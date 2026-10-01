// views/ViewCatalogoCursos.jsx — Catálogo de Cursos e Trilhas (tabelas cat_*, vitrine v19c).
// Fonte: pacote catalogo_v19c_release_completo (30/09/2026). 16.504 cursos, 64 trilhas, 6 blocos.
// Endpoints em /api/cat/* (ver worker_cat/README_WORKER_CAT.md do pacote) — ainda NÃO publicados
// no Worker `fato-portal-api` no momento em que esta view foi escrita (01/10/2026); por isso o
// estado "ainda não publicado" abaixo é tratado como caminho normal, não erro.
// Dado é outra base (curso individual), distinta das `sources` que ViewExplore.jsx mostra —
// por isso view própria em vez de misturar com o explorador de fontes existente.
import { useState, useEffect, useCallback } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { getJSON } from "../apiClient.js";

const PER_PAGE = 30;

function GratBadge({status}){
  if(status==="gratuito") return <span style={pill(C.greenDim,C.green,C.greenBorder)}>gratuito</span>;
  if(!status || status==="nao_informada" || status==="não_informada") return <span style={pill(C.surface,C.muted,C.border)}>não informado</span>;
  return <span style={pill(C.orangeDim,C.orangeLight,C.amberBorderA)}>{status.replace(/_/g," ")}</span>;
}

function CursoRow({c}){
  return (
    <div style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{c.nome}</div>
        <div style={{fontSize:11.5,color:C.muted,marginTop:2}}>{c.instituicao}{c.carga_horaria?` · ${c.carga_horaria}`:""}{c.modalidade?` · ${c.modalidade}`:""}</div>
        <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>
          <GratBadge status={c.gratuidade_status}/>
          {c.trilha_codigo && <span style={pill(C.blueDim,C.skyBlue,C.blueBorderA)}>{c.trilha_codigo}</span>}
          {c.fonte && <span style={pill("transparent",C.faint,C.border)}>{c.fonte}</span>}
        </div>
      </div>
      {c.url && !c.url_generica && (
        <a href={c.url} target="_blank" rel="noopener" style={{...btn("transparent",C.skyBlue,C.blueBorderA),fontSize:10,flexShrink:0}}>
          Acessar →
        </a>
      )}
      {c.url && c.url_generica && (
        <a href={c.url} target="_blank" rel="noopener" title="Link genérico do portal de origem — pode listar vários cursos"
           style={{...btn("transparent",C.muted,C.border),fontSize:10,flexShrink:0}}>
          Ver portal →
        </a>
      )}
    </div>
  );
}

export function ViewCatalogoCursos(){
  const [state,setState] = useState("carregando"); // carregando | pronto | nao_publicado | erro
  const [meta,setMeta] = useState(null);
  const [trilhas,setTrilhas] = useState([]);
  const [blocoSel,setBlocoSel] = useState(null);
  const [trilhaSel,setTrilhaSel] = useState("");
  const [q,setQ] = useState("");
  const [qDebounced,setQDebounced] = useState("");
  const [cursos,setCursos] = useState([]);
  const [after,setAfter] = useState(null);
  const [hasMore,setHasMore] = useState(false);
  const [carregandoMais,setCarregandoMais] = useState(false);

  useEffect(()=>{
    let vivo = true;
    Promise.all([getJSON("/api/cat/meta"), getJSON("/api/cat/trilhas")])
      .then(([m,t])=>{ if(!vivo) return; setMeta(m); setTrilhas(t); setState("pronto"); })
      .catch((err)=>{
        if(!vivo) return;
        // 404/erro de rede nesta fase inicial == endpoint ainda não publicado no Worker,
        // não é bug da view. Ver LEIA_PRIMEIRO.md do pacote catalogo_v19c.
        setState(String(err.message||"").includes("404") ? "nao_publicado" : "erro");
      });
    return ()=>{ vivo=false; };
  },[]);

  useEffect(()=>{
    const t = setTimeout(()=>setQDebounced(q.trim()),300);
    return ()=>clearTimeout(t);
  },[q]);

  const buscarPagina = useCallback((novoFiltro)=>{
    if(state!=="pronto") return;
    const sp = new URLSearchParams();
    if(blocoSel!=null) sp.set("bloco",blocoSel);
    if(trilhaSel) sp.set("trilha",trilhaSel);
    if(qDebounced.length>=3) sp.set("q",qDebounced);
    sp.set("per_page",PER_PAGE);
    if(!novoFiltro && after!=null) sp.set("after",after);
    setCarregandoMais(true);
    getJSON(`/api/cat/cursos?${sp.toString()}`)
      .then(d=>{
        setCursos(prev=> novoFiltro ? d.items : [...prev, ...d.items]);
        setAfter(d.next_after);
        setHasMore(!!d.has_more);
      })
      .catch(()=>{ setCursos([]); setHasMore(false); })
      .finally(()=>setCarregandoMais(false));
  },[state,blocoSel,trilhaSel,qDebounced,after]);

  // refiltra do zero quando bloco/trilha/busca mudam
  useEffect(()=>{ if(state==="pronto"){ setAfter(null); buscarPagina(true); } },[state,blocoSel,trilhaSel,qDebounced]); // eslint-disable-line

  if(state==="carregando"){
    return <div style={{padding:60,textAlign:"center",color:C.muted,fontSize:13}}>Carregando catálogo…</div>;
  }
  if(state==="nao_publicado"){
    return (
      <div style={{maxWidth:640,margin:"60px auto",padding:24,...card(C.amberBorderA),textAlign:"center"}}>
        <div style={{fontSize:14,fontWeight:600,color:C.amberLight,marginBottom:8}}>Catálogo de Cursos ainda não publicado</div>
        <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>
          Os endpoints <code>/api/cat/*</code> existem mas ainda não foram publicados no Worker.
          16.504 cursos e 64 trilhas prontos do lado do banco — falta a carga no D1 e o deploy
          do Worker (ver <code>LEIA_PRIMEIRO.md</code> do pacote <code>catalogo_v19c</code>).
        </div>
      </div>
    );
  }
  if(state==="erro"){
    return <div style={{padding:60,textAlign:"center",color:C.red,fontSize:13}}>Não foi possível carregar o catálogo agora. Tente recarregar a página.</div>;
  }

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 24px"}}>
      <div style={{marginBottom:18}}>
        <h1 style={{fontSize:20,color:C.heading,margin:0}}>Catálogo de Cursos</h1>
        <div style={{fontSize:12,color:C.muted,marginTop:4}}>
          {meta?.n_cursos?.toLocaleString("pt-BR")} cursos gratuitos catalogados, em {trilhas.length} trilhas · {meta?.gerado_em?`atualizado em ${meta.gerado_em}`:""}
        </div>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <button onClick={()=>setBlocoSel(null)}
          style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${blocoSel==null?C.blue:C.border}`,background:blocoSel==null?C.blueDim2:"transparent",color:blocoSel==null?C.skyBlue:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:blocoSel==null?700:400}}>
          Todos os blocos
        </button>
        {(meta?.blocos||[]).map(b=>(
          <button key={b.id} onClick={()=>setBlocoSel(b.id)}
            style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${blocoSel===b.id?C.blue:C.border}`,background:blocoSel===b.id?C.blueDim2:"transparent",color:blocoSel===b.id?C.skyBlue:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:blocoSel===b.id?700:400}}>
            {b.nome} ({b.n_cursos})
          </button>
        ))}
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Nome do curso ou instituição (mín. 3 letras)"
          style={{flex:"1 1 220px",padding:"7px 12px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        <select value={trilhaSel} onChange={e=>setTrilhaSel(e.target.value)} style={{...SEL}}>
          <option value="">Todas as trilhas</option>
          {trilhas.map(t=><option key={t.codigo} value={t.codigo}>{t.codigo} — {t.nome}</option>)}
        </select>
        <span style={{fontSize:11,color:C.faint,marginLeft:"auto"}}>{cursos.length} carregado{cursos.length===1?"":"s"}</span>
      </div>

      <div>
        {cursos.map(c=><CursoRow key={c.id} c={c}/>)}
        {!carregandoMais && cursos.length===0 && (
          <div style={{padding:40,textAlign:"center",color:C.faint,fontSize:12}}>Nenhum curso encontrado com esses filtros.</div>
        )}
      </div>

      {hasMore && (
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={()=>buscarPagina(false)} disabled={carregandoMais} style={btn(C.blueDim2,C.skyBlue,C.blueBorderA)}>
            {carregandoMais?"Carregando…":"Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}
