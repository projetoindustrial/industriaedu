// views/ViewVagas.jsx — aba "Vagas" (petroquímica e O&G no Brasil).
// Dados: tabelas vg_* do D1, servidas pelo Worker em /api/vagas e /api/vagas/meta
// (origem: projeto Painel de Vagas; versão e data da leitura aparecem no topo da lista).
// A lista, os filtros e a paginação são o web component <aba-vagas> (lib/aba-vagas.js), que
// só lê a API e escreve todo texto por textContent. Esta view só carrega o script e define as cores.
import { useEffect, useState } from "react";
import { C } from "../theme/tokens.js";
import { API_BASE } from "../apiClient.js";

const SCRIPT_SRC = "./lib/aba-vagas.js";

function carregaComponente(){
  return new Promise((ok,erro)=>{
    if(window.customElements && window.customElements.get("aba-vagas")) return ok();
    let s=document.querySelector('script[data-aba-vagas]');
    if(!s){
      s=document.createElement("script");
      s.src=SCRIPT_SRC; s.async=true; s.setAttribute("data-aba-vagas","1");
      document.head.appendChild(s);
    }
    s.addEventListener("load",()=>ok(),{once:true});
    s.addEventListener("error",()=>erro(new Error("não foi possível carregar o componente de vagas")),{once:true});
  });
}

export function ViewVagas(){
  const [pronto,setPronto]=useState(false);
  const [erro,setErro]=useState(null);
  useEffect(()=>{ carregaComponente().then(()=>setPronto(true)).catch(setErro); },[]);

  const cores={
    "--av-fg":C.text,"--av-bg":C.surface,"--av-borda":C.border,"--av-cor":C.indigoDark,
  };

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px"}}>
      <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:C.heading}}>Vagas na indústria</h2>
      <p style={{margin:"0 0 16px",fontSize:12,color:C.dim,lineHeight:1.6}}>
        Vagas abertas em empresas de petroquímica e petróleo & gás no Brasil, lidas dos portais de emprego das próprias empresas.
        É uma foto de alguns dias: confirme na página da empresa se a vaga continua aberta antes de se candidatar.
        Este portal não cobra nem pede seus dados.
      </p>
      {erro && <div style={{color:C.red,fontSize:13}}>Não foi possível carregar as vagas. {String(erro.message||erro)}</div>}
      {!erro && !pronto && <div style={{color:C.muted,fontSize:13}}>Carregando…</div>}
      {pronto && <aba-vagas api-base={API_BASE} style={cores}></aba-vagas>}
    </div>
  );
}
