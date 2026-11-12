import { useState } from 'react';
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

export default function App() {
  // A app abre logo no VENDER, que e a parte que estas a apresentar
  const [aba, setAba] = useState<Aba>('vender');

  const botao = (id: Aba, label: string, ativo: string) =>
    (<button key={id} onClick={() => setAba(id)} className={`px-4 sm:px-6 py-2.5 rounded-full text-[12px] sm:text-[13px] font-black whitespace-nowrap ${aba === id ? ativo : 'bg-gray-100 text-gray-700'}`}>{label}</button>);

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      {/* TOPO - WEZHA TOTSHE */}
      <div className="bg-[#1e2f4a] text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#facc15] rounded-full flex items-center justify-center text-black font-black text-[16px]">W</div>
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
