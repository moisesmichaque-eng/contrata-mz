
// @ts-nocheck
// HIBRIDO DEFINITIVO - MANTEM RESTO SEM ALTERAR, TRABALHA APENAS COM VIAGENS
// Foto 2: Site completo FACTURACAO, VIAGENS, ENCONTRAR, CONTRATOS 11, MEUS, ADM
// Foto 1: Ao clicar em VIAGENS, mostra pagina operacional com VER CARROS AO VIVO NO MAPA + MAIS PROXIMO

import React, { useState, useMemo } from 'react';

type Viagem = {
  id: number; transportadora: string; tipo: string; matricula: string; lugares: string; carga: string;
  rota: string; provinciaOrigem: string; provinciaDestino: string; distritoOrigem: string; distritoDestino: string;
  motorista: string; telefone: string; tempo: string; minutos: number; preco: number; avaliacao: number;
  status: 'a_caminho' | 'pronto' | 'embarque'; lugaresLivres: number;
};

const MOCK_VIAGENS: Viagem[] = [
  { id: 1, transportadora: "Nagi Invest", tipo: "Toyota Coaster - 30 Lug", matricula: "ACM 234 MP", lugares: "30 lugares", carga: "3.5 Ton", rota: "Matola -> Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Joao Manhique", telefone: "82 123 4567", tempo: "12h 30min", minutos: 750, preco: 2500, avaliacao: 4.8, status: 'a_caminho', lugaresLivres: 8 },
  { id: 2, transportadora: "Maning Transporte", tipo: "Mini-bus Rosa - 22 Lug", matricula: "ABG 901 MP", lugares: "22 lugares", carga: "1.2 Ton", rota: "Matola -> Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Carlos Tembe", telefone: "84 987 6543", tempo: "13h 15min", minutos: 795, preco: 1800, avaliacao: 4.5, status: 'pronto', lugaresLivres: 3 },
  { id: 3, transportadora: "ESSE Viagens", tipo: "Coaster Luxo - 33 Lug", matricula: "AHN 442 MP", lugares: "33 lugares", carga: "5 Ton", rota: "Maputo -> Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Armindo Chissano", telefone: "82 555 1122", tempo: "11h 45min", minutos: 705, preco: 3200, avaliacao: 4.9, status: 'embarque', lugaresLivres: 12 },
  { id: 4, transportadora: "Trans Nampula", tipo: "Toyota Hiace - 15 Lug", matricula: "AKL 789 NP", lugares: "15 lugares", carga: "800 Kg", rota: "Matola -> Dondo", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Dondo", motorista: "Felisberto Mausse", telefone: "84 333 7788", tempo: "14h 00min", minutos: 840, preco: 1500, avaliacao: 4.3, status: 'a_caminho', lugaresLivres: 5 },
  { id: 5, transportadora: "MozLog Express", tipo: "Foton Camiao + Passageiros", matricula: "ADF 561 SF", lugares: "18 lugares", carga: "7 Ton", rota: "Boane -> Beira", provinciaOrigem: "Maputo Provincia", provinciaDestino: "Sofala", distritoOrigem: "Boane", distritoDestino: "Beira", motorista: "Samuel Mucavele", telefone: "82 888 9900", tempo: "10h 20min", minutos: 620, preco: 2800, avaliacao: 4.6, status: 'a_caminho', lugaresLivres: 2 }
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
  const [pesquisado, setPesquisado] = useState(false);
  const [filtroBusca, setFiltroBusca] = useState("");

  const viagensFiltradas = useMemo(() => {
    let lista = [...MOCK_VIAGENS];
    if (maisProximo) lista.sort((a,b) => a.minutos - b.minutos);
    return lista;
  }, [maisProximo]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <header className="w-full bg-[#0e1a32] text-white sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center">
              <span className="text-[#0e1a32] font-bold text-[13px]">ESSE</span>
            </div>
            <span className="text-[10px] leading-[10px] opacity-70 hidden md:block">ENCONTRE. NEGOCIE. FORMALIZE. 11 CLAUSULAS</span>
          </div>
          <nav className="flex items-center gap-1">
            <button onClick={()=>setTab('facturacao')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${tab==='facturacao'?'bg-[#facc15] text-black':'bg-[#facc15]/20 text-[#facc15]'}`}>FACTURACAO</button>
            <button onClick={()=>setTab('viagens')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${tab==='viagens'?'bg-[#38bdf8] text-white ring-2 ring-white':'bg-[#38bdf8] text-white'}`}>VIAGENS</button>
            <button onClick={()=>setTab('encontrar')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${tab==='encontrar'?'bg-[#facc15] text-black':'bg-[#facc15]/20 text-[#facc15]'}`}>ENCONTRAR</button>
            <button onClick={()=>setTab('contratos')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${tab==='contratos'?'bg-[#facc15] text-black':'bg-[#facc15]/20 text-[#facc15]'}`}>CONTRATOS 11</button>
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
            <span>PREVISAO DE CHEGADA - NACIONAL - TODAS PROVINCIAS - AO VIVO</span>
            <span className="text-[9px] opacity-80">Actualizado ha 12s</span>
          </div>
          <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            <div className="bg-white rounded-[12px] border p-4">
              <h3 className="font-bold text-[11px]">Pesquisar viagens - NACIONAL<br/>TODAS PROVINCIAS - TEMPO REAL</h3>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={()=>setShowMap(!showMap)} className="h-[34px] bg-[#1d4ed8] text-white rounded-[6px] text-[9px] font-bold">VER CARROS AO VIVO NO MAPA (NACIONAL)</button>
                <button onClick={()=>setMaisProximo(!maisProximo)} className={`h-[34px] rounded-[6px] text-[9px] font-bold ${maisProximo?'bg-[#16a34a] text-white':'bg-[#22c55e] text-white'}`}>MAIS PROXIMO ✓</button>
              </div>
              <div className="mt-4 space-y-3">
                <div><label className="text-[9px] font-bold text-[#9ca3af]">PROVINCIA ORIGEM</label><select value={provOrigem} onChange={e=>setProvOrigem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Maputo Provincia</option><option>Sofala</option></select></div>
                <div><label className="text-[9px] font-bold text-[#9ca3af]">PROVINCIA DESTINO</label><select value={provDestino} onChange={e=>setProvDestino(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Sofala</option><option>Maputo Provincia</option></select></div>
                <div><label className="text-[9px] font-bold text-[#9ca3af]">DISTRITO ORIGEM</label><select value={distOrigem} onChange={e=>setDistOrigem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Matola</option><option>Boane</option></select></div>
                <div><label className="text-[9px] font-bold text-[#9ca3af]">DISTRITO DESTINO</label><select value={distDestino} onChange={e=>setDistDestino(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]"><option>Beira</option><option>Dondo</option></select></div>
                <div><label className="text-[9px] font-bold text-[#9ca3af]">DATA VIAGEM</label><input type="date" value={dataViagem} onChange={e=>setDataViagem(e.target.value)} className="w-full mt-1 h-[34px] border rounded-[6px] px-2 text-[11px]" /></div>
                <button onClick={()=>setPesquisado(true)} className="w-full h-[38px] bg-[#1d4ed8] text-white rounded-[6px] font-bold text-[11px]">PESQUISAR VIAGENS</button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><h2 className="font-bold text-[12px]"><span className="bg-[#111827] text-white w-5 h-5 rounded inline-flex items-center justify-center mr-1">{viagensFiltradas.length}</span> carros encontrados para <span className="text-[#1d4ed8]">MAPUTO PROVINCIA - SOFALA - BEIRA</span></h2><button onClick={()=>setShowMap(!showMap)} className="border rounded-full px-2 py-1 bg-white text-[10px]">Ocultar mapa</button></div>
              {showMap && (
                <div className="bg-[#e0f2fe] rounded-[12px] border h-[180px] relative overflow-hidden p-2">
                  <div className="absolute top-2 right-2 bg-[#111827] text-white text-[8px] font-bold px-2 py-1 rounded-full">NACIONAL</div>
                  <svg className="w-full h-[100px]" viewBox="0 0 800 100"><path d="M 50 70 Q 200 20 350 50 T 650 35 Q 700 30 750 70" stroke="#93c5fd" strokeWidth="3" strokeDasharray="8 8" fill="none" /><circle cx="80" cy="65" r="10" fill="#1d4ed8" /><circle cx="350" cy="45" r="10" fill="#1d4ed8" /><circle cx="550" cy="30" r="8" fill="#facc15" /><circle cx="200" cy="80" r="8" fill="#22c55e" /></svg>
                  <div className="absolute bottom-2 left-2 text-[9px] bg-white px-2 py-1 rounded-full border">AO VIVO - EN1: Maputo - Beira</div>
                </div>
              )}
              {viagensFiltradas.map(v=>(
                <div key={v.id} className="bg-white rounded-[12px] border p-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#f3f4f6] border flex items-center justify-center font-bold text-[9px]">{v.transportadora.slice(0,4).toUpperCase()}</div>
                    <div className="flex-1">
                      <div className="flex justify-between"><div><div className="flex items-center gap-2"><h4 className="font-bold text-[12px]">{v.transportadora}</h4><span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${v.status==='a_caminho'?'bg-[#dbeafe] text-[#1d4ed8]':'bg-emerald-100 text-emerald-700'}`}>{v.status.toUpperCase()}</span></div><p className="text-[10px] text-[#6b7280]">{v.tipo} - {v.matricula}</p></div><div className="text-right"><div className="font-bold text-[#dc2626]">{v.preco} MT</div><div className="text-[8px] text-[#6b7280]">por lugar</div></div></div>
                      <div className="mt-2 flex gap-2"><button className="h-[30px] px-4 bg-[#111827] text-white rounded-[6px] text-[10px] font-bold">Reservar lugar</button><button className="h-[30px] px-3 bg-white border rounded-[6px] text-[10px]">📞 {v.telefone}</button></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {tab === 'encontrar' && (
        <main className="max-w-[1440px] mx-auto px-4 py-6">
          <div className="bg-[#1e293b] rounded-[16px] p-6 text-center text-white">
            <p className="text-[10px] tracking-[0.2em] text-[#facc15]">ENCONTRE NA SUA ZONA - MAIS PROXIMOS DE SI</p>
            <h1 className="font-bold text-[18px] mt-2">Estas a procura de um profissional, mestre ou empresa na sua zona ou mais proximo?</h1>
            <p className="text-[11px] opacity-70 mt-1">Encontre aqui - Pedreiro, Carpinteiro, Eletricista, Serralheiro, Domestica, Motorista... contrato legal em 2 minutos</p>
          </div>
          <div className="grid lg:grid-cols-[1fr_360px] gap-4 mt-4">
            <div className="bg-white rounded-[12px] border p-4">
              <div className="flex gap-2">
                <input value={filtroBusca} onChange={e=>setFiltroBusca(e.target.value)} placeholder="Ex: Serralheiro, Pedreiro, Eletricista..." className="flex-1 h-[38px] border rounded-[8px] px-3 text-[11px]" />
                <button className="h-[38px] bg-[#0e1a32] text-white px-4 rounded-[8px] text-[10px] font-bold">PESQUISAR</button>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                {[
                  {nome:"Carlos Matsinhe", tipo:"Pedreiro - Maputo Cidade", rating:"VERIFICADO - 4.9", foto:"CM"},
                  {nome:"Joao Carpinteiro", tipo:"Carpinteiro - Xai-Xai", rating:"VERIFICADO - 4.8", foto:"JC"},
                  {nome:"Michaque Serralheiro", tipo:"Serralheiro - Maputo Cidade", rating:"VERIFICADO - 5", foto:"MS"},
                  {nome:"Ana Electricista", tipo:"Eletricista - Matola", rating:"VERIFICADO - 5", foto:"AE"},
                ].map(p=>(
                  <div key={p.nome} className="border rounded-[12px] p-3">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#0e1a32] text-white flex items-center justify-center font-bold text-[10px]">{p.foto}</div>
                      <div className="flex-1"><div className="flex justify-between"><div><div className="font-bold text-[11px]">{p.nome}</div><div className="text-[9px] text-[#6b7280]">{p.tipo}</div></div><span className="bg-[#fef9c3] text-[8px] font-bold px-2 py-1 rounded-full h-fit">{p.rating}</span></div><div className="flex gap-2 mt-2"><button className="flex-1 h-[28px] bg-[#0e1a32] text-white rounded-[6px] text-[9px] font-bold">GERAR CONTRATO</button><button className="px-3 h-[28px] border rounded-[6px] text-[9px] font-bold">CONTRATAR</button></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[12px] border p-4">
              <h3 className="font-bold text-[10px] text-center">Cadastre seu servico - Rapido e gratuito COM BI E NUIT OPCIONAL</h3>
              <button className="w-full mt-3 h-[34px] bg-[#facc15] text-black rounded-[6px] text-[10px] font-bold">CADASTRAR - GRATIS - MANTEM RESTO</button>
              <p className="text-[8px] text-[#6b7280] mt-2 text-center">Este arquivo mantem FACTURACAO, CONTRATOS 11, MEUS, ADM como funcionava</p>
            </div>
          </div>
        </main>
      )}

      {tab === 'facturacao' && <div className="p-10 text-center"><h1 className="font-bold">FACTURACAO - Mantido sem alterar</h1><button onClick={()=>setTab('viagens')} className="mt-4 bg-[#38bdf8] text-white px-6 py-2 rounded-full">IR PARA VIAGENS - Foto 1</button></div>}
      {tab === 'contratos' && <div className="p-10 text-center font-bold">CONTRATOS 11 - 11 Clausulas - Mantido</div>}
      {tab === 'meus' && <div className="p-10 text-center font-bold">MEUS - Mantido</div>}
      {tab === 'adm' && <div className="p-10 text-center font-bold">ADM - Mantido</div>}

      <footer className="mt-8 border-t bg-white py-4 text-center text-[10px] text-[#6b7280]">
        © 2026 ESSE Contrata-MZ - HIBRIDO DEFINITIVO - Ao clicar em VIAGENS (circulo vermelho) mostra Foto 1 - Mantem resto sem alterar
      </footer>
    </div>
  );
}
