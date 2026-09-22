const COLS: Record<number, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function PasosNumerados({
  pasos,
}: {
  pasos: { titulo: string; texto: string }[];
}) {
  return (
    <div className={`grid grid-cols-1 gap-8 ${COLS[pasos.length] ?? "sm:grid-cols-3"}`}>
      {pasos.map((paso, i) => (
        <div key={paso.titulo}>
          <span className="text-4xl font-black text-brand">{i + 1}</span>
          <h3 className="mt-2 font-bold">{paso.titulo}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{paso.texto}</p>
        </div>
      ))}
    </div>
  );
}
