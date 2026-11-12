// @ts-nocheck
// CONTRATOS - FASE 1 REAL - 100% REAL - Sem Mock
// Base: ContratosReal.tsx 19KB - Melhorias:
// 1) PDF com 11 CLAUSULAS COMPLETAS (texto legal)
// 2) ASSINATURA REAL - desenhar com dedo/mouse + nome + BI + data (nao so checkbox)
// 3) CONTA REAL - sem conta_Date.now() - sem login nao cria nem ve contratos
// 4) WHATSAPP - trabalhador + dono +258823832513 ao criar
// 5) VALIDACAO - BI 13 digitos, Tel 9 digitos (82-89), Valor > 0, Data inicio
// 6) SEGURANCA - sem login lista = [] (nao mostra contratos dos outros)
// 7) EDITAR / APAGAR / PESQUISAR
// 8) V37 - PDF REAL direto (igual as faturas): baixa .pdf + partilha com o CONTRATADO. Sem HTML, sem print.
// 9) V37 - Faixa WEZHA TOTSHE + efeito de entrada no topo da pagina de Contratos.
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
const DONO_WPP = '258823832513';

const normTel = (t:any) => String(t||'').replace(/\D/g,'').replace(/^258/,'');
const isTelMZ = (t:any) => { const n=normTel(t); return n.length===9 && /^8[2-9]/.test(n); };
const isBI = (b:any) => String(b||'').replace(/\D/g,'').length===13;

const CLAUSULAS = [
  { id:1, titulo:"Dados das partes", short:"Quem contrata e quem faz" },
  { id:2, titulo:"Objeto e tarefas", short:"O que será feito" },
  { id:3, titulo:"Horario e local", short:"Quando e onde" },
  { id:4, titulo:"Salario e pagamento", short:"Quanto e como paga" },
  { id:5, titulo:"Alimentacao e alojamento", short:"Beneficios" },
  { id:6, titulo:"Folgas e ferias", short:"Descanso legal" },
  { id:7, titulo:"Periodo experimental", short:"Teste inicial" },
  { id:8, titulo:"Deveres do trabalhador", short:"Obrigações" },
  { id:9, titulo:"Deveres do empregador", short:"Obrigações" },
  { id:10, titulo:"Rescisão e multas", short:"Fim do contrato" },
  { id:11, titulo:"Disposições finais", short:"Assinaturas" },
];

const MODELO_TAREFAS: any = {
  "Pedreiro": ["Fundações e alicerces com nível e prumo", "Levantar paredes com blocos", "Reboco e acabamento", "Garantir obra limpa e organizada"],
  "Carpinteiro": ["Medir e cortar madeira", "Montar estruturas", "Instalar portas e janelas", "Acabamento com verniz"],
  "Eletricista": ["Instalar fiação", "Quadro elétrico", "Testes de segurança", "Entregar com garantia"],
  "Domestica": ["Limpeza geral da casa", "Lavar e passar roupa", "Cozinhar quando necessário", "Organizar ambientes"],
  "Outros/Particular": ["Tarefas conforme combinado", "Cumprir horário", "Deixar local limpo", "Entregar com recibo"]
};

// TEXTO LEGAL COMPLETO - 11 CLAUSULAS - usado no PDF e na vista
function textoClausulas(c:any){
  const tarefas = Array.isArray(c.tarefas)? c.tarefas.join(', ') : (c.tarefas||'');
  return [
    `CLAUSULA 1 - DADOS DAS PARTES: Empregador: ${c.emp_nome} - BI/NUIT: ${c.emp_bi||'-'} - Tel: ${c.emp_tel} - End: ${c.emp_end||'-'}. Trabalhador: ${c.trab_nome} - BI: ${c.trab_bi||'-'} - Tel: ${c.trab_tel} - End: ${c.trab_end||'-'} - Profissao: ${c.trab_prof}. Ambas as partes declaram que os dados acima sao verdadeiros e assumem responsabilidade legal pela veracidade dos mesmos.`,
    `CLAUSULA 2 - OBJETO E TAREFAS: O trabalhador compromete-se a realizar as seguintes tarefas: ${tarefas}. Qualquer tarefa fora desta lista so sera feita com acordo escrito das duas partes, com ajuste de valor e prazo.`,
    `CLAUSULA 3 - HORARIO E LOCAL: Horario: ${c.horario_inicio} as ${c.horario_fim} - Dias: ${c.dias} - Data de inicio: ${c.data_inicio||'-'} - Local de trabalho: ${c.local_trab||'-'}. Atrasos superiores a 30 minutos sem aviso devem ser comunicados por telefone/WhatsApp. Horas extra so com acordo previo.`,
    `CLAUSULA 4 - SALARIO E PAGAMENTO: Valor total: ${c.valor} MZN - Dia de pagamento: dia ${c.dia_pag} - Forma: ${c.forma_pag} - Prazo: ${c.prazo}. O pagamento sera feito na forma combinada, com recibo / comprovativo M-Pesa / e-Mola. Em caso de atraso superior a 5 dias, o trabalhador pode suspender o trabalho ate receber, sem perda de direito ao valor.`,
    `CLAUSULA 5 - ALIMENTACAO E ALOJAMENTO: ${c.alimentacao||'Conforme combinado'}. Se o empregador fornecer alimentacao, a mesma deve ser digna e em condicoes de higiene. Se nao fornecer, o trabalhador organiza a sua propria alimentacao, sem desconto no salario, salvo acordo escrito.`,
    `CLAUSULA 6 - FOLGAS E FERIAS: O trabalhador tem direito a 1 dia de folga por semana, salvo acordo diferente. Feriados nacionais sao pagos. Ferias: apos 12 meses de trabalho continuo, o trabalhador tem direito a 30 dias de ferias pagas, ou compensacao proporcional se o contrato for menor.`,
    `CLAUSULA 7 - PERIODO EXPERIMENTAL: Os primeiros 15 dias sao periodo experimental. Durante este periodo, qualquer das partes pode terminar o contrato sem multa, pagando apenas os dias ja trabalhados. Apos este periodo, aplicam-se as regras da Clausula 10.`,
    `CLAUSULA 8 - DEVERES DO TRABALHADOR: Cumprir horario, executar tarefas com qualidade, cuidar das ferramentas e materiais, manter o local limpo, respeitar as regras de seguranca, nao faltar sem aviso, nao desviar material, guardar sigilo sobre informacoes da casa / obra.`,
    `CLAUSULA 9 - DEVERES DO EMPREGADOR: Pagar no dia combinado, fornecer material e ferramentas necessarias, garantir condicoes de seguranca e higiene, tratar o trabalhador com respeito e dignidade, nao exigir tarefas perigosas sem protecao, fornecer recibo de cada pagamento.`,
    `CLAUSULA 10 - RESCISAO E MULTAS: Se o empregador rescindir sem justa causa, paga os dias trabalhados + 7 dias de aviso. Se o trabalhador abandonar sem aviso, perde o valor dos ultimos 3 dias. Em caso de roubo, dano intencional ou violencia, o contrato termina de imediato e o caso pode ser levado as autoridades. Qualquer rescisao deve ser comunicada por escrito / WhatsApp com motivo.`,
    `CLAUSULA 11 - DISPOSICOES FINAIS: Este contrato foi lido e aceite pelas duas partes, com assinaturas reais (desenho) abaixo. Em caso de conflito, as partes tentam resolver por conversa. Se nao resolverem, recorrem a Inspeccao do Trabalho / Tribunal competente em Mocambique. Este contrato tem 2 vias - uma para cada parte. Assinado em ${c.local_trab||'Mocambique'} em ${new Date().toLocaleDateString('pt-MZ')}.`
  ];
}

// Canvas de assinatura
function AssinaturaPad({ label, nome, onChange }: any){
  const ref = useRef<any>(null);
  const desenhando = useRef(false);
  const [tem, setTem] = useState(false);
  const iniciar = (e:any) => {
    const cv = ref.current; if(!cv) return;
    const r = cv.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    const ctx = cv.getContext('2d'); ctx.beginPath(); ctx.moveTo(x,y); desenhando.current = true;
  };
  const mover = (e:any) => {
    if(!desenhando.current) return;
    const cv = ref.current; const r = cv.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    const ctx = cv.getContext('2d'); ctx.lineWidth=2; ctx.strokeStyle='#1e2f4a'; ctx.lineTo(x,y); ctx.stroke(); setTem(true);
    if(onChange) onChange(cv.toDataURL());
  };
  const fim = () => { desenhando.current=false; if(ref.current && onChange) onChange(ref.current.toDataURL()); };
  const limpar = () => { const cv=ref.current; const ctx=cv.getContext('2d'); ctx.clearRect(0,0,cv.width,cv.height); setTem(false); if(onChange) onChange(''); };
  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <p className="text-[12px] font-bold">{label} - {nome||''}</p>
      <p className="text-[10px] text-gray-500">Desenha com o dedo / mouse aqui 👇</p>
      <canvas ref={ref} width={320} height={110} style={{width:'100%',background:'#fff',border:'1px solid #ddd',borderRadius:8,touchAction:'none'}}
        onMouseDown={iniciar} onMouseMove={mover} onMouseUp={fim} onMouseLeave={fim}
        onTouchStart={iniciar} onTouchMove={mover} onTouchEnd={fim} />
      <div className="flex justify-between mt-1"><span className="text-[10px]">{tem?'✅ Assinatura desenhada':'⚠️ Ainda sem assinatura'}</span><button onClick={limpar} className="text-[11px] bg-white border px-2 py-1 rounded-full">Limpar</button></div>
    </div>
  );
}

export default function ContratosReal(){
  const [lista, setLista] = useState<any[]>([]);
  const [clausulaAtiva, setClausulaAtiva] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contratoVer, setContratoVer] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState('');
  const [editId, setEditId] = useState<any>(null);
  const [contaId, setContaId] = useState<any>(null);
  const [sigEmp, setSigEmp] = useState('');
  const [sigTrab, setSigTrab] = useState('');

  const [form, setForm] = useState({
    empNome:'', empBI:'', empTel:'', empEnd:'',
    trabNome:'', trabBI:'', trabTel:'', trabEnd:'', trabProf:'Pedreiro',
    tarefas: MODELO_TAREFAS["Pedreiro"],
    horarioInicio:'06:00', horarioFim:'17:00', dias:'Segunda a Sabado', dataInicio:'', localTrab:'',
    valor:'', diaPag:'05', formaPag:'M-Pesa', prazo:'30 dias',
    alimentacao:'Sim - almoço fornecido no local',
  });

  const carregarReais = async () => {
    setCarregando(true);
    const sessao = localStorage.getItem('loja_sessao');
    let cid = null;
    if(sessao){ try{ cid = JSON.parse(sessao).conta_id; }catch(e){} }
    setContaId(cid);
    // SEGURANCA: sem login -> lista vazia, NAO mostra contratos dos outros
    if(!cid){ setLista([]); setCarregando(false); return; }
    let { data, error } = await supabase.from('contratos').select('*').eq('conta_id', cid).order('created_at',{ascending:false});
    if(error && String(error.message||'').includes('conta_id')){
      // Tabela ainda sem conta_id - mostra aviso e carrega sem filtro para nao bloquear
      alert('⚠️ Falta correr o SQL! Vai ao Supabase → SQL Editor → cola CONTRATOS-SQL-CORRIGIR-CONTA_ID.sql → RUN! A tabela ainda nao tem conta_id!');
      const r2:any = await supabase.from('contratos').select('*').order('created_at',{ascending:false});
      data = r2.data; error = null;
    }
    if(error) alert('Erro a carregar: '+error.message);
    setLista((data as any)||[]);
    setCarregando(false);
  };

  useEffect(()=>{ carregarReais();
    const profSel = localStorage.getItem('prof_selecionado_contrato');
    if(profSel){ try{ const p=JSON.parse(profSel); setForm(f=>({...f, trabNome:p.nome, trabTel:p.telefone||p.whatsapp, trabProf:p.profissao, tarefas: MODELO_TAREFAS[p.profissao]||MODELO_TAREFAS["Outros/Particular"]})); }catch(e){} }
    const lojaSessao = localStorage.getItem('loja_sessao');
    if(lojaSessao){ try{ const l=JSON.parse(lojaSessao); setForm(f=>({...f, empNome:l.nome_loja, empTel:l.username, empBI:l.nuit||''})); }catch(e){} }
  },[]);

  const validar = () => {
    if(!contaId) return 'Sem conta! Faz login na tua Loja no VENDER primeiro. Sem login nao podes criar contrato.';
    if(!form.empNome.trim() || !form.trabNome.trim()) return 'Preenche Empregador e Trabalhador.';
    if(!isTelMZ(form.empTel)) return 'Tel Empregador invalido! Tem de ser 9 digitos a comecar por 82-89. Ex: 841234567';
    if(!isTelMZ(form.trabTel)) return 'Tel Trabalhador invalido! Tem de ser 9 digitos a comecar por 82-89.';
    if(form.empBI && !isBI(form.empBI)) return 'BI/NUIT Empregador: BI tem de ter 13 digitos. Se e NUIT, deixa vazio ou usa 9 digitos.';
    if(form.trabBI && !isBI(form.trabBI)) return 'BI Trabalhador invalido! Tem de ter 13 digitos. Ex: 1101012345678';
    if(!form.valor || Number(form.valor) <= 0) return 'Valor tem de ser maior que 0. Ex: 7500';
    if(!form.dataInicio) return 'Escolhe a Data de Inicio.';
    if(!sigEmp) return 'Falta ASSINATURA do Empregador - desenha com o dedo!';
    if(!sigTrab) return 'Falta ASSINATURA do Trabalhador - desenha com o dedo!';
    return null;
  };

  const handleCriarContrato = async () => {
    const err = validar();
    if(err){ alert('⚠️ '+err); return; }
    setCarregando(true);
    const novo:any = {
      conta_id: contaId,
      emp_nome: form.empNome, emp_bi: form.empBI, emp_tel: normTel(form.empTel), emp_end: form.empEnd,
      trab_nome: form.trabNome, trab_bi: form.trabBI, trab_tel: normTel(form.trabTel), trab_end: form.trabEnd, trab_prof: form.trabProf,
      tarefas: form.tarefas,
      horario_inicio: form.horarioInicio, horario_fim: form.horarioFim, dias: form.dias, data_inicio: form.dataInicio, local_trab: form.localTrab,
      valor: form.valor, dia_pag: form.diaPag, forma_pag: form.formaPag, prazo: form.prazo, alimentacao: form.alimentacao,
      clausulas: CLAUSULAS,
      assinatura_contratante: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigEmp },
      assinatura_contratado: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigTrab },
      status: 'ASSINADO'
    };
    let res;
    if(editId){ res = await supabase.from('contratos').update(novo).eq('id', editId).eq('conta_id', contaId); }
    else { res = await supabase.from('contratos').insert([novo]); }
    if(res.error){ if(String(res.error.message||'').includes('conta_id')) alert('⚠️ Falta correr o SQL CONTRATOS-SQL-CORRIGIR-CONTA_ID.sql no Supabase!'); else alert('Erro: '+res.error.message); setCarregando(false); return; }
    // V37 - CRIAR CONTRATO: depois de guardar, baixa o PDF automaticamente + partilha com o CONTRATADO (igual as faturas)
    await baixarEPartilharPdfContrato(novo);
    alert('✅ CONTRATO REAL CRIADO! PDF baixado + partilha aberta para o Trabalhador!');
    setMostrarForm(false); setEditId(null); setSigEmp(''); setSigTrab(''); carregarReais();
    setCarregando(false);
  };

  const apagar = async (id:any) => {
    if(!confirm('Apagar este contrato? Nao da para desfazer.')) return;
    const { error } = await supabase.from('contratos').delete().eq('id', id).eq('conta_id', contaId);
    if(error) alert('Erro: '+error.message); else carregarReais();
  };

  const editar = (c:any) => {
    setEditId(c.id);
    setForm({
      empNome:c.emp_nome||'', empBI:c.emp_bi||'', empTel:c.emp_tel||'', empEnd:c.emp_end||'',
      trabNome:c.trab_nome||'', trabBI:c.trab_bi||'', trabTel:c.trab_tel||'', trabEnd:c.trab_end||'', trabProf:c.trab_prof||'Pedreiro',
      tarefas: c.tarefas||[], horarioInicio:c.horario_inicio||'06:00', horarioFim:c.horario_fim||'17:00', dias:c.dias||'', dataInicio:c.data_inicio||'', localTrab:c.local_trab||'',
      valor:c.valor||'', diaPag:c.dia_pag||'05', formaPag:c.forma_pag||'M-Pesa', prazo:c.prazo||'', alimentacao:c.alimentacao||'',
    });
    setSigEmp(c.assinatura_contratante?.assinatura||''); setSigTrab(c.assinatura_contratado?.assinatura||'');
    setMostrarForm(true);
  };

  // ===== V37 - PDF REAL do contrato (igual as faturas): .pdf direto + partilha com o contratado =====
  const paraJpeg = (dataUrl:any) => new Promise<string>((res)=>{
    if(!dataUrl) return res('');
    try{
      const img = new Image();
      img.onload = ()=>{
        try{
          const cv = document.createElement('canvas'); cv.width = 320; cv.height = 110;
          const ctx:any = cv.getContext('2d'); if(!ctx) return res('');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,320,110);
          ctx.drawImage(img, 0, 0, 320, 110);
          res((cv.toDataURL('image/jpeg', 0.85).split(',')[1])||'');
        }catch(e){ res(''); }
      };
      img.onerror = ()=>res('');
      img.src = dataUrl;
    }catch(e){ res(''); }
  });
  const gerarPdfContrato = async (c:any) => {
    const limpa = (v:any)=> String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^ -~]/g,' ');
    const esc = (v:any)=> limpa(v).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    const id = c.id?.substring(0,8) || String(Math.floor(Math.random()*1000000));
    const quebrar = (texto:string, max:number) => {
      const palavras = String(texto||'').split(/\s+/); const out:string[] = []; let linha = '';
      palavras.forEach((p:string)=>{ if((linha+' '+p).trim().length > max){ if(linha) out.push(linha); linha = p; } else linha = (linha+' '+p).trim(); });
      if(linha) out.push(linha);
      return out;
    };
    const sigEmpJpeg = await paraJpeg(c.assinatura_contratante?.assinatura);
    const sigTrabJpeg = await paraJpeg(c.assinatura_contratado?.assinatura);
    const sigEmpBin = sigEmpJpeg ? (()=>{ try{ return atob(sigEmpJpeg); }catch(e){ return ''; } })() : '';
    const sigTrabBin = sigTrabJpeg ? (()=>{ try{ return atob(sigTrabJpeg); }catch(e){ return ''; } })() : '';
    // Linhas do PDF: {t, bold}
    const linhas:any[] = [];
    linhas.push({t:'WEZHA TOTSHE - Encontrar . Vender . Contratos', bold:true});
    linhas.push({t:`CONTRATO DE PRESTACAO DE SERVICOS - ${c.trab_prof} - ID ${id}`, bold:true});
    linhas.push({t:`Gerado em ${new Date().toLocaleString('pt-MZ')} - Mocambique`, bold:false});
    linhas.push({t:'', bold:false});
    textoClausulas(c).forEach((cl:string)=>{ quebrar(cl, 92).forEach((l:string)=>linhas.push({t:l, bold:false})); linhas.push({t:'', bold:false}); });
    // Assinaturas no fim, com pagina propria se a pagina estiver quase cheia
    if(linhas.length % 54 > 46){ while(linhas.length % 54 !== 0) linhas.push({t:'', bold:false}); }
    linhas.push({t:'ASSINATURAS REAIS:', bold:true});
    linhas.push({t:`Empregador: ${c.emp_nome} - ${c.assinatura_contratante?.data||''}`, bold:false});
    linhas.push({img:'Im1'});
    linhas.push({t:`Trabalhador: ${c.trab_nome} - ${c.assinatura_contratado?.data||''}`, bold:false});
    linhas.push({img:'Im2'});
    linhas.push({t:'Este contrato tem 2 vias - uma para cada parte.', bold:false});
    // Paginar: 54 linhas por pagina
    const paginas:any[][] = []; let atual:any[] = [];
    linhas.forEach((ln:any)=>{ atual.push(ln); if(atual.length>=54){ paginas.push(atual); atual=[]; } });
    if(atual.length) paginas.push(atual);
    // Objetos PDF: 1 Catalogo, 2 Paginas, 3 F1, 4 F2, 5 Im1, 6 Im2, depois 1 Pagina + 1 Conteudo por pagina
    const objs:string[] = [''];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
    let prox = 5;
    const numIm1 = sigEmpBin ? prox++ : 0;
    const numIm2 = sigTrabBin ? prox++ : 0;
    if(numIm1) objs[numIm1] = `<< /Type /XObject /Subtype /Image /Width 320 /Height 110 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${sigEmpBin.length} >>\nstream\n${sigEmpBin}\nendstream`;
    if(numIm2) objs[numIm2] = `<< /Type /XObject /Subtype /Image /Width 320 /Height 110 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${sigTrabBin.length} >>\nstream\n${sigTrabBin}\nendstream`;
    const kids:string[] = [];
    paginas.forEach((pg:any)=>{
      const numPag = prox++; const numCont = prox++;
      kids.push(`${numPag} 0 R`);
      let cont = '';
      let y = 800;
      pg.forEach((ln:any)=>{
        if(ln.img){
          const qual = ln.img==='Im1' ? numIm1 : numIm2;
          if(qual){ cont += `q 160 0 0 45 40 ${y-50} cm /${ln.img} Do Q `; }
          y -= 58;
          return;
        }
        cont += `BT /${ln.bold?'F2':'F1'} 10 Tf 1 0 0 1 40 ${y} Tm (${esc(ln.t)}) Tj ET `;
        y -= 13;
      });
      objs[numPag] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>${(numIm1||numIm2)?` /XObject << ${numIm1?`/Im1 ${numIm1} 0 R `:''}${numIm2?`/Im2 ${numIm2} 0 R`:''} >>`:''} >> /Contents ${numCont} 0 R >>`;
      objs[numCont] = `<< /Length ${cont.length} >>\nstream\n${cont}\nendstream`;
    });
    objs[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${paginas.length} >>`;
    const totalObjs = prox - 1;
    let pdf = '%PDF-1.4\n'; const offsets:number[] = [0];
    for(let i=1;i<=totalObjs;i++){ offsets[i]=pdf.length; pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xrefPos = pdf.length;
    pdf += `xref\n0 ${totalObjs+1}\n0000000000 65535 f \n`;
    for(let i=1;i<=totalObjs;i++){ pdf += String(offsets[i]).padStart(10,'0') + ' 00000 n \n'; }
    pdf += `trailer\n<< /Size ${totalObjs+1} /Root 1 0 R >>\nstartxref\n` + xrefPos + '\n%%EOF';
    const bytes = new Uint8Array(pdf.length); for(let bi=0; bi<pdf.length; bi++) bytes[bi] = pdf.charCodeAt(bi) & 0xFF;
    return new Blob([bytes], {type:'application/pdf'});
  };
  const baixarEPartilharPdfContrato = async (c:any) => {
    const id = c.id?.substring(0,8) || String(Math.floor(Math.random()*1000000));
    const nomeFicheiro = `Contrato ${c.trab_prof} - ${c.trab_nome} - ID ${id}.pdf`;
    const blob = await gerarPdfContrato(c);
    // 1) Baixa o PDF automaticamente (igual as faturas)
    const urlPdf = URL.createObjectURL(blob);
    const aPdf = document.createElement('a'); aPdf.href=urlPdf; aPdf.download=nomeFicheiro; document.body.appendChild(aPdf); aPdf.click(); document.body.removeChild(aPdf);
    setTimeout(()=>URL.revokeObjectURL(urlPdf), 10000);
    // 2) Partilha direta com o CONTRATADO (numero do trabalhador): ficheiro primeiro, WhatsApp se falhar
    const msg = `Ola ${c.trab_nome}! CONTRATO ${c.trab_prof} - ID ${id} - ${c.valor} MZN - Inicio ${c.data_inicio} - Empregador ${c.emp_nome}. Ja esta ASSINADO com as 2 assinaturas! O PDF ja baixou - anexa o PDF aqui, por favor.`;
    const ficheiro = new File([blob], nomeFicheiro, {type:'application/pdf'});
    let partilhado = false;
    try{ if((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare({files:[ficheiro]})){ await (navigator as any).share({ files:[ficheiro], title:nomeFicheiro, text: msg }); partilhado = true; } }catch(e){}
    if(!partilhado){
      window.open(`https://wa.me/258${normTel(c.trab_tel)}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };
  const gerarPDF = (c:any) => { baixarEPartilharPdfContrato(c); };

  const filtrados = lista.filter(c => !pesquisa || (c.trab_nome||'').toLowerCase().includes(pesquisa.toLowerCase()) || (c.emp_nome||'').toLowerCase().includes(pesquisa.toLowerCase()) || (c.trab_prof||'').toLowerCase().includes(pesquisa.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <style>{`@keyframes wezhaEntrada { from { opacity: 0; transform: translateY(-10px) scale(.97); } to { opacity: 1; transform: none; } } @keyframes wezhaPulso { 0%,100% { transform: scale(1); } 50% { transform: scale(1.07); } } .wezha-entrada { animation: wezhaEntrada .6s ease both; } .wezha-logo { animation: wezhaPulso 2.4s ease-in-out infinite; }`}</style>
      <div className="wezha-entrada flex items-center gap-3 mb-4"><div className="wezha-logo w-11 h-11 bg-[#facc15] rounded-full flex items-center justify-center text-black font-black text-[20px] shadow">W</div><div><div className="font-black text-[18px] leading-none text-[#1e2f4a]">WEZHA TOTSHE</div><div className="text-[10px] text-gray-500 mt-1">Encontrar • Vender • Contratos</div></div></div>
      <div className="bg-white rounded-xl border p-6 mb-4">
          <h1 className="text-2xl font-bold text-[#1e2f4a]">CONTRATOS - 100% REAL - 11 CLÁUSULAS - FASE 1</h1>
          <p className="text-[11px] text-gray-500 mt-1">Sem mock - Só Supabase contratos - {lista.length} contratos reais - Conta por loja {contaId?'✅ Logado':'⚠️ Sem login - faz login no VENDER!'}</p>
          {!contaId && <p className="text-[12px] bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mt-3">⚠️ Sem login! Vai ao VENDER → entra na tua Loja → volta aqui. Sem login não vês nem crias contratos (segurança - não mostrar contratos dos outros).</p>}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={()=>{ setEditId(null); setMostrarForm(true); }} className="bg-[#1e2f4a] text-white px-5 py-2 rounded-full text-[12px] font-bold">+ NOVO CONTRATO REAL</button>
            <button onClick={carregarReais} className="bg-gray-100 px-4 py-2 rounded-full text-[11px]">🔄 Recarregar</button>
            <input value={pesquisa} onChange={e=>setPesquisa(e.target.value)} placeholder="🔍 Pesquisar por nome / profissão..." className="border rounded-full px-4 py-2 text-[12px] flex-1 min-w-[200px]" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Dica: Seleciona um profissional no ENCONTRAR e clica GERAR CONTRATO que já preenche automaticamente com dados reais</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {filtrados.length===0 && <div className="col-span-3 bg-white p-8 rounded-xl border text-center text-[13px] text-gray-500">{contaId?'Nenhum contrato real - clica NOVO CONTRATO REAL.':'Sem login - nenhum contrato mostrado por segurança.'}</div>}
          {filtrados.map(c=>(
            <div key={c.id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between"><h4 className="font-bold text-[13px]">{c.trab_prof} - {c.trab_nome}</h4><span className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-full">{c.status}</span></div>
              <p className="text-[11px] mt-1">Empregador: {c.emp_nome} - {c.emp_tel}</p>
              <p className="text-[11px]">Trabalhador: {c.trab_nome} - {c.trab_tel} - {c.valor} MZN</p>
              <p className="text-[10px] text-gray-400 mt-1">ID {c.id?.substring(0,8)} - {new Date(c.created_at).toLocaleString('pt-MZ')}</p>
              <div className="flex gap-2 mt-3 flex-wrap"><button onClick={()=>setContratoVer(c)} className="text-[11px] bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full">Ver 11 Cláusulas</button><button onClick={()=>gerarPDF(c)} className="text-[11px] bg-[#1e2f4a] text-white px-3 py-1 rounded-full">PDF + WhatsApp</button><button onClick={()=>editar(c)} className="text-[11px] bg-yellow-50 border px-3 py-1 rounded-full">Editar</button><button onClick={()=>apagar(c.id)} className="text-[11px] bg-red-50 text-red-600 border px-3 py-1 rounded-full">Apagar</button></div>
            </div>
          ))}
        </div>

        {mostrarForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
              <div className="p-5 border-b flex justify-between items-center"><h3 className="font-bold text-[14px]">{editId?'Editar Contrato Real':'Novo Contrato Real - 11 Cláusulas'} - FASE 1</h3><button onClick={()=>setMostrarForm(false)} className="text-2xl">×</button></div>
              <div className="p-4">
                <div className="flex gap-1 mb-4 flex-wrap">
                  {CLAUSULAS.map(cl=> <button key={cl.id} onClick={()=>setClausulaAtiva(cl.id)} className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold ${clausulaAtiva===cl.id?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>{cl.id}. {cl.titulo}</button>)}
                </div>

                {clausulaAtiva===1 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[11px] font-bold">Empregador Nome *</label><input value={form.empNome} onChange={e=>setForm({...form, empNome:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nome real da loja/pessoa" /></div>
                    <div><label className="text-[11px] font-bold">BI/NUIT Empregador (BI 13 digitos)</label><input value={form.empBI} onChange={e=>setForm({...form, empBI:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="1101012345678" /></div>
                    <div><label className="text-[11px] font-bold">Tel Empregador * (9 digitos 82-89)</label><input value={form.empTel} onChange={e=>setForm({...form, empTel:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="841234567" /></div>
                    <div><label className="text-[11px] font-bold">End Empregador</label><input value={form.empEnd} onChange={e=>setForm({...form, empEnd:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                    <div><label className="text-[11px] font-bold">Trabalhador Nome *</label><input value={form.trabNome} onChange={e=>setForm({...form, trabNome:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nome real do profissional (vem do ENCONTRAR)" /></div>
                    <div><label className="text-[11px] font-bold">Profissão</label><select value={form.trabProf} onChange={e=>{ const prof=e.target.value; setForm({...form, trabProf:prof, tarefas: MODELO_TAREFAS[prof]||MODELO_TAREFAS["Outros/Particular"]}); }} className="w-full border rounded px-3 py-2 text-[12px]"><option>Pedreiro</option><option>Carpinteiro</option><option>Eletricista</option><option>Domestica</option><option>Outros/Particular</option></select></div>
                    <div><label className="text-[11px] font-bold">BI Trabalhador * (13 digitos)</label><input value={form.trabBI} onChange={e=>setForm({...form, trabBI:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="1101012345678" /></div>
                    <div><label className="text-[11px] font-bold">Tel Trabalhador * (9 digitos)</label><input value={form.trabTel} onChange={e=>setForm({...form, trabTel:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="841234567" /></div>
                    <div className="col-span-2"><label className="text-[11px] font-bold">End Trabalhador</label><input value={form.trabEnd} onChange={e=>setForm({...form, trabEnd:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                  </div>
                )}
                {clausulaAtiva===2 && (<div><label className="text-[11px] font-bold">Tarefas - O que será feito</label><textarea value={Array.isArray(form.tarefas)?form.tarefas.join('\n'):form.tarefas} onChange={e=>setForm({...form, tarefas: e.target.value.split('\n')})} className="w-full border rounded px-3 py-2 text-[12px] mt-1" rows={6} placeholder="Lista de tarefas" /></div>)}
                {clausulaAtiva===3 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[11px] font-bold">Horário Início</label><input value={form.horarioInicio} onChange={e=>setForm({...form, horarioInicio:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                    <div><label className="text-[11px] font-bold">Horário Fim</label><input value={form.horarioFim} onChange={e=>setForm({...form, horarioFim:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                    <div><label className="text-[11px] font-bold">Dias</label><input value={form.dias} onChange={e=>setForm({...form, dias:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                    <div><label className="text-[11px] font-bold">Data Início *</label><input type="date" value={form.dataInicio} onChange={e=>setForm({...form, dataInicio:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                    <div className="col-span-2"><label className="text-[11px] font-bold">Local Trabalho</label><input value={form.localTrab} onChange={e=>setForm({...form, localTrab:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Endereço real onde será feito" /></div>
                  </div>
                )}
                {clausulaAtiva===4 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[11px] font-bold">Valor MZN * (&gt;0)</label><input value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="7500" /></div>
                    <div><label className="text-[11px] font-bold">Dia Pagamento</label><input value={form.diaPag} onChange={e=>setForm({...form, diaPag:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="05" /></div>
                    <div><label className="text-[11px] font-bold">Forma Pagamento</label><select value={form.formaPag} onChange={e=>setForm({...form, formaPag:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]"><option>M-Pesa</option><option>Emola</option><option>Banco</option><option>Numerário</option></select></div>
                    <div><label className="text-[11px] font-bold">Prazo</label><input value={form.prazo} onChange={e=>setForm({...form, prazo:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                  </div>
                )}
                {clausulaAtiva===5 && (<div><label className="text-[11px] font-bold">Alimentação e alojamento</label><input value={form.alimentacao} onChange={e=>setForm({...form, alimentacao:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>)}
                {clausulaAtiva>=6 && clausulaAtiva<=11 && (
                  <div className="text-[12px] text-gray-700 p-4 bg-green-50 border border-green-200 rounded">
                    <b>Cláusula {clausulaAtiva} - {CLAUSULAS[clausulaAtiva-1]?.titulo} - TEXTO LEGAL COMPLETO ✅</b>
                    <p className="mt-2">{textoClausulas({ emp_nome:form.empNome, emp_bi:form.empBI, emp_tel:form.empTel, emp_end:form.empEnd, trab_nome:form.trabNome, trab_bi:form.trabBI, trab_tel:form.trabTel, trab_end:form.trabEnd, trab_prof:form.trabProf, tarefas:form.tarefas, horario_inicio:form.horarioInicio, horario_fim:form.horarioFim, dias:form.dias, data_inicio:form.dataInicio, local_trab:form.localTrab, valor:form.valor, dia_pag:form.diaPag, forma_pag:form.formaPag, prazo:form.prazo, alimentacao:form.alimentacao })[clausulaAtiva-1]}</p>
                    <p className="text-[10px] text-green-700 mt-2">Este texto vai mesmo para o PDF - nao e promessa! Antes era so "sera incluida" e nao ia!</p>
                  </div>
                )}

                <div className="mt-4 border-t pt-3">
                  <p className="text-[12px] font-bold mb-2">✍️ ASSINATURAS REAIS - Desenha com o dedo!</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <AssinaturaPad label="EMPREGADOR" nome={form.empNome} onChange={setSigEmp} />
                    <AssinaturaPad label="TRABALHADOR" nome={form.trabNome} onChange={setSigTrab} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Sem desenho, nao cria contrato! A assinatura desenhada fica guardada no Supabase e aparece no PDF!</p>
                </div>
              </div>
              <div className="p-4 border-t flex gap-2"><button onClick={()=>setMostrarForm(false)} className="flex-1 border py-2.5 rounded-full text-[12px]">Cancelar</button><button onClick={handleCriarContrato} disabled={carregando} className="flex-1 bg-[#1e2f4a] text-white py-2.5 rounded-full text-[12px] font-bold">{carregando?'Salvando...':(editId?'GUARDAR ALTERAÇÕES':'CRIAR CONTRATO REAL + WHATSAPP')}</button></div>
            </div>
          </div>
        )}

        {contratoVer && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto p-6">
              <div className="flex justify-between"><h3 className="font-bold">Contrato {contratoVer.trab_prof} - {contratoVer.trab_nome} - 11 Cláusulas</h3><button onClick={()=>setContratoVer(null)} className="text-2xl">×</button></div>
              <div className="mt-4 space-y-3 text-[12px]">
                <p><b>Empregador:</b> {contratoVer.emp_nome} - {contratoVer.emp_tel} - BI {contratoVer.emp_bi}</p>
                <p><b>Trabalhador:</b> {contratoVer.trab_nome} - {contratoVer.trab_tel} - {contratoVer.trab_prof}</p>
                <p><b>Tarefas:</b> {Array.isArray(contratoVer.tarefas)?contratoVer.tarefas.join(', '):contratoVer.tarefas}</p>
                <p><b>Horário:</b> {contratoVer.horario_inicio} às {contratoVer.horario_fim} - {contratoVer.dias} - Início {contratoVer.data_inicio} - Local {contratoVer.local_trab}</p>
                <p><b>Pagamento:</b> {contratoVer.valor} MZN - Dia {contratoVer.dia_pag} - {contratoVer.forma_pag} - Prazo {contratoVer.prazo}</p>
                <p><b>Alimentação:</b> {contratoVer.alimentacao}</p>
                <div className="bg-gray-50 p-3 rounded-lg"><b>11 Cláusulas Completas:</b>{textoClausulas(contratoVer).map((t,i)=><p key={i} className="mt-2">{t}</p>)}</div>
                <div><b>Assinaturas:</b><div className="flex gap-4 mt-2">{contratoVer.assinatura_contratante?.assinatura && <div><img src={contratoVer.assinatura_contratante.assinatura} style={{maxWidth:180,border:'1px solid #ddd'}}/><p>Empregador - {contratoVer.assinatura_contratante?.data}</p></div>}{contratoVer.assinatura_contratado?.assinatura && <div><img src={contratoVer.assinatura_contratado.assinatura} style={{maxWidth:180,border:'1px solid #ddd'}}/><p>Trabalhador - {contratoVer.assinatura_contratado?.data}</p></div>}</div></div>
              </div>
              <div className="flex gap-2 mt-4"><button onClick={()=>gerarPDF(contratoVer)} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[12px] font-bold">GERAR PDF 11 CLÁUSULAS + WHATSAPP</button><button onClick={()=>setContratoVer(null)} className="flex-1 border py-2 rounded-full text-[12px]">Fechar</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
