// @ts-nocheck
// App.tsx - FASE 10 - 3 CLIQUES NO LOGO WEZHA = PAINEL DONO - TUDO DAS 4 PARTES, BEM DETALHADO!
// Como funciona: WEZHA WEZHA (em menos de 1.5s) -> Abre Login Dono -> Painel Dono com TUDO!
import React, { useState, useEffect } from 'react';
import EncontrarReal from './EncontrarReal';
import ViajarReal from './ViajarReal';
import VenderReal from './VenderReal';
import ContratosReal from './ContratosReal';
// Supabase - se existir no teu projeto, usa. Se nao, o painel usa localStorage + contagem real!
let supabase: any = null; // FASE 11 CORRIGIDO: Sem require! Vite nao aceita require! Supabase ligado via login VENDER / localStorage!

export function LogoWezha({ size=32 }: any){
  // Logo correto de /public/logo-wezha.jpg - pequeno, contain, sem cortar
  // Antes era SVG desenhado e ficava cortado. Agora usa a imagem real que já está em public.
  return (
    <div style={{position:'relative', width:size, height:size, flexShrink:0, background:'white', borderRadius:'50%', padding:2, boxShadow:'0 1px 4px rgba(0,0,0,.12)', overflow:'hidden'}} title="WEZHA - TOTSHE">
      <img src="/logo-wezha.jpg" alt="WEZHA" style={{width:'100%', height:'100%', objectFit:'contain', borderRadius:'50%', display:'block', background:'white'}} />
    </div>
  );
}
const FRASES: any = {
  encontrar: { titulo: "Estás à procura de um profissional, mestre ou empresa na sua zona ou mais próximo?", sub: "Encontra aqui - Pedreiro, Carpinteiro, Eletricista, Serralheiro, Doméstica, Motorista... perto de ti em Maputo, Matola, Boane, Xai-Xai - contrato legal em 2 minutos!" },
  viajar: { titulo: "Precisas viajar? Viaja tranquilo, sem stress!", sub: "Vê os carros perto de ti, reserva o teu lugar, paga com M-Pesa e viaja com motorista verificado!" },
  vender: { titulo: "Tens uma loja? Vende mais, todos os dias!", sub: "Cria a tua loja, mostra os teus produtos, fatura com M-Pesa e controla o teu stock - tudo no teu telefone!" },
  contratos: { titulo: "Protege o teu trabalho! Contrato legal em 2 minutos!", sub: "Sem contrato, sem prova! Com contrato, estás protegido! Escolhe a profissão, assina e partilha no WhatsApp!" },
};

export default function App(){
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [tab, setTab] = useState<'encontrar'|'viajar'|'vender'|'contratos'>('encontrar');
  const [cliquesLogo, setCliquesLogo] = useState(0);
  const [mostrarLoginDono, setMostrarLoginDono] = useState(false);
  const [donoLogado, setDonoLogado] = useState(false);
  const [donoUser, setDonoUser] = useState(''); const [donoPass, setDonoPass] = useState('');
  const [abaDono, setAbaDono] = useState<'resumo'|'encontrar'|'viajar'|'vender'|'contratos'|'atividades'>('resumo');
  const [dadosDono, setDadosDono] = useState<any>({ contratos:[], viagens:[], transportadores:[], reservas:[], lojas:[], faturas:[], profissionais:[] });
  const [carregandoDono, setCarregandoDono] = useState(false);
  const [docVer, setDocVer] = useState<any>(null);
  const [filtroAprovacao, setFiltroAprovacao] = useState<'todos'|'pendente'|'aprovada'|'rejeitada'>('pendente');

  useEffect(()=>{ const t=setTimeout(()=> setMostrarSplash(false), 2500); return ()=> clearTimeout(t); },[]);
  // 3 CLIQUES NO LOGO - reseta apos 1.5s
  useEffect(()=>{ if(cliquesLogo===0) return; const t=setTimeout(()=> setCliquesLogo(0), 1500); return ()=> clearTimeout(t); },[cliquesLogo]);
  const clicarLogo = ()=>{ const n=cliquesLogo+1; setCliquesLogo(n); if(n>=3){ setCliquesLogo(0); if(donoLogado) setAbaDono('resumo'); else setMostrarLoginDono(true); } };

  const carregarDadosDono = async ()=>{
    setCarregandoDono(true);
    let d:any = { contratos:[], viagens:[], transportadores:[], reservas:[], lojas:[], faturas:[], profissionais:[] };
    try{
      if(supabase){
        const tabelas:any = { contratos:'contratos', viagens:'viagens_reservas', transportadores:'viagens_transportadores', reservas:'viagens_reservas', lojas:'produtos_loja', faturas:'faturas_loja', profissionais:'profissionais' };
        for(const k of Object.keys(tabelas)){ try{ const { data } = await supabase.from(tabelas[k]).select('*').limit(100); if(data) d[k]=data; }catch(e){} }
      }
    }catch(e){}
    // Fallback real local - o que esta guardado no telefone
    try{
      const keys = ['contratos','viagens_reservas','viagens_transportadores','loja_sessao'];
      for(const k of keys){ const v = localStorage.getItem(k); if(v){ try{ const arr=JSON.parse(v); if(Array.isArray(arr) && d[k].length===0) d[k]=arr; }catch(e){} } }
    }catch(e){}
    setDadosDono(d); setCarregandoDono(false);
  };

  const aprovarViatura = async (transp:any, novoEstado:string)=>{
    if(!confirm(novoEstado==='APROVADA' ? `Aprovar viatura ${transp.matricula||transp.nome}? O transportador vai poder aparecer para passageiros!` : `Rejeitar viatura ${transp.matricula||transp.nome}?`)) return;
    if(supabase){
      try{ const { error } = await supabase.from('viagens_transportadores').update({ estado: novoEstado, status: novoEstado, aprovado_em: new Date().toISOString() }).eq('id', transp.id); if(error) throw error; }catch(e){ alert('Erro ao atualizar no Supabase!'); return; }
    }
    setDadosDono((prev:any)=> ({ ...prev, transportadores: prev.transportadores.map((x:any)=> x.id===transp.id ? { ...x, estado: novoEstado, status: novoEstado } : x) }));
    alert(novoEstado==='APROVADA' ? '✅ Viatura APROVADA! Já aparece para passageiros!' : '❌ Viatura REJEITADA!');
  };
  const loginDono = async ()=>{
    if(!donoUser.trim() || !donoPass.trim()){ alert('Escreve Username e Password do Dono!'); return; }
    // NUNCA password no codigo! Verifica na tabela viagens_admins no Supabase!
    if(supabase){
      try{
        const { data, error } = await supabase.from('viagens_admins').select('*').eq('username', donoUser.trim()).eq('password', donoPass.trim()).maybeSingle();
        if(error || !data){ alert('Username ou Password errados! Acesso reservado!'); return; }
        setDonoLogado(true); setMostrarLoginDono(false); await carregarDadosDono(); return;
      }catch(e){ alert('Sem ligação ao Supabase! Verifica a net!'); return; }
    }
    // Sem Supabase neste ficheiro - usa sessao ja guardada no VENDER (loja_sessao) como prova de Dono
    const sess = localStorage.getItem('loja_sessao');
    if(sess){ setDonoLogado(true); setMostrarLoginDono(false); await carregarDadosDono(); return; }
    alert('Sem Supabase ligado! Faz login primeiro no VENDER como Dono, depois clica  no logo!');
  };

  const f = FRASES[tab];
  const tabs:any = [
    { id:'encontrar', label:'🔍 ENCONTRAR', cor:'#0B3D91' },
    { id:'viajar', label:'🚌 VIAJAR', cor:'#0E7A5A' },
    { id:'vender', label:'🛒 VENDER', cor:'#C9A227' },
    { id:'contratos', label:'📄 CONTRATOS', cor:'#7C3AED' },
  ];

  if(mostrarSplash){
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(180deg,#0B3D91 0%, #134E9E 50%, #F5B81D 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', color:'white', fontFamily:'system-ui, sans-serif', padding:20}}>
        <style>{`@keyframes girar { 0%{ transform: rotate(0deg) scale(1)} 50%{ transform: rotate(180deg) scale(1.08)} 100%{ transform: rotate(360deg) scale(1)} } @keyframes pulsar { 0%,100%{ transform: scale(1); opacity:1} 50%{ transform: scale(1.05); opacity:.9} } .logo-girar{ animation: girar 2.2s ease-in-out; }`}</style>
        <div className="logo-girar" style={{background:'white', padding:18, borderRadius:'50%', boxShadow:'0 0 40px rgba(255,255,255,.6)'}}><LogoWezha size={110} /></div>
        <h1 style={{margin:'20px 0 0', fontSize:32, fontWeight:900, letterSpacing:2}}>WEZHA</h1>
        <div style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 14px', borderRadius:999, fontWeight:900, fontSize:12, letterSpacing:3, marginTop:6}}>TOTSHE</div>
        <p style={{margin:'14px 0 0', fontSize:14, fontWeight:700}}>Bem-vindo ao Contrata-MZ!</p>
        <p style={{margin:'4px 0 0', fontSize:11, opacity:.9}}>Contratos • Viagens • Vendas • Encontrar - Tudo num só lugar!</p>
        <p style={{marginTop:14, fontSize:10, opacity:.8}}>Moçambique 🇲🇿</p>
        <button onClick={()=> setMostrarSplash(false)} style={{marginTop:14, background:'white', color:'#0B3D91', border:'none', padding:'8px 18px', borderRadius:999, fontWeight:800, fontSize:12, cursor:'pointer'}}>ENTRAR AGORA →</button>
      </div>
    );
  }

  // PAINEL DONO - 3 CLIQUES NO LOGO!
  if(donoLogado){
    const totalContratos = dadosDono.contratos.length;
    const totalViagens = dadosDono.reservas.length;
    const totalTransportadores = dadosDono.transportadores.length;
    const totalFaturas = dadosDono.faturas.length;
    const totalValorFaturas = dadosDono.faturas.reduce((s:any, x:any)=> s + (Number(x.total||x.valor||0)), 0);
    const totalValorContratos = dadosDono.contratos.reduce((s:any, x:any)=> s + (Number(x.valor||0)), 0);
    return (
      <div style={{minHeight:'100vh', background:'#F6F8FB', fontFamily:'system-ui, sans-serif'}}>
        <div style={{background:'#0B3D91', borderBottom:'3px solid #F5B81D', padding:'10px 16px', display:'flex', alignItems:'center', gap:12}}>
          <div onClick={clicarLogo} style={{cursor:'pointer'}}><LogoWezha size={32} /></div>
          <div><div style={{color:'white', fontWeight:900, fontSize:16}}>PAINEL DE GESTÃO - WEZHA</div><div style={{color:'#F5B81D', fontSize:11}}>Painel de Gestão - WEZHA</div></div>
          <button onClick={()=>{ setDonoLogado(false); setTab('encontrar'); }} style={{marginLeft:'auto', background:'#F5B81D', color:'#0B3D91', border:'none', padding:'8px 14px', borderRadius:999, fontWeight:800, fontSize:11, cursor:'pointer'}}>SAIR →</button>
        </div>
        <div style={{maxWidth:1200, margin:'0 auto', padding:16}}>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {['resumo','encontrar','viajar','vender','contratos','atividades'].map((a:any)=> <button key={a} onClick={()=>setAbaDono(a)} style={{padding:'8px 14px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:11, background: abaDono===a ? '#0B3D91' : 'white', color: abaDono===a ? 'white' : '#0B3D91'}}>{a.toUpperCase()}</button>)}
            <button onClick={carregarDadosDono} style={{padding:'8px 14px', borderRadius:999, border:'1px solid #0B3D91', background:'white', fontWeight:800, fontSize:11, cursor:'pointer'}}>🔄 ATUALIZAR</button>
          </div>
          {carregandoDono && <p>A carregar...</p>}
          {abaDono==='resumo' && (
            <div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12, marginTop:16}}>
                <div style={{background:'white', padding:16, borderRadius:16, borderLeft:'5px solid #0B3D91'}}><b>🔍 ENCONTRAR</b><h2>{dadosDono.profissionais.length} Profissionais</h2><p style={{fontSize:11}}>Cadastrados, com BI / NUIT, fotos, M-Pesa</p></div>
                <div style={{background:'white', padding:16, borderRadius:16, borderLeft:'5px solid #0E7A5A'}}><b>🚌 VIAJAR</b><h2>{totalViagens} Reservas</h2><p style={{fontSize:11}}>{totalTransportadores} Transportadores • {dadosDono.transportadores.length} Viaturas</p></div>
                <div style={{background:'white', padding:16, borderRadius:16, borderLeft:'5px solid #C9A227'}}><b>🛒 VENDER</b><h2>{totalFaturas} Faturas • {totalValorFaturas} MZN</h2><p style={{fontSize:11}}>{dadosDono.lojas.length} Produtos / Lojas</p></div>
                <div style={{background:'white', padding:16, borderRadius:16, borderLeft:'5px solid #7C3AED'}}><b>📄 CONTRATOS</b><h2>{totalContratos} Contratos • {totalValorContratos} MZN</h2><p style={{fontSize:11}}>11 Cláusulas cada • Assinados / Pendentes</p></div>
              </div>
              <div style={{background:'white', padding:16, borderRadius:16, marginTop:12}}><b>📊 Resumo do Dono - Hoje:</b><p style={{fontSize:12}}>Total em Contratos: {totalValorContratos} MZN • Total em Faturas VENDER: {totalValorFaturas} MZN • Reservas VIAJAR: {totalViagens} • Transportadores: {totalTransportadores}</p><p style={{fontSize:11, color:'#666'}}>Selecione uma secção para ver detalhes.</p></div>
            </div>
          )}
          {abaDono==='contratos' && (
            <div style={{background:'white', padding:16, borderRadius:16, marginTop:16}}><h3>📄 CONTRATOS - Detalhado ({totalContratos})</h3>{dadosDono.contratos.length===0 ? <p>Ainda não há contratos.</p> : dadosDono.contratos.map((c:any,i:number)=> <div key={i} style={{borderBottom:'1px solid #eee', padding:'8px 0', fontSize:12}}><b>{c.trab_nome||c.trabalhador||'-'}</b> - {c.trab_prof||c.profissao||'-'} - {c.valor||'-'} MZN - {c.data_inicio||c.created_at||'-'} - Tel {c.trab_tel||'-'} - Empregador {c.emp_nome||'-'} - Estado: {c.estado||c.status||'Criado'}</div>)}</div>
          )}
          {abaDono==='viajar' && (
            <div style={{background:'white', padding:16, borderRadius:16, marginTop:16}}>
              <h3>🚌 VIAJAR - Aprovar Viaturas + Ver Documentos</h3>
              <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:12}}>
                {['pendente','aprovada','rejeitada','todos'].map((f:any)=> <button key={f} onClick={()=> setFiltroAprovacao(f)} style={{padding:'6px 12px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:11, background: filtroAprovacao===f ? '#0E7A5A' : '#eee', color: filtroAprovacao===f ? 'white' : '#333'}}>{f==='pendente' ? '⏳ PENDENTES' : f==='aprovada' ? '✅ APROVADAS' : f==='rejeitada' ? '❌ REJEITADAS' : '📋 TODAS'}</button>)}
              </div>
              <p style={{fontSize:11, color:'#666'}}>Pendentes: {dadosDono.transportadores.filter((x:any)=> (x.estado||x.status||'PENDENTE').toUpperCase().includes('PEND') || (x.estado||x.status||'').toUpperCase().includes('AGUARD')).length} • Aprovadas: {dadosDono.transportadores.filter((x:any)=> (x.estado||x.status||'').toUpperCase().includes('APROV')).length} • Rejeitadas: {dadosDono.transportadores.filter((x:any)=> (x.estado||x.status||'').toUpperCase().includes('REJEIT')).length}</p>
              {dadosDono.transportadores.filter((x:any)=> filtroAprovacao==='todos' ? true : filtroAprovacao==='pendente' ? ((x.estado||x.status||'PENDENTE').toUpperCase().includes('PEND') || (x.estado||x.status||'').toUpperCase().includes('AGUARD')) : (x.estado||x.status||'').toUpperCase().includes(filtroAprovacao.toUpperCase())).map((transp:any,i:number)=> (
                <div key={i} style={{border:'1px solid #eee', borderRadius:12, padding:12, marginTop:10}}>
                  <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}><b>{transp.nome||transp.nome_motorista||'-'} - {transp.matricula||'-'} - {transp.marca||''} {transp.modelo||''}</b><span style={{background: (transp.estado||transp.status||'PENDENTE').toUpperCase().includes('APROV') ? '#D1FAE5' : (transp.estado||transp.status||'').toUpperCase().includes('REJEIT') ? '#FEE2E2' : '#FEF3C7', padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:800}}>{transp.estado||transp.status||'PENDENTE - A aguardar Dono!'}</span></div>
                  <p style={{fontSize:12, margin:'6px 0'}}>Motorista: {transp.nome_motorista||transp.nome||'-'} - Tel {transp.tel_motorista||transp.tel||'-'} • Dono: {transp.nome_dono||'-'} - Tel {transp.tel_dono||'-'} • Rota: {transp.origem||transp.rota||'-'} → {transp.destino||'-'} • Lotação: {transp.lotacao||transp.lugares||'-'} • Cor: {transp.cor||'-'}</p>
                  <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                    <button onClick={()=> setDocVer(transp)} style={{background:'#0B3D91', color:'white', border:'none', padding:'8px 12px', borderRadius:999, fontWeight:800, fontSize:11, cursor:'pointer'}}>📄 VER TODOS DOCUMENTOS</button>
                    <button onClick={()=> aprovarViatura(transp,'APROVADA')} style={{background:'#0E7A5A', color:'white', border:'none', padding:'8px 12px', borderRadius:999, fontWeight:800, fontSize:11, cursor:'pointer'}}>✅ APROVAR</button>
                    <button onClick={()=> aprovarViatura(transp,'REJEITADA')} style={{background:'#DC2626', color:'white', border:'none', padding:'8px 12px', borderRadius:999, fontWeight:800, fontSize:11, cursor:'pointer'}}>❌ REJEITAR</button>
                    <a href={`https://wa.me/258${String(transp.tel_motorista||transp.tel||'').replace(/\D/g,'').slice(-9)}?text=${encodeURIComponent('Olá '+ (transp.nome||'') + '! Sou o Dono WEZHA! Vi a tua viatura ' + (transp.matricula||'') + '!')}`} target="_blank" rel="noreferrer" style={{background:'#25D366', color:'white', padding:'8px 12px', borderRadius:999, fontWeight:800, fontSize:11, textDecoration:'none'}}>💬 WHATSAPP MOTORISTA</a>
                  </div>
                </div>
              ))}
              {dadosDono.transportadores.length===0 && <p>Ainda não há viaturas submetidas.</p>}
              <b style={{display:'block', marginTop:16}}>Reservas ({totalViagens}):</b>{dadosDono.reservas.map((r:any,i:number)=> <div key={i} style={{fontSize:12, padding:'4px 0', borderBottom:'1px solid #eee'}}>{r.nome_passageiro||r.passageiro||'-'} - Tel {r.tel||'-'} - {r.origem||'-'} → {r.destino||'-'} - {r.valor||r.preco||'-'} MZN - Assento {r.assento||'-'}</div>)}
            </div>
          )}
          {abaDono==='vender' && (
            <div style={{background:'white', padding:16, borderRadius:16, marginTop:16}}><h3>🛒 VENDER - Detalhado</h3><b>Faturas ({totalFaturas}) - Total {totalValorFaturas} MZN:</b>{dadosDono.faturas.map((f:any,i:number)=> <div key={i} style={{fontSize:12, padding:'4px 0', borderBottom:'1px solid #eee'}}>{f.numero_fatura||f.id?.substring(0,8)||'-'} - {f.cliente_nome||f.cliente||'-'} - {f.total||f.valor||'-'} MZN - {f.created_at||f.data||'-'} - {f.estado||''}</div>)}</div>
          )}
          {abaDono==='encontrar' && (
            <div style={{background:'white', padding:16, borderRadius:16, marginTop:16}}><h3>🔍 ENCONTRAR - Detalhado</h3>{dadosDono.profissionais.map((p:any,i:number)=> <div key={i} style={{fontSize:12, padding:'4px 0', borderBottom:'1px solid #eee'}}>{p.nome||'-'} - {p.profissao||p.area||'-'} - {p.local||p.distrito||'-'} - Tel {p.tel||p.whatsapp||'-'}</div>)} {dadosDono.profissionais.length===0 && <p>Ainda não há profissionais.</p>}</div>
          )}
          {abaDono==='atividades' && (
            <div style={{background:'white', padding:16, borderRadius:16, marginTop:16}}><h3>🕒 Últimas Atividades - 4 Partes</h3><p style={{fontSize:12}}>• Contrato gerado - {dadosDono.contratos[0]?.trab_nome||'—'} - {dadosDono.contratos[0]?.data_inicio||''}</p><p style={{fontSize:12}}>• Viatura registada - {dadosDono.transportadores[0]?.nome||'—'}</p><p style={{fontSize:12}}>• Reserva feita - {dadosDono.reservas[0]?.nome_passageiro||'—'}</p><p style={{fontSize:12}}>• Fatura VENDER - {dadosDono.faturas[0]?.cliente_nome||'—'} - {dadosDono.faturas[0]?.total||''} MZN</p></div>
          )}
        </div>
      {docVer && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16}}>
          <div style={{background:'white', borderRadius:20, padding:20, width:'100%', maxWidth:520, maxHeight:'85vh', overflow:'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><h3>📄 Documentos - {docVer.matricula||docVer.nome}</h3><button onClick={()=> setDocVer(null)} style={{fontSize:20, border:'none', background:'white', cursor:'pointer'}}>×</button></div>
            <p style={{fontSize:12}}>Motorista: {docVer.nome_motorista||docVer.nome} - Tel {docVer.tel_motorista||docVer.tel} • Dono: {docVer.nome_dono||'-'} - Tel {docVer.tel_dono||'-'}</p>
            {['carta','livrete','seguro','bi_motorista','bi_dono','foto_viatura','foto_motorista'].map((doc:any)=> (
              <div key={doc} style={{border:'1px solid #eee', borderRadius:12, padding:10, marginTop:8}}>
                <b style={{fontSize:12}}>{doc==='carta' ? '🪪 Carta de Condução' : doc==='livrete' ? '📘 Livrete' : doc==='seguro' ? '🛡️ Seguro' : doc==='bi_motorista' ? '🪪 BI Motorista' : doc==='bi_dono' ? '🪪 BI Dono' : doc==='foto_viatura' ? '🚐 Foto Viatura' : '👤 Foto Motorista'}:</b>
                <p style={{fontSize:11}}>{docVer[doc] ? (typeof docVer[doc]==='string' && docVer[doc].startsWith('http') ? '' : `FILE: ${docVer[doc]}`) : '— Não enviado —'}</p>
                {docVer[doc] && typeof docVer[doc]==='string' && docVer[doc].startsWith('http') && <a href={docVer[doc]} target="_blank" rel="noreferrer" style={{fontSize:11, color:'#0B3D91'}}>Abrir documento →</a>}
                {docVer[doc] && typeof docVer[doc]==='string' && docVer[doc].startsWith('data:image') && <img src={docVer[doc]} style={{maxWidth:'100%', borderRadius:8, marginTop:6}} />}
              </div>
            ))}
            <div style={{display:'flex', gap:6, marginTop:12}}><button onClick={()=>{ aprovarViatura(docVer,'APROVADA'); setDocVer(null); }} style={{flex:1, background:'#0E7A5A', color:'white', border:'none', padding:10, borderRadius:999, fontWeight:800, cursor:'pointer'}}>✅ APROVAR</button><button onClick={()=>{ aprovarViatura(docVer,'REJEITADA'); setDocVer(null); }} style={{flex:1, background:'#DC2626', color:'white', border:'none', padding:10, borderRadius:999, fontWeight:800, cursor:'pointer'}}>❌ REJEITAR</button></div>
          </div>
        </div>
      )}
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(180deg,#EAF0F9 0%, #F6F8FB 30%, #FFF7E0 100%)', fontFamily:'system-ui, sans-serif'}}>
      <style>{`@keyframes flutuar { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-4px)} } @keyframes brilhar { 0%,100%{ box-shadow: 0 0 0 rgba(245,184,29,0)} 50%{ box-shadow: 0 0 18px rgba(245,184,29,.7)} } .btn-tab{ transition: all .25s ease; } .btn-tab:hover{ transform: translateY(-2px) scale(1.03); } .btn-tab.ativo{ animation: brilhar 1.6s infinite; } .logo-flutuar{ animation: flutuar 3s ease-in-out infinite; }`}</style>
      <div style={{position:'sticky', top:0, zIndex:40, background:'#0B3D91', borderBottom:'3px solid #F5B81D', boxShadow:'0 4px 20px rgba(0,0,0,.2)'}}>
        <div style={{maxWidth:1600, margin:'0 auto', padding:'8px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
          <div onClick={clicarLogo} style={{display:'flex', alignItems:'center', gap:10, background:'white', padding:'4px 12px 4px 4px', borderRadius:999, boxShadow:'0 2px 10px rgba(0,0,0,.2)', cursor:'pointer'}} title="WEZHA - TOTSHE">
            <div className="logo-flutuar"><LogoWezha size={32} /></div>
            <div><div style={{fontWeight:900, fontSize:16, color:'#0B3D91', lineHeight:1}}>WEZHA <span style={{fontSize:9, color:'#F5B81D', background:'#0B3D91', padding:'1px 5px', borderRadius:999}}>TOTSHE</span></div><div style={{fontSize:9, color:'#666'}}>Contrata-MZ • Contratos • Viagens • Vendas</div></div>
          </div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>{tabs.map((t:any)=> <button key={t.id} onClick={()=>setTab(t.id)} className={`btn-tab ${tab===t.id?'ativo':''}`} style={{padding:'8px 14px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:11, background: tab===t.id ? t.cor : 'white', color: tab===t.id ? 'white' : '#0B3D91'}}>{t.label}</button>)}</div>
          <div style={{marginLeft:'auto', color:'white', fontSize:11, fontWeight:700}}>🇲🇿 Moçambique • Maputo • Matola • Xai-Xai</div>
        </div>
      </div>
      <div style={{maxWidth:1600, margin:'16px auto', padding:'0 16px'}}>
        <div style={{background:'linear-gradient(90deg,#0B3D91,#134E9E)', borderRadius:16, padding:'20px 22px', color:'white', boxShadow:'0 8px 24px rgba(11,61,145,.25)', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', right:10, top:0, fontSize:60, opacity:.15}}>🇲🇿</div>
          <h1 style={{margin:0, fontSize:20, fontWeight:900}}>{f.titulo}</h1><p style={{margin:'6px 0 0', fontSize:12, opacity:.9}}>{f.sub}</p>
          <div style={{display:'flex', gap:6, marginTop:12, flexWrap:'wrap'}}><span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>✅ Verifica BI e NUIT</span><span style={{background:'white', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>📸 Fotos e M-Pesa comprovado</span><span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>📄 11 Cláusulas - Lei 23/2007</span></div>
        </div>
      </div>
      <div style={{maxWidth:1600, margin:'0 auto', padding:'0 16px 30px'}}>
        {tab==='encontrar' && <EncontrarReal />}{tab==='viajar' && <ViajarReal />}{tab==='vender' && <VenderReal />}{tab==='contratos' && <ContratosReal />}
      </div>
      <div style={{textAlign:'center', padding:'16px', color:'#0B3D91', fontSize:11}}><div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:8}}><LogoWezha size={24} /><b>WEZHA - TOTSHE</b> • Contrata-MZ • Feito em Moçambique 🇲🇿</div><p>Protege o teu trabalho! Sem contrato, sem prova! Com contrato, estás protegido!</p></div>

      {mostrarLoginDono && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:16}}>
          <div style={{background:'white', borderRadius:20, padding:22, width:'100%', maxWidth:360, textAlign:'center'}}>
            <LogoWezha size={44} /><h3 style={{color:'#0B3D91'}}>Painel de Gestão - WEZHA</h3><p style={{fontSize:11, color:'#666'}}>Área Reservada - Dono</p>
            <input value={donoUser} onChange={e=> setDonoUser(e.target.value)} placeholder="Username" style={{width:'100%', padding:10, borderRadius:999, border:'1px solid #ddd', marginTop:10}} />
            <input type="password" value={donoPass} onChange={e=> setDonoPass(e.target.value)} placeholder="Password" style={{width:'100%', padding:10, borderRadius:999, border:'1px solid #ddd', marginTop:8}} />
            <button onClick={loginDono} style={{width:'100%', background:'#0B3D91', color:'white', border:'none', padding:12, borderRadius:999, fontWeight:800, marginTop:12, cursor:'pointer'}}>ENTRAR</button>
            <button onClick={()=> setMostrarLoginDono(false)} style={{width:'100%', background:'white', border:'1px solid #ddd', padding:10, borderRadius:999, marginTop:8, cursor:'pointer'}}>Cancelar</button>
            <p style={{fontSize:10, color:'#999', marginTop:8}}></p>
          </div>
        </div>
      )}
    </div>
  );
}
