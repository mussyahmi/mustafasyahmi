import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  label: string;
  size?: "default" | "lg";
  /**
   * Green ("solid") is reserved for the pinned mobile button, so it always means
   * the same thing. "primary" is the main action inside a light section,
   * "onDark" the main action on an ink panel, "outline" a secondary action.
   */
  variant?: "solid" | "outline" | "primary" | "onDark";
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
        variant === "solid" &&
          "bg-whatsapp text-whatsapp-foreground shadow-sm hover:brightness-95 focus-visible:outline-whatsapp",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-sm hover:brightness-110 focus-visible:outline-primary",
        variant === "onDark" &&
          "bg-ink-foreground text-ink shadow-sm hover:brightness-95 focus-visible:outline-ink-foreground",
        variant === "outline" && "border border-primary/40 text-primary hover:bg-accent focus-visible:outline-primary",
        size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
