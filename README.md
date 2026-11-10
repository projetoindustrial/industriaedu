# IndústriaEDU

Portal gratuito de educação e mercado de trabalho para a indústria brasileira.

**Site:** https://projetoindustrial.github.io/industriaedu/
**API:** Cloudflare Worker + D1 (leitura pública, somente-leitura)

## O que é

Um catálogo curado de fontes educacionais gratuitas ligadas à indústria: cursos, trilhas de
carreira, empresas, normas técnicas (NR), CBO e CNCT, além de dados de mercado de trabalho e
programas sociais — hoje com 604 fontes, 107 trilhas de carreira e 208 programas sociais
mapeados.

## Arquitetura

- **`portal/`** — frontend em React 18 (sem build step; Babel standalone no navegador),
  consumindo a API via `apiClient.js`.
- **`worker/`** — backend em Cloudflare Workers, expondo endpoints GET somente-leitura sobre um
  banco Cloudflare D1 (SQLite gerenciado).

O frontend nunca acessa o banco diretamente: todo dado passa pelos endpoints do Worker, que
decidem o que é retornado.

## Publicação

O portal é publicado automaticamente no GitHub Pages a cada push em `portal/`, via GitHub
Actions (`.github/workflows/deploy-pages.yml`). O Worker é publicado separadamente — ver
`worker/README.md` para instruções de deploy.

## Documentação interna

Notas de construção, protocolo de sessões e histórico de desenvolvimento ficam na branch
`docs-internos`, fora da `main`, para manter o repositório público focado no produto.

## Versão em texto (para pessoas e assistentes de IA)

O portal interativo depende de JavaScript. Para que o conteúdo também seja legível sem ele, há uma
camada paralela em `portal/texto/` (trilhas, perfis, empresas, normas, CSV/JSONL), mais `portal/llms.txt`
e `portal/sitemap.xml`. Ela é gerada pelo script `tools/gerar_texto.mjs` (Node 20+, sem dependências):

```
node tools/gerar_texto.mjs --base https://<worker>.workers.dev   # lê a API ao vivo
node tools/gerar_texto.mjs --json-dir ./dump                      # ou JSONs locais
```

Regere e publique sempre que os dados do banco mudarem. Normas pagas aparecem só como referência.
