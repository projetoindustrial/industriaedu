// views/ViewCatalogoCursos.jsx — Catálogo de Cursos e Trilhas (tabelas cat_*, vitrine v19c).
// Fonte: pacote catalogo_v19c_release_completo (30/09/2026). 16.504 cursos, 64 trilhas, 6 blocos.
// Endpoints em /api/cat/* (meta, trilhas, cursos), publicados no Worker `fato-portal-api` em 02/10/2026.
// Dado é outra base (curso individual), distinta das `sources` que ViewExplore.jsx mostra —
// por isso view própria em vez de misturar com o explorador de fontes existente.
import { useState, useEffect, useCallback, useRef } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { getJSON } from "../apiClient.js";

const PER_PAGE = 30;

// Valores reais de gratuidade_status em cat_cursos (D1, v19c): ok 5.096 · ok_fonte_direta 2.364 ·
// publico_federal_sem_campo_direto 8.587 · gratuidade_nao_informada 457. Nenhum é literalmente "gratuito".
function GratBadge({status}){
  if(status==="ok") return <span style={pill(C.greenDim,C.green,C.greenBorder)}>gratuito</span>;
  if(status==="ok_fonte_direta") return <span title="Gratuidade confirmada na fonte direta" style={pill(C.greenDim,C.green,C.greenBorder)}>gratuito · fonte direta</span>;
  if(status==="publico_federal_sem_campo_direto") return <span title="Oferta de instituição pública federal; a fonte não traz um campo explícito de gratuidade" style={pill(C.blueDim,C.skyBlue,C.blueBorderA)}>rede pública federal</span>;
  return <span title="A fonte não informa se o curso é gratuito" style={pill("transparent",C.muted,C.border)}>gratuidade não informada</span>;
}

// modalidade vem com ~25 grafias (EAD, EaD, Educação a Distância, 100% online, HYBRID, PRESENTIAL...).
// Asset/Guide, Path, Workshop, Collection são tipo de material, não modalidade — não exibidos.
export function modalidadeCurta(m){
  if(!m) return null;
  const s = String(m).toLowerCase();
  if(s.includes("semi") || s.includes("hybrid") || s.includes("encontros") || s.includes("prática presencial")) return "Híbrido";
  if(s.includes("mooc")) return "MOOC";
  if(s.includes("ead") || s.includes("dist") || s.includes("online")) return "EaD";
  if(s.includes("presencial") || s.startsWith("presenti")) return "Presencial";
  return null;
}

function CursoRow({c}){
  const onde = c.instituicao || c.fonte;
  const carga = c.carga_horaria && !/^n[ãa]o informada$/i.test(c.carga_horaria) ? c.carga_horaria : null;
  const modal = modalidadeCurta(c.modalidade);
  return (
    <div style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{c.nome}</div>
        <div style={{fontSize:11.5,color:C.muted,marginTop:2}}>{[onde,carga,modal].filter(Boolean).join(" · ")}</div>
        <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>
          <GratBadge status={c.gratuidade_status}/>
          {c.trilha_codigo && <span style={pill(C.blueDim,C.skyBlue,C.blueBorderA)}>{c.trilha_codigo}</span>}
          {c.papel==="referencia" && <span title="Material de referência, fora do caminho principal da trilha" style={pill("transparent",C.faint,C.border)}>referência</span>}
          {c.papel==="alternativa_idioma" && <span style={pill("transparent",C.faint,C.border)}>outro idioma</span>}
          {c.instituicao && c.fonte && c.fonte!==c.instituicao && <span style={pill("transparent",C.faint,C.border)}>{c.fonte}</span>}
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
  const [state,setState] = useState("carregando"); // carregando | pronto | erro
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
  const [erroLista,setErroLista] = useState(false);
  const [tentativa,setTentativa] = useState(0);
  const reqId = useRef(0); // só a resposta da requisição mais recente pode alterar a lista

  useEffect(()=>{
    let vivo = true;
    setState("carregando");
    Promise.all([getJSON("/api/cat/meta"), getJSON("/api/cat/trilhas")])
      .then(([m,t])=>{ if(!vivo) return; setMeta(m); setTrilhas(t); setState("pronto"); })
      .catch(()=>{ if(vivo) setState("erro"); });
    return ()=>{ vivo=false; };
  },[tentativa]);

  useEffect(()=>{
    const t = setTimeout(()=>setQDebounced(q.trim()),700); // busca LIKE lê a tabela toda no D1 (~10-16 mil linhas): menos consultas por digitação
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
    const meuId = ++reqId.current;
    setCarregandoMais(true);
    setErroLista(false);
    getJSON(`/api/cat/cursos?${sp.toString()}`)
      .then(d=>{
        if(meuId!==reqId.current) return; // resposta de um filtro antigo: descarta
        setCursos(prev=> novoFiltro ? d.items : [...prev, ...d.items]);
        setAfter(d.next_after);
        setHasMore(!!d.has_more);
      })
      .catch(()=>{
        if(meuId!==reqId.current) return;
        if(novoFiltro){ setCursos([]); setHasMore(false); }
        setErroLista(true);
      })
      .finally(()=>{ if(meuId===reqId.current) setCarregandoMais(false); });
  },[state,blocoSel,trilhaSel,qDebounced,after]);

  // refiltra do zero quando bloco/trilha/busca mudam
  useEffect(()=>{ if(state==="pronto"){ setAfter(null); buscarPagina(true); } },[state,blocoSel,trilhaSel,qDebounced]); // eslint-disable-line

  if(state==="carregando"){
    return <div style={{padding:60,textAlign:"center",color:C.muted,fontSize:13}}>Carregando catálogo…</div>;
  }
  if(state==="erro"){
    return (
      <div style={{padding:60,textAlign:"center",color:C.red,fontSize:13}}>
        <div>Não foi possível carregar o catálogo agora.</div>
        <button onClick={()=>setTentativa(n=>n+1)} style={{...btn(C.blueDim2,C.skyBlue,C.blueBorderA),marginTop:14}}>Tentar de novo</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 24px"}}>
      <div style={{marginBottom:18}}>
        <h1 style={{fontSize:20,color:C.heading,margin:0}}>Catálogo de Cursos</h1>
        <div style={{fontSize:12,color:C.muted,marginTop:4}}>
          {meta?.n_cursos?.toLocaleString("pt-BR")} cursos catalogados, em {trilhas.length} trilhas · {meta?.gerado_em?`atualizado em ${meta.gerado_em}`:""}
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

      {blocoSel!=null && (meta?.blocos||[]).find(x=>x.id===blocoSel)?.descricao && (
        <div style={{fontSize:11.5,color:C.muted,lineHeight:1.55,marginBottom:14,padding:"8px 12px",borderLeft:`2px solid ${C.border}`}}>
          {(meta.blocos||[]).find(x=>x.id===blocoSel).descricao}
        </div>
      )}

      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Nome do curso ou instituição (mín. 3 letras)"
          style={{flex:"1 1 220px",padding:"7px 12px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        <select value={trilhaSel} onChange={e=>setTrilhaSel(e.target.value)} style={{...SEL,flex:"1 1 220px",minWidth:0,maxWidth:"100%"}}>
          <option value="">Todas as trilhas</option>
          {trilhas.map(t=><option key={t.codigo} value={t.codigo}>{t.codigo} — {t.nome}</option>)}
        </select>
        <span style={{fontSize:11,color:C.faint,marginLeft:"auto"}}>{cursos.length} carregado{cursos.length===1?"":"s"}</span>
      </div>

      <div>
        {cursos.map(c=><CursoRow key={c.id} c={c}/>)}
        {!carregandoMais && erroLista && (
          <div style={{padding:30,textAlign:"center",color:C.red,fontSize:12}}>
            Não foi possível carregar os cursos agora.{" "}
            <button onClick={()=>buscarPagina(cursos.length===0)} style={{...btn("transparent",C.skyBlue,C.blueBorderA),fontSize:11}}>Tentar de novo</button>
          </div>
        )}
        {!carregandoMais && !erroLista && cursos.length===0 && (
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
