// Pruebas de la búsqueda flexible (src/lib/busqueda.ts).
// Uso: npm run test:busqueda   (Node 22.18+/24 ejecuta el .ts directo)
import assert from "node:assert/strict";
import { test } from "node:test";
import { coincide, filtroBusqueda, normalizar, prepararBusqueda } from "../src/lib/busqueda.ts";

// Valores reales de la columna `busqueda` de catalogo_publico.
const CATALOGO = [
  "volkswagentcrosstrendline16msi110cv2020",
  "hondahrvexcvt2017",
  "volkswagengoltrend16gp2013",
  "citroencelyseehdi92feel2018",
  "volkswagenamarokhighline2021",
  "volkswagenamarok2014",
  "mercedesbenza200progressive2025",
  "chevroletonixjoy14mt2021",
  "toyotacorolla20xlicvt2023",
];

const DEBEN_ENCONTRAR = {
  "T cross": "volkswagentcrosstrendline16msi110cv2020",
  tcross: "volkswagentcrosstrendline16msi110cv2020",
  "t-cross": "volkswagentcrosstrendline16msi110cv2020",
  hrv: "hondahrvexcvt2017",
  "HR V": "hondahrvexcvt2017",
  goltrend: "volkswagengoltrend16gp2013",
  "gol trend": "volkswagengoltrend16gp2013",
  "trend gol": "volkswagengoltrend16gp2013",
  "vw gol": "volkswagengoltrend16gp2013",
  "c elysee": "citroencelyseehdi92feel2018",
  celysee: "citroencelyseehdi92feel2018",
  "C-Elysée": "citroencelyseehdi92feel2018",
  "amarok 2021": "volkswagenamarokhighline2021",
  mercedes: "mercedesbenza200progressive2025",
  "chevy onix": "chevroletonixjoy14mt2021",
};

for (const [q, esperado] of Object.entries(DEBEN_ENCONTRAR)) {
  test(`"${q}" encuentra ${esperado}`, () => {
    assert.ok(coincide(esperado, q));
  });
}

test('"amarok 2021" no trae la Amarok 2014', () => {
  assert.equal(coincide("volkswagenamarok2014", "amarok 2021"), false);
});

test('"corolla" no trae autos que no son Corolla', () => {
  assert.deepEqual(
    CATALOGO.filter((b) => coincide(b, "corolla")),
    ["toyotacorolla20xlicvt2023"]
  );
});

test("normalizar saca acentos y símbolos", () => {
  assert.equal(normalizar("  Citröen C-Élysée! "), "citroen c elysee");
});

test("tokens de 1 carácter se ignoran salvo que sea el único", () => {
  assert.deepEqual(prepararBusqueda("t cross")?.tokens, ["cross"]);
  assert.deepEqual(prepararBusqueda("t")?.tokens, ["t"]);
});

test("filtro para Supabase", () => {
  assert.equal(
    filtroBusqueda("gol trend"),
    "busqueda.ilike.%goltrend%,and(busqueda.ilike.%gol%,busqueda.ilike.%trend%)"
  );
  assert.equal(filtroBusqueda("hrv"), "busqueda.ilike.%hrv%");
  assert.equal(filtroBusqueda("  "), null);
});
