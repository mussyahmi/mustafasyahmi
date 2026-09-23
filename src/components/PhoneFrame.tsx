import Image from "next/image";
import type { ReactNode } from "react";

type Props = { src?: string; alt?: string; children?: ReactNode };

export function PhoneFrame({ src, alt, children }: Props) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-foreground bg-foreground shadow-lg">
      {children ?? (
        <Image
          src={src ?? ""}
          alt={alt ?? ""}
          width={390}
          height={844}
          sizes="14rem"
          className="aspect-[390/560] w-full rounded-[1.1rem] object-cover object-top sm:aspect-[390/844]"
        />
      )}
    </div>
  );
}
