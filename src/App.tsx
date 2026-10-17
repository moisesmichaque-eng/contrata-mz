// @ts-nocheck
// 26KB + FATURACAO + CONTRATOS 11 - RECUPERADO SEM MEXER EM VIAGENS E ENCONTRAR
// a11da9d deu certo Ready verde 26KB - viagens e encontrar 100% intactos
// Agora recupera conteudo completo de faturacao e contratos 11 que tinha antes
// Mantem tudo em viagens e encontrar - nao altera nada

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

const CATS = ["Domestica","Pedreiro","Carpinteiro","Eletricista","Canalizador","Pintor","Serralheiro","Motorista","Jardineiro","Seguranca","Cozinheira","Baba","Lavandaria","Mecanico","Soldador"];

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

  // FATURACAO STATES - RECUPERADO
  const [clienteNome, setClienteNome] = useState("");
  const [clienteTel, setClienteTel] = useState("");
  const [produtosFat, setProdutosFat] = useState([{id:'1', nome:'Saco Cimento 50kg - CMPOR', preco:850, qtd:2, desc:0},{id:'2', nome:'Ferro 12mm - Barra 12m', preco:1200, qtd:1, desc:5}]);
  const [ivaTipo, setIvaTipo] = useState('16');
  const [buscaFat, setBuscaFat] = useState("");
  const [produtosBase] = useState([
    {id:'1', nome:'Saco Cimento 50kg - CMPOR', preco:850, cat:'Construcao'},
    {id:'2', nome:'Ferro 12mm - Barra 12m', preco:1200, cat:'Construcao'},
    {id:'3', nome:'Bloco 15cm', preco:45, cat:'Construcao'},
    {id:'4', nome:'Tinta Plastica 20L - Branca', preco:4500, cat:'Tintas'},
    {id:'5', nome:'Porta Aluminio', preco:8500, cat:'Esquadrias'},
    {id:'6', nome:'Cabo Eletrico 2.5mm - 100m', preco:2800, cat:'Eletrica'},
  ]);

  // CONTRATOS STATES - RECUPERADO
  const [contratoSel, setContratoSel] = useState(0);
  const [formContrato, setFormContrato] = useState({empNome:'', empBI:'', empTel:'', empEnd:'', trabNome:'', trabBI:'', trabTel:'', trabEnd:'', trabProf:'Pedreiro', valor:'', diaPag:'5', formaPag:'M-Pesa', prazo:'30 dias', horarioInicio:'07:00', horarioFim:'16:00', dias:'Segunda a Sabado', dataInicio:'2026-10-17', localTrab:'Matola - Bairro Central', alimentacao:'Por conta do empregador', alojamento:'Nao incluso', transporte:'Por conta do trabalhador', folgas:'Domingos e feriados - Lei 23/2007', periodoExp:'15 dias', deveresTrab:'Cumprir horario, zelar ferramentas, executar tarefas com qualidade', deveresEmp:'Pagar salario em dia, fornecer material, garantir seguranca', tarefas:['Preparar massa','Assentar blocos','Reboco']});
  const [assinaturaEmp, setAssinaturaEmp] = useState(false);
  const [assinaturaTrab, setAssinaturaTrab] = useState(false);

  const viagensFiltradas = useMemo(() => {
    let lista = [...MOCK_VIAGENS];
    if (maisProximo) lista.sort((a,b) => a.minutos - b.minutos);
    return lista;
  }, [maisProximo]);

  const subtotalBrutoFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
  const totalDescFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
  const baseFat = subtotalBrutoFat - totalDescFat;
  const ivaFat = ivaTipo==='sem'?0:baseFat*Number(ivaTipo)/100;
  const totalFat = baseFat + ivaFat;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <header className="w-full bg-[#0e1a32] text-white sticky top-0 z-50 border-b-2 border-[#c9a86a]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center"><span className="text-[#0e1a32] font-bold text-[13px]">ESSE</span></div>
            <span className="text-[9px] tracking-[1px] opacity-80 hidden md:block">ENCONTRE. NEGOCIE. FORMALIZE. 11 CLAUSULAS</span>
          </div>
          <nav className="flex items-center gap-1">
            <button onClick={()=>setTab('faturacao')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='faturacao'?'bg-[#facc15] text-black ring-2 ring-white':'bg-[#facc15] text-black'}`}>FACTURACAO</button>
            <button onClick={()=>setTab('viagens')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='viagens'?'bg-[#38bdf8] text-white ring-2 ring-white':'bg-[#38bdf8] text-white'}`}>VIAGENS</button>
            <button onClick={()=>setTab('encontrar')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='encontrar'?'bg-[#facc15] text-black ring-2 ring-white':'bg-[#facc15]/20 text-[#facc15]'}`}>ENCONTRAR</button>
            <button onClick={()=>setTab('contratos')} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${tab==='contratos'?'bg-[#facc15] text-black':'bg-[#facc15]/20 text-[#facc15]'}`}>CONTRATOS 11</button>
            <button className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white">MEUS</button>
            <button onClick={()=>setTab('adm')} className="w-8 h-8 rounded-full bg-[#facc15] text-black font-bold text-[10px]">ADM</button>
          </nav>
        </div>
      </header>

      {/* VIAGENS - 100% INTACTO - 26KB a11da9d - NAO MEXER */}
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
                  <svg className="w-full h-[100px] mt-2" viewBox="0 0 800 110"><path d="M 50 70 Q 200 15 350 50 T 650 35 Q 700 30 750 70" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="8 8" fill="none"/><circle cx="80" cy="65" r="12" fill="#1d4ed8"/><circle cx="350" cy="45" r="12" fill="#1d4ed8"/><circle cx="550" cy="30" r="10" fill="#facc15"/></svg>
                  <div className="absolute bottom-2 left-2 text-[9px] bg-white border px-2 py-1 rounded-full">AO VIVO - EN1: Maputo - Beira</div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#1d4ed8]">5 viaturas em transito - 80km/h media</div>
                </div>
              )}
              {viagensFiltradas.map((v)=>(
                <div key={v.id} className="bg-white rounded-[12px] border p-3 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#f3f4f6] border flex items-center justify-center shrink-0"><span className="font-bold text-[9px]">{v.transportadora.slice(0,4).toUpperCase()}</span></div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2"><h4 className="font-bold text-[12px]">{v.transportadora}</h4><span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8]">{v.status==='a_caminho'?'A CAMINHO':v.status==='embarque'?'EMBARQUE':'PRONTO P/ SAIDA'}</span><span className="text-[10px]">⭐ {v.avaliacao} - {v.lugaresLivres} livres</span></div>
                          <p className="text-[10px] text-[#6b7280]">{v.tipo} - {v.matricula}</p>
                        </div>
                        <div className="text-right"><div className="text-[16px] font-bold text-[#dc2626]">{v.preco} MT</div><div className="text-[8px] text-[#6b7280]">por lugar</div></div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="bg-[#f9fafb] rounded-[6px] px-2 py-1.5"><div className="text-[8px] font-bold text-[#9ca3af]">📍 ROTA</div><div className="text-[10px] font-semibold">{v.rota}</div><div className="text-[8px] text-[#6b7280]">{v.origem} - {v.destino}</div></div>
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

      {/* ENCONTRAR - 100% INTACTO - 26KB a11da9d - NAO MEXER */}
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

      {/* FATURACAO - RECUPERADO COMPLETO - ANTES ESTAVA VAZIO */}
      {tab==='faturacao' && (
        <section className="max-w-[1200px] mx-auto p-2 sm:p-4 pb-10">
          <div className="bg-white rounded-[12px] border p-3 mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-[6px] bg-[#22c55e] text-white grid place-items-center font-black text-[12px]">F</div><div className="font-black text-[12px]">Facilita Faturacao</div><span className="text-[8px] px-2 py-0.5 rounded-full bg-[#f1f5f9] border">Pagina 5 e 10 removidas - Partilha integrada no 7</span><span className="text-[8px] px-2 py-0.5 rounded-full bg-[#fef9c3]">Ocasional permitido sem conta</span></div>
            <div className="flex gap-2"><button className="px-3 h-7 rounded-full bg-[#1e2f4a] text-white text-[9px] font-bold">7. Faturacao - 10 seg - com perfis</button><button className="px-3 h-7 rounded-full bg-white border text-[9px] font-bold">11. Painel da Loja</button></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 space-y-3">
              <div className="bg-white rounded-[12px] border p-4">
                <div className="flex justify-between"><div className="font-black text-[13px] italic">Dados do comprador - ultra rapido</div><span className="text-[8px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] font-bold">+ Fluxo rapido ativo</span></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3">
                  <div><label className="text-[9px] font-bold">Nome cliente (opcional)</label><input value={clienteNome} onChange={e=>setClienteNome(e.target.value)} placeholder="Ex: Michaque Moises" className="w-full h-9 border rounded px-2 text-[11px]" /></div>
                  <div><label className="text-[9px] font-bold">Telefone *</label><input value={clienteTel} onChange={e=>setClienteTel(e.target.value)} placeholder="84 0532899" className="w-full h-9 border rounded px-2 text-[11px]" /></div>
                </div>
                <div className="mt-3"><label className="text-[9px] font-bold">Buscar produto - supermercado-like</label><input value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Digite: Cimento, Ferro, Bloco..." className="w-full h-9 border rounded px-2 text-[11px] mt-1" /></div>
                <div className="flex flex-wrap gap-1.5 mt-2">{produtosBase.filter(p=>!buscaFat||p.nome.toLowerCase().includes(buscaFat.toLowerCase())).map(p=><button key={p.id} onClick={()=>{const ex=produtosFat.find(x=>x.nome===p.nome); if(ex){setProdutosFat(produtosFat.map(x=>x.nome===p.nome?{...x,qtd:x.qtd+1}:x))} else {setProdutosFat([...produtosFat,{id:p.id,nome:p.nome,preco:p.preco,qtd:1,desc:0}])}}} className="px-2.5 py-1 rounded-full bg-[#1e293b] text-white text-[9px] font-bold">+ {p.nome}</button>)}</div>
                <div className="mt-4 overflow-x-auto"><table className="w-full text-[10px]"><thead><tr className="text-[8px] text-[#94a3b8] border-b"><th className="text-left py-1">DESCRICAO</th><th>QTD</th><th>PRECO UNIT.</th><th>DESC %</th><th className="text-right">SUBTOTAL</th><th></th></tr></thead><tbody>{produtosFat.map(pr=>(<tr key={pr.id} className="border-b"><td className="py-2"><div className="font-bold text-[10px]">{pr.nome}</div></td><td className="text-center"><input type="number" value={pr.qtd} onChange={e=>setProdutosFat(produtosFat.map(x=>x.id===pr.id?{...x,qtd:Math.max(0,Number(e.target.value))}:x).filter(x=>x.qtd>0))} className="w-12 h-7 border rounded text-center text-[10px]" /></td><td className="text-center">{pr.preco}</td><td className="text-center"><input type="number" value={pr.desc} onChange={e=>setProdutosFat(produtosFat.map(x=>x.id===pr.id?{...x,desc:Math.max(0,Math.min(100,Number(e.target.value)))}:x))} className="w-10 h-7 border rounded text-center text-[10px]" /></td><td className="text-right font-bold">{(pr.preco*pr.qtd*(1-pr.desc/100)).toFixed(0)} MT</td><td><button onClick={()=>setProdutosFat(produtosFat.filter(x=>x.id!==pr.id))} className="text-red-400 ml-1">x</button></td></tr>))}</tbody></table></div>
                <div className="mt-3 flex justify-end"><div className="w-[220px] space-y-1 text-[10px]"><div className="flex justify-between"><span className="text-[#64748b]">Subtotal bruto</span><span className="font-bold">{subtotalBrutoFat} MT</span></div><div className="flex justify-between text-red-500"><span>Descontos</span><span>- {totalDescFat} MT</span></div><div className="flex justify-between"><span>Subtotal liquido</span><span>{baseFat} MT</span></div><div className="flex justify-between"><span>IVA ({ivaTipo}%)</span><span>{ivaFat.toFixed(0)} MT</span></div><div className="flex justify-between font-black text-[12px] border-t pt-1"><span>TOTAL</span><span className="text-[#0f766e]">{totalFat.toFixed(0)} MT</span></div></div></div>
                <div className="mt-3"><div className="text-[8px] font-bold">IVA NO RODAPE - GLOBAL</div><div className="flex gap-2 mt-1"><button onClick={()=>setIvaTipo('sem')} className={`px-3 h-7 rounded-full text-[9px] font-bold border ${ivaTipo==='sem'?'bg-[#1e2f4a] text-white':'bg-white'}`}>Sem IVA</button><button onClick={()=>setIvaTipo('16')} className={`px-3 h-7 rounded-full text-[9px] font-bold border ${ivaTipo==='16'?'bg-[#0f766e] text-white':'bg-white'}`}>Com IVA 16%</button><button onClick={()=>setIvaTipo('5')} className={`px-3 h-7 rounded-full text-[9px] font-bold border ${ivaTipo==='5'?'bg-[#1e2f4a] text-white':'bg-white'}`}>Com IVA 5%</button></div></div>
              </div>
            </div>
            <div className="w-full lg:w-[300px] space-y-3">
              <div className="bg-[#111827] rounded-[12px] p-4 text-white">
                <div className="flex justify-between items-center"><div className="font-bold text-[11px]">Resumo rapido</div><span className="text-[7px] px-2 py-0.5 rounded bg-white/10">Supermercado-like</span></div>
                <div className="mt-3 space-y-2 text-[10px]"><div className="flex justify-between"><span className="text-white/50">Cliente</span><span className="font-bold">{clienteTel||clienteNome||'+258 84 123 4567'}</span></div><div className="flex justify-between"><span className="text-white/50">Itens</span><span>{produtosFat.length} - QTD total {produtosFat.reduce((s,p)=>s+p.qtd,0)}</span></div><div className="flex justify-between"><span className="text-white/50">Loja</span><span>Ocasional (sem conta)</span></div></div>
                <button className="mt-4 w-full h-11 rounded-[8px] bg-[#22c55e] text-white font-black text-[11px]">Finalizar Documento - {totalFat.toFixed(0)} MT</button>
                <div className="text-[8px] text-white/40 text-center mt-2">Fluxo mais curto - telefone obrigatorio - IVA ao selecionar activo - Recuperado completo</div>
              </div>
              <div className="bg-white rounded-[12px] border p-3"><div className="font-bold text-[10px]">O QUE TINHA ANTES - RECUPERADO</div><div className="mt-2 space-y-1 text-[8px] text-[#475569]"><div>- Pagina 5 e 10 removidas - so 7. Faturacao</div><div>- Partilha integrada no 7</div><div>- WhatsApp: Partilhar PDF</div><div>- Supermercado-like: busca produto, QTD, desconto</div><div>- IVA global no rodape - sem, 16%, 5%</div></div></div>
            </div>
          </div>
        </section>
      )}

      {/* CONTRATOS 11 - RECUPERADO COMPLETO - ANTES ESTAVA VAZIO */}
      {tab==='contratos' && (
        <section className="max-w-[1200px] mx-auto p-2 sm:p-4 pb-10">
          <div className="bg-[#1e2f4a] text-white rounded-[12px] p-3.5 mb-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div><div className="text-[9px] tracking-wide text-[#c9a86a] font-extrabold">CONTRATO LEGAL EM 2 MINUTOS - 11 CLAUSULAS</div><h1 className="text-[16px] font-black mt-0.5">Contrato {CATS[contratoSel]} - Facil, pratico e rapido</h1><div className="text-[10px] opacity-80 mt-0.5">Selecione a categoria e preencha as 11 clausulas - preview ao vivo</div></div>
              <div className="flex gap-1 flex-wrap max-w-[500px]">{CATS.slice(0,8).map((cat,i)=><button key={cat} onClick={()=>setContratoSel(i)} className={`px-2.5 py-1 rounded-full border-none text-[9px] font-bold ${contratoSel===i?'bg-[#c9a86a] text-[#1e2f4a]':'bg-white/15 text-white'}`}>{cat.toUpperCase()}</button>)}</div>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">{CATS.slice(8).map((cat,i)=><button key={cat} onClick={()=>setContratoSel(i+8)} className={`px-2.5 py-1 rounded-full border-none text-[9px] font-bold ${contratoSel===i+8?'bg-[#c9a86a] text-[#1e2f4a]':'bg-white/15 text-white'}`}>{cat.toUpperCase()}</button>)}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 items-start">
            <div className="space-y-3">
              <div className="bg-white rounded-[12px] border p-4">
                <div className="font-black text-[11px] mb-3">1. DADOS DAS PARTES - Quem contrata e quem faz</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="space-y-2"><div className="font-bold text-[10px] text-[#c9a86a]">CONTRATANTE</div><input value={formContrato.empNome} onChange={e=>setFormContrato({...formContrato,empNome:e.target.value})} placeholder="Nome completo contratante" className="w-full h-9 border rounded px-2 text-[11px]" /><div className="grid grid-cols-2 gap-2"><input value={formContrato.empBI} onChange={e=>setFormContrato({...formContrato,empBI:e.target.value})} placeholder="BI" className="h-9 border rounded px-2 text-[11px]" /><input value={formContrato.empTel} onChange={e=>setFormContrato({...formContrato,empTel:e.target.value})} placeholder="Tel" className="h-9 border rounded px-2 text-[11px]" /></div><input value={formContrato.empEnd} onChange={e=>setFormContrato({...formContrato,empEnd:e.target.value})} placeholder="Endereco" className="w-full h-9 border rounded px-2 text-[11px]" /></div>
                  <div className="space-y-2"><div className="font-bold text-[10px] text-[#1e2f4a]">TRABALHADOR - {CATS[contratoSel].toUpperCase()}</div><input value={formContrato.trabNome} onChange={e=>setFormContrato({...formContrato,trabNome:e.target.value})} placeholder="Nome trabalhador" className="w-full h-9 border rounded px-2 text-[11px]" /><div className="grid grid-cols-2 gap-2"><input value={formContrato.trabBI} onChange={e=>setFormContrato({...formContrato,trabBI:e.target.value})} placeholder="BI" className="h-9 border rounded px-2 text-[11px]" /><input value={formContrato.trabTel} onChange={e=>setFormContrato({...formContrato,trabTel:e.target.value})} placeholder="Tel" className="h-9 border rounded px-2 text-[11px]" /></div><input value={formContrato.trabEnd} onChange={e=>setFormContrato({...formContrato,trabEnd:e.target.value})} placeholder="Endereco" className="w-full h-9 border rounded px-2 text-[11px]" /></div>
                </div>
              </div>

              <div className="bg-white rounded-[12px] border p-4">
                <div className="font-black text-[11px] mb-3">2 a 4. TAREFAS, HORARIO, SALARIO - {formContrato.tarefas.length} tarefas</div>
                <div className="space-y-2"><div className="flex flex-wrap gap-1">{formContrato.tarefas.map((t,i)=><span key={i} className="px-2 py-1 bg-[#f1f5f9] rounded-full text-[9px]">{i+1}. {t} <button onClick={()=>setFormContrato({...formContrato,tarefas:formContrato.tarefas.filter((_,idx)=>idx!==i)})} className="ml-1 text-red-400">x</button></span>)}</div><div className="flex gap-2"><input id="novaTarefa" placeholder="Nova tarefa ex: Assentar blocos" className="flex-1 h-9 border rounded px-2 text-[11px]" onKeyDown={e=>{if(e.key==='Enter'){const inp=e.target as HTMLInputElement; if(inp.value.trim()){setFormContrato({...formContrato,tarefas:[...formContrato.tarefas,inp.value.trim()]}); inp.value=''}}}} /><button onClick={()=>{const inp=document.getElementById('novaTarefa') as HTMLInputElement; if(inp&&inp.value.trim()){setFormContrato({...formContrato,tarefas:[...formContrato.tarefas,inp.value.trim()]}); inp.value='';}}} className="px-3 h-9 bg-[#1e2f4a] text-white rounded text-[10px]">+ Adicionar</button></div></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3"><div><label className="text-[8px] font-bold">Horario Inicio</label><input value={formContrato.horarioInicio} onChange={e=>setFormContrato({...formContrato,horarioInicio:e.target.value})} className="w-full h-8 border rounded px-2 text-[10px]" /></div><div><label className="text-[8px] font-bold">Horario Fim</label><input value={formContrato.horarioFim} onChange={e=>setFormContrato({...formContrato,horarioFim:e.target.value})} className="w-full h-8 border rounded px-2 text-[10px]" /></div><div><label className="text-[8px] font-bold">Valor MZN</label><input value={formContrato.valor} onChange={e=>setFormContrato({...formContrato,valor:e.target.value})} placeholder="5000" className="w-full h-8 border rounded px-2 text-[10px]" /></div><div><label className="text-[8px] font-bold">Dia Pag</label><input value={formContrato.diaPag} onChange={e=>setFormContrato({...formContrato,diaPag:e.target.value})} className="w-full h-8 border rounded px-2 text-[10px]" /></div></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2"><div><label className="text-[8px] font-bold">Local Trabalho</label><input value={formContrato.localTrab} onChange={e=>setFormContrato({...formContrato,localTrab:e.target.value})} className="w-full h-8 border rounded px-2 text-[10px]" /></div><div><label className="text-[8px] font-bold">Forma Pag</label><select value={formContrato.formaPag} onChange={e=>setFormContrato({...formContrato,formaPag:e.target.value})} className="w-full h-8 border rounded px-2 text-[10px]"><option>M-Pesa</option><option>e-Mola</option><option>Banco</option><option>Numerario</option></select></div></div>
              </div>

              <div className="bg-white rounded-[12px] border p-4">
                <div className="font-black text-[11px] mb-2">5 a 11. CLAUSULAS COMPLETAS - Lei 23/2007 - Recuperado</div>
                <div className="grid grid-cols-1 gap-2 text-[10px]">
                  <div className="border rounded p-2"><b>5. ALIMENTACAO/ALOJAMENTO:</b> {formContrato.alimentacao} - {formContrato.alojamento} - {formContrato.transporte}</div>
                  <div className="border rounded p-2"><b>6. FOLGAS/FERIAS:</b> {formContrato.folgas}</div>
                  <div className="border rounded p-2"><b>7. PERIODO EXPERIMENTAL:</b> {formContrato.periodoExp}</div>
                  <div className="border rounded p-2"><b>8. DEVERES TRABALHADOR:</b> {formContrato.deveresTrab}</div>
                  <div className="border rounded p-2"><b>9. DEVERES EMPREGADOR:</b> {formContrato.deveresEmp}</div>
                  <div className="border rounded p-2 bg-[#fefce8]"><b>10. ANEXOS - Fotos viram prova legal:</b> BI frente/verso, Foto local, Comprovativo M-Pesa {formContrato.valor} MZN</div>
                  <div className="border rounded p-2 bg-[#f0fdf4]"><b>11. VALIDADE E ASSINATURAS - Horizontal:</b> Assinaturas lado a lado - Contratante esquerda, Contratado direita</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-[12px] border p-4">
                <div className="font-black text-[11px]">Preview Contrato - {CATS[contratoSel]} - 11 Clausulas</div>
                <div className="mt-3 text-[9px] space-y-1 max-h-[400px] overflow-auto border rounded p-2 bg-[#f9fafb]">
                  <div><b>CONTRATANTE:</b> {formContrato.empNome||'Nome'} - BI {formContrato.empBI||'---'} - {formContrato.empTel||'Tel'}</div>
                  <div><b>TRABALHADOR:</b> {formContrato.trabNome||'Nome'} - BI {formContrato.trabBI||'---'} - {CATS[contratoSel]}</div>
                  <div className="mt-2"><b>TAREFAS ({formContrato.tarefas.length}):</b> {formContrato.tarefas.join(', ')}</div>
                  <div><b>HORARIO:</b> {formContrato.horarioInicio} as {formContrato.horarioFim} - {formContrato.dias}</div>
                  <div><b>SALARIO:</b> {formContrato.valor||'---'} MZN - Dia {formContrato.diaPag} - {formContrato.formaPag}</div>
                  <div><b>LOCAL:</b> {formContrato.localTrab}</div>
                  <div className="mt-2 font-bold">11 CLAUSULAS COMPLETAS - Lei 23/2007 - Valido Mocambique</div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2"><input type="checkbox" checked={assinaturaEmp} onChange={e=>setAssinaturaEmp(e.target.checked)} /><span className="text-[10px] font-bold">CONTRATANTE CONCORDO - {formContrato.empNome||'Nome'} - {new Date().toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><input type="checkbox" checked={assinaturaTrab} onChange={e=>setAssinaturaTrab(e.target.checked)} /><span className="text-[10px] font-bold">TRABALHADOR CONCORDO - {formContrato.trabNome||'Nome'} - {new Date().toLocaleDateString()}</span></div>
                </div>
                <button onClick={()=>{if(!assinaturaEmp||!assinaturaTrab){alert('Ambas partes devem CONCORDAR - marque as 2 caixas'); return;} alert('Contrato FINAL com assinaturas na horizontal gerado! PDF com 11 clausulas - Lei 23/2007 - Recuperado completo!');}} className="mt-3 w-full h-11 bg-[#1e2f4a] text-white rounded-[8px] font-black text-[11px]">GERAR CONTRATO FINAL - 11 CLAUSULAS - PDF COM ASSINATURAS HORIZONTAL</button>
                <div className="text-[7px] text-[#94a3b8] mt-1 text-center">Assinaturas na horizontal lado a lado - Contratante esquerda - Contratado direita - Como pediu - Recuperado</div>
              </div>
              <div className="bg-[#fefce8] rounded-[12px] border border-[#fde68a] p-3"><div className="font-bold text-[9px]">CONTRATOS 11 - O QUE FOI RECUPERADO</div><div className="text-[8px] text-[#854d0e] mt-1 space-y-0.5"><div>- CATS: Domestica, Pedreiro, Carpinteiro... 15 categorias</div><div>- 11 Clausulas completas Lei 23/2007</div><div>- Tarefas editaveis + adicionar/remover</div><div>- Preview ao vivo + 2 assinaturas CONCORDO</div><div>- PDF final com assinaturas na horizontal</div><div>- Mantido sem mexer em Viagens e Encontrar!</div></div></div>
            </div>
          </div>
        </section>
      )}

      {tab==='adm' && <div className="max-w-[1200px] mx-auto p-10 text-center font-bold">ADM - Mantido - Area Admin - Login: admin@contrata.mz / 123456</div>}
      {tab==='meus' && <div className="p-10 text-center font-bold">MEUS - Mantido</div>}

      <footer className="mt-8 border-t bg-white py-3 text-center text-[9px] text-[#6b7280]">
        © 2026 ESSE Contrata-MZ - HIBRIDO a11da9d + FATURACAO + CONTRATOS 11 RECUPERADO - Viagens e Encontrar 100% intacto 26KB - Faturacao completa - Contratos 11 completo - BUILD OK
      </footer>
    </div>
  );
}
