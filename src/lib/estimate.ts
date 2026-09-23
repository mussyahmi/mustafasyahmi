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

export function estimateFor(answers: Answers): Estimate {
  if (answers.need === "unsure") return { kind: "tiers" };

  const base = BASE[answers.need];
  let amount = base * SIZE_MULTIPLIER[answers.size];
  if (answers.need === "website" && answers.payment === "yes") amount += PAYMENT_ADDITION;
  if (answers.timeline === "asap") amount *= RUSH_MULTIPLIER;

  const low = Math.max(base, roundDown(amount));
  const high = roundUp(low * SPREAD);
  return { kind: "range", low, high };
}

function optionLabel(questionId: string, optionId: string): string {
  const question = estimator.questions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId)?.label ?? optionId;
}

export function estimateMessage(answers: Answers, estimate: Estimate): string {
  const shown =
    estimate.kind === "range"
      ? `${formatRinggit(estimate.low)} to ${formatRinggit(estimate.high)}`
      : "not sure yet, I would like your advice";

  return [
    "Hi Mustafa, I used the estimator on your website.",
    `What I need: ${optionLabel("need", answers.need)}`,
    `Size: ${optionLabel("size", answers.size)}`,
    `Online payment: ${optionLabel("payment", answers.payment)}`,
    `Timeline: ${optionLabel("timeline", answers.timeline)}`,
    `Estimate shown: ${shown}`,
  ].join("\n");
}
