import React, { useState, useMemo } from 'react';
// lucide-react removido para build estavel - usando texto

type Viagem = {
  id: number;
  transportadora: string;
  tipo: string;
  matricula: string;
  lugares: string;
  carga: string;
  rota: string;
  provinciaOrigem: string;
  provinciaDestino: string;
  distritoOrigem: string;
  distritoDestino: string;
  motorista: string;
  telefone: string;
  tempo: string;
  minutos: number;
  preco: number;
  avaliacao: number;
  status: 'a_caminho' | 'pronto' | 'embarque';
  lugaresLivres: number;
};

const MOCK_VIAGENS: Viagem[] = [
  {
    id: 1,
    transportadora: "Nagi Invest",
    tipo: "Toyota Coaster - 30 Lug",
    matricula: "ACM 234 MP",
    lugares: "30 lugares",
    carga: "3.5 Ton",
    rota: "Matola -> Beira",
    provinciaOrigem: "Maputo Província",
    provinciaDestino: "Sofala",
    distritoOrigem: "Matola",
    distritoDestino: "Beira",
    motorista: "João Manhique",
    telefone: "82 123 4567",
    tempo: "12h 30min",
    minutos: 750,
    preco: 2500,
    avaliacao: 4.8,
    status: 'a_caminho',
    lugaresLivres: 8
  },
  {
    id: 2,
    transportadora: "Maning Transporte",
    tipo: "Mini-bus Rosa - 22 Lug",
    matricula: "ABG 901 MP",
    lugares: "22 lugares",
    carga: "1.2 Ton",
    rota: "Matola -> Beira",
    provinciaOrigem: "Maputo Província",
    provinciaDestino: "Sofala",
    distritoOrigem: "Matola",
    distritoDestino: "Beira",
    motorista: "Carlos Tembe",
    telefone: "84 987 6543",
    tempo: "13h 15min",
    minutos: 795,
    preco: 1800,
    avaliacao: 4.5,
    status: 'pronto',
    lugaresLivres: 3
  },
  {
    id: 3,
    transportadora: "ESSE Viagens",
    tipo: "Coaster Luxo - 33 Lug",
    matricula: "AHN 442 MP",
    lugares: "33 lugares",
    carga: "5 Ton",
    rota: "Maputo -> Beira",
    provinciaOrigem: "Maputo Província",
    provinciaDestino: "Sofala",
    distritoOrigem: "Matola",
    distritoDestino: "Beira",
    motorista: "Armindo Chissano",
    telefone: "82 555 1122",
    tempo: "11h 45min",
    minutos: 705,
    preco: 3200,
    avaliacao: 4.9,
    status: 'embarque',
    lugaresLivres: 12
  },
  {
    id: 4,
    transportadora: "Trans Nampula",
    tipo: "Toyota Hiace - 15 Lug",
    matricula: "AKL 789 NP",
    lugares: "15 lugares",
    carga: "800 Kg",
    rota: "Matola -> Dondo",
    provinciaOrigem: "Maputo Província",
    provinciaDestino: "Sofala",
    distritoOrigem: "Matola",
    distritoDestino: "Dondo",
    motorista: "Felisberto Maússe",
    telefone: "84 333 7788",
    tempo: "14h 00min",
    minutos: 840,
    preco: 1500,
    avaliacao: 4.3,
    status: 'a_caminho',
    lugaresLivres: 5
  },
  {
    id: 5,
    transportadora: "MozLog Express",
    tipo: "Foton Camião + Passageiros",
    matricula: "ADF 561 SF",
    lugares: "18 lugares",
    carga: "7 Ton",
    rota: "Boane -> Beira",
    provinciaOrigem: "Maputo Província",
    provinciaDestino: "Sofala",
    distritoOrigem: "Boane",
    distritoDestino: "Beira",
    motorista: "Samuel Mucavele",
    telefone: "82 888 9900",
    tempo: "10h 20min",
    minutos: 620,
    preco: 2800,
    avaliacao: 4.6,
    status: 'a_caminho',
    lugaresLivres: 2
  }
];

export default function App() {
  const [showMap, setShowMap] = useState(true);
  const [maisProximo, setMaisProximo] = useState(false);
  const [provOrigem, setProvOrigem] = useState("Maputo Província");
  const [provDestino, setProvDestino] = useState("Sofala");
  const [distOrigem, setDistOrigem] = useState("Matola");
  const [distDestino, setDistDestino] = useState("Beira");
  const [dataViagem, setDataViagem] = useState("2026-10-17");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pesquisado, setPesquisado] = useState(false);
  const [topMenu, setTopMenu] = useState("VIAGENS");
  const [topFeedback, setTopFeedback] = useState("");

  const viagensFiltradas = useMemo(() => {
    let lista = [...MOCK_VIAGENS];
    if (provDestino !== "Todas") {
      lista = lista.filter(v => v.provinciaDestino.toLowerCase().includes(provDestino.toLowerCase().slice(0,3)) || provDestino === "Sofala");
    }
    if (maisProximo) {
      lista.sort((a,b) => a.minutos - b.minutos);
    }
    if (pesquisado) {
      // Simulate filter by distrito
      lista = lista.filter(v => 
        v.distritoOrigem.toLowerCase().includes(distOrigem.toLowerCase()) ||
        v.distritoDestino.toLowerCase().includes(distDestino.toLowerCase()) ||
        distOrigem === "Matola"
      );
    }
    return lista;
  }, [provDestino, distOrigem, distDestino, maisProximo, pesquisado]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] font-[system-ui]" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        * { font-family: "Plus Jakarta Sans", system-ui, sans-serif; }
        .mono { font-family: "JetBrains Mono", monospace; }
      `}</style>

      {/* TOP HEADER - ESSE */}
      <header className="w-full bg-[#0e1a32] text-white sticky top-0 z-50" style={{ top: 'var(--safe-area-inset-top)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center">
                <span className="text-[#0e1a32] font-bold text-[15px] tracking-tight">ESSE</span>
              </div>
              <span className="text-[11px] leading-[11px] opacity-70 hidden sm:block">CONTRATA<br/>FACILITA</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: "FACTURAÇÃO", badge: null },
                { label: "VIAGENS", badge: null },
                { label: "ENCONTRAR", badge: null },
                { label: "CONTRATOS", badge: "11" },
                { label: "MEUS", badge: null },
                { label: "ADM", badge: null },
              ].map((item) => {
                const isActive = topMenu === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => { setTopMenu(item.label); setTopFeedback(item.label); setTimeout(()=>setTopFeedback(""), 1500); }}
                    className={`px-3 py-2 text-[12px] tracking-[0.08em] rounded-[6px] transition-all flex items-center gap-2 ${isActive ? 'bg-[#1d4ed8] font-bold text-white' : 'font-semibold opacity-70 hover:opacity-100 hover:bg-white/10 text-white'}`}
                  >
                    {item.label} {item.badge && <span className="bg-[#ef4444] text-white text-[10px] px-[6px] py-[1px] rounded-full mono">{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {topFeedback && <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full font-semibold animate-pulse">{topFeedback} • activo</span>}
            <div className="hidden md:flex items-center gap-2 text-[11px] opacity-60">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              TEMPO REAL
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1e2f4f] border border-white/20 flex items-center justify-center text-[12px] font-bold">JD</div>
          </div>
        </div>
      </header>

      {/* SUB HEADER - Facilita Viagens */}
      <div className="bg-white border-b border-[#e5e7eb] sticky top-[56px] z-40 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ top: 'calc(56px + var(--safe-area-inset-top))' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-bold text-[15px] tracking-tight">Facilita Viagens</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-[13px] text-[#6b7280] hover:text-black py-3">Visão geral</a>
              <a className="text-[13px] font-semibold text-[#1d4ed8] border-b-2 border-[#1d4ed8] py-3">Pesquisar viagens</a>
              <a className="text-[13px] text-[#6b7280] hover:text-black py-3">Enviar encomenda</a>
              <a className="text-[13px] text-[#6b7280] hover:text-black py-3">Minhas reservas</a>
            </nav>
          </div>
          <button className="bg-[#facc15] hover:bg-[#eab308] text-black text-[11px] font-bold tracking-[0.06em] px-4 py-2 rounded-[6px]">ÁREA TRANSPORTADOR</button>
        </div>
      </div>

      {/* GREEN BAR - Previsão */}
      <div className="bg-[#16a34a] text-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[36px] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.02em]">
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center"></div>
            PREVISÃO DE CHEGADA — NACIONAL • TODAS PROVÍNCIAS
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> AO VIVO
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] opacity-90">
            ⏱️ Actualizado há 12s
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-5 grid grid-cols-12 gap-5 items-start">
        
        {/* LEFT - FILTER */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-4">
          <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Title */}
            <div className="px-5 pt-5 pb-3 border-b border-[#f3f4f6]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-[13px] font-bold tracking-[-0.01em] leading-tight">Pesquisar viagens — NACIONAL<br/>TODAS PROVÍNCIAS — TEMPO REAL</h2>
                  <p className="text-[11px] text-[#6b7280] mt-1">Passageiro filtra à esquerda, resultados à direita</p>
                </div>
                
              </div>

              {/* KEY BUTTONS - Blue next to Green */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className={`h-[44px] rounded-[10px] text-[11px] font-bold tracking-[0.02em] leading-[13px] flex items-center justify-center gap-1.5 px-2 transition-all ${showMap ? 'bg-[#1d4ed8] text-white shadow-[0_2px_8px_rgba(29,78,216,0.3)]' : 'bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe]'}`}
                >
                  
                  VER CARROS<br/>AO VIVO NO MAPA<br/>(NACIONAL)
                </button>
                <button 
                  onClick={() => setMaisProximo(!maisProximo)}
                  className={`h-[44px] rounded-[10px] text-[11px] font-bold tracking-[0.02em] flex items-center justify-center gap-1.5 transition-all ${maisProximo ? 'bg-[#16a34a] text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)]' : 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'}`}
                >
                  
                  {maisProximo ? 'MAIS PRÓXIMO ✓' : 'MAIS PRÓXIMO'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-5 space-y-4">
              {[
                { label: 'PROVÍNCIA ORIGEM', value: provOrigem, setter: setProvOrigem, options: ['Maputo Província', 'Maputo Cidade', 'Gaza', 'Inhambane', 'Sofala', 'Todas'] },
                { label: 'PROVÍNCIA DESTINO', value: provDestino, setter: setProvDestino, options: ['Sofala', 'Nampula', 'Zambézia', 'Maputo Província', 'Todas'] },
                { label: 'DISTRITO ORIGEM', value: distOrigem, setter: setDistOrigem, options: ['Matola', 'Boane', 'Marracuene', 'Matola-Rio', 'Todos'] },
                { label: 'DISTRITO DESTINO', value: distDestino, setter: setDistDestino, options: ['Beira', 'Dondo', 'Nhamatanda', 'Búzi', 'Todos'] },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.08em] text-[#6b7280]">{f.label}</label>
                  <div className="relative">
                    <select 
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      className="w-full h-[42px] rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] appearance-none"
                    >
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                    
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.08em] text-[#6b7280]">DATA VIAGEM</label>
                <input 
                  type="date"
                  value={dataViagem}
                  onChange={(e) => setDataViagem(e.target.value)}
                  className="w-full h-[42px] rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.08em] text-[#6b7280]">PROVÍNCIA FILTRO</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Todas', 'Sul', 'Centro', 'Norte'].map(p => (
                    <button key={p} className={`h-[32px] rounded-[8px] text-[11px] font-semibold border ${p==='Todas' ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]'}`}>{p}</button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setPesquisado(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full h-[48px] bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-[10px] font-bold text-[13px] tracking-[0.02em] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(29,78,216,0.25)] transition-all active:scale-[0.98]"
              >
                 PESQUISAR VIAGENS
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[#6b7280] bg-[#f9fafb] rounded-[8px] px-3 py-2">
                <div className="w-5 h-5 rounded-full bg-[#e5e7eb] flex items-center justify-center"></div>
                Filtros aplicam-se instantaneamente à direita
              </div>
            </div>
          </div>

          {/* Mini legend */}
          <div className="mt-4 bg-[#0e1a32] text-white rounded-[12px] p-4">
            <p className="text-[11px] font-bold tracking-[0.06em] opacity-60">DICA DE OTIMIZAÇÃO</p>
            <p className="text-[12px] leading-[18px] mt-1.5">Esquerda = sua área de pesquisa. Direita = carros filtrados em tempo real. Sem telas extras.</p>
          </div>
        </aside>

        {/* RIGHT - RESULTS */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-8 space-y-4">
          
          {/* Results header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[15px] font-bold">
              <span className="bg-[#111827] text-white mono text-[12px] px-2 py-1 rounded-[6px] mr-2">{viagensFiltradas.length}</span>
              carros encontrados para <span className="text-[#1d4ed8]">{provOrigem.toUpperCase()} → {provDestino.toUpperCase()}</span> → {distDestino.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6b7280] hidden sm:block">Ordenar: {maisProximo ? 'Mais próximo' : 'Padrão'}</span>
              <button onClick={() => setShowMap(!showMap)} className="text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] flex items-center gap-1">
                🗺️ {showMap ? 'Ocultar mapa' : 'Ver no mapa'}
              </button>
            </div>
          </div>

          {/* Map Placeholder - toggle */}
          {showMap && (
            <div className="bg-white rounded-[14px] border border-[#e5e7eb] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="h-[220px] bg-[#dbeafe] relative overflow-hidden">
                {/* Fake map */}
                <div className="absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full opacity-60">
                  <path d="M50 150 Q200 20 350 100 T600 80 T750 120" stroke="#1d4ed8" strokeWidth="3" fill="none" strokeDasharray="8 6" />
                </svg>
                {viagensFiltradas.slice(0,4).map((v,i) => (
                  <div key={v.id} className="absolute" style={{ left: `${18 + i*19}%`, top: `${30 + (i%2)*35}%` }}>
                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${v.status==='embarque' ? 'bg-emerald-500' : v.status==='pronto' ? 'bg-amber-500' : 'bg-[#1d4ed8]'} animate-[bounce_2s_infinite]`} style={{ animationDelay: `${i*0.3}s` }}>
                      
                    </div>
                    <div className="mt-1 bg-black text-white text-[9px] px-1.5 py-0.5 rounded-full mono whitespace-nowrap">{v.matricula}</div>
                  </div>
                ))}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-semibold shadow flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> AO VIVO • EN1: Maputo → Beira
                </div>
                <div className="absolute top-3 right-3 bg-[#111827] text-white text-[10px] px-2.5 py-1 rounded-full font-bold">NACIONAL</div>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between bg-[#f9fafb] text-[11px]">
                <span className="text-[#6b7280] flex items-center gap-1.5"> Clica num carro no mapa para ver detalhes</span>
                <span className="font-semibold text-[#1d4ed8]">5 viaturas em trânsito</span>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className="space-y-3">
            {viagensFiltradas.map((v) => (
              <div 
                key={v.id} 
                onClick={() => setSelectedId(selectedId===v.id ? null : v.id)}
                className={`group bg-white rounded-[14px] border ${selectedId===v.id ? 'border-[#1d4ed8] shadow-[0_4px_20px_rgba(29,78,216,0.12)]' : 'border-[#e5e7eb] hover:border-[#d1d5db] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'} p-4 cursor-pointer transition-all`}
              >
                <div className="flex gap-4">
                  {/* Logo/Icon */}
                  <div className="hidden sm:flex w-12 h-12 rounded-[10px] bg-[#f3f4f6] border border-[#e5e7eb] items-center justify-center shrink-0">
                    <span className="font-bold text-[11px] tracking-tight">{v.transportadora.slice(0,4).toUpperCase()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-[14px] leading-tight">{v.transportadora}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status==='a_caminho' ? 'bg-[#dbeafe] text-[#1d4ed8]' : v.status==='pronto' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {v.status==='a_caminho' ? 'A CAMINHO' : v.status==='pronto' ? 'PRONTO P/ SAÍDA' : 'EMBARQUE'}
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px]">⭐ {v.avaliacao}</span>
                        </div>
                        <p className="text-[12px] text-[#6b7280] mt-0.5">{v.tipo} • {v.matricula} • <span className="text-[#111827] font-medium">{v.lugaresLivres} livres</span> de {v.lugares}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[18px] font-bold tracking-tight text-[#dc2626] mono">{v.preco.toLocaleString('pt-MZ')} MT</div>
                        <div className="text-[10px] text-[#6b7280] -mt-1">por lugar • negociável</div>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-[#f9fafb] rounded-[8px] px-2.5 py-2">
                        <div className="text-[10px] font-bold tracking-[0.06em] text-[#9ca3af] flex items-center gap-1">📍 ROTA</div>
                        <div className="text-[12px] font-semibold mt-0.5 truncate">{v.rota}</div>
                      </div>
                      <div className="bg-[#f9fafb] rounded-[8px] px-2.5 py-2">
                        <div className="text-[10px] font-bold tracking-[0.06em] text-[#9ca3af] flex items-center gap-1">🕒 PREVISÃO</div>
                        <div className="text-[12px] font-semibold mt-0.5 flex items-center gap-1">⏱️ {v.tempo}</div>
                      </div>
                      <div className="bg-[#f9fafb] rounded-[8px] px-2.5 py-2">
                        <div className="text-[10px] font-bold tracking-[0.06em] text-[#9ca3af] flex items-center gap-1">👥 MOTORISTA</div>
                        <div className="text-[12px] font-semibold mt-0.5 truncate">{v.motorista}</div>
                      </div>
                      <div className="bg-[#f9fafb] rounded-[8px] px-2.5 py-2">
                        <div className="text-[10px] font-bold tracking-[0.06em] text-[#9ca3af] flex items-center gap-1">📦 CARGA</div>
                        <div className="text-[12px] font-semibold mt-0.5">{v.carga}</div>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button className="h-[36px] px-4 bg-[#111827] hover:bg-black text-white rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 transition-colors">
                        Reservar lugar
                      </button>
                      <button className="h-[36px] px-3 bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] rounded-[8px] text-[12px] font-semibold flex items-center gap-1.5">
                        📞 {v.telefone}
                      </button>
                      <button className="h-[36px] px-3 bg-[#eff6ff] border border-[#dbeafe] text-[#1d4ed8] rounded-[8px] text-[11px] font-bold flex items-center gap-1">
                        🗺️ Ver no mapa
                      </button>
                      <span className="ml-auto text-[10px] text-[#9ca3af] hidden md:block">Matrícula: {v.matricula} • Actualizado agora</span>
                    </div>

                    {selectedId===v.id && (
                      <div className="mt-3 pt-3 border-t border-[#f3f4f6] grid md:grid-cols-2 gap-3 text-[12px]">
                        <div className="space-y-1">
                          <p className="font-bold">Detalhes da viagem</p>
                          <p className="text-[#6b7280] leading-[18px]">Saída: {v.distritoOrigem} ({v.provinciaOrigem}) às 05:00 • Paragens: Xai-Xai, Inhambane, Vilankulo • Chegada prevista em {v.distritoDestino} ({v.provinciaDestino}). Bagagem incluída até 20kg.</p>
                        </div>
                        <div className="bg-[#fffbeb] border border-amber-200 rounded-[8px] p-2.5">
                          <p className="font-bold text-amber-800 text-[11px]">POLÍTICA ESSE</p>
                          <p className="text-amber-900/80 text-[11px] mt-1 leading-[15px]">Pagamento na reserva com garantia de lugar. Cancelamento grátis até 2h antes.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-dashed border-[#d1d5db] rounded-[12px] p-4 text-center">
            <p className="text-[12px] text-[#6b7280]">Mostrando {viagensFiltradas.length} de 37 viaturas nacionais disponíveis hoje • <button className="text-[#1d4ed8] font-bold underline">Carregar mais</button></p>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-[#e5e7eb] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#6b7280]">
          <span>© 2026 ESSE Contrata-MZ • Facilita Viagens • Nacional • Tempo Real • Prototipo Otimizado</span>
          <span className="flex items-center gap-3"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Sistema optimizado: sem tela vermelha duplicada, botões no topo do filtro</span>
        </div>
      </footer>
    </div>
  );
}
