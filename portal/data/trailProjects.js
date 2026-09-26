// data/trailProjects.js — "Projeto Final" por trilha (Relatório Técnico Final IndústriaEDU,
// seção 8). Estrutura padrão de 5 partes + 3 níveis de complexidade, aplicada nas trilhas
// mais próximas de cada um dos 9 exemplos do relatório (mapeamento feito em 26/09/2026 —
// o relatório dava só a área, não o id da trilha; roteiro/formato/critérios abaixo foram
// escritos aqui em cima da situação/objetivo originais do relatório).
// Cobre 9 das 107 trilhas por enquanto — as demais não têm Projeto Final ainda.
export const NIVEIS = [
  { nivel: 1, nome: "Essencial", entrega: "Resposta básica ao problema", tempo: "30–60 min" },
  { nivel: 2, nome: "Completo", entrega: "+ justificativa + segurança + prevenção", tempo: "1–2 horas" },
  { nivel: 3, nome: "Avançado", entrega: "+ diagrama / pesquisa extra", tempo: "2–4 horas" },
];

export const PROJETOS_FINAIS = {
  "trl-02": {
    area: "Automação Industrial",
    situacao: "Uma esteira para com frequência na linha; o sensor parece estar falhando.",
    objetivo: "Diagnosticar as causas prováveis, propor uma solução e listar cuidados de segurança e uma ação preventiva.",
    roteiro: [
      "Liste os sintomas observados e quando eles aparecem (sempre? só em certas condições?).",
      "Monte uma árvore de causas prováveis (sensor, cabo, fonte, atuador, lógica do CLP).",
      "Descreva como testaria cada causa, da mais simples/barata pra mais trabalhosa.",
      "Proponha a correção e uma ação preventiva pra não repetir.",
    ],
    formatoEntrega: "Texto curto ou diagrama de causas (pode ser foto de um desenho à mão)",
    criterios: [
      "As causas listadas são plausíveis pro sintoma descrito?",
      "A ordem de teste faz sentido (simples antes de complexo)?",
      "Os cuidados de segurança (bloqueio/energia) foram lembrados?",
    ],
  },
  "TRL-CNCT-003": {
    area: "Refrigeração e Climatização",
    situacao: "Uma câmara fria não mantém a temperatura; o compressor liga com frequência excessiva.",
    objetivo: "Diagnosticar a causa provável, propor uma correção e uma melhoria de eficiência energética.",
    roteiro: [
      "Verifique as causas mais comuns de perda de frio: vedação da porta, carga de gás, evaporador com gelo.",
      "Relacione o ciclo curto do compressor com a causa mais provável encontrada.",
      "Proponha a correção passo a passo.",
      "Sugira uma melhoria simples de eficiência (isolamento, degelo, ajuste de termostato).",
    ],
    formatoEntrega: "Checklist preenchido + foto do ponto de falha, se houver",
    criterios: [
      "A causa apontada explica o sintoma (compressor ligando demais)?",
      "A correção proposta é executável com ferramentas básicas?",
      "A sugestão de eficiência é realista pro tipo de câmara?",
    ],
  },
  "TRL-CNCT-013": {
    area: "Manutenção Automotiva",
    situacao: "Um veículo de frota apresenta consumo alto e perda de potência, sem nenhuma luz acesa no painel.",
    objetivo: "Montar um plano de diagnóstico priorizado e listar as ferramentas necessárias.",
    roteiro: [
      "Liste os sistemas que afetam consumo e potência (ar, combustível, ignição, escapamento, pneus).",
      "Ordene por probabilidade e facilidade de checagem.",
      "Para cada item, diga qual ferramenta ou teste seria usado.",
      "Defina o critério de \"resolvido\" (ex: consumo volta ao normal em X km).",
    ],
    formatoEntrega: "Checklist com ordem de prioridade",
    criterios: [
      "A ordem de checagem prioriza o que é mais barato/rápido de testar primeiro?",
      "As ferramentas listadas são coerentes com cada teste?",
      "Existe um critério claro de que o problema foi resolvido?",
    ],
  },
  "trl-06": {
    area: "Segurança do Trabalho",
    situacao: "Uma oficina tem risco de queda e ruído alto, sem nenhuma análise formal feita até hoje.",
    objetivo: "Identificar os riscos, classificá-los e propor controles e EPIs adequados.",
    roteiro: [
      "Percorra (mentalmente ou com foto) os pontos de risco de queda e as fontes de ruído.",
      "Classifique cada risco por gravidade e frequência de exposição.",
      "Aplique a hierarquia de controles (eliminar > isolar > administrativo > EPI) antes de só indicar EPI.",
      "Liste os EPIs certos pra cada risco que restar depois dos controles.",
    ],
    formatoEntrega: "Tabela simples: risco → classificação → controle → EPI",
    criterios: [
      "Os riscos identificados são reais pro cenário descrito (queda, ruído)?",
      "A hierarquia de controles foi respeitada (não pulou direto pro EPI)?",
      "Os EPIs indicados são os corretos pro risco (ex: abafador pra ruído, não só protetor genérico)?",
    ],
  },
  "TRL-CNCT-009": {
    area: "Logística",
    situacao: "Um centro de distribuição tem atrasos recorrentes e excesso de movimentação interna.",
    objetivo: "Propor melhorias de fluxo e uma forma simples de medir se a melhoria funcionou.",
    roteiro: [
      "Mapeie o fluxo atual (recebimento → armazenagem → separação → expedição) e onde ele trava.",
      "Aponte os pontos de movimentação desnecessária (retrabalho, distância, espera).",
      "Proponha 2–3 mudanças concretas de layout ou processo.",
      "Defina um indicador simples pra medir antes/depois (ex: tempo médio de separação de pedido).",
    ],
    formatoEntrega: "Diagrama de fluxo (antes/depois) ou texto estruturado",
    criterios: [
      "O gargalo identificado é coerente com os sintomas (atraso, movimentação excessiva)?",
      "As mudanças propostas atacam a causa, não só o sintoma?",
      "O indicador escolhido realmente mede o que a mudança promete melhorar?",
    ],
  },
  "TRL-CNCT-004": {
    area: "Administração / Gestão",
    situacao: "Uma microempresa industrial não tem controle de prazos, custos nem comunicação interna.",
    objetivo: "Propor 3 práticas simples de organização e acompanhamento, viáveis sem sistema caro.",
    roteiro: [
      "Identifique qual dos três (prazo, custo, comunicação) está causando mais problema hoje.",
      "Escolha uma prática simples pra cada um (planilha de prazos, controle básico de custo, reunião curta semanal).",
      "Descreva como a prática seria aplicada no dia a dia, sem depender de sistema caro.",
      "Defina como saberia se está funcionando em 30 dias.",
    ],
    formatoEntrega: "Texto curto com as 3 práticas e como medir resultado",
    criterios: [
      "As práticas são realmente simples de aplicar numa micro/pequena empresa?",
      "Cada prática ataca um dos três problemas citados (prazo, custo, comunicação)?",
      "Existe um jeito claro de saber se deu certo?",
    ],
  },
  "TRL-CNCT-006": {
    area: "Recursos Humanos",
    situacao: "A produção tem alta rotatividade de funcionários e falta de feedback entre líderes e equipe.",
    objetivo: "Identificar as causas prioritárias da rotatividade e propor ações de retenção mensuráveis.",
    roteiro: [
      "Liste possíveis causas de rotatividade (salário, clima, liderança, condições de trabalho, falta de feedback).",
      "Priorize as 2–3 causas mais prováveis pro cenário descrito.",
      "Proponha uma ação concreta pra cada causa priorizada.",
      "Defina um indicador pra cada ação (ex: taxa de turnover mensal, resultado de pesquisa de clima).",
    ],
    formatoEntrega: "Texto ou tabela: causa → ação → indicador",
    criterios: [
      "As causas priorizadas fazem sentido com o problema (rotatividade + falta de feedback)?",
      "As ações propostas são específicas, não genéricas (\"melhorar o clima\" não conta)?",
      "Os indicadores são mensuráveis de verdade?",
    ],
  },
  "TRL-CNCT-010": {
    area: "Meio Ambiente",
    situacao: "Uma pequena indústria não tem plano de gestão de resíduos nem de efluentes.",
    objetivo: "Propor um plano básico de melhoria com indicadores simples de acompanhamento.",
    roteiro: [
      "Liste os tipos de resíduo e efluente gerados pela operação descrita.",
      "Para cada tipo, proponha um destino/tratamento adequado (reduzir, reutilizar, descartar corretamente).",
      "Monte um plano básico com responsável e prazo pra cada ação.",
      "Defina 1–2 indicadores simples (ex: volume de resíduo por mês, % de reaproveitamento).",
    ],
    formatoEntrega: "Plano de ação simples (tabela ou texto estruturado)",
    criterios: [
      "Os tipos de resíduo/efluente listados são coerentes com o cenário industrial?",
      "As ações propostas são viáveis pra uma pequena indústria (não exigem investimento pesado demais)?",
      "Os indicadores escolhidos permitem acompanhar o progresso ao longo do tempo?",
    ],
  },
  "TRL-CNCT-014": {
    area: "Mecânica Geral",
    situacao: "Uma máquina apresenta vibração e ruído incomuns depois de várias horas de trabalho contínuo.",
    objetivo: "Definir uma sequência de inspeção justificada e os cuidados de segurança necessários (LOTO).",
    roteiro: [
      "Liste as causas mais comuns de vibração/ruído (desalinhamento, desbalanceamento, folga, lubrificação, rolamento).",
      "Ordene a sequência de inspeção da causa mais provável/fácil de checar pra mais trabalhosa.",
      "Descreva o procedimento de bloqueio e etiquetagem (LOTO) antes de qualquer inspeção física.",
      "Explique o que justifica essa ordem de prioridade escolhida.",
    ],
    formatoEntrega: "Checklist de inspeção com ordem justificada",
    criterios: [
      "A sequência de inspeção vai do mais provável/simples pro mais complexo?",
      "O procedimento de LOTO foi descrito antes de qualquer intervenção física?",
      "A justificativa da ordem escolhida faz sentido técnico?",
    ],
  },
};
