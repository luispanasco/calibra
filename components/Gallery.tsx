"use client";

import Image from "next/image";
import { useState } from "react";
import { Machine } from "./Machine";

/** Foto principal sobre el escenario + miniaturas (si hay más de una). */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative mx-auto aspect-[5/4] w-full max-w-[680px]">
        <div className="laser" aria-hidden />
        <Machine src={images[i] ?? ""} alt={alt} sizes="(min-width:1024px) 680px, 100vw" priority className="absolute inset-x-0 bottom-[14%] top-0" />
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {images.map((src, n) => (
            <button
              key={src}
              onClick={() => setI(n)}
              aria-label={`Foto ${n + 1}`}
              aria-pressed={n === i}
              className={`relative h-16 w-20 border bg-graphite p-1.5 transition-colors ${n === i ? "border-orange" : "border-white/10 hover:border-white/30"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
