/**
 * Tamaño de un título .display que tiene que entrar en una línea y ocupar el
 * ancho de su columna: sale de la cantidad de letras (~0,76 em por letra en
 * Saira expandida, mayúsculas), medido contra el ancho del contenedor (cqi), así
 * que el padre necesita la clase `@container`. `max` es el tope para los cortos.
 */
export function fitTitle(text: string, max = "5.4rem", min = "1.8rem"): string {
  const perChar = 100 / (Math.max(text.length, 6) * 0.76);
  return `clamp(${min}, ${perChar.toFixed(2)}cqi, ${max})`;
}
