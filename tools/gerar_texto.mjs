#!/usr/bin/env node
// gerar_texto.mjs — gera a versão em TEXTO do IndústriaEDU (legível sem JavaScript, por pessoas
// e por LLMs): portal/texto/*.html, portal/texto/dados/*, portal/llms.txt e portal/sitemap.xml.
// O app interativo (React) não é alterado: esta é uma camada paralela, gerada a partir dos
// mesmos JSONs que o app consome.
//
// Uso (Node 20+, sem dependências):
//   node tools/gerar_texto.mjs --base https://<worker>.workers.dev      # lê a API ao vivo
//   node tools/gerar_texto.mjs --json-dir ./dump                         # lê trilhas.json, perfis.json,
//                                                                        # companies.json, normas.json
// Opções: --out portal   --nota "texto sobre a origem/data dos dados"
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith("--") ? [...a, [x.slice(2), arr[i + 1]]] : a), []));
const OUT = args.out || "portal";
const SITE = "https://projetoindustrial.github.io/industriaedu/";
const HOJE = new Date().toISOString().slice(0, 10);
const NOTA = args.nota || "Dados do banco do portal, lidos da API no momento da geração.";

// ---------- entrada ----------
async function carregar() {
  const nomes = { trilhas: "/api/trilhas", perfis: "/api/perfis", companies: "/api/companies", normas: "/api/normas" };
  const d = {};
  for (const [k, rota] of Object.entries(nomes)) {
    if (args["json-dir"]) d[k] = JSON.parse(fs.readFileSync(path.join(args["json-dir"], k + ".json"), "utf8"));
    else {
      const base = args.base || (fs.readFileSync("portal/apiClient.js", "utf8").match(/API_BASE\s*=\s*"([^"]+)"/) || [])[1];
      if (!base) throw new Error("Informe --base ou --json-dir");
      const r = await fetch(base + rota);
      if (!r.ok) throw new Error(`Falha em ${rota}: HTTP ${r.status}`);
      d[k] = await r.json();
    }
  }
  // mesmo filtro do app (loadCore.js): TRL-TI-007 é um stub de FK, não é trilha real
  d.trilhas = d.trilhas.filter((t) => t.id !== "TRL-TI-007");
  return d;
}

// ---------- utilidades ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = (id) => String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmt = (x) => (x == null ? "" : Array.isArray(x) ? x.map(fmt).filter(Boolean).join("; ") : typeof x === "object" ? Object.entries(x).filter(([, v]) => v != null && v !== "").map(([k, v]) => `${k}: ${fmt(v)}`).join(", ") : String(x));
const ordena = (arr, f) => [...arr].sort((a, b) => String(f(a)).localeCompare(String(f(b)), "pt-BR"));
const okUrl = (u) => /^https?:\/\/\S+$/.test(u || "");
const lk = (u) => (okUrl(u) ? `<a href="${esc(u)}" rel="noopener">${esc(u)}</a>` : esc(u || "—"));
const codTrilha = (x) => (typeof x === "object" && x ? `${x.trail_code}${x.atlas_num ? " (Atlas " + x.atlas_num + ")" : ""}` : String(x));
const PAGA = (s) => /^conte[úu]do pago/i.test(s || "");
const csv = (rows, cols) => "\ufeff" + [cols.join(";"), ...rows.map((r) => cols.map((c) => '"' + String(r[c] ?? "").replace(/"/g, '""') + '"').join(";"))].join("\r\n") + "\r\n";
const jsonl = (rows) => rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
const paginas = []; // {url, titulo}
const gravar = (rel, conteudo) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, conteudo); };
const lista = (titulo, itens) => (itens && itens.length ? `<h3>${esc(titulo)}</h3><ul>${itens.map((i) => `<li>${esc(fmt(i))}</li>`).join("")}</ul>` : "");
const dl = (pares) => { const p = pares.filter(([, v]) => v !== "" && v != null); return p.length ? `<dl>${p.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""; };

function pagina(rel, titulo, descricao, corpo, raiz = "../") {
  const url = SITE + "texto/" + rel;
  paginas.push({ url, titulo });
  gravar("texto/" + rel, `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)} — IndústriaEDU (texto)</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="${raiz}favicon.svg">
<link rel="stylesheet" href="${rel.includes("/") ? "../" : ""}estatico.css">
</head>
<body>
<header><nav aria-label="Navegação"><a href="${rel.includes("/") ? "../" : ""}index.html">Índice em texto</a><a href="trilhas.html">Trilhas</a><a href="perfis.html">Perfis</a><a href="empresas.html">Empresas</a><a href="normas.html">Normas</a><a href="${raiz}">Versão interativa</a></nav></header>
<main>
${corpo}
</main>
<footer><p>${esc(NOTA)} Gerado em ${HOJE}. Confirme links e dados antes de decidir: cursos e ofertas mudam.</p></footer>
</body>
</html>
`);
}

// ---------- principal ----------
const { trilhas, perfis, companies, normas } = await carregar();
const idsTrilha = new Set(trilhas.map((t) => t.id));
const linkT = (id, nome) => (idsTrilha.has(id) ? `<a href="trilha-${slug(id)}.html">${esc(nome || id)}</a>` : esc(nome || id));

// trilhas: uma página por trilha
for (const t of trilhas) {
  const passos = (t.steps || []).map((s) => `<li><strong>${esc(s.phase)} — ${esc(s.note)}</strong>${s.escolas?.length ? `<ul>${s.escolas.map((e) => `<li>${esc(e.escola_nome)}${e.curso_nome ? " — " + esc(e.curso_nome) : ""}${e.url ? ` (${lk(e.url)})` : ""}</li>`).join("")}</ul>` : ""}</li>`).join("");
  const deriv = (t.derivadas || []).map((d) => `<li>${linkT(d.id, d.name)}${d.temas_chave ? " — " + esc(d.temas_chave) : ""}</li>`).join("");
  pagina(`trilha-${slug(t.id)}.html`, `${t.name} (${t.id})`, (t.description || t.name).slice(0, 200),
    `<h1>${esc(t.name)}</h1>${dl([["Código", t.id], ["Área CNCT", t.cnct], ["CBO", fmt(t.cbos)], ["Normas relacionadas", fmt(t.normas)], ["Derivada de", t.derivada_de ? (typeof t.derivada_de === "object" ? t.derivada_de.name || t.derivada_de.id : t.derivada_de) : ""]])}
<p>${esc(t.description || "")}</p>${t.nota_curadoria ? `<p><em>Nota de curadoria:</em> ${esc(t.nota_curadoria)}</p>` : ""}
${passos ? `<h2>Etapas e onde estudar</h2><ol>${passos}</ol>` : "<p>Esta trilha ainda não tem etapas cadastradas.</p>"}
${deriv ? `<h2>Sub-trilhas</h2><ul>${deriv}</ul>` : ""}
<p><a href="trilhas.html">← Todas as trilhas</a></p>`);
}
pagina("trilhas.html", "Trilhas de carreira", `${trilhas.length} trilhas de carreira da indústria, com etapas e fontes de estudo.`,
  `<h1>Trilhas de carreira (${trilhas.length})</h1><p>Cada trilha lista etapas e as escolas/cursos indicados.</p><ul>${ordena(trilhas, (t) => t.name).map((t) => `<li>${linkT(t.id, t.name)} <small>(${esc(t.cnct || "sem área")} · ${(t.steps || []).length} etapas)</small></li>`).join("")}</ul>`);

// perfis: uma página com todos
pagina("perfis.html", "Perfis técnicos (CNCT)", `${perfis.length} perfis profissionais do Catálogo Nacional de Cursos Técnicos com CBO, qualificações e campo de atuação.`,
  `<h1>Perfis técnicos — CNCT (${perfis.length})</h1><p>Ordenados por nome. Cada perfil traz nível, carga horária, ocupações (CBO), qualificações e onde atua.</p>` +
  ordena(perfis, (p) => p.name).map((p) => `<article id="perfil-${p.id}"><h2>${esc(p.name)}</h2>${dl([["Código CNCT", p.cnct_code], ["Nível (tier)", p.tier], ["Carga horária", p.carga_horaria || p.ch ? (p.carga_horaria || p.ch) + " h" : ""], ["CBO principal", p.cbo_principal], ["Outras CBO", fmt((p.cbo_list || []).filter((c) => c !== p.cbo_principal))], ["Setores (códigos)", fmt(p.sectors_guia)], ["Trilhas relacionadas", p.trail_count], ["Sinônimos", fmt(p.sinonimos)]])}${p.perfil_conclusao ? `<p><strong>Perfil de conclusão:</strong> ${esc(p.perfil_conclusao)}</p>` : ""}${p.campo_atuacao ? `<p><strong>Campo de atuação:</strong> ${esc(p.campo_atuacao)}</p>` : ""}${lista("Qualificações", p.qualifications)}${lista("Especializações", p.specializations)}${lista("Graduações relacionadas", p.graduacoes)}${lista("Normas", p.normas)}${lista("Onde estudar", p.onde_estudar)}${lista("Roteiro de carreira", p.roteiro_carreira)}</article>`).join("\n"));

// empresas
pagina("empresas.html", "Empresas", `${companies.length} empresas industriais brasileiras mapeadas, com UF, setores e site quando validado.`,
  `<h1>Empresas (${companies.length})</h1><p>Empresas industriais brasileiras mapeadas. O site só aparece quando foi cadastrado.</p><table><thead><tr><th>Empresa</th><th>UF</th><th>Setores</th><th>Site</th></tr></thead><tbody>${ordena(companies, (c) => c.name).map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.uf || "—")}</td><td>${esc((c.sectors || []).map((s) => s.name).join("; ") || "—")}</td><td>${c.url ? lk(c.url) : "—"}</td></tr>`).join("")}</tbody></table>`);

// normas (só metadados; descrições de normas pagas não são reproduzidas)
const nl = Object.values(normas);
pagina("normas.html", "Normas e referências", `${nl.length} normas e referências legais ligadas a trilhas e perfis. Conteúdo pago não é reproduzido.`,
  `<h1>Normas e referências (${nl.length})</h1><p>Apenas código, descrição pública e trilhas relacionadas. Normas pagas aparecem só como referência, sem o conteúdo.</p><table><thead><tr><th>Código</th><th>Descrição</th><th>Trilhas do Atlas</th></tr></thead><tbody>${ordena(nl, (n) => n.codigo).map((n) => `<tr><td>${esc(n.codigo)}</td><td>${PAGA(n.descricao) ? "<em>Norma paga: sem descrição pública no catálogo.</em>" : esc(n.descricao || "—")}</td><td>${esc([...new Set((n.trilhas || []).map(codTrilha))].join(", ") || "—")}</td></tr>`).join("")}</tbody></table>`);

// índice
pagina("index.html", "Versão em texto", "Versão em texto simples do IndústriaEDU: trilhas, perfis CNCT, empresas e normas da indústria brasileira, legível sem JavaScript.",
  `<h1>IndústriaEDU — versão em texto</h1>
<p>Catálogo gratuito de educação e mercado de trabalho para a indústria brasileira. Esta é a versão em texto simples, sem JavaScript, do <a href="../">portal interativo</a>.</p>
<ul>
<li><a href="trilhas.html">Trilhas de carreira</a> — ${trilhas.length} trilhas, uma página cada, com etapas e fontes de estudo.</li>
<li><a href="perfis.html">Perfis técnicos (CNCT)</a> — ${perfis.length} perfis com CBO, qualificações e campo de atuação.</li>
<li><a href="empresas.html">Empresas</a> — ${companies.length} empresas industriais.</li>
<li><a href="normas.html">Normas e referências</a> — ${nl.length} itens (sem conteúdo pago).</li>
</ul>
<h2>Dados para download</h2>
<ul><li><a href="dados/trilhas.jsonl">trilhas.jsonl</a></li><li><a href="dados/perfis.jsonl">perfis.jsonl</a></li><li><a href="dados/empresas.csv">empresas.csv</a></li><li><a href="dados/normas.csv">normas.csv</a></li></ul>
<p>Para assistentes de IA: veja também <a href="../llms.txt">llms.txt</a>.</p>`);

// dados
gravar("texto/dados/trilhas.jsonl", jsonl(trilhas.map(({ icon, color, ...t }) => t)));
gravar("texto/dados/perfis.jsonl", jsonl(perfis.map((p) => ({ id: p.id, nome: p.name, cnct_code: p.cnct_code, tier: p.tier, carga_horaria: p.carga_horaria || p.ch, cbo_principal: p.cbo_principal, cbo_list: p.cbo_list, setores_guia: p.sectors_guia, qualificacoes: p.qualifications, especializacoes: p.specializations, graduacoes: p.graduacoes, normas: p.normas, perfil_conclusao: p.perfil_conclusao, campo_atuacao: p.campo_atuacao }))));
gravar("texto/dados/empresas.csv", csv(companies.map((c) => ({ nome: c.name, uf: c.uf, setores: (c.sectors || []).map((s) => s.name).join("; "), site: okUrl(c.url) ? c.url : "" })), ["nome", "uf", "setores", "site"]));
gravar("texto/dados/normas.csv", csv(nl.map((n) => ({ codigo: n.codigo, descricao: PAGA(n.descricao) ? "" : n.descricao, trilhas: [...new Set((n.trilhas || []).map(codTrilha))].join("; ") })), ["codigo", "descricao", "trilhas"]));
gravar("texto/estatico.css", `:root{color-scheme:light dark;font-family:"IBM Plex Sans",system-ui,-apple-system,sans-serif;line-height:1.55}
body{margin:0 auto;max-width:60rem;padding:1rem}
nav{display:flex;flex-wrap:wrap;gap:.5rem 1rem;padding:.5rem 0;border-bottom:1px solid #8884}
h1{font-size:1.6rem}h2{font-size:1.2rem;margin-top:1.6rem}h3{font-size:1rem;margin:.8rem 0 .2rem}
article{border-top:1px solid #8884;padding-top:.5rem}
dl{display:grid;grid-template-columns:max-content 1fr;gap:.2rem 1rem}dt{font-weight:600}dd{margin:0}
table{border-collapse:collapse;width:100%;font-size:.9rem;display:block;overflow-x:auto}th,td{text-align:left;padding:.35rem .6rem;border-bottom:1px solid #8883;vertical-align:top}
footer{margin-top:2rem;font-size:.8rem;opacity:.8}
`);

// llms.txt, sitemap
const D = SITE + "texto/";
gravar("llms.txt", `# IndústriaEDU

> Catálogo gratuito de educação e mercado de trabalho para a indústria brasileira: ${trilhas.length} trilhas de carreira, ${perfis.length} perfis técnicos do CNCT, ${companies.length} empresas e ${nl.length} normas/referências. O portal interativo precisa de JavaScript; esta é a versão em texto simples, legível sem JavaScript.

## Páginas
- [Índice em texto](${D}): ponto de partida
- [Trilhas de carreira](${D}trilhas.html): ${trilhas.length} trilhas, uma página por trilha, com etapas e escolas/cursos
- [Perfis técnicos CNCT](${D}perfis.html): CBO, qualificações, campo de atuação
- [Empresas](${D}empresas.html): empresas industriais, UF, setores
- [Normas e referências](${D}normas.html): só metadados; normas pagas não são reproduzidas

## Dados
- [trilhas.jsonl](${D}dados/trilhas.jsonl)
- [perfis.jsonl](${D}dados/perfis.jsonl)
- [empresas.csv](${D}dados/empresas.csv)
- [normas.csv](${D}dados/normas.csv)

## Portal interativo
- [IndústriaEDU](${SITE}): versão com filtros e visualizações (requer JavaScript)
- [Projeto Industrial](https://projetoindustrial.github.io/llms.txt): demais sites da família

## Aviso
${NOTA} Gerado em ${HOJE}. Links externos e ofertas de cursos mudam: confirme antes de contar com eles.
`);
const urls = [SITE, ...paginas.map((p) => p.url)];
gravar("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc><lastmod>${HOJE}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log(`OK: ${paginas.length} páginas HTML, ${trilhas.length} trilhas, ${perfis.length} perfis, ${companies.length} empresas, ${nl.length} normas -> ${OUT}/`);
