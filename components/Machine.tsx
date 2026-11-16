import Image from "next/image";

/**
 * Máquina sin fondo sobre el escenario: cono de luz, piso iluminado y reflejo.
 * `sizes` según dónde se use (card chica vs. hero). `align`: "bottom" apoya la
 * máquina en el piso (hero, ficha); "center" la centra en su caja (cards).
 */
export function Machine({
  src,
  alt,
  sizes,
  priority,
  reflection = true,
  align = "bottom",
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  reflection?: boolean;
  align?: "bottom" | "center";
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`stage grid place-items-center ${className}`}>
        <span className="mono text-xs uppercase tracking-[0.2em] text-grey">Foto próximamente</span>
      </div>
    );
  }
  return (
    <div className={`stage ${className}`}>
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`machine object-contain ${align === "center" ? "object-center" : "object-bottom"}`} />
      </div>
      {reflection && (
        <div className="absolute inset-x-0 top-full h-1/3 overflow-hidden" aria-hidden>
          <div className="relative h-[300%] w-full">
            <Image src={src} alt="" fill sizes={sizes} className="reflection object-contain object-bottom" />
          </div>
        </div>
      )}
    </div>
  );
}
