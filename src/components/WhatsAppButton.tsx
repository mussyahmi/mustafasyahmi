import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  label: string;
  size?: "default" | "lg";
  /** "solid" is the green button. "outline" keeps green unique to the pinned bar. */
  variant?: "solid" | "outline";
  className?: string;
};

export function WhatsAppButton({ message, label, size = "default", variant = "solid", className }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "solid"
          ? "bg-whatsapp text-whatsapp-foreground shadow-sm hover:brightness-95 focus-visible:outline-whatsapp"
          : "border border-primary/40 text-primary hover:bg-accent focus-visible:outline-primary",
        size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
