import { estimator } from "@/content";
import { formatRinggit } from "@/lib/format";

export type NeedId = "website" | "store" | "custom" | "unsure";
export type SizeId = "small" | "medium" | "large";
export type PaymentId = "yes" | "no" | "unsure";
export type TimelineId = "asap" | "soon" | "exploring";

export type Answers = {
  need: NeedId;
  size: SizeId;
  payment: PaymentId;
  timeline: TimelineId;
};

export type Estimate = { kind: "range"; low: number; high: number } | { kind: "tiers" };

const BASE: Record<Exclude<NeedId, "unsure">, number> = {
  website: 2500,
  store: 8000,
  custom: 15000,
};

const SIZE_MULTIPLIER: Record<SizeId, number> = {
  small: 1,
  medium: 1.25,
  large: 1.6,
};

const PAYMENT_ADDITION = 1500;
const RUSH_MULTIPLIER = 1.15;
const SPREAD = 1.35;
const STEP = 500;

const roundDown = (amount: number) => Math.floor(amount / STEP) * STEP;
const roundUp = (amount: number) => Math.ceil(amount / STEP) * STEP;

export function estimateFor(answers: Partial<Answers>): Estimate {
  const { need, size, payment, timeline } = answers;
  if (need === "unsure" || !need || !size || !payment || !timeline) return { kind: "tiers" };

  const base = BASE[need];
  let amount = base * SIZE_MULTIPLIER[size];
  if (need === "website" && payment === "yes") amount += PAYMENT_ADDITION;
  if (timeline === "asap") amount *= RUSH_MULTIPLIER;

  const low = Math.max(base, roundDown(amount));
  const high = roundUp(low * SPREAD);
  return { kind: "range", low, high };
}

function optionLabel(questionId: string, optionId: string | undefined): string | undefined {
  if (!optionId) return undefined;
  const question = estimator.questions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId)?.label ?? optionId;
}

export function estimateMessage(answers: Partial<Answers>, estimate: Estimate): string {
  const shown =
    estimate.kind === "range"
      ? `${formatRinggit(estimate.low)} to ${formatRinggit(estimate.high)}`
      : "not sure yet, I would like your advice";

  const lines = [
    "Hi Mustafa, I used the estimator on your website.",
    withLabel("What I need", optionLabel("need", answers.need)),
    withLabel("Size", optionLabel("size", answers.size)),
    withLabel("Online payment", optionLabel("payment", answers.payment)),
    withLabel("Timeline", optionLabel("timeline", answers.timeline)),
    `Estimate shown: ${shown}`,
  ];

  return lines.filter((line): line is string => line !== undefined).join("\n");
}

function withLabel(prefix: string, value: string | undefined): string | undefined {
  return value === undefined ? undefined : `${prefix}: ${value}`;
}
