// views/ViewVagas.jsx — ponteiro para o Painel de Vagas.
// D16 (opção 3, 27/11/2026): a lista de vagas vive só no Painel de Vagas (projetoindustrial.github.io/vagas/).
// A aba de Vagas daqui (web component <aba-vagas>, lib/aba-vagas.js) foi removida. A rota "vagas" fica
// para não quebrar links e marcadores antigos.
import { C } from "../theme/tokens.js";

const PAINEL_URL = "https://projetoindustrial.github.io/vagas/";

export function ViewVagas(){
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px"}}>
      <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:C.heading}}>Vagas na indústria</h2>
      <p style={{margin:"0 0 16px",fontSize:13,color:C.dim,lineHeight:1.6}}>
        As vagas de petroquímica e petróleo & gás no Brasil ficam no Painel de Vagas, com filtros e o link da
        página oficial de cada empresa. É uma foto de alguns dias: confirme na
        página da empresa se a vaga continua aberta antes de se candidatar. Este portal não cobra nem pede seus dados.
      </p>
      <a href={PAINEL_URL} style={{display:"inline-block",padding:"10px 16px",borderRadius:8,background:C.indigoDark,color:"#fff",textDecoration:"none",fontSize:14,fontWeight:600}}>
        Abrir o Painel de Vagas
      </a>
    </div>
  );
}
