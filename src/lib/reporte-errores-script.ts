/**
 * Script inline para el <head>: manda a /api/client-error los errores de JS
 * del navegador, y avisa si React no hidrató a los 8 s de cargar la página.
 *
 * Va en ES5 puro (var, function; sin arrow functions, let/const, fetch ni
 * optional chaining) a propósito: tiene que correr aunque el navegador no
 * pueda ejecutar el bundle (por ejemplo un Safari anterior a 16.4, que es el
 * mínimo que soporta Next 16). Máximo 5 reportes por carga de página.
 */
export const SCRIPT_REPORTE_ERRORES = `(function () {
  var enviados = 0;
  var MAXIMO = 5;

  function cortar(valor) {
    if (valor === undefined || valor === null) return "";
    valor = String(valor);
    return valor.length > 2000 ? valor.slice(0, 2000) : valor;
  }

  function enviar(datos) {
    try {
      if (enviados >= MAXIMO) return;
      enviados++;
      datos.ua = cortar(navigator.userAgent);
      datos.url = cortar(location.href);
      var cuerpo = JSON.stringify(datos);
      if (navigator.sendBeacon && window.Blob) {
        var blob = new Blob([cuerpo], { type: "application/json" });
        if (navigator.sendBeacon("/api/client-error", blob)) return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/client-error", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(cuerpo);
    } catch (e) {}
  }

  var anterior = window.onerror;
  window.onerror = function (msg, src, line, col, error) {
    enviar({
      tipo: "error",
      msg: cortar(msg),
      src: cortar(src),
      line: cortar(line),
      col: cortar(col),
      stack: cortar(error && error.stack)
    });
    if (typeof anterior === "function") return anterior.apply(this, arguments);
    return false;
  };

  if (window.addEventListener) {
    window.addEventListener("unhandledrejection", function (evento) {
      var motivo = evento && evento.reason;
      enviar({
        tipo: "unhandledrejection",
        msg: cortar(motivo && motivo.message ? motivo.message : motivo),
        stack: cortar(motivo && motivo.stack)
      });
    });

    // window.__TITUS_HIDRATO lo pone en true un useEffect del layout.
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (!window.__TITUS_HIDRATO) {
          enviar({ tipo: "no-hidrato", msg: "React no hidrató a los 8 s de cargar la página" });
        }
      }, 8000);
    });
  }
})();`;
