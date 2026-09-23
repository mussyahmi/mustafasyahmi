import { cn } from "@/lib/utils";

type Props = { eyebrow: string; heading: string; intro?: string; className?: string };

export function SectionHeading({ eyebrow, heading, intro, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{heading}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}
