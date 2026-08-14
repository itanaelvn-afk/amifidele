"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/components/utils";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

const MISSING_LOCAL_PLACEHOLDER = "/images/placeholder.jpg";

export const PRODUCT_CARD_IMAGE_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

function isUsableSrc(src: string | undefined | null): src is string {
  if (!src || src.trim() === "") return false;
  return src !== MISSING_LOCAL_PLACEHOLDER;
}

type ImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const showFallback = didError || !isUsableSrc(src);

  if (showFallback) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-muted flex items-center justify-center",
          className
        )}
      >
        {/* data URI : next/image n'optimise pas ce fallback */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ERROR_IMG_SRC}
          alt=""
          className="max-h-16 max-w-16 opacity-60"
          data-original-url={src ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
        onError={() => setDidError(true)}
      />
    </div>
  );
}
