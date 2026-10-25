"use client";

import { useEffect, useRef } from "react";

/** Team member photo that falls back to the placeholder if the file is missing. */
export function TeamPhoto({ src, placeholder }: { src: string; placeholder: string }) {
  const ref = useRef<HTMLImageElement>(null);

  // A server-rendered image can fail before hydration attaches onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) img.src = placeholder;
  }, [placeholder]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      onError={(e) => {
        if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder;
      }}
      className="w-full h-full object-cover block"
    />
  );
}
