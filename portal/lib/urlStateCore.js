// urlStateCore.js — lógica pura (sem React) de filtros ⇄ query string. Testável em Node.
// Só serializa valores DIFERENTES do padrão, então a URL "limpa" continua limpa.

export function parseFilters(search, defaults) {
  const p = new URLSearchParams(search);
  const out = { ...defaults };
  for (const k of Object.keys(defaults)) {
    if (!p.has(k)) continue;
    const raw = p.get(k);
    out[k] = typeof defaults[k] === "boolean" ? raw === "1" : raw;
  }
  return out;
}

export function serializeFilters(state, defaults, currentSearch = "") {
  const p = new URLSearchParams(currentSearch);          // preserva parâmetros de outros usos
  for (const k of Object.keys(defaults)) {
    p.delete(k);
    const v = state[k];
    if (v === defaults[k] || v === "" || v == null) continue;
    p.set(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
  }
  const s = p.toString();
  return s ? "?" + s : "";
}
