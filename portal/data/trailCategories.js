// data/trailCategories.js — classificação das trilhas por área, feita em cima do
// rótulo CNCT real de cada trilha (campo `cnct` vindo do banco), não de palpite por
// palavra solta no nome. Mapa construído em 26/09/2026 a partir dos 71 rótulos CNCT
// distintos existentes nas 107 trilhas atuais (extraídos de worker/d1/data.sql).
// Se novas trilhas entrarem com um CNCT que não está no mapa, caem em "outros" —
// é só adicionar a linha correspondente aqui.

const CNCT_TO_CATEGORY = {
  "#13 Metalurgia / END": "mecanica",
  "#17 Transição Energética": "processos",
  "#2 Automação Industrial": "automacao",
  "#22 Soldagem": "mecanica",
  "#25 Segurança do Trabalho": "seguranca",
  "#7 Eletrotécnica Industrial": "eletrica",
  "Administração e Gestão Empresarial": "gestao",
  "Agricultura e Produção Vegetal": "agro",
  "Agroindústria e Processamento de Alimentos": "alimentos",
  "Aquicultura": "agro",
  "Automação e Controle de Processos": "automacao",
  "Automação e Controle de Processos / Segurança Industria\nl": "automacao",
  "Automação e Controle de Processos / Segurança Industrial": "automacao",
  "Automação e Controle de Processos / Segurança Industrial\nl": "automacao",
  "Biotecnologia Industrial": "agro",
  "Competências Transversais": "transversais",
  "Completação e Intervenção de Poços": "processos",
  "Comércio Exterior e Logística Internacional": "logistica",
  "Construção Civil e Edificações": "construcao",
  "Contabilidade e Gestão Financeira": "gestao",
  "Design Gráfico": "design",
  "Design de Embalagens": "design",
  "Design de Interiores": "design",
  "Eletrotécnica e Sistemas Elétricos": "eletrica",
  "Eletrônica e Sistemas Embarcados": "eletrica",
  "Energias Renováveis e Sustentabilidade": "processos",
  "Estradas e Rodovias": "construcao",
  "Geodésia e Cartografia": "agro",
  "Geologia e Exploração Mineral": "agro",
  "Gestão Ambiental": "gestao",
  "Gestão Financeira e Análise de Investimentos": "gestao",
  "Gestão Pública e Regulação": "gestao",
  "Gestão da Qualidade": "gestao",
  "Gestão de Pessoas e Recursos Humanos": "gestao",
  "Gestão de Recursos Hídricos": "agro",
  "Gestão de Vendas e Comércio / Gestão Imobiliária": "gestao",
  "Gestão e Negócios": "gestao",
  "Gestão e Negócios (transversal)": "gestao",
  "Inspeção e Qualidade Industrial": "mecanica",
  "Instrumentação e Controle de Processos": "automacao",
  "Logística Portuária e Supply Chain": "logistica",
  "Logística e Supply Chain": "logistica",
  "Manutenção Automotiva": "mecanica",
  "Mecatrônica": "automacao",
  "Mecânica Geral": "mecanica",
  "Mecânica de Manutenção e Projetos": "mecanica",
  "Metalurgia": "mecanica",
  "Metalurgia e Materiais": "mecanica",
  "Metrologia e Garantia da Qualidade": "mecanica",
  "Metrologia e Garantia da Qualidade / Processos Químicos": "mecanica",
  "Movimentação de Cargas e Içamento": "mecanica",
  "Operação e Manutenção Offshore": "processos",
  "Operações Portuárias e Logística": "logistica",
  "Panificação e Confeitaria": "alimentos",
  "Processos Químicos e Petroquímicos": "processos",
  "Produção Cultural e Design": "design",
  "Produção de Petróleo e Gás": "processos",
  "Recursos Florestais": "agro",
  "Redes OT e IoT Industrial": "ti",
  "Refrigeração e Climatização": "mecanica",
  "Saneamento Básico": "agro",
  "Segurança e Saúde no Trabalho": "seguranca",
  "Simulação e Otimização de Processos": "mecanica",
  "Sistemas Digitais e Automação": "automacao",
  "Sistemas Térmicos e Geração de Vapor": "processos",
  "Soldagem, Caldeiraria e Integridade Estrutural": "mecanica",
  "Tecnologia Sucroenergética": "alimentos",
  "Tecnologia de Alimentos": "alimentos",
  "Tecnologia de Bebidas": "alimentos",
  "Tecnologia de Carnes": "alimentos",
  "Tecnologia de Laticínios": "alimentos",
  "Zootecnia Industrial": "agro",
};

// Fallback por nome, só usado quando a trilha não tem `cnct` preenchido.
function categorizeByName(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("mecatrônica") || n.includes("mecatronica")) return "automacao";
  if (n.includes("design gráfico") || n.includes("produção cultural")) return "design";
  if (n.includes("tecnologia da informação") || n.includes("tecnologia da informacao")) return "ti";
  return "outros";
}

export function categorizeTrail(trail) {
  if (trail.cnct && CNCT_TO_CATEGORY[trail.cnct]) return CNCT_TO_CATEGORY[trail.cnct];
  return categorizeByName(trail.name);
}

export const CATEGORY_LABELS = {
  "automacao": "Automação e Controle",
  "eletrica": "Elétrica e Eletrônica",
  "mecanica": "Mecânica, Manutenção e Qualidade",
  "processos": "Química, Petróleo e Energia",
  "alimentos": "Alimentos e Agroindústria",
  "agro": "Agropecuária e Recursos Naturais",
  "construcao": "Construção e Infraestrutura",
  "seguranca": "Segurança e Saúde no Trabalho",
  "gestao": "Gestão e Negócios",
  "logistica": "Logística e Comércio Exterior",
  "ti": "Tecnologia e TI Industrial",
  "design": "Design e Produção Cultural",
  "transversais": "Competências Transversais"
};
CATEGORY_LABELS.outros = "Outros / Transversais";

export const CATEGORY_ORDER = ["automacao", "eletrica", "mecanica", "processos", "gestao", "logistica", "alimentos", "agro", "construcao", "seguranca", "ti", "design", "transversais"].concat(["outros"]);
