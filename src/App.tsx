import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('viagens');
  const [origem, setOrigem] = useState('Maputo Provincia');
  const [destino, setDestino] = useState('Sofala');
  const [origemDist, setOrigemDist] = useState('Matola');
  const [destinoDist, setDestinoDist] = useState('Beira');
  const [dataViagem, setDataViagem] = useState('2026-01-15');

  const viagens = [
    { id: 1, empresa: 'Nagi Invest', tipo: 'COMUM', estrelas: '4.5', rota: 'Maputo - Beira', placa: 'AE-123-MC', tel: '82 213 4047', preco: '2500 MT', dur: '3.5 Horas', assentos: 'Sub-Parque', peso: '5.5 Horas' },
    { id: 2, empresa: 'Maning Transporte', tipo: 'PREMIUM', estrelas: '4.8', rota: 'Matola - Beira', placa: 'AH-456-MP', tel: '84 991 4052', preco: '1800 MT', dur: '5h 10m', assentos: 'Carlos Novais', peso: '1.5 ton' },
    { id: 3, empresa: 'SSG Viagens', tipo: 'STANDARD', estrelas: '4.7', rota: 'Maputo - Beira', placa: 'AB-789-MC', tel: '82 123 4567', preco: '3500 MT', dur: '75 min', assentos: 'Avenida 24 de Julho', peso: '8 lugares' },
    { id: 4, empresa: 'Trans Marrupa', tipo: 'EXECUTIVO', estrelas: '4.9', rota: 'Matola - Chinde', placa: 'AC-321-MP', tel: '84 123 4567', preco: '1500 MT', dur: '100 km', assentos: 'Partida 1h Manhã', peso: '800 Kg' },
    { id: 5, empresa: 'Matola Express', tipo: 'EXPRESS', estrelas: '4.6', rota: 'Beira - Matola', placa: 'AD-654-MP', tel: '82 998 7766', preco: '2600 MT', dur: '100-20h', assentos: 'Servico Premium', peso: 'Premium' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <header className="bg-[#0f172a] text-white h-[52px] flex items-center justify-between px-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-white text-black px-2 py-1 text-[8px] font-black">CONTRATA</div>
          <span className="text-[8px] opacity-70">ENCONTRE. NEGOCIE. FORMALIZE. 11 CLAUSULAS</span>
        </div>
        <div className="flex gap-1">
          <button onClick={()=>setTab('faturacao')} className={`px-3 h-7 rounded-full text-[9px] font-black ${tab==='faturacao'?'bg-[#facc15] text-black':'bg-white/10'}`}>FACTURACAO</button>
          <button onClick={()=>setTab('viagens')} className={`px-3 h-7 rounded-full text-[9px] font-black ${tab==='viagens'?'bg-[#0ea5e9] text-white':'bg-white/10'}`}>VIAGENS</button>
          <button onClick={()=>setTab('encontrar')} className="px-3 h-7 rounded-full text-[9px] font-bold bg-white/10">ENCONTRAR</button>
          <button onClick={()=>setTab('contratos')} className="px-3 h-7 rounded-full text-[9px] font-bold bg-white/10">CONTRATOS 11</button>
        </div>
      </header>

      {tab==='viagens' && (
        <div className="max-w-[1200px] mx-auto p-2 sm:p-3">
          <div className="bg-white rounded-[12px] border p-2 mb-3 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-[#0ea5e9] text-white grid place-items-center rounded text-[10px] font-black">FV</div>
              <span className="font-black text-[11px]">Facilita Viagens</span>
              <span className="text-[7px] px-2 py-0.5 bg-[#e0f2fe] rounded-full border">Integrado como faturacao - mesmo padrao</span>
            </div>
            <div className="flex gap-1.5">
              <span className="px-3 h-6 grid place-items-center rounded-full bg-[#0ea5e9] text-white text-[8px] font-bold">Pesquisar viagens</span>
              <span className="px-3 h-6 grid place-items-center rounded-full bg-white border text-[8px]">Enviar encomenda</span>
              <span className="px-3 h-6 grid place-items-center rounded-full bg-white border text-[8px]">Minhas reservas</span>
              <span className="px-3 h-6 grid place-items-center rounded-full bg-[#fef9c3] border text-black text-[8px] font-black">AREA TRANSPORTADOR</span>
            </div>
          </div>

          <div className="bg-green-600 rounded-[10px] py-2 text-center text-white font-bold text-[11px] mb-3">Previsao de Chegada</div>

          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-3 items-start">
            {/* ESQUERDA */}
            <div className="bg-white rounded-[12px] border p-3">
              <div className="font-black text-[10px]">Pesquisar Viagens - NACIONAL, TODAS PROVINCIAS</div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="h-8 bg-[#0ea5e9] text-white rounded-full text-[8px] font-black">VER CARROS AO VIVO NO MAPA</button>
                <button className="h-8 bg-[#dcfce7] text-[#166534] border border-[#86efac] rounded-full text-[8px] font-black">MAIS PROXIMO</button>
              </div>
              <div className="mt-3 space-y-2.5">
                <div><label className="text-[7px] font-bold text-[#94a3b8]">PROVINCIA ORIGEM</label><select value={origem} onChange={e=>setOrigem(e.target.value)} className="w-full h-8 border rounded text-[10px] px-2 mt-1"><option>Maputo Provincia</option><option>Maputo Cidade</option><option>Gaza</option><option>Sofala</option></select></div>
                <div><label className="text-[7px] font-bold text-[#94a3b8]">PROVINCIA DESTINO</label><select value={destino} onChange={e=>setDestino(e.target.value)} className="w-full h-8 border rounded text-[10px] px-2 mt-1"><option>Sofala</option><option>Maputo Provincia</option><option>Gaza</option></select></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[7px] font-bold text-[#94a3b8]">DISTRITO ORIGEM</label><select value={origemDist} onChange={e=>setOrigemDist(e.target.value)} className="w-full h-8 border rounded text-[10px] px-2 mt-1"><option>Matola</option><option>Maputo</option></select></div>
                  <div><label className="text-[7px] font-bold text-[#94a3b8]">DISTRITO DESTINO</label><select value={destinoDist} onChange={e=>setDestinoDist(e.target.value)} className="w-full h-8 border rounded text-[10px] px-2 mt-1"><option>Beira</option><option>Matola</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[7px] font-bold text-[#94a3b8]">DATA VIAGEM</label><input type="date" value={dataViagem} onChange={e=>setDataViagem(e.target.value)} className="w-full h-8 border rounded text-[10px] px-2 mt-1" /></div>
                  <div><label className="text-[7px] font-bold text-[#94a3b8]">PROVINCIA FILTRO</label><select className="w-full h-8 border rounded text-[10px] px-2 mt-1"><option>Maputo Cidade</option></select></div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <select className="h-7 border rounded text-[8px] px-1"><option>Todos</option></select>
                  <select className="h-7 border rounded text-[8px] px-1"><option>Bus</option></select>
                  <select className="h-7 border rounded text-[8px] px-1"><option>Cancel</option></select>
                </div>
                <button className="w-full h-9 bg-[#0ea5e9] text-white rounded-full font-black text-[10px]">PESQUISAR VIAGENS</button>
                <div className="bg-[#0f172a] rounded-[10px] p-3 text-white">
                  <div className="text-[8px] font-bold">Guia de embarque</div>
                  <div className="text-[7px] opacity-70 mt-1">O sistema funciona offline: Crie o ponto, embarque e veja o carro mais proximo no mapa.</div>
                </div>
              </div>
            </div>

            {/* DIREITA */}
            <div className="space-y-3">
              <div className="bg-white rounded-[12px] border p-3">
                <div className="flex justify-between items-center">
                  <div className="font-black text-[10px]">6 cursos encontrados PARA {origem.toUpperCase()} - {destino.toUpperCase()} - {destinoDist.toUpperCase()}</div>
                  <div className="flex gap-1">
                    <span className="text-[7px] px-2 py-1 bg-[#e0f2fe] rounded-full">Cursos Partilh</span>
                    <span className="text-[7px] px-2 py-1 bg-[#fef9c3] rounded-full">Duplicar</span>
                  </div>
                </div>
                <div className="mt-3 h-[140px] bg-[#f0f9ff] rounded-[10px] border relative overflow-hidden">
                  <div className="absolute top-[50%] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-[#94a3b8]"></div>
                  <div className="absolute left-[10%] top-[45%]"><div className="w-3 h-3 bg-[#1e2f4a] rounded-full border-2 border-white shadow"></div><div className="mt-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 rounded">R-101</div><div className="text-[6px]">Maputo</div></div>
                  <div className="absolute left-[35%] top-[35%]"><div className="w-3 h-3 bg-[#0ea5e9] rounded-full border-2 border-white shadow"></div><div className="mt-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 rounded">R-101</div></div>
                  <div className="absolute left-[55%] top-[55%]"><div className="w-4 h-4 bg-[#facc15] rounded-full border-2 border-white shadow grid place-items-center text-[8px]">●</div><div className="mt-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 rounded">R-101</div></div>
                  <div className="absolute right-[25%] top-[30%]"><div className="w-3 h-3 bg-[#22c55e] rounded-full border-2 border-white shadow"></div><div className="mt-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 rounded">R-101</div></div>
                  <div className="absolute right-[10%] top-[45%]"><div className="w-3 h-3 bg-[#22c55e] rounded-full border-2 border-white shadow"></div><div className="mt-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 rounded">R-101</div><div className="text-[6px]">Beira</div></div>
                  <div className="absolute bottom-1 left-2 text-[7px] text-[#64748b]">AO VIVO no Mapa - Beira</div>
                  <div className="absolute top-1 right-2 text-[7px] px-2 py-0.5 bg-black text-white rounded-full">NACIONAL</div>
                </div>
              </div>

              <div className="space-y-2">
                {viagens.map(v=>(
                  <div key={v.id} className="bg-white rounded-[12px] border p-3 flex gap-3">
                    <div className="h-8 w-8 bg-[#f1f5f9] rounded grid place-items-center text-[8px] font-black">{v.empresa.substring(0,3).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-[11px]">{v.empresa}</span>
                        <span className="text-[6px] px-1.5 py-0.5 bg-[#e0f2fe] rounded-full border">{v.tipo} - {v.estrelas}</span>
                        <span className="text-[6px] px-1.5 py-0.5 bg-[#f1f5f9] rounded-full">{v.rota}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2 text-[7px] text-[#64748b]">
                        <div><div className="font-bold text-[6px]">MOTORISTA</div><div>{v.placa}</div></div>
                        <div><div className="font-bold text-[6px]">DURACAO</div><div>{v.dur}</div></div>
                        <div><div className="font-bold text-[6px]">ASSENTOS</div><div>{v.assentos}</div></div>
                        <div><div className="font-bold text-[6px]">PESO</div><div>{v.peso}</div></div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 h-6 bg-[#1e2f4a] text-white rounded-full text-[7px] font-black">Reservar lugar</button>
                        <span className="px-2 h-6 grid place-items-center border rounded-full text-[7px]">{v.tel}</span>
                        <span className="px-2 h-6 grid place-items-center bg-[#e0f2fe] rounded-full text-[7px]">Ver no mapa</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-[#0ea5e9] text-[12px]">{v.preco}</div>
                      <div className="text-[7px] text-[#94a3b8] mt-1">8 Assentos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab!=='viagens' && (
        <div className="max-w-[1200px] mx-auto p-6 text-center">
          <div className="bg-white rounded-[12px] border p-10">
            <h2 className="font-black text-[16px]">{tab.toUpperCase()} - Em desenvolvimento</h2>
            <p className="text-[10px] text-[#64748b] mt-2">Clique em VIAGENS para ver o prototipo com mapa</p>
            <button onClick={()=>setTab('viagens')} className="mt-4 px-6 h-10 bg-[#0ea5e9] text-white rounded-full font-black text-[11px]">IR PARA VIAGENS - PROTÓTIPO</button>
          </div>
        </div>
      )}
    </div>
  );
}
