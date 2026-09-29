# Como contribuir com o IndústriaEDU

O catálogo é mantido de forma independente. Há dois caminhos, conforme o tipo de ajuda:

## 1. Você achou um erro ou tem uma sugestão (não precisa saber programar)
Abra uma **Issue** no repositório e escolha o modelo:
- **Link quebrado ou desatualizado** — informe a fonte e, se souber, o endereço novo.
- **Sugerir nova fonte** — informe o link direto da página do curso e se é realmente gratuito.
Um mantenedor confere e aplica no banco. Você não precisa editar arquivo nenhum.

## 2. Você quer mexer no código do site (Pull Request)
1. Abra uma Issue descrevendo a mudança antes de começar.
2. Faça o PR contra `main` e preencha o checklist do modelo.
3. O CI valida o catálogo automaticamente; PR que quebra o schema não passa.

## Regra importante: quem edita o quê
O banco `fato_*.db` é um arquivo binário e **só é editado pela sessão/papel BANCO**; o site
(`App.jsx`, `db.js`, `index.html`, `views/`) só pelo papel SITE. Quem encontra problema do "outro
lado" registra um pedido no `_BACKLOG.md` em vez de corrigir direto (motivo: o incidente histórico
descrito na Regra 0 do `_LEIA_PRIMEIRO.md`). Por isso PR **não** deve incluir alteração no `.db`.

## O que o CI checa
`scripts/exportar_e_validar_catalogo.py` gera `sources.json` (visão legível do banco) e valida contra
`schema/sources.schema.json`. Rode localmente antes de abrir o PR.

## Como rodar localmente
```
python scripts/exportar_e_validar_catalogo.py --db portal/dados/fato_v237.db \
       --schema schema/sources.schema.json --out /tmp/sources.json
```
