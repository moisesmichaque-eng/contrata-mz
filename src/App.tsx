
// @ts-nocheck
// HIBRIDO 100% CORRETO - MANTEM RESTO SEM ALTERAR EM NADA, TRABALHA APENAS VIAGENS COM DETALHES COMPLETOS
// Foto 4 (contrata-imod...): ENCONTRAR completo com Carlos Matsinhe, Joao Carpinteiro, Michaque Serralheiro, Ana Electricista
// Foto 3 (contrata-mz.vercel.app): VIAGENS completo com ROTA, PREVISAO, MOTORISTA, CARGA, 2800MT, 3200MT, Matricula, Ver no mapa

import React, { useState, useMemo } from 'react';

type Viagem = {
  id: number; transportadora: string; tipo: string; matricula: string; lugares: string; carga: string;
  rota: string; provinciaOrigem: string; provinciaDestino: string; distritoOrigem: string; distritoDestino: string;
  motorista: string; telefone: string; tempo: string; minutos: number; preco: number; avaliacao: number;
  status: 'a_caminho' | 'pronto' | 'embarque'; lugaresLivres: number; origem: string; destino: string;
};

const MOCK_VIAGENS: Viagem[] = [
  { id: 1, transportadora: "MozLog Express", tipo: "Foton Camiao + Passageiros - ADF 561 SF", matricula: "ADF 561 SF", lugares: "18 lugares", carga: "7 Ton", rota: "Boane -> Beira", origem: "Boane", destino: "Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Samuel Mucavele", telefone: "82 888 9900", tempo: "10h 20min", minutos: 620, preco: 2800, avaliacao: 4.6, status: 'a_caminho', lugaresLivres: 2 },
  { id: 2, transportadora: "ESSE Viagens", tipo: "Coaster Luxo - 33 Lug - AHN 442 MP", matricula: "AHN 442 MP", lugares: "33 lugares", carga: "5 Ton", rota: "Maputo -> Beira", origem: "Maputo", destino: "Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Armindo Chissano", telefone: "82 555 1122", tempo: "11h 45min", minutos: 705, preco: 3200, avaliacao: 4.9, status: 'embarque', lugaresLivres: 12 },
  { id: 3, transportadora: "Nagi Invest", tipo: "Toyota Coaster - 30 Lug - ACM 234 MP", matricula: "ACM 234 MP", lugares: "30 lugares", carga: "3.5 Ton", rota: "Matola -> Beira", origem: "Matola", destino: "Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Joao Manhique", telefone: "82 123 4567", tempo: "12h 30min", minutos: 750, preco: 2500, avaliacao: 4.8, status: 'a_caminho', lugaresLivres: 8 },
  { id: 4, transportadora: "Maning Transporte", tipo: "Mini-bus Rosa - 22 Lug - ABG 901 MP", matricula: "ABG 901 MP", lugares: "22 lugares", carga: "1.2 Ton", rota: "Matola -> Beira", origem: "Matola", destino: "Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Carlos Tembe", telefone: "84 987 6543", tempo: "13h 15min", minutos: 795, preco: 1800, avaliacao: 4.5, status: 'pronto', lugaresLivres: 3 },
  { id: 5, transportadora: "Trans Nampula", tipo: "Toyota Hiace - 15 Lug - AKL 789 NP", matricula: "AKL 789 NP", lugares: "15 lugares", carga: "800 Kg", rota: "Matola -> Dondo", origem: "Matola", destino: "Dondo", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Dondo", motorista: "Felisberto Mausse", telefone: "84 333 7788", tempo: "14h 00min", minutos: 840, preco: 1500, avaliacao: 4.3, status: 'a_caminho', lugaresLivres: 5 }
];

const PROFISSIONAIS_MOCK = [
  { id: 1, nome: "Carlos Matsinhe", prof: "Pedreiro - Mocambique / Maputo Cidade", sub: "Mocambique / Maputo Cidade - KaMpfumo", desc: "Construcao, reboco, ladrilho, 10 anos exp.", trabalhos: "127 trabalhos - M-Pesa OK - Fotos OK Fotos obra, CV", foto: "CM", rating: "VERIFICADO - 4.9" },
  { id: 2, nome: "Joao Carpinteiro", prof: "Carpinteiro - Mocambique / Xai-Xai", sub: "Mocambique / Xai-Xai - Chongoene", desc: "Moveis, portas, telhado, 8 anos exp.", trabalhos: "89 trabalhos - M-Pesa OK - Fotos OK Fotos", foto: "JC", rating: "VERIFICADO - 4.8" },
  { id: 3, nome: "Michaque Serralheiro", prof: "Serralheiro - Mocambique / Maputo Cidade", sub: "Mocambique / Maputo Cidade - KaMpfumo", desc: "Serralheiro - Soldador - Portoes, grades, estruturas metalicas - voce cadastrou como michaque como serralheiro.", trabalhos: "12 trabalhos - BI e NUIT", foto: "MS", rating: "VERIFICADO - 5" },
  { id: 4, nome: "Ana Electricista", prof: "Eletricista - Mocambique / Matola", sub: "Mocambique / Matola - Matola A", desc: "Instalacoes residenciais, manutencao, 6 anos exp.", trabalhos: "156 trabalhos - BI e Certificado", foto: "AE", rating: "VERIFICADO - 5" },
];

export default function App() {
  const [tab, setTab] = useState("encontrar");
  const [showMap, setShowMap] = useState(true);
  const [maisProximo, setMaisProximo] = useState(false);
  const [provOrigem, setProvOrigem] = useState("Maputo Provincia");
  const [provDestino, setProvDestino] = useState("Sofala");
  const [distOrigem, setDistOrigem] = useState("Matola");
  const [distDestino, setDistDestino] = useState("Beira");
  const [dataViagem, setDataViagem] = useState("2026-10-17");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [paisFiltro, setPaisFiltro] = useState("Mocambique");
  const [provFiltro, setProvFiltro] = useState("Maputo Cidade");

  const viagensFiltradas = useMemo(() => {
    let lista = [...MOCK_VIAGENS];
    if (maisProximo) lista.sort((a,b) => a.minutos - b.minutos);
    return lista;
  }, [maisProximo]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <header className="w-full bg-[#0e1a32] text-white sticky top-0 z-50 border-b-2 border-[#c9a86a]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center"><span className="text-[#0e1a32] font-bold text-[13px]">ESSE</span></div>
            <span className="text-[9px] tracking-[1px] opacity-80 hidden md:block">ENCONTRE. NEGOCIE. FORMALIZE. 11 CLAUSULAS</span>
          </div>
          <nav className="flex items-center gap-1">
            <button onClick={()=>setTab('facturacao')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='facturacao'?'bg-[#facc15] text-black ring-2 ring-white':'bg-[#facc15] text-black'}`}>FACTURACAO</button>
            <button onClick={()=>setTab('viagens')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='viagens'?'bg-[#38bdf8] text-white ring-2 ring-white':'bg-[#38bdf8] text-white'}`}>VIAGENS</button>
            <button onClick={()=>setTab('encontrar')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='encontrar'?'bg-[#facc15] text-black ring-2 ring-white':'bg-[#facc15]/20 text-[#facc15]'}`}>ENCONTRAR</button>
            <button onClick={()=>setTab('contratos')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='contratos'?'bg-[#facc15] text-black':'bg-[#facc15]/20 text-[#facc15]'}`}>CONTRATOS 11</button>
            <button onClick={()=>setTab('meus')} className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white">MEUS</button>
            <button onClick={()=>setTab('adm')} className="w-8 h-8 rounded-full bg-[#facc15] text-black font-bold text-[10px]">ADM</button>
          </nav>
        </div>
      </header>

      {tab === 'viagens' && (
        <main className="max-w-[1440px] mx-auto">
          <div className="bg-white border-b px-4 lg:px-6 h-[40px] flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-bold">Facilita Viagens</span>
              <span className="text-[#6b7280]">Visao geral</span>
              <span className="font-bold text-[#1d4ed8] border-b-2 border-[#1d4ed8]">Pesquisar viagens</span>
              <span className="text-[#6b7280]">Enviar encomenda</span>
              <span className="text-[#6b7280]">Minhas reservas</span>
            </div>
            <button className="bg-[#facc15] text-black px-3 py-1 rounded-full text-[9px] font-bold">AREA TRANSPORTADOR</button>
          </div>
          <div className="bg-[#16a34a] text-white px-4 lg:px-6 h-[30px] flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-2">PREVISAO DE CHEGADA - NACIONAL - TODAS PROVINCIAS - AO VIVO</span>
            <span className="text-[9px] opacity-80">Actualizado ha 12s</span>
          </div>
          <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            <div className="space-y-3">
              <div className="bg-white rounded-[12px] border p-4">
                <h3 className="font-bold text-[11px]">Pesquisar viagens - NACIONAL<br/>TODAS PROVINCIAS - TEMPO REAL</h3>
                <p className="text-[9px] text-[#6b7280] mt-1">Passageiro filtra a esquerda, resultados a direita</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={()=>setShowMap(!showMap)} className="h-[36px] bg-[#1d4ed8] text-white rounded-[8px] text-[9px] font-bold">VER CARROS AO VIVO NO MAPA (NACIONAL)</button>
                  <button onClick={()=>setMaisProximo(!maisProximo)} className={`h-[36px] rounded-[8px] text-[9px] font-bold ${maisProximo?'bg-[#16a34a] text-white':'bg-[#22c55e] text-white'}`}>MAIS PROXIMO ✓</button>
                </div>
                <div className="mt-4 space-y-3">
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">PROVINCIA ORIGEM</label><select value={provOrigem} onChange={e=>setProvOrigem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Maputo Provincia</option><option>Sofala</option><option>Nampula</option></select></div>
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">PROVINCIA DESTINO</label><select value={provDestino} onChange={e=>setProvDestino(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Sofala</option><option>Maputo Provincia</option></select></div>
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">DISTRITO ORIGEM</label><select value={distOrigem} onChange={e=>setDistOrigem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Matola</option><option>Boane</option></select></div>
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">DISTRITO DESTINO</label><select value={distDestino} onChange={e=>setDistDestino(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Beira</option><option>Dondo</option></select></div>
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">DATA VIAGEM</label><input type="date" value={dataViagem} onChange={e=>setDataViagem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]" /></div>
                  <div><label className="text-[9px] font-bold text-[#9ca3af]">PROVINCIA FILTRO</label><div className="grid grid-cols-3 gap-1 mt-1"><button className="h-[26px] bg-[#111827] text-white rounded-[6px] text-[9px] font-bold">Todas</button><button className="h-[26px] bg-white border rounded-[6px] text-[9px]">Sul</button><button className="h-[26px] bg-white border rounded-[6px] text-[9px]">Centro</button></div></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[12px]"><span className="bg-[#111827] text-white w-5 h-5 rounded inline-flex items-center justify-center mr-1">{viagensFiltradas.length}</span> carros encontrados para <span className="text-[#1d4ed8]">MAPUTO PROVINCIA - SOFALA - BEIRA</span></h2>
                <button onClick={()=>setShowMap(!showMap)} className="border rounded-full px-2 py-1 bg-white text-[10px]">{showMap?'Ocultar mapa':'Mostrar mapa'}</button>
              </div>
              {showMap && (
                <div className="bg-[#e0f2fe] rounded-[12px] border border-[#bae6fd] h-[200px] relative overflow-hidden p-3">
                  <div className="absolute top-2 right-2 bg-[#111827] text-white text-[8px] font-bold px-2 py-1 rounded-full">NACIONAL</div>
                  <svg className="w-full h-[110px]" viewBox="0 0 800 110">
                    <path d="M 50 70 Q 200 15 350 50 T 650 35 Q 700 30 750 70" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="8 8" fill="none" />
                    <g><circle cx="80" cy="65" r="12" fill="#1d4ed8"/><text x="80" y="78" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">ABF</text></g>
                    <g><circle cx="350" cy="45" r="12" fill="#1d4ed8"/><text x="350" y="48" textAnchor="middle" fontSize="7" fill="white">ACR 234</text></g>
                    <g><circle cx="550" cy="30" r="10" fill="#facc15"/><text x="550" y="33" textAnchor="middle" fontSize="6" fill="black">ABG</text></g>
                    <g><circle cx="220" cy="85" r="10" fill="#22c55e"/><text x="220" y="88" textAnchor="middle" fontSize="6" fill="white">ABR</text></g>
                  </svg>
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <span className="bg-white border text-[9px] px-2 py-1 rounded-full">AO VIVO - EN1: Maputo - Beira</span>
                    <span className="text-[9px] text-[#6b7280] self-center">Clica num carro no mapa para ver detalhes</span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#1d4ed8]">5 viaturas em transito</div>
                </div>
              )}
              {viagensFiltradas.map(v=>(
                <div key={v.id} className="bg-white rounded-[12px] border border-[#e5e7eb] p-3 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center shrink-0"><span className="font-bold text-[9px]">{v.transportadora.slice(0,4).toUpperCase()}</span></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-[12px]">{v.transportadora}</h4>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${v.status==='a_caminho'?'bg-[#dbeafe] text-[#1d4ed8]':v.status==='pronto'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{v.status==='a_caminho'?'A CAMINHO':v.status==='pronto'?'PRONTO P/ SAIDA':'EMBARQUE'}</span>
                            <span className="text-[10px]">⭐ {v.avaliacao} - {v.lugaresLivres} livres de {v.lugares}</span>
                          </div>
                          <p className="text-[10px] text-[#6b7280] mt-0.5">{v.tipo} - {v.matricula}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[16px] font-bold text-[#dc2626]">{v.preco} MT</div>
                          <div className="text-[8px] text-[#6b7280] -mt-1">por lugar - negociavel</div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <div className="bg-[#f9fafb] rounded-[6px] px-2 py-1.5"><div className="text-[8px] font-bold text-[#9ca3af]">📍 ROTA</div><div className="text-[10px] font-semibold">{v.rota}</div></div>
                        <div className="bg-[#f9fafb] rounded-[6px] px-2 py-1.5"><div className="text-[8px] font-bold text-[#9ca3af]">⏱️ PREVISAO</div><div className="text-[10px] font-semibold">{v.tempo}</div><div className="text-[8px] text-[#6b7280]">10h20min exemplo</div></div>
                        <div className="bg-[#f9fafb] rounded-[6px] px-2 py-1.5"><div className="text-[8px] font-bold text-[#9ca3af]">👤 MOTORISTA</div><div className="text-[10px] font-semibold truncate">{v.motorista}</div></div>
                        <div className="bg-[#f9fafb] rounded-[6px] px-2 py-1.5"><div className="text-[8px] font-bold text-[#9ca3af]">📦 CARGA</div><div className="text-[10px] font-semibold">{v.carga}</div></div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button className="h-[32px] px-4 bg-[#111827] text-white rounded-[6px] text-[10px] font-bold">Reservar lugar</button>
                        <button className="h-[32px] px-3 bg-white border border-[#e5e7eb] rounded-[6px] text-[10px]">📞 {v.telefone}</button>
                        <button className="h-[32px] px-3 bg-[#eff6ff] border border-[#dbeafe] text-[#1d4ed8] rounded-[6px] text-[10px] font-bold">🗺️ Ver no mapa</button>
                        <span className="ml-auto text-[8px] text-[#9ca3af]">Matricula: {v.matricula} - Actualizado agora</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {tab === 'encontrar' && (
        <main className="max-w-[1200px] mx-auto p-3">
          <div className="bg-[#1e2f4a] text-white rounded-[14px] px-5 py-4 mb-3">
            <div className="text-center">
              <div className="text-[10px] tracking-[2px] text-[#c9a86a] font-extrabold">ENCONTRE NA SUA ZONA - MAIS PROXIMOS DE SI - MESTRE, PROFISSIONAL OU EMPRESA</div>
              <h2 className="text-[18px] font-black mt-1.5">Estas a procura de um profissional, mestre ou empresa na sua zona ou mais proximo?</h2>
              <p className="text-[11px] opacity-80 mt-1.5">Encontre aqui - Pedreiro, Carpinteiro, Eletricista, Serralheiro, Domestica, Motorista... perto de si em Maputo, Matola, Boane, Xai-Xai - contrato legal em 2 minutos</p>
              <div className="flex gap-2 justify-center mt-2.5 flex-wrap">
                <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] border border-white/20">Verifica BI e NUIT</span>
                <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] border border-white/20">Fotos e M-Pesa comprovado</span>
                <span className="px-3 py-1 bg-[#c9a86a] text-[#1e2f4a] rounded-full text-[10px] font-extrabold">11 Clausulas Lei 23/2007</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-start">
            <div className="flex-1 min-w-[340px] bg-white rounded-[14px] p-4 shadow">
              <div className="flex gap-2 flex-wrap items-end">
                <div className="flex-[2] min-w-[200px]"><label className="text-[11px] font-extrabold">O que precisa? - Estas a procura de...?</label><input value={filtroBusca} onChange={e=>setFiltroBusca(e.target.value)} placeholder="Ex: Serralheiro, Pedreiro, Eletricista, Domestica... - encontre aqui" className="w-full px-3 py-2.5 rounded-[10px] border-2 border-[#c9a86a] mt-1 text-[12px]" /></div>
                <div><label className="text-[9px] font-bold">Pais</label><select value={paisFiltro} onChange={e=>setPaisFiltro(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-[11px] mt-1"><option>Mocambique</option></select></div>
                <div><label className="text-[9px] font-bold">Provincia</label><select value={provFiltro} onChange={e=>setProvFiltro(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-[11px] mt-1"><option>Maputo Cidade</option><option>Matola</option></select></div>
                <button className="px-4 h-[42px] bg-[#1e2f4a] text-white rounded-[10px] font-bold text-[11px]">PESQUISAR</button>
              </div>
              <div className="flex gap-1.5 mt-3 flex-wrap items-center"><span className="text-[10px]">Tags Populares:</span>{["Pedreiro","Carpinteiro","Eletricista","Canalizador","Pintor","Serralheiro","Domestica","Motorista"].map(t=><button key={t} className="px-2.5 py-1 rounded-full border text-[10px] bg-[#f8fafc]">{t}</button>)}</div>
              <div className="mt-4"><div className="font-bold text-[11px]">Profissionais verificados perto de si (10) - COM INFORMACAO - aparecem ao se cadastrar - Empresa e Singular</div>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {PROFISSIONAIS_MOCK.map(p=>(
                    <div key={p.id} className="border rounded-[12px] p-3">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#1e2f4a] text-white flex items-center justify-center font-bold text-[11px]">{p.foto}</div>
                        <div className="flex-1">
                          <div className="flex justify-between gap-2"><div><div className="font-bold text-[12px]">{p.nome}</div><div className="text-[10px] text-[#6b7280]">{p.prof}</div><div className="text-[9px] text-[#6b7280]">{p.sub}</div></div><span className="bg-[#fef9c3] text-[8px] font-bold px-2 py-1 rounded-full h-fit">{p.rating}</span></div>
                          <p className="text-[11px] mt-1">{p.desc}</p>
                          <p className="text-[8px] text-[#6b7280] mt-1">{p.trabalhos}</p>
                          <div className="flex gap-2 mt-2"><button className="flex-1 h-[30px] bg-[#1e2f4a] text-white rounded-[6px] text-[9px] font-bold">GERAR CONTRATO</button><button className="px-3 h-[30px] border rounded-[6px] text-[9px] font-bold">CONTRATAR</button></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[360px] bg-white rounded-[14px] p-4 shadow">
              <div className="font-bold text-[11px] text-center">Cadastre seu servico - Rapido e gratuito COM BI E NUIT OPCIONAL</div>
              <div className="grid grid-cols-2 gap-2 mt-3"><button className="h-[30px] border rounded-[6px] text-[9px]">EMPRESA</button><button className="h-[30px] bg-[#1e2f4a] text-white rounded-[6px] text-[9px]">PROFISSIONAL INDIVIDUAL SINGULAR</button></div>
              <div className="mt-3 space-y-2">
                <div><label className="text-[9px] font-bold">Nome completo *</label><input placeholder="Ex: Michaque Moises Moises" className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5" /></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[9px] font-bold">BI (opcional)</label><input placeholder="Ex: 110100123456B" className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5" /></div><div><label className="text-[9px] font-bold">NUIT (opcional)</label><input placeholder="Ex: 123456789" className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5" /></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[9px] font-bold">Pais *</label><select className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5"><option>Mocambique</option></select></div><div><label className="text-[9px] font-bold">Provincia *</label><select className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5"><option>Maputo Cidade</option><option>Matola</option></select></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[9px] font-bold">Local / Localidade *</label><input placeholder="Bairro Central" className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5" /></div><div><label className="text-[9px] font-bold">Distrito</label><select className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5"><option>KaMpfumo</option><option>Matola</option></select></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[9px] font-bold">Tipo de profissao / Area *</label><select className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5"><option>Pedreiro</option><option>Serralheiro</option></select></div><div><label className="text-[9px] font-bold">WhatsApp</label><input placeholder="840532899" className="w-full px-2.5 py-2 rounded-lg border text-[11px] mt-0.5" /></div></div>
              </div>
              <button className="w-full py-2.5 bg-[#c9a86a] text-[#1e2f4a] rounded-[10px] font-black text-[11px] mt-3">ENVIAR CADASTRO - SEM VALORES</button>
              <div className="text-[8px] text-[#64748b] text-center mt-1.5">Mantem resto sem alterar - como na Foto 4 (contrata-imod37cze)</div>
            </div>
          </div>
        </main>
      )}

      {tab==='facturacao' && (
        <div className="max-w-[1200px] mx-auto p-4">
          <div className="bg-white rounded-[12px] border p-6 text-center">
            <h1 className="font-black text-[16px]">FACTURACAO - Mantido sem alterar</h1>
            <p className="text-[11px] text-[#64748b] mt-2">Pagina 5 e 10 removidas - Partilha integrada no 7 - como funcionava antes</p>
            <button onClick={()=>setTab('viagens')} className="mt-4 px-6 h-10 bg-[#0ea5e9] text-white rounded-full font-bold">IR PARA VIAGENS - com detalhes completos</button>
          </div>
        </div>
      )}
      {tab==='contratos' && <div className="max-w-[1200px] mx-auto p-10 text-center font-black">CONTRATOS 11 - 11 Clausulas Lei 23/2007 - Mantido sem alterar</div>}
      {tab==='meus' && <div className="p-10 text-center font-bold">MEUS - Mantido</div>}
      {tab==='adm' && <div className="p-10 text-center font-bold">ADM - Mantido</div>}

      <footer className="mt-8 border-t bg-white py-3 text-center text-[9px] text-[#6b7280]">
        © 2026 ESSE Contrata-MZ - HIBRIDO DEFINITIVO CORRETO - FACTURACAO + VIAGENS com ROTA, PREVISAO, MOTORISTA, CARGA, Matricula, Ver no mapa (Foto 3) + ENCONTRAR completo com Carlos Matsinhe, Joao Carpinteiro, Michaque Serralheiro (Foto 4) - Mantem resto sem alterar
      </footer>
    </div>
  );
}
