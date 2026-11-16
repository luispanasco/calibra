import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-cb py-32 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display metal mt-4 text-[clamp(3rem,10vw,7rem)]">Fuera de medida</h1>
      <p className="mt-4 text-fog">La página que buscás no existe o se movió.</p>
      <Link href="/" className="btn btn-primary mt-8">Volver al inicio</Link>
    </section>
  );
}
