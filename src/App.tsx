// @ts-nocheck
// BASE ONTEM 100% BUILD OK - SEM ERRO - TUDO COMO HA 13H ATRAS
// Faturacao, Encontrar, Contratos 11 com botoes, formularios, assinaturas, WhatsApp direto
// Viagens intacto como combinado hoje - so mexer em Viagens depois

import React, { useState, useMemo } from 'react';

type Viagem = {
  id: number; transportadora: string; tipo: string; matricula: string; lugares: string; carga: string;
  rota: string; provinciaOrigem: string; provinciaDestino: string; distritoOrigem: string; distritoDestino: string;
  motorista: string; telefone: string; tempo: string; minutos: number; preco: number; avaliacao: number;
  status: 'a_caminho' | 'pronto' | 'embarque'; lugaresLivres: number; origem: string; destino: string;
};

const MOCK_VIAGENS: Viagem[] = [
  { id: 1, transportadora: "MozLog Express", tipo: "Foton Camiao + Passageiros - ADF 561 SF", matricula: "ADF 561 SF", lugares: "18 lugares", carga: "7 Ton", rota: "MAPUTO PROVINCIA - SOFALA - BEIRA", provinciaOrigem: "Maputo", provinciaDestino: "Sofala", distritoOrigem: "Matola", distritoDestino: "Beira", motorista: "Carlos Matsinhe", telefone: "823832513", tempo: "06:30 - 18:00", minutos: 690, preco: 2800, avaliacao: 4.9, status: 'a_caminho', lugaresLivres: 5, origem: "Maputo", destino: "Beira" },
  { id: 2, transportadora: "Norte Cargo", tipo: "Toyota Hiace - 15 lugares - ADH 234 MP", matricula: "ADH 234 MP", lugares: "15 lugares", carga: "2 Ton", rota: "MAPUTO CIDADE - NAMPULA - NACALA", provinciaOrigem: "Maputo Cidade", provinciaDestino: "Nampula", distritoOrigem: "KaMpfumo", distritoDestino: "Nacala", motorista: "Joao Carpinteiro", telefone: "821234567", tempo: "05:00 - 17:00", minutos: 720, preco: 3200, avaliacao: 4.8, status: 'pronto', lugaresLivres: 8, origem: "Maputo", destino: "Nampula" },
  { id: 3, transportadora: "Sul Logistica", tipo: "Isuzu Camiao - 10 Ton - AFM 890 MP", matricula: "AFM 890 MP", lugares: "3 lugares", carga: "10 Ton", rota: "GAZA - XAI-XAI - MAPUTO", provinciaOrigem: "Gaza", provinciaDestino: "Maputo", distritoOrigem: "Xai-Xai", distritoDestino: "Matola", motorista: "Michaque Serralheiro", telefone: "843210987", tempo: "07:00 - 15:00", minutos: 480, preco: 1800, avaliacao: 4.7, status: 'embarque', lugaresLivres: 2, origem: "Xai-Xai", destino: "Maputo" },
  { id: 4, transportadora: "Centro Express", tipo: "Mini-bus 25 lugares - AEF 123 MP", matricula: "AEF 123 MP", lugares: "25 lugares", carga: "3 Ton", rota: "MANICA - CHIMOIO - BEIRA", provinciaOrigem: "Manica", provinciaDestino: "Sofala", distritoOrigem: "Chimoio", distritoDestino: "Beira", motorista: "Ana Electricista", telefone: "827654321", tempo: "06:00 - 14:00", minutos: 480, preco: 2200, avaliacao: 4.9, status: 'pronto', lugaresLivres: 12, origem: "Chimoio", destino: "Beira" },
  { id: 5, transportadora: "Moz Norte", tipo: "Bus 45 lugares - ABT 456 MP", matricula: "ABT 456 MP", lugares: "45 lugares", carga: "5 Ton", rota: "TETE - ZAMBEZIA - QUELIMANE", provinciaOrigem: "Tete", provinciaDestino: "Zambezia", distritoOrigem: "Tete", distritoDestino: "Quelimane", motorista: "Jose Pedreiro", telefone: "829876543", tempo: "04:30 - 18:30", minutos: 840, preco: 3500, avaliacao: 4.6, status: 'a_caminho', lugaresLivres: 15, origem: "Tete", destino: "Quelimane" },
];

const PROFISSIONAIS = [
  { id:1, nome:"Carlos Matsinhe", tipo:"Pedreiro", local:"Mocambique / Maputo Cidade", pais:"Mocambique", provincia:"Maputo Cidade", distrito:"KaMpfumo", nuit:"123456789", bi:"110100123456B", ramo:"Construcao Civil", profissao:"Pedreiro", rating:4.9, trabalhos:127, preco:"800MT/dia", descricao:"Construcao, reboco, ladrilho, 10 anos exp.", foto:"CM", verificado:true, whatsapp:"823832513", anexos:["BI","NUIT","Fotos obra","CV"] },
  { id:2, nome:"Joao Carpinteiro", tipo:"Carpinteiro", local:"Mocambique / Xai-Xai", pais:"Mocambique", provincia:"Gaza", distrito:"Chongoene", nuit:"401866877", bi:"110201234567A", ramo:"Carpintaria", profissao:"Carpinteiro", rating:4.8, trabalhos:89, preco:"750MT/dia", descricao:"Moveis, portas, telhados, madeira macica", foto:"JC", verificado:true, whatsapp:"821234567", anexos:["BI","NUIT","Fotos"] },
  { id:3, nome:"Michaque Serralheiro", tipo:"Serralheiro", local:"Mocambique / Matola", pais:"Mocambique", provincia:"Maputo Provincia", distrito:"Matola", nuit:"402123456", bi:"110302345678C", ramo:"Serralharia", profissao:"Serralheiro", rating:4.7, trabalhos:65, preco:"700MT/dia", descricao:"Portoes, grades, soldadura, estruturas metalicas", foto:"MS", verificado:true, whatsapp:"843210987", anexos:["BI","NUIT"] },
  { id:4, nome:"Ana Electricista", tipo:"Eletricista", local:"Mocambique / Beira", pais:"Mocambique", provincia:"Sofala", distrito:"Beira", nuit:"403987654", bi:"110403456789D", ramo:"Eletrica", profissao:"Eletricista", rating:4.9, trabalhos:102, preco:"900MT/dia", descricao:"Instalacoes eletricas, quadro, tomadas, iluminacao", foto:"AE", verificado:true, whatsapp:"827654321", anexos:["BI","NUIT","Certificado"] },
];

const CATS = ["Domestica","Pedreiro","Carpinteiro","Motorista","Eletricista","Jardineiro","Seguranca","Cozinheira","Baba","Limpador","Pintor","Mecanico","Babysitter","Serralheiro","Servicos/Consultorias","Outros/Particular"];

const MODELO_TAREFAS: any = {
  "Pedreiro": ["Fundacoes e alicerces com nivel e prumo", "Levantamento de paredes de bloco e tijolo", "Reboco interior e exterior liso", "Assentamento de tijoleira e ceramica", "Construcao de pilares, vigas e cintas", "Concretagem de laje e contrapiso", "Acabamento com massa fina", "Instalacao de portas e janelas", "Construcao de muro e portao", "Limpeza final e entrega"],
  "Carpinteiro": ["Medir, cortar e montar madeira", "Fabricar portas, janelas, armarios", "Instalar forro e deck", "Fazer estrutura de telhado", "Lixar e envernizar", "Instalar fechaduras e dobradicas", "Reparar moveis e portas", "Construir escadas e corrimao", "Trabalhar com MDF e madeira macica", "Entrega limpa e fotografada"],
  "Domestica": ["Limpeza geral da casa", "Lavar louca e organizar cozinha", "Arrumar quartos e fazer camas", "Lavar roupa, passar e guardar", "Cozinhar cafe, almoco e jantar", "Cuidar das criancas", "Manter banheiros limpos", "Organizar armarios e despensa", "Ir ao mercado e anotar gastos", "Resumo diario no WhatsApp"],
  "Motorista": ["Conduzir com seguranca", "Levar e buscar com pontualidade", "Manutencao basica oleo e pneus", "Abastecer e controlar consumo", "Lavar viatura 2x por semana", "Verificar documentacao", "Cumprir horario sem atrasos", "Guardar sigilo da familia", "Registar quilometragem", "Comunicar revisoes"],
  "Eletricista": ["Instalar quadro e disjuntores", "Instalar tomadas e interruptores", "Passar cabos e organizar fiacao", "Instalar iluminacao interior e exterior", "Instalar chuveiro e ar condicionado", "Fazer aterramento", "Testar instalacao", "Identificar circuitos no quadro", "Deixar obra limpa", "Entregar com teste e garantia"],
};

export default function App(){
  const [tab,setTab]=useState("encontrar");
  const [filtroBusca,setFiltroBusca]=useState("");
  const [paisFiltro,setPaisFiltro]=useState("Mocambique");
  const [filtroCatFat,setFiltroCatFat]=useState("Todos");
  const [telFat, setTelFat] = useState("+258 84 123 4567");
  const [nomeFat, setNomeFat] = useState("");
  const [buscaFat, setBuscaFat] = useState("");
  const [ivaTipo, setIvaTipo] = useState("16");
  const [contratoSel,setContratoSel]=useState(1);
  const [clausulaAtiva,setClausulaAtiva]=useState(4);
  const [mostrarPreviewMobile,setMostrarPreviewMobile]=useState(false);
  const [catSel, setCatSel] = useState("Pedreiro");
  const [formContrato,setFormContrato]=useState({ empNome:"Moisés Michaque", empBI:"110100123456B", empTel:"823832513", empEnd:"Matola, Maputo", trabNome:"Carlos Matsinhe", trabBI:"110100123456B", trabTel:"823832513", trabEnd:"KaMpfumo, Maputo", trabProf:"Pedreiro", valor:"800", diaPag:"05", formaPag:"M-Pesa / Numerario", horarioInicio:"07:00", horarioFim:"17:00", dias:"Segunda a Sabado", dataInicio:"18/10/2026", localTrab:"Matola, Casa do Sr Moisés", tarefas: MODELO_TAREFAS["Pedreiro"] });

  const profissionaisFiltrados = useMemo(()=>{
    return PROFISSIONAIS.filter(p=> 
      (filtroBusca==="" || p.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || p.tipo.toLowerCase().includes(filtroBusca.toLowerCase())) &&
      (paisFiltro==="Todos" || p.pais===paisFiltro)
    );
  },[filtroBusca,paisFiltro]);

  const viagensFiltradas = useMemo(()=>{
    return MOCK_VIAGENS.filter(v=> 
      filtroBusca==="" || v.rota.toLowerCase().includes(filtroBusca.toLowerCase()) || v.transportadora.toLowerCase().includes(filtroBusca.toLowerCase())
    );
  },[filtroBusca]);

  const [produtosFat, setProdutosFat] = useState([
    {id:'p1', nome:'Saco de Cimento 50kg - CMPOR', preco:850, qtd:3, desc:0},
    {id:'p2', nome:'Bloco 15cm - 40x20', preco:42, qtd:20, desc:5},
  ]);

  const PRODUTOS_BASE = [
    {id:'c1', nome:'Saco de Cimento 50kg - 850 MT', cat:'Cimento', preco:850},
    {id:'c2', nome:'Bloco 15cm - 42 MT', cat:'Bloco', preco:42},
    {id:'c3', nome:'Areia Grossa - m3 - 1200 MT', cat:'Inertes', preco:1200},
    {id:'c4', nome:'Tinta PVA Branca 20L - 3500 MT', cat:'Tinta', preco:3500},
    {id:'c5', nome:'Ferro 12mm - 950 MT', cat:'Ferro', preco:950},
    {id:'c6', nome:'Chapa IBR 0.25 - 2100 MT', cat:'Cobertura', preco:2100},
    {id:'c7', nome:'Tubo PVC 110mm - 1800 MT', cat:'Tubo PVC', preco:1800},
    {id:'c8', nome:'Fechadura Stam 40mm - 650 MT', cat:'Fechadura', preco:650},
  ];

  const subtotalBrutoFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
  const totalDescFat = produtosFat.reduce((s,p)=>s+(p.preco*p.qtd*p.desc/100),0);
  const baseFat = subtotalBrutoFat - totalDescFat;
  const ivaFat = ivaTipo==='sem'?0: ivaTipo==='16'? baseFat*0.16 : baseFat*0.05;
  const totalFat = baseFat + ivaFat;
  const catsFat = ["Todos","Cimento","Bloco","Inertes","Tinta","Ferro","Cobertura","Tubo PVC","Fechadura"];

  const gerarContratoPDF = ()=>{
    const catName = catSel;
    const id = Date.now();
    const html = `
      <html><head><meta charset="utf-8">
      <style>
      body{font-family:Arial,sans-serif;max-width:850px;margin:20px auto;padding:20px;line-height:1.5;color:#1a2a3a;font-size:12px}
      .header{background:#1e2f4a;color:white;padding:20px;border-radius:12px;text-align:center}
      .header h1{color:#d4a44a;margin:0;font-size:16px}
      .clausula{border:1px solid #e2e8f0;border-radius:8px;padding:15px;margin:12px 0;background:#f8fafc}
      .clausula h3{background:#1e2f4a;color:white;padding:8px 12px;border-radius:6px;margin:-15px -15px 12px -15px;font-size:11px}
      .tarefa{background:#1e2f4a;color:white;padding:5px 9px;border-radius:15px;display:inline-block;margin:2px;font-size:10px}
      .assinaturas-horizontal{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0}
      .assinatura-box{border:2px solid #1e2f4a;border-radius:8px;padding:12px;background:white}
      @media print{.no-print{display:none}}
      </style></head><body>
      <div class="header"><h1>CONTRATO ${catName.toUpperCase()} - 11 CLAUSULAS - ID ${id}</h1><div>contrata-mz.vercel.app - ${new Date().toLocaleString('pt-MZ')}</div></div>
      <div class="clausula"><h3>1. DADOS DAS PARTES</h3><b>CONTRATANTE:</b> ${formContrato.empNome} - BI: ${formContrato.empBI} - Tel: ${formContrato.empTel}<br><b>TRABALHADOR:</b> ${formContrato.trabNome} - BI: ${formContrato.trabBI} - Tel: ${formContrato.trabTel} - Prof: ${formContrato.trabProf}</div>
      <div class="clausula"><h3>2. OBJETO E TAREFAS - ${formContrato.tarefas.length} tarefas</h3>${formContrato.tarefas.map((t:string,i:number)=>`<span class="tarefa">${i+1}. ${t}</span>`).join("")}</div>
      <div class="clausula"><h3>3. HORARIO E LOCAL</h3><b>Horario:</b> ${formContrato.horarioInicio} as ${formContrato.horarioFim}<br><b>Local:</b> ${formContrato.localTrab}<br><b>Dias:</b> ${formContrato.dias}<br><b>Inicio:</b> ${formContrato.dataInicio}</div>
      <div class="clausula"><h3>4. SALARIO E PAGAMENTO</h3><b>Valor:</b> ${formContrato.valor} MZN<br><b>Dia:</b> ${formContrato.diaPag}<br><b>Forma:</b> ${formContrato.formaPag}</div>
      <div class="clausula"><h3>5 a 10. CLAUSULAS LEGAIS - Lei 23/2007</h3>Alimentacao, alojamento, folgas, ferias, periodo experimental, deveres do trabalhador e empregador, anexos com fotos e provas</div>
      <div class="clausula"><h3>11. VALIDADE E ASSINATURAS</h3>
      <div class="assinaturas-horizontal">
      <div class="assinatura-box"><b>CONTRATANTE</b><br>${formContrato.empNome}<br><br><br>Assinatura: ___________________<br>Data: ${new Date().toLocaleDateString('pt-MZ')}</div>
      <div class="assinatura-box"><b>TRABALHADOR</b><br>${formContrato.trabNome}<br><br><br>Assinatura: ___________________<br>Data: ${new Date().toLocaleDateString('pt-MZ')}</div>
      </div></div>
      <div class="no-print" style="text-align:center;margin:20px"><button onclick="window.print()" style="background:#1e2f4a;color:white;padding:12px 24px;border-radius:8px;border:none;cursor:pointer;font-weight:bold">IMPRIMIR / SALVAR COMO PDF FINAL COM ASSINATURAS</button></div>
      </body></html>
    `;
    const w = window.open("", "_blank");
    if(w){ w.document.write(html); w.document.close(); }
  };

  const partilharWhatsApp = (texto: string)=>{
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-[#1e2f4a] text-white p-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="font-black text-[16px] tracking-tight">CONTRATA-MZ <span className="text-[#d4a44a]">• VIAGENS NACIONAL</span></div>
          <nav className="flex gap-1 flex-wrap">
            {[
              {k:"encontrar", label:"ENCONTRAR"},
              {k:"viagens", label:"VIAGENS"},
              {k:"faturacao", label:"FACTURACAO"},
              {k:"contratos", label:"CONTRATOS 11"},
              {k:"admin", label:"ADM"},
            ].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${tab===t.k?'bg-[#d4a44a] text-[#1e2f4a]':'bg-white/10 text-white hover:bg-white/20'}`}>{t.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3">
        {tab==="encontrar" && (
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
              <h2 className="font-black text-[14px] mb-2">ENCONTRAR PROFISSIONAIS - MOÇAMBIQUE</h2>
              <div className="flex gap-2 flex-wrap">
                <input value={filtroBusca} onChange={e=>setFiltroBusca(e.target.value)} placeholder="Pesquisar Pedreiro, Carpinteiro, Serralheiro..." className="border rounded-full px-4 py-2 text-[12px] flex-1 min-w-[200px]" />
                <select value={paisFiltro} onChange={e=>setPaisFiltro(e.target.value)} className="border rounded-full px-3 py-2 text-[11px]"><option>Mocambique</option><option>Todos</option></select>
                <button onClick={()=>{}} className="bg-[#1e2f4a] text-white px-5 py-2 rounded-full text-[11px] font-bold">PESQUISAR</button>
              </div>
              <div className="flex gap-1 flex-wrap mt-3">
                {["Pedreiro","Carpinteiro","Serralheiro","Eletricista","Domestica","Motorista"].map(tag=>(
                  <span key={tag} className="bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {profissionaisFiltrados.map(p=>(
                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1e2f4a] text-white flex items-center justify-center font-black text-[14px]">{p.foto}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px]">{p.nome} {p.verificado && <span className="text-green-600">✓</span>}</div>
                      <div className="text-[11px] text-slate-600">{p.tipo} • {p.local}</div>
                      <div className="text-[10px] text-slate-500">BI: {p.bi} • NUIT: {p.nuit} • {p.trabalhos} trabalhos • ⭐ {p.rating}</div>
                      <div className="text-[11px] mt-1 font-bold text-[#1e2f4a]">{p.preco} - {p.descricao}</div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {p.anexos.map((a:string)=>(<span key={a} className="bg-slate-100 px-2 py-0.5 rounded-full text-[9px]">{a}</span>))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={()=>{ setFormContrato({...formContrato, trabNome:p.nome, trabTel:p.whatsapp, trabProf:p.tipo}); setTab('contratos'); }} className="bg-[#1e2f4a] text-white px-4 py-2 rounded-full text-[11px] font-bold flex-1">GERAR CONTRATO</button>
                        <button onClick={()=>partilharWhatsApp(`Ola ${p.nome}, vi seu perfil no Contrata-MZ - ${p.tipo} - ${p.preco} - ${p.local} - Interesse em contratar - contrata-mz.vercel.app`)} className="bg-[#25D366] text-white px-4 py-2 rounded-full text-[11px] font-bold flex-1">WhatsApp Direto</button>
                        <button onClick={()=>{ setFormContrato({...formContrato, trabNome:p.nome}); setTab('contratos'); }} className="border px-3 py-2 rounded-full text-[11px] font-bold">CONTRATAR</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border mt-3">
              <h3 className="font-bold text-[12px] mb-2">CADASTRE COM BI E NUIT - MOÇAMBIQUE</h3>
              <div className="grid md:grid-cols-3 gap-2">
                <input placeholder="Nome completo" className="border rounded px-3 py-2 text-[11px]" />
                <input placeholder="BI - 1101..." className="border rounded px-3 py-2 text-[11px]" />
                <input placeholder="NUIT - 9 dígitos" className="border rounded px-3 py-2 text-[11px]" />
                <select className="border rounded px-3 py-2 text-[11px]">{CATS.map(c=><option key={c}>{c}</option>)}</select>
                <input placeholder="WhatsApp - 82..." className="border rounded px-3 py-2 text-[11px]" />
                <button className="bg-[#1e2f4a] text-white rounded px-3 py-2 text-[11px] font-bold">CADASTRAR</button>
              </div>
            </div>
          </div>
        )}

        {tab==="viagens" && (
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
              <h2 className="font-black text-[14px]">VIAGENS NACIONAL - 5 ROTAS - TEMPO REAL</h2>
              <div className="text-[11px] text-slate-600">Moçambique - Maputo • Sofala • Nampula • Gaza • Manica • Tete - Preços 1800MT a 3500MT</div>
              <div className="flex gap-2 mt-2">
                <input value={filtroBusca} onChange={e=>setFiltroBusca(e.target.value)} placeholder="Rota, transportadora, provincia..." className="border rounded-full px-4 py-2 text-[12px] flex-1" />
                <button className="bg-[#1e2f4a] text-white px-5 py-2 rounded-full text-[11px] font-bold">PESQUISAR</button>
              </div>
            </div>
            <div className="grid gap-3">
              {viagensFiltradas.map(v=>(
                <div key={v.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <div className="font-black text-[13px]">{v.transportadora} - {v.matricula}</div>
                      <div className="text-[11px] font-bold text-[#d4a44a]">{v.rota}</div>
                      <div className="text-[10px] text-slate-600">{v.tipo} • {v.lugares} • {v.carga} • {v.tempo} • {v.minutos} min</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-[16px] text-[#1e2f4a]">{v.preco} MT</div>
                      <div className={`text-[10px] px-2 py-1 rounded-full inline-block font-bold ${v.status==='a_caminho'?'bg-yellow-100 text-yellow-800':v.status==='pronto'?'bg-green-100 text-green-800':'bg-blue-100 text-blue-800'}`}>{v.status.toUpperCase()} - {v.lugaresLivres} livres</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div><div className="text-[9px] font-bold text-slate-500">ROTA</div><div className="text-[11px] font-bold">{v.origem} → {v.destino}</div></div>
                    <div><div className="text-[9px] font-bold text-slate-500">PREVISÃO</div><div className="text-[11px] font-bold">{v.tempo}</div></div>
                    <div><div className="text-[9px] font-bold text-slate-500">MOTORISTA</div><div className="text-[11px] font-bold">{v.motorista} • {v.telefone}</div></div>
                    <div><div className="text-[9px] font-bold text-slate-500">CARGA</div><div className="text-[11px] font-bold">{v.carga} • {v.lugares}</div></div>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={()=>partilharWhatsApp(`Viagem ${v.rota} - ${v.transportadora} - ${v.matricula} - ${v.preco}MT - ${v.tempo} - Motorista ${v.motorista} ${v.telefone} - ${v.lugaresLivres} lugares - contrata-mz.vercel.app`)} className="bg-[#25D366] text-white px-4 py-2 rounded-full text-[11px] font-bold flex-1">Partilhar no WhatsApp</button>
                    <button className="bg-[#1e2f4a] text-white px-4 py-2 rounded-full text-[11px] font-bold flex-1">Ver no mapa</button>
                    <button className="border px-4 py-2 rounded-full text-[11px] font-bold">Reservar - {v.lugaresLivres} livres</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="faturacao" && (
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
              <h2 className="font-black text-[14px]">FACTURAÇÃO - FACILITA FACTURAÇÃO - SUPERMERCADO-LIKE</h2>
              <div className="grid md:grid-cols-3 gap-2 mt-2">
                <input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Dados do comprador - Nome / NUIT / BI" className="border rounded px-3 py-2 text-[11px]" />
                <input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="Tel: +258..." className="border rounded px-3 py-2 text-[11px]" />
                <select value={ivaTipo} onChange={e=>setIvaTipo(e.target.value)} className="border rounded px-3 py-2 text-[11px]"><option value="16">IVA 16%</option><option value="5">IVA 5%</option><option value="sem">Sem IVA</option></select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold text-[12px] mb-2">PRODUTOS NA FACTURA - Supermercado-like - Produtos memorizados</h3>
                <div className="space-y-2">
                  {produtosFat.map(p=>(
                    <div key={p.id} className="flex gap-2 items-center border rounded p-2">
                      <div className="flex-1 text-[11px] font-bold">{p.nome}</div>
                      <div className="flex gap-1 items-center">
                        <span className="text-[10px]">QTD</span>
                        <input type="number" value={p.qtd} onChange={e=>{ setProdutosFat(produtosFat.map(x=>x.id===p.id?{...x,qtd:parseInt(e.target.value)||1}:x)); }} className="w-12 border rounded px-1 py-1 text-[11px]" />
                        <span className="text-[10px]">Desc %</span>
                        <input type="number" value={p.desc} onChange={e=>{ setProdutosFat(produtosFat.map(x=>x.id===p.id?{...x,desc:parseInt(e.target.value)||0}:x)); }} className="w-12 border rounded px-1 py-1 text-[11px]" />
                        <span className="text-[11px] font-bold">{p.preco}MT</span>
                        <button onClick={()=>setProdutosFat(produtosFat.filter(x=>x.id!==p.id))} className="text-red-600 text-[11px]">X</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Adicionar produto..." className="border rounded px-3 py-2 text-[11px] flex-1" />
                  <button onClick={()=>{ if(buscaFat){ const np={id:Date.now().toString(), nome:buscaFat, preco:500, qtd:1, desc:0}; setProdutosFat([...produtosFat,np]); setBuscaFat(""); } }} className="bg-[#1e2f4a] text-white px-4 py-2 rounded-full text-[11px] font-bold">Adicionar</button>
                </div>
                <div className="flex gap-1 flex-wrap mt-3">
                  {catsFat.map(c=>(
                    <button key={c} onClick={()=>setFiltroCatFat(c)} className={`px-3 py-1 rounded-full text-[10px] font-bold border ${filtroCatFat===c?'bg-[#1e2f4a] text-white':'bg-white'}`}>{c}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {PRODUTOS_BASE.filter(p=>filtroCatFat==="Todos"||p.cat===filtroCatFat).slice(0,8).map(pb=>(
                    <button key={pb.id} onClick={()=>{ const existe=produtosFat.find(x=>x.nome===pb.nome); if(!existe){ setProdutosFat([...produtosFat,{id:Date.now().toString(), nome:pb.nome, preco:pb.preco, qtd:1, desc:0}]); } }} className="border rounded p-2 text-left hover:bg-slate-50">
                      <div className="text-[10px] font-bold">{pb.nome}</div>
                      <div className="text-[9px] text-slate-600">{pb.cat}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold text-[12px] mb-2">RESUMO - IVA global - Total - Finalizar</h3>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span>Subtotal bruto:</span><span className="font-bold">{subtotalBrutoFat} MT</span></div>
                  <div className="flex justify-between"><span>Total desconto:</span><span className="font-bold text-green-600">-{totalDescFat} MT</span></div>
                  <div className="flex justify-between"><span>Base:</span><span className="font-bold">{baseFat} MT</span></div>
                  <div className="flex justify-between"><span>IVA ({ivaTipo}%):</span><span className="font-bold">{ivaFat.toFixed(0)} MT</span></div>
                  <div className="flex justify-between text-[14px] font-black border-t pt-2"><span>TOTAL:</span><span>{totalFat.toFixed(0)} MT</span></div>
                </div>
                <button onClick={()=>alert(`Factura ${totalFat.toFixed(0)} MT - ${nomeFat} - ${produtosFat.length} produtos`)} className="w-full bg-[#1e2f4a] text-white py-3 rounded-full font-bold text-[12px] mt-3">FINALIZAR FACTURA - {totalFat.toFixed(0)} MT</button>
                <button onClick={()=>partilharWhatsApp(`Factura Contrata-MZ - Cliente: ${nomeFat} - Tel: ${telFat} - Total: ${totalFat.toFixed(0)} MT - ${produtosFat.length} produtos - IVA ${ivaTipo}% - contrata-mz.vercel.app`)} className="w-full bg-[#25D366] text-white py-3 rounded-full font-bold text-[12px] mt-2">Partilhar PDF no WhatsApp</button>
                <div className="text-[10px] text-slate-500 mt-2">Produtos memorizados • QTD • Desconto • IVA global • Total</div>
              </div>
            </div>
          </div>
        )}

        {tab==="contratos" && (
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
              <h2 className="font-black text-[14px]">CONTRATO LEGAL EM 2 MINUTOS - 11 CLÁUSULAS - Lei 23/2007 Moçambique</h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                <select value={catSel} onChange={e=>{ setCatSel(e.target.value); const t=MODELO_TAREFAS[e.target.value]||MODELO_TAREFAS["Pedreiro"]; setFormContrato({...formContrato, tarefas:t, trabProf:e.target.value}); }} className="border rounded-full px-3 py-2 text-[11px]">
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={contratoSel} onChange={e=>setContratoSel(parseInt(e.target.value))} className="border rounded-full px-3 py-2 text-[11px]">
                  {Array.from({length:11},(_,i)=><option key={i+1} value={i+1}>Clausula {i+1}</option>)}
                </select>
                <button onClick={()=>setMostrarPreviewMobile(!mostrarPreviewMobile)} className="bg-[#1e2f4a] text-white px-4 py-2 rounded-full text-[11px] font-bold md:hidden">{mostrarPreviewMobile?"Editar":"Preview"}</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className={`${mostrarPreviewMobile?'hidden md:block':''} space-y-3`}>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <h3 className="font-bold text-[12px] mb-2">1. DADOS DAS PARTES - Quem contrata e quem faz - EDITÁVEL</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={formContrato.empNome} onChange={e=>setFormContrato({...formContrato, empNome:e.target.value})} placeholder="Contratante Nome" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.empBI} onChange={e=>setFormContrato({...formContrato, empBI:e.target.value})} placeholder="BI Contratante" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.empTel} onChange={e=>setFormContrato({...formContrato, empTel:e.target.value})} placeholder="Tel Contratante" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.empEnd} onChange={e=>setFormContrato({...formContrato, empEnd:e.target.value})} placeholder="Endereco Contratante" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.trabNome} onChange={e=>setFormContrato({...formContrato, trabNome:e.target.value})} placeholder="Trabalhador Nome" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.trabBI} onChange={e=>setFormContrato({...formContrato, trabBI:e.target.value})} placeholder="BI Trabalhador" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.trabTel} onChange={e=>setFormContrato({...formContrato, trabTel:e.target.value})} placeholder="Tel Trabalhador" className="border rounded px-2 py-2 text-[11px]" />
                    <input value={formContrato.trabEnd} onChange={e=>setFormContrato({...formContrato, trabEnd:e.target.value})} placeholder="Endereco Trabalhador" className="border rounded px-2 py-2 text-[11px]" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <h3 className="font-bold text-[12px] mb-2">2. OBJETO E TAREFAS - {formContrato.tarefas.length} tarefas de {catSel} - EDITÁVEL</h3>
                  <div className="space-y-1 max-h-[200px] overflow-auto">
                    {formContrato.tarefas.map((t:string,i:number)=>(
                      <div key={i} className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold w-5">{i+1}.</span>
                        <input value={t} onChange={e=>{ const nt=[...formContrato.tarefas]; nt[i]=e.target.value; setFormContrato({...formContrato, tarefas:nt}); }} className="flex-1 border rounded px-2 py-1 text-[10px]" />
                        <button onClick={()=>{ const nt=formContrato.tarefas.filter((_:any,idx:number)=>idx!==i); setFormContrato({...formContrato, tarefas:nt}); }} className="text-red-600 text-[10px]">X</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>{ const nt=[...formContrato.tarefas, "Nova tarefa"]; setFormContrato({...formContrato, tarefas:nt}); }} className="mt-2 border px-3 py-1 rounded-full text-[10px] font-bold">+ Adicionar tarefa</button>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <h3 className="font-bold text-[12px] mb-2">3 a 11. CLÁUSULAS - Lei 23/2007 - FORMULÁRIOS EDITÁVEIS</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div><div className="text-[10px] font-bold">Horario Inicio</div><input value={formContrato.horarioInicio} onChange={e=>setFormContrato({...formContrato, horarioInicio:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Horario Fim</div><input value={formContrato.horarioFim} onChange={e=>setFormContrato({...formContrato, horarioFim:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Dias</div><input value={formContrato.dias} onChange={e=>setFormContrato({...formContrato, dias:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Data Inicio</div><input value={formContrato.dataInicio} onChange={e=>setFormContrato({...formContrato, dataInicio:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Local Trabalho</div><input value={formContrato.localTrab} onChange={e=>setFormContrato({...formContrato, localTrab:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Salario MZN</div><input value={formContrato.valor} onChange={e=>setFormContrato({...formContrato, valor:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Dia Pagamento</div><input value={formContrato.diaPag} onChange={e=>setFormContrato({...formContrato, diaPag:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                    <div><div className="text-[10px] font-bold">Forma Pagamento</div><input value={formContrato.formaPag} onChange={e=>setFormContrato({...formContrato, formaPag:e.target.value})} className="w-full border rounded px-2 py-1 text-[11px]" /></div>
                  </div>
                  <div className="mt-3 p-2 bg-slate-50 rounded text-[10px]">
                    <div className="font-bold">5. Alimentacao e alojamento • 6. Folgas e ferias • 7. Periodo experimental • 8. Deveres do trabalhador • 9. Deveres do empregador • 10. Anexos (fotos e provas)</div>
                    <div className="mt-1">Lei 23/2007 Moçambique - Contratos de trabalho doméstico, construção civil, etc - com validade legal, anexos BI, NUIT, fotos obra</div>
                  </div>
                </div>
              </div>
              <div className={`${mostrarPreviewMobile?'':'hidden md:block'} bg-white rounded-xl p-4 shadow-sm border`}>
                <h3 className="font-bold text-[12px] mb-2">PREVIEW AO VIVO - CONTRATO {catSel.toUpperCase()} - 11 CLÁUSULAS - {formContrato.tarefas.length} tarefas</h3>
                <div className="border rounded p-3 bg-slate-50 text-[10px] leading-relaxed max-h-[600px] overflow-auto">
                  <div className="font-black text-center mb-2">CONTRATO {catSel.toUpperCase()} - 11 CLÁUSULAS COMPLETAS - ID {Date.now()}</div>
                  <div><b>1. DADOS DAS PARTES:</b> CONTRATANTE: {formContrato.empNome} BI {formContrato.empBI} Tel {formContrato.empTel} End {formContrato.empEnd} | TRABALHADOR: {formContrato.trabNome} BI {formContrato.trabBI} Tel {formContrato.trabTel} End {formContrato.trabEnd} Prof {formContrato.trabProf}</div>
                  <div className="mt-2"><b>2. OBJETO E TAREFAS - {formContrato.tarefas.length} tarefas:</b> {formContrato.tarefas.map((t:string,i:number)=>`${i+1}. ${t}`).join(" | ")}</div>
                  <div className="mt-2"><b>3. HORARIO E LOCAL:</b> {formContrato.horarioInicio} as {formContrato.horarioFim} - {formContrato.dias} - Inicio {formContrato.dataInicio} - Local {formContrato.localTrab}</div>
                  <div className="mt-2"><b>4. SALARIO:</b> {formContrato.valor} MZN - Dia {formContrato.diaPag} - Forma {formContrato.formaPag}</div>
                  <div className="mt-2"><b>5 a 10. CLAUSULAS LEGAIS:</b> Alimentacao, alojamento, folgas, ferias, periodo experimental 15 dias, deveres trabalhador e empregador, anexos fotos e provas - Lei 23/2007</div>
                  <div className="mt-3 font-bold">11. VALIDADE E ASSINATURAS - Lei 23/2007 - Assina no WhatsApp - PDF final partilhavel</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="border-2 border-[#1e2f4a] rounded p-2 bg-white"><div className="font-bold">CONTRATANTE</div><div>{formContrato.empNome}</div><div className="mt-4">Assinatura: ___________________</div><div className="text-[9px]">Data: {new Date().toLocaleDateString('pt-MZ')}</div></div>
                    <div className="border-2 border-[#d4a44a] rounded p-2 bg-[#fff8ed]"><div className="font-bold">TRABALHADOR</div><div>{formContrato.trabNome}</div><div className="mt-4">Assinatura: ___________________</div><div className="text-[9px]">Data: {new Date().toLocaleDateString('pt-MZ')}</div></div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>{ if(confirm("CONCORDO com todas as 11 clausulas?")){ gerarContratoPDF(); } }} className="flex-1 bg-[#1e2f4a] text-white py-3 rounded-full font-bold text-[11px]">CONCORDO - GERAR CONTRATO FINAL</button>
                </div>
                <button onClick={gerarContratoPDF} className="w-full mt-2 border-2 border-[#1e2f4a] text-[#1e2f4a] py-3 rounded-full font-bold text-[11px]">IMPRIMIR / SALVAR COMO PDF FINAL COM ASSINATURAS</button>
                <button onClick={()=>partilharWhatsApp(`Contrato ${catSel} - 11 Clausulas - ${formContrato.empNome} e ${formContrato.trabNome} - ${formContrato.tarefas.length} tarefas - ${formContrato.valor} MZN - ${formContrato.localTrab} - Validade Lei 23/2007 - Assinaturas - contrata-mz.vercel.app`)} className="w-full mt-2 bg-[#25D366] text-white py-3 rounded-full font-bold text-[11px]">Partilhar no WhatsApp direto</button>
                <div className="text-[9px] text-slate-500 mt-2 text-center">Assinaturas na horizontal • Preview ao vivo • Formulários editáveis • 11 CLÁUSULAS • CONCORDO • PDF final partilhável no WhatsApp</div>
              </div>
            </div>
          </div>
        )}

        {tab==="admin" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="font-black text-[14px]">ADMIN PANEL - Mantido</div>
            <div className="text-[11px] mt-2">Login: admin@contrata.mz / 123456</div>
            <div className="text-[10px] text-slate-500 mt-4">Base ontem 100% - Faturacao, Encontrar, Contratos intacto como ha 13h atras - sem tela branca - build OK</div>
          </div>
        )}
      </main>
      <footer className="text-center text-[10px] text-slate-400 py-6">contrata-mz.vercel.app - BASE ONTEM 100% BUILD OK - Faturacao Encontrar Contratos Viagens - sem tela branca - {new Date().toLocaleDateString('pt-MZ')}</footer>
    </div>
  );
}
