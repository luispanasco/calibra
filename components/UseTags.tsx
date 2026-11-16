/** Etiquetas de uso del equipo ("Run-flat", "Camión", "Empotrable"…). */
export function UseTags({ uses, size = "sm", className = "" }: { uses: string[]; size?: "sm" | "md"; className?: string }) {
  if (!uses.length) return null;
  const cls =
    size === "md"
      ? "px-2.5 py-1 text-[0.7rem] tracking-[0.14em]"
      : "px-1.5 py-[3px] text-[0.6rem] tracking-[0.12em]";
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Usos">
      {uses.map((u) => (
        <li key={u} className={`mono border border-orange/35 bg-orange/[0.08] font-semibold uppercase text-orange ${cls}`}>
          {u}
        </li>
      ))}
    </ul>
  );
}
