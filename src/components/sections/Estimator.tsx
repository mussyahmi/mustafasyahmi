"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { estimator, services, site } from "@/content";
import { estimateFor, estimateMessage, type Answers } from "@/lib/estimate";
import { formatRinggit, parseRinggit } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

export function Estimator() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Partial<Answers>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const questions = estimator.questions;
  const finished = step >= questions.length;
  const result = finished ? estimateFor(picked) : null;
  const closest = finished ? services.find((service) => service.id === picked.need) : undefined;

  // Each question (and the result) unmounts the previously focused button, so
  // move focus to whichever heading is currently mounted instead of letting
  // it fall to document.body. Skip the very first render so the page does
  // not jump on load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (finished ? resultHeadingRef.current : headingRef.current)?.focus();
  }, [step, finished]);

  const choose = (questionId: string, optionId: string) => {
    // Changing the first question starts a new path, so drop any answers
    // gathered under the previous path rather than mixing them together.
    const next: Partial<Answers> =
      questionId === "need"
        ? { need: optionId as Answers["need"] }
        : ({ ...picked, [questionId]: optionId } as Partial<Answers>);
    setPicked(next);
    // "Not sure yet" cannot be priced, so skip straight to the result.
    setStep(questionId === "need" && optionId === "unsure" ? questions.length : step + 1);
  };

  const restart = () => {
    setPicked({});
    setStep(0);
  };

  return (
    <section id="estimate" className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={estimator.eyebrow} heading={estimator.heading} intro={estimator.intro} />
        <Reveal className="mt-10 rounded-3xl bg-card p-7 card-soft sm:p-10">
          {!finished && (
            <div>
              <div aria-live="polite">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {estimator.progressLabel} {step + 1} {estimator.progressJoiner} {questions.length}
                </p>
                <h3 ref={headingRef} tabIndex={-1} className="mt-3 text-2xl font-bold sm:text-3xl">
                  {questions[step].label}
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {questions[step].options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => choose(questions[step].id, option.id)}
                      className="rounded-2xl border border-border bg-background px-5 py-4 text-left text-base font-semibold transition hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  {estimator.result.back}
                </button>
              )}
            </div>
          )}

          {finished && result && (
            <div aria-live="polite">
              <h3 ref={resultHeadingRef} tabIndex={-1} className="sr-only">
                {result.kind === "range" ? estimator.result.rangeTitle : estimator.result.tiersTitle}
              </h3>
              {result.kind === "range" ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    {estimator.result.rangeTitle}
                  </p>
                  <p className="mt-3 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                    {formatRinggit(result.low)} to {formatRinggit(result.high)}
                  </p>
                  {closest && (
                    <p className="mt-4 text-muted-foreground">
                      {estimator.result.includesLabel}: <span className="font-semibold text-foreground">{closest.name}</span>
                      {". "}
                      {closest.summary}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                    {estimator.result.tiersTitle}
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {services
                      .filter((service) => service.id !== "care")
                      .map((service) => (
                        <li key={service.id} className="rounded-2xl border border-border bg-background p-5">
                          <p className="font-semibold">{service.name}</p>
                          <p className="mt-1 font-heading text-2xl font-extrabold text-primary">
                            {formatRinggit(parseRinggit(service.price))}
                          </p>
                        </li>
                      ))}
                  </ul>
                </>
              )}

              <p className="mt-6 text-sm text-muted-foreground">{estimator.result.note}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <WhatsAppButton size="lg" message={estimateMessage(picked, result)} label={estimator.result.cta} />
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {estimator.result.restart}
                </button>
              </div>
            </div>
          )}

          {!finished && (
            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
              <a
                href={whatsappLink(site.defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {estimator.fallbackCta}
              </a>
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
