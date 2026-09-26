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
  "trl-01": {
    area: "Eletrotécnica Industrial",
    situacao: "Um disjuntor geral de um painel elétrico industrial desarma repetidamente ao longo do dia, sem motivo óbvio.",
    objetivo: "Investigar as causas prováveis de um desarme repetitivo e propor um plano seguro de diagnóstico.",
    roteiro: [
      "Liste as causas típicas de desarme (sobrecarga, curto, fuga de corrente, disjuntor com defeito).",
      "Descreva como diferenciar cada causa (leitura de corrente, teste de isolamento, histórico de cargas ligadas no momento do desarme).",
      "Defina os procedimentos de segurança (bloqueio/etiquetagem, EPI) antes de qualquer medição.",
      "Proponha o próximo passo de diagnóstico e o que faria se o desarme persistir.",
    ],
    formatoEntrega: "Texto estruturado ou checklist de diagnóstico",
    criterios: [
      "As causas listadas são coerentes com um desarme repetitivo (não pontual)?",
      "A ordem de investigação vai do mais simples/seguro pro mais invasivo?",
      "Os cuidados de segurança elétrica foram mencionados antes de medições?",
    ],
  },
  "trl-03": {
    area: "Soldagem",
    situacao: "Uma solda é reprovada na inspeção visual por apresentar porosidade e uma pequena trinca.",
    objetivo: "Identificar as causas prováveis dos defeitos e propor correções no processo antes de re-soldar.",
    roteiro: [
      "Relacione porosidade e trinca com suas causas típicas (gás de proteção, umidade, parâmetros, material).",
      "Diga qual causa é mais provável dado o tipo de defeito observado.",
      "Proponha o ajuste de processo antes de tentar soldar de novo.",
      "Descreva como confirmaria que o ajuste resolveu o problema.",
    ],
    formatoEntrega: "Texto curto ou foto da solda com anotações",
    criterios: [
      "A causa apontada é coerente com o tipo específico de defeito (porosidade ≠ trinca)?",
      "O ajuste proposto ataca a causa, não só o sintoma?",
      "Existe uma forma clara de verificar se a correção funcionou?",
    ],
  },
  "trl-04": {
    area: "Energia Solar Fotovoltaica",
    situacao: "Um sistema fotovoltaico está gerando bem menos energia do que o esperado pelo projeto.",
    objetivo: "Diagnosticar as causas prováveis da baixa geração e propor uma correção.",
    roteiro: [
      "Liste causas comuns de baixa geração (sombreamento, sujeira nos módulos, string desbalanceada, inversor).",
      "Descreva como verificar cada uma (inspeção visual, dados do inversor, comparação entre strings).",
      "Priorize a investigação pela causa mais provável e mais barata de checar primeiro.",
      "Proponha a correção e uma forma de acompanhar se a geração voltou ao esperado.",
    ],
    formatoEntrega: "Checklist de diagnóstico ou texto curto",
    criterios: [
      "As causas listadas cobrem tanto problema físico (sombra/sujeira) quanto elétrico (string/inversor)?",
      "A ordem de investigação é eficiente (simples antes de complexo)?",
      "A forma de acompanhamento proposta realmente mede geração de energia?",
    ],
  },
  "trl-05": {
    area: "Inspeção e Ensaios Não Destrutivos",
    situacao: "Antes de liberar um equipamento pra operação, foi solicitado um ensaio não destrutivo numa solda considerada crítica.",
    objetivo: "Escolher o ensaio mais adequado pro caso e justificar a escolha.",
    roteiro: [
      "Liste os principais tipos de END (líquido penetrante, partícula magnética, ultrassom, radiografia) e o que cada um detecta melhor.",
      "Relacione o tipo de descontinuidade esperada (superficial vs interna) com o ensaio mais indicado.",
      "Justifique a escolha considerando acesso, material e criticidade da solda.",
      "Descreva o critério de aceitação que usaria pra liberar ou reprovar a peça.",
    ],
    formatoEntrega: "Texto justificando a escolha do ensaio",
    criterios: [
      "O ensaio escolhido é tecnicamente adequado pro tipo de descontinuidade esperada?",
      "A justificativa considera as limitações do ensaio (ex: penetrante não detecta defeito interno)?",
      "Existe um critério claro de aceitação/reprovação?",
    ],
  },
  "TRL-CNCT-031": {
    area: "Redes OT e IoT Industrial",
    situacao: "Um CLP perde comunicação de forma intermitente com o sistema SCADA, sem padrão claro de quando acontece.",
    objetivo: "Montar um plano de diagnóstico de rede pra encontrar a causa da instabilidade.",
    roteiro: [
      "Liste possíveis causas (cabeamento, switch, endereçamento IP duplicado, ruído elétrico, sobrecarga de rede).",
      "Separe causas de camada física (cabo/conector) das de camada lógica (configuração/protocolo).",
      "Defina uma ordem de teste, começando pelo mais fácil de verificar (ex: cabo e LED de link).",
      "Proponha uma forma de monitorar a rede por um período pra capturar o padrão da falha intermitente.",
    ],
    formatoEntrega: "Checklist de diagnóstico de rede",
    criterios: [
      "As causas físicas e lógicas foram separadas corretamente?",
      "A ordem de teste é eficiente pra um problema intermitente (difícil de reproduzir na hora)?",
      "A proposta de monitoramento é capaz de capturar um evento que não é constante?",
    ],
  },
  "TRL-CNCT-029": {
    area: "Construção Civil e Edificações",
    situacao: "Fissuras aparecem na alvenaria de uma obra que acabou de ser entregue.",
    objetivo: "Investigar as causas prováveis das fissuras e propor uma correção.",
    roteiro: [
      "Classifique o tipo de fissura pelo padrão (horizontal, vertical, diagonal, mapa) — isso já indica a causa provável.",
      "Relacione o padrão observado com causas típicas (recalque, retração, sobrecarga, problema térmico).",
      "Proponha a investigação complementar necessária antes de intervir (ex: acompanhar abertura por semanas).",
      "Proponha a correção adequada ao tipo de fissura identificado.",
    ],
    formatoEntrega: "Texto com foto/esquema do padrão de fissura",
    criterios: [
      "O padrão da fissura foi usado corretamente pra indicar a causa provável?",
      "A investigação complementar proposta é adequada antes de intervir (não corrige às cegas)?",
      "A correção é compatível com a causa identificada?",
    ],
  },
  "TRL-CNCT-022": {
    area: "Design Gráfico",
    situacao: "Uma pequena indústria pede uma identidade visual nova pro seu produto, mas o briefing do cliente é vago (\"quero algo moderno\").",
    objetivo: "Transformar um briefing vago num conceito visual justificado.",
    roteiro: [
      "Liste as perguntas que faria ao cliente pra destravar o briefing (público-alvo, concorrentes, valores da marca).",
      "Escolha uma direção de conceito (cores, tipografia, estilo) e justifique com base nas respostas hipotéticas.",
      "Descreva como aplicaria esse conceito em pelo menos duas peças diferentes (ex: logo + embalagem).",
      "Explique como apresentaria e defenderia essa escolha pro cliente.",
    ],
    formatoEntrega: "Moodboard ou peça gráfica simples + texto justificando as escolhas",
    criterios: [
      "As perguntas de briefing realmente destravam informação útil pro projeto?",
      "O conceito escolhido é justificado, não só \"gosto pessoal\"?",
      "A aplicação em mais de uma peça mantém coerência visual?",
    ],
  },
  "TRL-CNCT-020": {
    area: "Tecnologia de Alimentos",
    situacao: "Um lote de produto alimentício é reprovado no controle de qualidade por um desvio (ex: contaminação ou alteração sensorial).",
    objetivo: "Investigar a causa provável do desvio e propor uma ação corretiva baseada em BPF/APPCC.",
    roteiro: [
      "Levante os pontos do processo onde esse tipo de desvio costuma se originar (matéria-prima, manipulação, temperatura, higienização).",
      "Relacione o desvio observado com o ponto mais provável de origem.",
      "Proponha uma ação corretiva imediata pro lote e uma ação preventiva pro processo.",
      "Diga como isso se conecta a um ponto crítico de controle (PCC) do APPCC.",
    ],
    formatoEntrega: "Texto estruturado (causa → ação corretiva → ação preventiva)",
    criterios: [
      "A causa apontada é plausível pro tipo de desvio (contaminação ≠ alteração sensorial têm origens diferentes)?",
      "A ação corretiva e a preventiva estão claramente separadas?",
      "A ligação com BPF/APPCC faz sentido técnico?",
    ],
  },
  "TRL-CNCT-011": {
    area: "Agricultura",
    situacao: "Uma lavoura apresenta produtividade abaixo do esperado e sinais visuais de deficiência nas folhas.",
    objetivo: "Diagnosticar a causa provável (nutricional, praga, doença ou manejo) e propor uma correção.",
    roteiro: [
      "Descreva os sinais visuais típicos que ajudam a diferenciar deficiência nutricional de ataque de praga/doença.",
      "Liste os exames/observações que faria pra confirmar a causa (análise de solo, inspeção de folhas, histórico de manejo).",
      "Proponha a correção adequada à causa mais provável.",
      "Sugira uma prática pra prevenir a recorrência na próxima safra.",
    ],
    formatoEntrega: "Texto ou tabela: sinal observado → causa provável → correção",
    criterios: [
      "Os sinais visuais foram usados corretamente pra diferenciar as causas possíveis?",
      "A confirmação proposta (ex: análise de solo) é adequada antes de agir?",
      "A prevenção sugerida realmente evita repetição do problema?",
    ],
  },
  "TRL-CNCT-038": {
    area: "Petróleo e Gás",
    situacao: "Uma linha de produção de um poço apresenta queda de pressão sem explicação aparente.",
    objetivo: "Levantar hipóteses técnicas pra queda de pressão e propor uma ordem de investigação segura.",
    roteiro: [
      "Liste hipóteses típicas de queda de pressão (vazamento, obstrução, problema no reservatório, falha de equipamento).",
      "Separe as hipóteses por gravidade/urgência (vazamento é diferente de queda natural de reservatório).",
      "Defina os procedimentos de segurança operacional a seguir antes de qualquer intervenção.",
      "Proponha a sequência de verificação, da mais crítica/segura pra mais demorada.",
    ],
    formatoEntrega: "Texto estruturado com ordem de prioridade e justificativa",
    criterios: [
      "As hipóteses cobrem cenários de gravidade diferente (vazamento vs. queda natural)?",
      "A segurança operacional aparece antes de qualquer ação de campo?",
      "A ordem de investigação prioriza corretamente o que é mais crítico?",
    ],
  },
  "TRL-MICRO-SKILL-002": {
    area: "Liderança e Gestão de Equipes Técnicas",
    situacao: "Uma equipe técnica está com conflitos internos e produtividade em queda depois de uma mudança de turno.",
    objetivo: "Identificar as causas prováveis do conflito e propor ações de liderança pra reverter a situação.",
    roteiro: [
      "Liste possíveis causas ligadas à mudança de turno (comunicação, sobrecarga, adaptação, falta de integração da equipe).",
      "Priorize as 2 causas mais prováveis pro cenário descrito.",
      "Proponha uma ação de liderança concreta pra cada causa (não genérica como \"melhorar comunicação\").",
      "Defina como saberia, em algumas semanas, se a situação melhorou.",
    ],
    formatoEntrega: "Texto curto: causa → ação de liderança → como medir melhora",
    criterios: [
      "As causas identificadas são plausíveis pro contexto (mudança de turno)?",
      "As ações propostas são específicas e aplicáveis, não clichês genéricos?",
      "Existe um jeito concreto de verificar se funcionou?",
    ],
  },
};
