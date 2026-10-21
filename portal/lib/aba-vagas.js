// <aba-vagas> — aba "Vagas" do portal, como web component (sem React/npm: funciona dentro de React, Vite ou HTML puro).
// Uso: <aba-vagas api-base="https://fato-portal-api.SEU-SUBDOMINIO.workers.dev" empresa-url="/empresas/{slug}"></aba-vagas>
//   api-base     (obrigatório) base da API; vazio = mesma origem
//   empresa-url  (opcional) modelo do link da empresa no portal, com {slug}; sem ele o nome não vira link
// Só lê /api/vagas/meta e /api/vagas. Todo texto da API entra por textContent (nada de innerHTML com dado).
const CSS = `:host{display:block;font:14px/1.4 system-ui,sans-serif;color:var(--av-fg,#172b3a)}
.nota{font-size:12px;opacity:.75;margin:0 0 10px}.filtros{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
select,input{font:inherit;padding:6px 8px;border:1px solid var(--av-borda,#d0d9e0);border-radius:8px;background:var(--av-bg,#fff);color:inherit;min-width:0}
input{flex:1 1 160px}.card{border:1px solid var(--av-borda,#d0d9e0);border-radius:10px;padding:10px 12px;margin:0 0 8px;background:var(--av-bg,#fff)}
.t{font-weight:600}.s{font-size:12px;opacity:.8;margin-top:2px}a.b{display:inline-block;margin-top:8px;padding:6px 10px;border-radius:8px;background:var(--av-cor,#0e5263);color:#fff;text-decoration:none;font-size:13px}
a.b.m{background:#8a5a00}button{font:inherit;padding:8px 14px;border-radius:8px;border:1px solid var(--av-borda,#d0d9e0);background:transparent;color:inherit;cursor:pointer}.vazio,.erro{padding:14px;text-align:center;opacity:.8}.erro{color:#a82f2f;opacity:1}`;
const h = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); kids.flat().forEach((k) => e.append(k)); return e; };
const dmy = (iso, aprox) => (iso ? (aprox ? "~" : "") + iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4) : "");
const seguro = (u) => /^https?:\/\//i.test(u || "");
const ROT = { vaga: "Abrir vaga", montado: "Abrir vaga (link montado)", portal: "Abrir portal de carreiras" };

class AbaVagas extends HTMLElement {
  connectedCallback() {
    this.base = (this.getAttribute("api-base") || "").replace(/\/+$/, ""); this.tpl = this.getAttribute("empresa-url") || "";
    this.f = { uf: "", nivel: "", area: "", tipo: "", q: "" }; this.after = "";
    const r = this.attachShadow({ mode: "open" });
    r.append(h("style", { textContent: CSS }));
    this.nota = h("p", { className: "nota" }); this.fil = h("div", { className: "filtros" }); this.lista = h("div"); this.mais = h("div", { style: "text-align:center;margin:10px 0" });
    r.append(this.nota, this.fil, this.lista, this.mais);
    this.api("/api/vagas/meta").then((m) => { this.monta(m); this.carrega(true); }).catch((e) => this.falha(e));
  }
  async api(p) { const r = await fetch(this.base + p); if (!r.ok) throw new Error(r.status === 503 ? "As vagas ainda não foram carregadas." : "Erro " + r.status); return r.json(); }
  falha(e) { this.lista.replaceChildren(h("div", { className: "erro", textContent: "Não foi possível carregar as vagas. " + e.message })); this.mais.replaceChildren(); }
  monta(m) {
    this.nota.textContent = (m.nota || "") + " Dados de " + (m.gerado_em || "data desconhecida") + ". Confirme sempre na página da empresa.";
    const sel = (k, rot, itens) => { const s = h("select", { ariaLabel: rot }, h("option", { value: "", textContent: rot }), itens.map((i) => h("option", { value: i.valor, textContent: `${i.valor} (${i.n})` }))); s.onchange = () => { this.f[k] = s.value; this.carrega(true); }; return s; };
    let tm; const q = h("input", { type: "search", placeholder: "Buscar cargo ou empresa (3+ letras)", ariaLabel: "Buscar" });
    q.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { const v = q.value.trim(); if (v.length === 0 || v.length >= 3) { this.f.q = v; this.carrega(true); } }, 400); };
    this.fil.replaceChildren(sel("uf", "Todas as UFs", m.ufs), sel("nivel", "Todos os níveis", m.niveis), sel("area", "Todas as áreas", m.areas), sel("tipo", "Todos os tipos", m.tipos), q);
  }
  async carrega(zera) {
    if (zera) { this.after = ""; this.lista.replaceChildren(); }
    const p = new URLSearchParams(Object.entries(this.f).filter(([, v]) => v)); if (this.after) p.set("after", this.after);
    this.mais.replaceChildren(h("span", { textContent: "Carregando…" }));
    try {
      const d = await this.api("/api/vagas?" + p);
      d.items.forEach((v) => this.lista.append(this.card(v)));
      if (zera && !d.items.length) this.lista.append(h("div", { className: "vazio", textContent: "Nenhuma vaga com esses filtros." }));
      this.after = d.next_after; this.mais.replaceChildren();
      if (d.has_more) { const b = h("button", { textContent: "Carregar mais" }); b.onclick = () => this.carrega(false); this.mais.append(b); }
    } catch (e) { this.falha(e); }
  }
  card(v) {
    const emp = this.tpl && v.empresa_slug ? h("a", { href: this.tpl.replace("{slug}", encodeURIComponent(v.empresa_slug)), textContent: v.empresa }) : v.empresa;
    const datas = [v.publicada_em && "Publicada " + dmy(v.publicada_em, v.pub_aprox), v.expira_em && "até " + dmy(v.expira_em)].filter(Boolean).join(" · ");
    const c = h("div", { className: "card" }, h("div", { className: "t", textContent: v.titulo }), h("div", { className: "s" }, emp, " · " + (v.local || "local não informado")),
      h("div", { className: "s", textContent: [v.nivel, v.area, ...(v.tipos || [])].filter(Boolean).join(" · ") }), h("div", { className: "s", textContent: datas }));
    if (seguro(v.link)) c.append(h("a", { className: "b" + (v.link_tipo === "montado" ? " m" : ""), href: v.link, target: "_blank", rel: "noopener noreferrer", textContent: ROT[v.link_tipo] || ROT.portal }));
    return c;
  }
}
if (!customElements.get("aba-vagas")) customElements.define("aba-vagas", AbaVagas);
