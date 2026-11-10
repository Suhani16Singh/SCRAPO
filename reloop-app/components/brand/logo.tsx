import Link from "next/link";
import Image from "next/image";
import { cx } from "@/lib/cx";

export function Logo({
  tone,
  className,
  size = "md",
}: {
  tone?: "olive" | "lime";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const heights = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-14 w-auto",
  };

  return (
    <Link
      href="/"
      aria-label="Scrapo home"
      className={cx("inline-flex items-center transition-all duration-200 hover:opacity-90", className)}
    >
      <Image
        src="/scrapo-logo.png"
        alt="Scrapo — Refurbish . Recycle . Reimagine"
        width={320}
        height={120}
        priority
        className={cx("object-contain", heights[size])}
      />
    </Link>
  );
}
