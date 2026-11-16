/**
 * Wordmark de Launch Uruguay tal como lo muestra launchweb: Space Grotesk en
 * mayúsculas, "LAUNCH" en negrita y "Uruguay" en el rojo de marca (#df1d30).
 */
export function LaunchWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.25em] font-launch font-bold uppercase leading-none tracking-tight ${className}`}>
      <span className="text-white">Launch</span>
      <span className="font-normal text-launch">Uruguay</span>
    </span>
  );
}
