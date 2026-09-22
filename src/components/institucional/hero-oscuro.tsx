export function HeroOscuro({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo: string;
}) {
  return (
    <section className="bg-brand-black px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
          {titulo}
        </h1>
        <p className="mt-4 text-lg text-white/70">{subtitulo}</p>
      </div>
    </section>
  );
}
