// @ts-nocheck
// App.tsx - WEZHA TOTSHE - Design para as 4 PARTES!
// Logo: WEZHA (circulo azul + amarelo) + TOTSHE no canto inferior direito
// Cores: Azul WEZHA #0B3D91 / #134E9E + Dourado #F5B81D + Fundo claro #F6F8FB
// Frases convidativas + Animacoes leves + Fundos bonitos - IGUAL nas 4 partes!
import React, { useState } from 'react';
import EncontrarReal from './EncontrarReal';
import ViajarReal from './ViajarReal';
import VenderReal from './VenderReal';
import ContratosReal from './ContratosReal';

// LOGO WEZHA - SVG igual ao logo que mandaste - azul + amarelo + WEZHA + TOTSHE canto inferior direito
export function LogoWezha({ size=36 }: any){
  return (
    <div style={{position:'relative', width:size, height:size, flexShrink:0}} title="WEZHA - TOTSHE">
      <svg viewBox="0 0 100 100" style={{width:'100%',height:'100%'}}>
        <path d="M 92 8 A 48 48 0 1 0 92 92 A 58 58 0 0 1 92 8" fill="#0B3D91" />
        <path d="M 38 22 A 44 44 0 1 1 38 82 A 50 50 0 0 0 38 22" fill="#F5B81D" />
        <circle cx="50" cy="50" r="32" fill="white" />
        <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0B3D91" fontFamily="Georgia, serif">WEZHA</text>
      </svg>
      <span style={{position:'absolute', right:-2, bottom:-4, fontSize:7, fontWeight:800, color:'#0B3D91', background:'white', padding:'0 2px', borderRadius:4, letterSpacing:1}}>TOTSHE</span>
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
  const [tab, setTab] = useState<'encontrar'|'viajar'|'vender'|'contratos'>('encontrar');
  const f = FRASES[tab];
  const tabs:any = [
    { id:'encontrar', label:'🔍 ENCONTRAR', cor:'#0B3D91' },
    { id:'viajar', label:'🚌 VIAJAR', cor:'#0E7A5A' },
    { id:'vender', label:'🛒 VENDER', cor:'#C9A227' },
    { id:'contratos', label:'📄 CONTRATOS', cor:'#7C3AED' },
  ];
  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(180deg,#EAF0F9 0%, #F6F8FB 30%, #FFF7E0 100%)', fontFamily:'system-ui, sans-serif'}}>
      <style>{`
        @keyframes flutuar { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-4px)} }
        @keyframes brilhar { 0%,100%{ box-shadow: 0 0 0 rgba(245,184,29,0)} 50%{ box-shadow: 0 0 18px rgba(245,184,29,.7)} }
        .btn-tab{ transition: all .25s ease; }
        .btn-tab:hover{ transform: translateY(-2px) scale(1.03); }
        .btn-tab.ativo{ animation: brilhar 1.6s infinite; }
        .logo-flutuar{ animation: flutuar 3s ease-in-out infinite; }
        .card-anim{ animation: flutuar 4s ease-in-out infinite; }
      `}</style>

      {/* TOPO - LOGO WEZHA + TOTSHE - IGUAL NAS 4 PARTES */}
      <div style={{position:'sticky', top:0, zIndex:40, background:'#0B3D91', borderBottom:'3px solid #F5B81D', boxShadow:'0 4px 20px rgba(0,0,0,.2)'}}>
        <div style={{maxWidth:1600, margin:'0 auto', padding:'8px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, background:'white', padding:'4px 12px 4px 4px', borderRadius:999, boxShadow:'0 2px 10px rgba(0,0,0,.2)'}}>
            <div className="logo-flutuar"><LogoWezha size={40} /></div>
            <div>
              <div style={{fontWeight:900, fontSize:16, color:'#0B3D91', lineHeight:1}}>WEZHA <span style={{fontSize:9, color:'#F5B81D', background:'#0B3D91', padding:'1px 5px', borderRadius:999}}>TOTSHE</span></div>
              <div style={{fontSize:9, color:'#666'}}>WEZHA TOTSHE • Contratos • Viagens • Vendas</div>
            </div>
          </div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {tabs.map((t:any)=> <button key={t.id} onClick={()=>setTab(t.id)} className={`btn-tab ${tab===t.id?'ativo':''}`} style={{padding:'8px 14px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:11, background: tab===t.id ? t.cor : 'white', color: tab===t.id ? 'white' : '#0B3D91'}}>{t.label}</button>)}
          </div>
          <div style={{marginLeft:'auto', color:'white', fontSize:11, fontWeight:700}}>🇲🇿 Moçambique • Maputo • Matola • Xai-Xai</div>
        </div>
      </div>

      {/* FRASE CONVIDATIVA - MUDA POR PARTE, MAS ESTILO IGUAL */}
      <div style={{maxWidth:1600, margin:'16px auto', padding:'0 16px'}}>
        <div style={{background:'linear-gradient(90deg,#0B3D91,#134E9E)', borderRadius:16, padding:'20px 22px', color:'white', boxShadow:'0 8px 24px rgba(11,61,145,.25)', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', right:10, top:0, fontSize:60, opacity:.15}}>🇲🇿</div>
          <h1 style={{margin:0, fontSize:20, fontWeight:900}}>{f.titulo}</h1>
          <p style={{margin:'6px 0 0', fontSize:12, opacity:.9}}>{f.sub}</p>
          <div style={{display:'flex', gap:6, marginTop:12, flexWrap:'wrap'}}>
            <span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>✅ Verifica BI e NUIT</span>
            <span style={{background:'white', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>📸 Fotos e M-Pesa comprovado</span>
            <span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>📄 11 Cláusulas - Lei 23/2007</span>
          </div>
        </div>
      </div>

      {/* CONTEUDO DAS 4 PARTES */}
      <div style={{maxWidth:1600, margin:'0 auto', padding:'0 16px 30px'}}>
        {tab==='encontrar' && <EncontrarReal />}
        {tab==='viajar' && <ViajarReal />}
        {tab==='vender' && <VenderReal />}
        {tab==='contratos' && <ContratosReal />}
      </div>

      {/* RODAPE - LOGO + FRASE */}
      <div style={{textAlign:'center', padding:'16px', color:'#0B3D91', fontSize:11}}>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:8}}><LogoWezha size={28} /><b>WEZHA TOTSHE</b> • Feito em Moçambique 🇲🇿</div>
        <p>Protege o teu trabalho! Sem contrato, sem prova! Com contrato, estás protegido!</p>
      </div>
    </div>
  );
}
