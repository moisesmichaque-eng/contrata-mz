import { useState, useEffect } from 'react';
import EncontrarReal from './EncontrarReal';
import VenderReal from './VenderReal';
import ViajarReal from './ViajarReal';
import ContratosReal from './ContratosReal';

// WEZHA TOTSHE - VIAJAR ESCONDIDO
// ============================================================
// Enquanto apresentas o VENDER, o VIAJAR NAO EXISTE na app:
// - Nao aparece no menu
// - Nao abre por nenhum botao
// - Ninguem o ve, ninguem lhe toca
//
// QUANDO COMPRARES O DOMINIO PROPRIO E QUISERES PUBLICAR O VIAJAR:
// Muda a linha abaixo de false para true, faz commit + push. So isso.
//   const MOSTRAR_VIAJAR = true;
// ============================================================
const MOSTRAR_VIAJAR = false;

// Pre-visualizacao so para ti, o dono: abre o site com ?viajar=mostrar no fim do link
// Ex: https://contrata-mz.vercel.app/?viajar=mostrar
// Assim testas o Viajar sem o mostrar a ninguem. Sem esse codigo no link, continua escondido.
const viajarPreview = typeof window !== 'undefined' && window.location.search.includes('viajar=mostrar');
const VIAJAR_ATIVO = MOSTRAR_VIAJAR || viajarPreview;

type Aba = 'encontrar' | 'vender' | 'contratos' | 'viajar';

// LOGOTIPO WEZHA - nunca mais some:
// 1) tenta o PNG transparente, 2) o PNG normal, 3) o JPG.
// Se nenhum ficheiro existir, desenha o logo em SVG.
export function LogoWezha({ size = 36 }: any) {
  const [tentativa, setTentativa] = useState(0);
  const fontes = ['/logo-wezha-transparente.png', '/logo-wezha.png', '/logo-wezha.jpg', '/logo_wezha.jpg'];
  if (tentativa >= fontes.length) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 3 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <path d="M 92 8 A 48 48 0 1 0 92 92 A 58 58 0 0 1 92 8" fill="#0B3D91" />
          <path d="M 38 22 A 44 44 0 1 1 38 82 A 50 50 0 0 0 38 22" fill="#F5B81D" />
          <circle cx="50" cy="50" r="32" fill="white" />
          <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0B3D91" fontFamily="Georgia, serif">WEZHA</text>
        </svg>
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, flexShrink: 0, background: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 3, boxShadow: '0 1px 4px rgba(0,0,0,.12)' }} title="WEZHA - TOTSHE">
      <img src={fontes[tentativa]} alt="WEZHA" onError={() => setTentativa(tentativa + 1)} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain', background: 'white', display: 'block' }} />
    </div>
  );
}

export default function App() {
  // A app abre logo no VENDER, que e a parte que estas a apresentar
  const [aba, setAba] = useState<Aba>('vender');
  // SPLASH - combinacao C: tres tons - azul escuro em cima, azul vivo no meio, amarelo em baixo. O logo gira 2,2s e depois o site abre
  const [mostrarSplash, setMostrarSplash] = useState(true);
  useEffect(() => { const t = setTimeout(() => setMostrarSplash(false), 2500); return () => clearTimeout(t); }, []);

  const botao = (id: Aba, label: string, ativo: string) =>
    (<button key={id} onClick={() => setAba(id)} className={`px-4 sm:px-6 py-2.5 rounded-full text-[12px] sm:text-[13px] font-black whitespace-nowrap ${aba === id ? ativo : 'bg-gray-100 text-gray-700'}`}>{label}</button>);

  // ECRÃ DE ENTRADA - combinacao C: tres tons. Texto branco, porque o nome fica em cima do azul.
  if (mostrarSplash) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1E2F4A 0%, #1A5CB5 45%, #1A5CB5 75%, #F5B81D 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 20, textAlign: 'center' }}>
        <style>{`@keyframes girar { 0%{ transform: rotate(0deg) scale(1)} 50%{ transform: rotate(180deg) scale(1.08)} 100%{ transform: rotate(360deg) scale(1)} } .logo-girar{ animation: girar 2.2s ease-in-out; }`}</style>
        <div className="logo-girar" style={{ background: 'white', padding: 18, borderRadius: '50%', boxShadow: '0 0 40px rgba(255,255,255,.6)' }}><LogoWezha size={110} /></div>
        <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>WEZHA <span style={{ background: '#facc15', color: '#1e2f4a', padding: '2px 10px', borderRadius: 999, fontSize: 16 }}>TOTSHE</span></h1>
        <p style={{ fontSize: 12, opacity: 0.9, marginTop: 6, fontWeight: 700 }}>Encontrar • Vender • Contratos</p>
        <button onClick={() => setMostrarSplash(false)} style={{ marginTop: 14, background: 'white', color: '#1e2f4a', border: 'none', padding: '8px 18px', borderRadius: 999, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>ENTRAR AGORA →</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <style>{`@keyframes flutuar { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-4px)} } .logo-flutuar{ animation: flutuar 3s ease-in-out infinite; }`}</style>
      {/* TOPO - WEZHA TOTSHE - cabecalho AZUL (antes era preto/azul escuro) */}
      <div className="bg-[#0B3D91] text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="logo-flutuar"><LogoWezha size={36} /></div>
            <div>
              <div className="font-black text-[14px] sm:text-[16px] leading-none">WEZHA TOTSHE</div>
              <div className="text-[9px] sm:text-[10px] text-gray-300">Encontrar • Vender • Contratos</div>
            </div>
          </div>
          <div className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full">Maputo • Moçambique</div>
        </div>
        {/* MENU - o VIAJAR nao esta aqui de proposito */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-3 flex gap-2 overflow-x-auto whitespace-nowrap">
          {botao('encontrar', '🔍 Encontrar', 'bg-white text-black')}
          {botao('vender', '🛒 Vender', 'bg-[#facc15] text-black')}
          {botao('contratos', '📄 Contratos', 'bg-white text-black')}
          {/* VIAJAR SO APARECE SE MOSTRAR_VIAJAR = true (dominio proprio) ou com ?viajar=mostrar */}
          {VIAJAR_ATIVO && botao('viajar', '🚌 Viajar', 'bg-white text-black')}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3">
        {aba === 'encontrar' && <EncontrarReal />}
        {aba === 'vender' && <VenderReal />}
        {aba === 'contratos' && <ContratosReal />}
        {aba === 'viajar' && VIAJAR_ATIVO && <ViajarReal />}
        {aba === 'viajar' && !VIAJAR_ATIVO && (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500 text-[13px]">Esta parte ainda não está disponível.</div>
        )}
      </div>
    </div>
  );
}
