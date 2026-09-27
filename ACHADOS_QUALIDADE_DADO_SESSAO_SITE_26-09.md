# Achados de qualidade de dado — sessão SITE, 26/09/2026

Registrados durante o trabalho de classificação por categoria e criação do "Projeto
Final" nas 107 trilhas. Atualizado no mesmo dia após uma segunda passada corrigindo
o que dava pra corrigir com segurança em `worker/d1/data.sql` (commit `1bdb5a5`).

**Importante para quem for aplicar isso:** correções em `data.sql` só valem no site
depois que o D1 ao vivo for reimportado a partir desse arquivo — eu não tenho acesso
à API da Cloudflare pra fazer isso diretamente.

## 1. Trilha-stub sem conteúdo real: `TRL-TI-007` — ✅ ocultada (não removida)
Descrição no banco: "Stub gerado pelo patch consolidado para garantir FK em
trail_escola_links". Não é uma trilha real. **Decisão tomada:** não apaguei a linha
do banco (poderia quebrar a FK que ela foi criada pra satisfazer). Em vez disso,
filtrei ela da saída em dois lugares: `worker/src/loadTrails.js` (servidor, só vale
após redeploy do Worker) e `portal/data/loadCore.js` (cliente, **já em produção** —
o visitante não vê mais essa trilha, independente do estado do Worker).
Se o time de BANCO quiser resolver na raiz (ex: flag `is_stub`/`hidden` na tabela),
os dois filtros client-side e server-side podem ser removidos depois.

## 2. CNCT com quebra de linha: `TRL-SUB-003` — ✅ corrigido em `data.sql`
Era `"...Segurança Industria\nl"` (quebrado no meio da palavra). Corrigido pra
`"...Segurança Industrial"` direto na fonte. Meu mapa de categorização
(`portal/data/trailCategories.js`) já tinha um caso especial pra esse valor quebrado
— pode ser simplificado depois que o D1 for reimportado com o valor corrigido (o
caso especial não atrapalha, só fica redundante).

## 3. Inconsistência NR-38 × NR-37: `TRL-SUB-008` — ⚠️ NÃO mexido, ficou mais confuso
Achei uma **terceira fonte** que não tinha visto na primeira passada: além do título
("NR-38") e da descrição da trilha ("NR-37"), existe uma **outra tabela** (algo tipo
atlas/referência técnica, entrada de id 185) que também cita essa sub-trilha e diz:

> "NR-38 (Segurança e Saúde no Trabalho em Atividades da Indústria de Petróleo e Gás)"

Ou seja, 2 fontes dizem NR-38 (o título da trilha + essa tabela atlas) e só 1 diz
NR-37 (a descrição da trilha). Eu tinha corrigido o título pra NR-37 antes de achar
essa terceira fonte — **desfiz essa mudança**, porque a maioria das fontes internas
aponta NR-38, e não tenho como verificar contra a norma real qual é a intenção
correta sem pesquisa regulatória. **Fica pra quem tiver mais contexto decidir** —
as 3 fontes (nome da trilha, description da trilha, e a entrada na tabela atlas
id=185) deveriam ser alinhadas depois de confirmado qual NR é a certa pro contexto
(parece ser sobre plataformas/indústria de petróleo e gás, dado o agrupamento com
outras sub-trilhas offshore).

## 4. Campo `description` vazio em 4 trilhas — ✅ preenchido em `data.sql`
`TRL-CNCT-040` (Laticínios), `TRL-CNCT-041` (Carnes e Derivados), `TRL-MOD-004`
(Perfuração HPHT), `TRL-MOD-006` (Soldagem Não Ferrosos) tinham `description` vazia.
Escrevi uma descrição de 1-2 frases pra cada uma, no mesmo estilo das demais 102
trilhas, baseada no nome/CNCT de cada uma. Vale uma revisão humana já que não vieram
de nenhuma fonte curada, só do meu conhecimento geral da área.

---
*Validação: carreguei `schema.sql` + `data.sql` corrigido num SQLite real antes de
subir — schema aceitou sem erro, 107 trilhas intactas, campos preenchidos conferidos
um a um.*
