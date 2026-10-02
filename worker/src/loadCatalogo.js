// loadCatalogo.js — endpoints do CATÁLOGO DE CURSOS E TRILHAS (tabelas cat_* do D1, vitrine v19c).
// Segue o padrão dos outros load*.js: query(db, sql, params) do helpers.js, tudo somente-leitura.
// Decisões de custo (D1 gratuito conta "linhas lidas" por dia):
//   - lista de cursos usa paginação por cursor (after=<id>) em vez de OFFSET e NÃO faz COUNT(*):
//     devolve has_more/next_after. O total geral vem de /api/cat/meta (já gravado em cat_meta).
//   - todo filtro vai por parâmetro (?), nunca concatenado no SQL (sem injeção).
//   - busca de texto (q) exige >=3 letras; é a consulta mais cara (varre a tabela até achar o limite).
import { query, groupBy } from "./helpers.js";

const PER_PAGE_PADRAO = 50;
const PER_PAGE_MAX = 100;
const COLS_LISTA = `id, bloco_id, nome, instituicao, fonte, carga_horaria, horas_h, categoria_eixo, modalidade,
  url, url_generica, gratuidade_status, trilha_codigo, modulo_ordem, papel, nivel`;

const limpaInt = (v) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? n : null; };
const fmtCurso = (c) => ({ ...c, url_generica: !!c.url_generica });
// escapa % _ \ pro LIKE (o usuário digita texto, não padrão)
const likeEsc = (s) => s.replace(/[\\%_]/g, (m) => "\\" + m);

// GET /api/cat/meta — versão, totais e blocos (cache barato, poucas linhas)
export async function loadCatMeta(db) {
  const [meta, blocos] = await Promise.all([
    query(db, `SELECT chave, valor FROM cat_meta`),
    query(db, `SELECT b.id, b.nome, b.descricao, (SELECT COUNT(*) FROM cat_cursos c WHERE c.bloco_id = b.id) AS n_cursos FROM cat_blocos b ORDER BY b.id`),
  ]);
  const m = {}; meta.forEach((r) => { m[r.chave] = r.valor; });
  return { versao: m.versao || null, gerado_em: m.gerado_em || null, n_cursos: Number(m.n_cursos) || null, nota: m.nota || null, blocos };
}

// GET /api/cat/trilhas — as 64 trilhas com seus módulos (sem cursos)
export async function loadCatTrilhas(db) {
  const [trilhas, modulos] = await Promise.all([
    query(db, `SELECT codigo, nome, eixo, situacao, carga_total_h, carga_cursos_h, carga_formal_h, n_modulos, n_itens FROM cat_trilhas ORDER BY rowid`),
    query(db, `SELECT trilha_codigo, ordem, fase, nome, tipo_modulo, carga_h, n_itens, extra FROM cat_trilha_modulos ORDER BY trilha_codigo, ordem`),
  ]);
  const modByTrilha = groupBy(modulos, "trilha_codigo");
  return trilhas.map((t) => ({ ...t, modulos: (modByTrilha[t.codigo] || []).map((m) => ({ ...m, extra: !!m.extra })) }));
}

// GET /api/cat/trilhas/:codigo — trilha + módulos, cada módulo com seus cursos (ordenados por nome)
// Retorna null se o código não existe (o index.js responde 404).
export async function loadCatTrilha(db, codigo) {
  const [trilhas, modulos, cursos] = await Promise.all([
    query(db, `SELECT codigo, nome, eixo, situacao, carga_total_h, carga_cursos_h, carga_formal_h, n_modulos, n_itens FROM cat_trilhas WHERE codigo = ?`, [codigo]),
    query(db, `SELECT ordem, fase, nome, tipo_modulo, carga_h, n_itens, extra FROM cat_trilha_modulos WHERE trilha_codigo = ? ORDER BY ordem`, [codigo]),
    query(db, `SELECT ${COLS_LISTA} FROM cat_cursos WHERE trilha_codigo = ? ORDER BY modulo_ordem, nome COLLATE NOCASE`, [codigo]),
  ]);
  if (!trilhas.length) return null;
  const porModulo = groupBy(cursos, "modulo_ordem");
  return {
    ...trilhas[0],
    modulos: modulos.map((m) => ({ ...m, extra: !!m.extra, cursos: (porModulo[m.ordem] || []).map(fmtCurso) })),
  };
}

// GET /api/cat/cursos?bloco=&trilha=&instituicao=&papel=&q=&per_page=&after=
export async function loadCatCursos(db, sp) {
  const where = []; const params = [];
  const bloco = limpaInt(sp.get("bloco")); if (bloco !== null) { where.push("bloco_id = ?"); params.push(bloco); }
  const trilha = sp.get("trilha"); if (trilha) { where.push("trilha_codigo = ?"); params.push(trilha.slice(0, 20)); }
  const inst = sp.get("instituicao"); if (inst) { where.push("instituicao = ?"); params.push(inst.slice(0, 200)); }
  const papel = sp.get("papel"); if (papel) { where.push("papel = ?"); params.push(papel.slice(0, 30)); }
  const q = (sp.get("q") || "").trim();
  if (q) {
    if (q.length < 3) return { erro: "q precisa de pelo menos 3 letras" };
    where.push("(nome LIKE ? ESCAPE '\\' OR instituicao LIKE ? ESCAPE '\\')");
    const p = `%${likeEsc(q.slice(0, 80))}%`; params.push(p, p);
  }
  const after = limpaInt(sp.get("after")); if (after !== null) { where.push("id > ?"); params.push(after); }
  let per = limpaInt(sp.get("per_page")) || PER_PAGE_PADRAO; per = Math.min(Math.max(per, 1), PER_PAGE_MAX);
  const sql = `SELECT ${COLS_LISTA} FROM cat_cursos ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id LIMIT ?`;
  const rows = await query(db, sql, [...params, per + 1]);
  const has_more = rows.length > per;
  const items = rows.slice(0, per).map(fmtCurso);
  return { items, has_more, next_after: has_more ? items[items.length - 1].id : null, per_page: per };
}

// GET /api/cat/cursos/:id — um curso (todas as colunas públicas)
export async function loadCatCurso(db, id) {
  const rows = await query(db, `SELECT ${COLS_LISTA}, publico_alvo, tipo_oferta, certificador, data_lancamento, natureza_temporal FROM cat_cursos WHERE id = ?`, [id]);
  return rows.length ? fmtCurso(rows[0]) : null;
}
