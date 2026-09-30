import assert from "node:assert/strict";
import { parseFilters, serializeFilters } from "./urlStateCore.js";
const D = { layer:"all", sector:"Todos", fmt:"Todos", lang:"Todos", sortBy:"relevance", noReg:false, dataLayer:"free", onlyFav:false, q:"" };

// 1. URL limpa quando tudo é padrão
assert.equal(serializeFilters(D, D), "");
// 2. só o que mudou entra na URL
const s = { ...D, layer:"technical", noReg:true, q:"soldagem NR-13" };
const qs = serializeFilters(s, D);
assert.equal(qs, "?layer=technical&noReg=1&q=soldagem+NR-13");
// 3. ida e volta preserva o estado (inclusive acentos e espaços)
const s2 = { ...D, sector:"Petróleo e Petroquímica", q:"válvula de segurança" };
assert.deepEqual(parseFilters(serializeFilters(s2, D), D), s2);
// 4. parâmetros alheios são preservados e chaves desconhecidas não entram no estado
assert.equal(serializeFilters(D, D, "?utm_source=x"), "?utm_source=x");
assert.deepEqual(parseFilters("?foo=1&layer=guia", D), { ...D, layer:"guia" });
// 5. booleano: "0" explícito vira false; voltar ao padrão remove da URL
assert.equal(parseFilters("?noReg=0", D).noReg, false);
assert.equal(serializeFilters({ ...D, noReg:false }, D, "?noReg=1"), "");
console.log("5 grupos de teste OK");
