import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  label: string;
  size?: "default" | "lg";
  className?: string;
};

export function WhatsAppButton({ message, label, size = "default", className }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-whatsapp-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp",
        size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
