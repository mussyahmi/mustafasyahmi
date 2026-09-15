import Image from "next/image";

export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-[1.6rem] border-[6px] border-foreground bg-foreground shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={390}
        height={844}
        sizes="10rem"
        className="aspect-[390/844] w-full rounded-[1.1rem] object-cover object-top"
      />
    </div>
  );
}
