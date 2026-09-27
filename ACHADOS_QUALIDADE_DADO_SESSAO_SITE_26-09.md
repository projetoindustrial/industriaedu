# Achados de qualidade de dado — sessão SITE, 26/09/2026

Registrados durante o trabalho de classificação por categoria e criação do "Projeto
Final" nas 107 trilhas (ver commits `cab0ac2`, `05b7df9`...`e62ccc1` no histórico de
`main`). Assinalado pra sessão BANCO decidir o que corrigir na fonte.

## 1. Trilha-stub sem conteúdo real: `TRL-TI-007`
Campo `description` dessa trilha no banco (`worker/d1/data.sql`) contém literalmente:

> "Stub gerado pelo patch consolidado para garantir FK em trail_escola_links"

Ou seja, é um registro técnico criado só pra satisfazer uma constraint de chave
estrangeira, não uma trilha de carreira real. Ela não recebeu Projeto Final de
propósito. **Sugestão:** decidir se ela deve ser removida da tabela `trails` ou
marcada com uma flag (`is_stub`/`hidden`) pra não aparecer no catálogo público do
portal — hoje ela aparece normalmente pro visitante, com nome genérico "Trilha
Tecnologia da Informação 007".

## 2. CNCT com quebra de linha no meio da palavra: `TRL-SUB-003`
Campo `cnct_label` está gravado como:

`"Automação e Controle de Processos / Segurança Industria\nl"`

— ou seja, "Industrial" quebrado em "Industria" + `\n` + "l". Parece um artefato de
importação/concatenação. Meu mapa de categorização (`portal/data/trailCategories.js`)
já trata essa string exata como caso especial pra classificar corretamente, mas o
ideal é corrigir a origem no banco.

## 3. Possível inconsistência título × descrição: `TRL-SUB-008`
- **Título:** "Sub-trilha: NRs Específicas — NR-38 e NR-12"
- **Descrição:** menciona "NR-37 (Segurança e Saúde em Plataformas de Petróleo) e NR-12"

NR-38 (trabalho doméstico) e NR-37 (plataformas de petróleo) são normas completamente
diferentes. Pelo contexto da trilha (parece ligada a offshore/plataformas, dado o
prefixo `SUB` usado em outras sub-trilhas de petróleo/automação avançada), a
descrição (NR-37) parece a correta e o título provavelmente tem um erro de digitação.
**Sugestão:** conferir com a fonte original e corrigir o título se for o caso.

## 4. Campo `description` vazio em 4 trilhas
- `TRL-CNCT-040` (Laticínios)
- `TRL-CNCT-041` (Carnes e Derivados)
- `TRL-MOD-004` (Perfuração HPHT e Águas Ultraprofundas)
- `TRL-MOD-006` (Soldagem de Materiais Não Ferrosos)

Essas 4 têm `name` e `cnct_label` preenchidos normalmente, só o `description` está
vazio (`''`). O Projeto Final delas foi escrito só a partir do nome/CNCT, sem a
descrição de apoio que as outras 102 trilhas tiveram. Não é um problema urgente, mas
vale completar o campo pra manter a consistência dos dados.

---
*Nenhum desses pontos bloqueou a entrega — todos os 106 Projetos Final funcionais
foram publicados normalmente. São apenas melhorias de qualidade de dado pra próxima
sessão BANCO.*
