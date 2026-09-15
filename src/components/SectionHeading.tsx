import { cn } from "@/lib/utils";

type Props = { eyebrow: string; heading: string; intro?: string; className?: string };

export function SectionHeading({ eyebrow, heading, intro, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{heading}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
