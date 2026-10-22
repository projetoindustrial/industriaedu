// theme/tokens.js — Sistema de tokens de cor e helpers de estilo.
// Design System v2 (out/2026): valores recalculados a partir dos tokens do DS (tema escuro); os NOMES e o
// significado semântico abaixo não mudaram. Verde/vermelho/amarelo/azul seguem status-success/danger/warning/text-link;
// o violeta de "rede" é EXTENSÃO ao DS (matiz 256°), mesmo tratamento de saturação e contraste (>=4,5:1 sobre o card).
// Extraído de App.jsx (linhas 39-51 originais) na quebra do monólito (D98/D99, 05/07/2026).
// Paleta expandida em 05/07/2026 (D97) — as 76 cores que antes estavam soltas pelo arquivo,
// nomeadas num só lugar. Ver ESTUDO_ARQUITETURA_E_PLANO.md seção 4.
//
// SISTEMA DE COR SEMÂNTICO (14/07/2026) — a lógica abaixo já existia implicitamente no uso
// real do código (auditada view por view antes de escrever isto); esta é a primeira vez que
// ela é declarada como regra. Ao adicionar cor nova a uma tela, escolher pelo SIGNIFICADO,
// não pelo gosto — e usar os tokens já existentes da família certa, não uma cor nova.
//
//   🟢 verde/emerald   — VANTAGEM para quem usa o site: valor em R$ (salário, saldo),
//                        conteúdo gratuito, status validado/aprovado, tendência de alta.
//   🔵 azul/skyBlue    — NAVEGAÇÃO e IDENTIFICADOR OFICIAL: link externo ("Acessar →"),
//                        código de trilha (TRL-...), código CBO, botão de navegação interna.
//   🟣 roxo/indigo     — REDE e RELACIONAMENTO: trilhas de carreira, soft skills, Atlas FATO,
//                        score de oportunidade, competidores de talento — dado que conecta
//                        uma entidade a outra, não um identificador isolado.
//   🟠 laranja/amber   — ALERTA: dominância de mercado, custo/pago, normas técnicas (NR-xx), avisos ⚠️.
//   🟧 caution         — PRÉ-REQUISITO e dificuldade (DS v2.3, status-caution; sempre com texto).
//   🔴 vermelho        — CRÍTICO/NEGATIVO: erro, impacto muito alto, status inválido, saldo
//                        negativo.
//
// Achado ao auditar: código CBO aparecia ora em azul (identificador), ora em roxo (como se
// fosse dado de rede) sem critério — corrigido para azul em todo lugar (14/07/2026), por ser
// um identificador oficial (mesma família de TRL-xx), não uma relação. Ver _DECISIONS.md D109.

// Escala de texto (DS v2.3): heading #e8eef2 > text #d4dee5 > dim #8ba3b5 (secundário) > muted #7c92a3 (terciário, >= 4,9:1 no card).
// faint, warmGray e muted eram 3 cinzas com ΔE2000 <= 2,4 (indistinguíveis): agora têm o mesmo valor; textSoft = text.
export const C = {
  bg:"#0b1520",surface:"#142333",surface2:"#0b1520",border:"#243447",
  text:"#d4dee5",muted:"#7c92a3",dim:"#8ba3b5",
  social:"#9377e2",tech:"#1c98a8",green:"#23a66a",amber:"#db9d25",caution:"#fa9364",cautionDim:"#31292b",
  purple:"#9478e2",orange:"#e0a42f",
  amberBorderA:"#83601d44",amberLight:"#e3aa3c",blue:"#71dbe9",blueBorderA:"#14819044",blueBorderA2:"#2a747e44",blueBorderA3:"#2a747e33",blueBorderA4:"#2e929f55",blueDark:"#2a747e",blueDim:"#113135",blueDim2:"#102b2f",borderLight:"#5f7890",emerald:"#45c289",faint:"#7c92a3",greenBorder:"#21744e",greenBorderA:"#26936144",greenBorderA2:"#34b37944",greenBright:"#34b379",greenDark:"#105535",greenDim:"#0a291b",greenDim2:"#0f271c",greenDim3:"#0f271c",greenDim4:"#12261d",greenLight:"#5ace99",heading:"#e8eef2",hoverBg:"#1b3242",indigoBorderA:"#917cce44",indigoBorderA2:"#917cce66",indigoBorderA3:"#553d9644",indigoBorderA4:"#553d9633",indigoBright:"#a78eeb",indigoDark:"#553d96",indigoLight:"#c1aff2",lime:"#48d393",limeBorderA:"#48d39333",orangeBorderA:"#ae7e2044",orangeDim:"#191103",orangeDim2:"#1a1409",orangeDim3:"#241a05",orangeDim4:"#171003",orangeLight:"#e6b351",purpleBorderA:"#9478e244",purpleDim:"#2a2046",purpleDim2:"#25115a",purpleDim3:"#1a1036",purpleLight:"#ae97ee",purpleSoft:"#ccbdf5",red:"#e98080",redBorder:"#742828",redBorderA:"#e9808022",redBorderA2:"#e9808044",redBright:"#df6464",redDim:"#3f1010",redDim2:"#1a0c0c",redDim3:"#271212",skyBlue:"#4dd1e3",surface3:"#0b1520",surfacePanel:"#0f1c28",textSoft:"#d4dee5",tierT2:"#50d0e1",tierT4:"#9476e7",warmGray:"#7c92a3",white:"#ffffff",yellow:"#e1a42e",
};

export const pill=(bg,color,border)=>({fontSize:10,padding:"2px 9px",borderRadius:99,background:bg,color,border:`1px solid ${border||color+"44"}`,whiteSpace:"nowrap",fontWeight:600,display:"inline-flex",alignItems:"center",gap:3});
export const card=(accent=C.border)=>({background:C.surface,border:`1px solid ${accent}`,borderRadius:10,overflow:"hidden"});
export const btn=(bg,color,border)=>({padding:"6px 14px",borderRadius:7,background:bg,color,border:`1px solid ${border||color+"55"}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"});
export const SEL={padding:"7px 10px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,fontFamily:"inherit"};
