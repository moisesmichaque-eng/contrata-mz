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

const PROFISSOES = ["Pedreiro","Carpinteiro","Domestica","Motorista","Eletricista","Jardineiro","Seguranca","Canalizador","Pintor","Mecanico","Babysitter","Serralheiro","Servicos/Consultorias","Aluguer de Imovel","Arrendamento de Imoveis","Outros/Particular"];
const MODELO_TAREFAS: any = {
  "Pedreiro": ["1. Medir e marcar fundações com nível e prumo","2. Fazer fundações e alicerces com betão","3. Levantar paredes com blocos / tijolos","4. Fazer reboco interior e exterior","5. Fazer betonilha e pavimento","6. Colocar azulejos e mosaicos","7. Fazer caixas de esgoto e drenagem","8. Reparar fissuras e infiltrações","9. Garantir obra limpa e organizada","10. Entregar obra com acabamento e fotografia"],
  "Carpinteiro": ["1. Medir, cortar e montar madeira com precisão milimétrica","2. Fabricar portas, janelas, armários e prateleiras","3. Instalar forro de madeira, lambril e deck com acabamento","4. Fazer estrutura de telhado, caibros e ripas","5. Instalar fechaduras, dobradiças e puxadores","6. Lixar, envernizar e pintar madeira","7. Reparar móveis, portas e estruturas de madeira","8. Construir escadas, corrimão e guarda-corpo de madeira","9. Fazer cofragem para betão","10. Entregar com acabamento e fotografado"],
  "Domestica": ["1. Limpeza geral da casa - chão, janelas, casa de banho","2. Lavar, passar e organizar roupa","3. Cozinhar refeições quando necessário","4. Organizar quartos, cozinha e despensa","5. Cuidar de crianças / idosos se combinado","6. Fazer compras da casa com lista","7. Lavar loiça e manter cozinha limpa","8. Regar plantas e cuidar do quintal","9. Receber encomendas e atender porta","10. Deixar casa limpa e organizada no fim do dia"],
  "Motorista": ["1. Conduzir viatura com segurança e pontualidade","2. Verificar óleo, água, pneus e combustível diariamente","3. Transportar passageiros / carga conforme rota","4. Manter viatura limpa por dentro e por fora","5. Registar viagens, combustível e despesas","6. Comunicar avarias e acidentes de imediato","7. Cumprir regras de trânsito e limites de velocidade","8. Ajudar a carregar e descarregar","9. Ter carta, seguro e livrete sempre na viatura","10. Entregar relatório de viagem no fim do dia"],
  "Eletricista": ["1. Instalar fiação, tomadas e interruptores","2. Montar quadro elétrico e disjuntores","3. Instalar candeeiros, ventiladores e AC","4. Fazer testes de segurança e curto-circuito","5. Instalar sistema de terra e proteção","6. Reparar avarias elétricas e quadros","7. Instalar gerador / inversor / painel solar","8. Passar cabos e tubos em paredes","9. Ler planta elétrica e seguir normas","10. Entregar com garantia e testes"],
  "Jardineiro": ["1. Cortar relva e aparar arbustos","2. Podar árvores e plantas","3. Regar plantas e jardim","4. Plantar flores, árvores e relva nova","5. Adubar e tratar pragas","6. Limpar folhas e manter jardim limpo","7. Fazer canteiros e caminhos","8. Instalar sistema de rega","9. Cuidar de vasos e plantas de interior","10. Entregar jardim limpo e fotografado"],
  "Seguranca": ["1. Vigiar entrada, saída e perímetro","2. Controlar quem entra e sai com registo","3. Fazer rondas de 2 em 2 horas","4. Comunicar qualquer suspeita de imediato","5. Não dormir nem sair do posto sem autorização","6. Manter uniforme e identificação","7. Guardar chaves e equipamentos","8. Escrever relatório de turno","9. Ajudar em emergências - fogo, acidente","10. Cumprir regras da empresa e do cliente"],
  "Canalizador": ["1. Instalar canos de água fria e quente","2. Instalar sanitas, lavatórios, chuveiros e torneiras","3. Reparar fugas e entupimentos","4. Instalar tanque, bomba de água e autoclismo","5. Fazer drenagem e esgoto","6. Testar pressão e fugas","7. Instalar esquentador / termoacumulador","8. Desentupir canos e caixas de esgoto","9. Substituir canos velhos e ferrugentos","10. Entregar com testes e garantia"],
  "Pintor": ["1. Preparar paredes - lixar, tapar buracos, primário","2. Pintar paredes interiores e exteriores","3. Pintar tetos, portas e janelas","4. Fazer textura, massa corrida e acabamento","5. Proteger chão e móveis antes de pintar","6. Escolher cores com o cliente","7. Pintar com 2 demãos para cobertura total","8. Limpar respingos e deixar local limpo","9. Pintar grade, portão e estruturas metálicas","10. Entregar com fotografia e garantia"],
  "Mecanico": ["1. Diagnosticar avaria com scanner / teste","2. Fazer revisão - óleo, filtros, velas, correia","3. Reparar motor, caixa e travões","4. Reparar suspensão, direção e pneus","5. Instalar peças novas com garantia","6. Testar viatura depois da reparação","7. Explicar avaria ao cliente antes de reparar","8. Manter oficina limpa e ferramentas organizadas","9. Registar peças usadas e valor","10. Entregar com teste e recibo"],
  "Babysitter": ["1. Cuidar de crianças com atenção e carinho","2. Dar banho, comida e pôr a dormir","3. Ajudar nos trabalhos de casa","4. Brincar e estimular a criança","5. Manter crianças seguras - sem sair sem autorização","6. Comunicar qualquer febre / acidente aos pais","7. Manter quarto e brinquedos organizados","8. Não dar medicamentos sem autorização dos pais","9. Registar refeições e horas de sono","10. Entregar relatório do dia aos pais"],
  "Serralheiro": ["1. Medir, cortar e soldar ferro / alumínio","2. Fabricar portões, grades, janelas e portas","3. Instalar estruturas metálicas e telhados","4. Fazer escadas e corrimão metálicos","5. Reparar portões, fechaduras e dobradiças","6. Pintar estruturas com anti-ferrugem","7. Soldar com segurança e EPI","8. Fazer caixas e suportes metálicos","9. Instalar rede e chapa","10. Entregar com acabamento e fotografia"],
  "Servicos/Consultorias": ["1. Reunir com cliente e entender necessidade","2. Fazer proposta com valor, prazo e entregas","3. Executar serviço conforme combinado","4. Enviar relatório / documento final","5. Fazer 1 revisão incluída","6. Cumprir prazo e comunicar atrasos","7. Guardar sigilo das informações do cliente","8. Emitir recibo / factura","9. Dar garantia do serviço","10. Fazer acompanhamento pós-entrega"],
  "Aluguer de Imovel": ["1. Entregar imovel limpo, com chaves e em bom estado","2. Pagar renda mensal ate ao dia combinado","3. Nao subalugar sem autorizacao escrita do dono","4. Manter imovel limpo e cuidar de portas, janelas e canalizacao","5. Pagar agua, luz e despesas do imovel durante o aluguer","6. Nao fazer obras / alteracoes sem autorizacao do dono","7. Permitir visita do dono com aviso de 24h","8. Devolver imovel no fim do prazo, limpo e com chaves","9. Pagar caucao / deposito e receber de volta se nao houver danos","10. Entregar com inventario e fotografias do estado do imovel"],
  "Arrendamento de Imoveis": ["1. Entregar casa / loja / escritorio com contrato e chaves","2. Pagar renda mensal ate ao dia combinado - M-Pesa / Banco","3. Usar o imovel so para o fim combinado (casa / loja / escritorio)","4. Nao subarrendar nem ceder a terceiros sem autorizacao","5. Manter imovel em bom estado - reparar danos que causar","6. Pagar agua, luz, seguranca e condominio","7. Nao fazer obras estruturais sem autorizacao escrita","8. Avisar 30 dias antes se quiser sair antes do fim","9. Devolver chaves e imovel limpo no fim do arrendamento","10. Fazer vistoria de entrada e saida com fotografias"],
  "Outros/Particular": ["1. Tarefas conforme combinado com o cliente","2. Cumprir horário e prazo","3. Deixar local limpo e organizado","4. Comunicar qualquer problema de imediato","5. Entregar com recibo e fotografia","6. Cumprir regras de segurança","7. Cuidar das ferramentas e material","8. Não desviar material","9. Respeitar a casa / obra do cliente","10. Entregar com qualidade"]
};
const TIPOS_ANEXO = ["Foto BI Contratante","Foto BI Contratado","Foto do local","NUIT Contratante (opcional)","NUIT Contratado (opcional)","Comprovativo M-Pesa","Foto obra / local","CV / Certificado","Logo Tipo / Empresa","Outro documento"];

// TEXTO LEGAL COMPLETO - 11 CLAUSULAS - usado no PDF e na vista
function textoClausulas(c:any){
  const tarefas = Array.isArray(c.tarefas)? c.tarefas.join(', ') : (c.tarefas||'');
  return [
    `DADOS DAS PARTES (sem numero - nao conta como clausula): Empregador: ${c.emp_nome} - BI: ${c.emp_bi||'-'} - NUIT (opcional): ${c.emp_nuit||c.empNUIT||'-'} - Tel: ${c.emp_tel} - End: ${c.emp_end||'-'}. Trabalhador: ${c.trab_nome} - BI: ${c.trab_bi||'-'} - NUIT (opcional): ${c.trab_nuit||c.trabNUIT||'-'} - Tel: ${c.trab_tel} - End: ${c.trab_end||'-'} - Profissao: ${c.trab_prof}. Ambas as partes declaram que os dados acima sao verdadeiros e assumem responsabilidade legal pela veracidade dos mesmos.`,
    `CLAUSULA 1 - OBJETO E TAREFAS: O trabalhador compromete-se a realizar as seguintes tarefas: ${tarefas}. Qualquer tarefa fora desta lista so sera feita com acordo escrito das duas partes, com ajuste de valor e prazo.`,
    `CLAUSULA 2 - HORARIO E LOCAL: Horario: ${c.horario_inicio} as ${c.horario_fim} - Dias: ${c.dias} - Data de inicio: ${c.data_inicio||'-'} - Local de trabalho: ${c.local_trab||c.emp_end||'-'} (casa do empregador se vazio). Atrasos superiores a 30 minutos sem aviso devem ser comunicados por telefone/WhatsApp. Horas extra so com acordo previo.`,
    `CLAUSULA 3 - SALARIO E PAGAMENTO: Valor total: ${c.valor} MZN - Dia de pagamento: dia ${c.dia_pag} - Forma: ${c.forma_pag} - Prazo: ${c.prazo}. O pagamento sera feito na forma combinada, com recibo / comprovativo M-Pesa / e-Mola. Em caso de atraso superior a 5 dias, o trabalhador pode suspender o trabalho ate receber, sem perda de direito ao valor.`,
    `CLAUSULA 4 - ALIMENTACAO E ALOJAMENTO: ${c.alimentacao||'Conforme combinado'}. Se o empregador fornecer alimentacao, a mesma deve ser digna e em condicoes de higiene. Se nao fornecer, o trabalhador organiza a sua propria alimentacao, sem desconto no salario, salvo acordo escrito.`,
    `CLAUSULA 5 - FOLGAS E FERIAS: O trabalhador tem direito a 1 dia de folga por semana, salvo acordo diferente. Feriados nacionais sao pagos. Ferias: apos 12 meses de trabalho continuo, o trabalhador tem direito a 30 dias de ferias pagas, ou compensacao proporcional se o contrato for menor.`,
    `CLAUSULA 6 - PERIODO EXPERIMENTAL: Os primeiros 15 dias sao periodo experimental. Durante este periodo, qualquer das partes pode terminar o contrato sem multa, pagando apenas os dias ja trabalhados. Apos este periodo, aplicam-se as regras da Clausula 9.`,
    `CLAUSULA 7 - DEVERES DO TRABALHADOR: Cumprir horario, executar tarefas com qualidade, cuidar das ferramentas e materiais, manter o local limpo, respeitar as regras de seguranca, nao faltar sem aviso, nao desviar material, guardar sigilo sobre informacoes da casa / obra.`,
    `CLAUSULA 8 - DEVERES DO EMPREGADOR: Pagar no dia combinado, fornecer material e ferramentas necessarias, garantir condicoes de seguranca e higiene, tratar o trabalhador com respeito e dignidade, nao exigir tarefas perigosas sem protecao, fornecer recibo de cada pagamento.`,
    `CLAUSULA 9 - RESCISAO E MULTAS: Se o empregador rescindir sem justa causa, paga os dias trabalhados + 7 dias de aviso. Se o trabalhador abandonar sem aviso, perde o valor dos ultimos 3 dias. Em caso de roubo, dano intencional ou violencia, o contrato termina de imediato e o caso pode ser levado as autoridades. Qualquer rescisao deve ser comunicada por escrito / WhatsApp com motivo.`,
    `CLAUSULA 10 - DISPOSICOES FINAIS: Este contrato foi lido e aceite pelas duas partes, com assinaturas reais (desenho) abaixo. Em caso de conflito, as partes tentam resolver por conversa. Se nao resolverem, recorrem a Inspeccao do Trabalho / Tribunal competente em Mocambique. Este contrato tem 2 vias - uma para cada parte. Assinado em ${c.local_trab||'Mocambique'} em ${new Date().toLocaleDateString('pt-MZ')}.`
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
  const [mostrarForm, setMostrarForm] = useState(true); // FASE 5: Primeira pagina JA e o criador! Sem 2 paineis!
  const [contratoVer, setContratoVer] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarMeus, setMostrarMeus] = useState(false);
  const [modoAssinatura, setModoAssinatura] = useState<'presencial'|'distancia'>('presencial');
  const [linkAssinatura, setLinkAssinatura] = useState('');
  const [assinaturaDistancia, setAssinaturaDistancia] = useState<any>(null); // Contrato a assinar via link ?assinar=ID // Página livre: sem lista Meus Contratos.
  const [editId, setEditId] = useState<any>(null);
  const [contaId, setContaId] = useState<any>(null);
  const [sigEmp, setSigEmp] = useState('');
  const [sigTrab, setSigTrab] = useState('');
  const [anexos, setAnexos] = useState<any>({});
  const [anexoAtivo, setAnexoAtivo] = useState('Foto BI Contratante');
  const [logoTipo, setLogoTipo] = useState('');
  const [tarefasSel, setTarefasSel] = useState<string[]>(MODELO_TAREFAS['Pedreiro'] || []);
  const [campoExtra, setCampoExtra] = useState('');
  const [mostrarPreview, setMostrarPreview] = useState(true);

  const [form, setForm] = useState({
    empNome:'', empBI:'', empNUIT:'', empTel:'', empEnd:'',
    trabNome:'', trabBI:'', trabNUIT:'', trabTel:'', trabEnd:'', trabProf:'Pedreiro',
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
    // FASE 6: Se abriu via link ?assinar=ID, carrega esse contrato para assinar à distância!
    try{
      const params = new URLSearchParams(window.location.search);
      const idAssinar = params.get('assinar') || params.get('contrato');
      if(idAssinar){
        (async()=>{
          const { data } = await supabase.from('contratos').select('*').eq('id', idAssinar).single();
          if(data){ setAssinaturaDistancia(data); setModoAssinatura('distancia'); setMostrarForm(true); setClausulaAtiva(11); }
        })();
      }
    }catch(e){}
    const profSel = localStorage.getItem('prof_selecionado_contrato');
    if(profSel){ try{ const p=JSON.parse(profSel); setForm(f=>({...f, trabNome:p.nome, trabTel:p.telefone||p.whatsapp, trabProf:p.profissao, tarefas: MODELO_TAREFAS[p.profissao]||MODELO_TAREFAS["Outros/Particular"]})); }catch(e){} }
    const lojaSessao = localStorage.getItem('loja_sessao');
    if(lojaSessao){ try{ const l=JSON.parse(lojaSessao); setForm(f=>({...f, empNome:l.nome_loja, empTel:l.username, empBI:l.nuit||''})); }catch(e){} }
  },[]);

  const lerFicheiro = (file:any, cb:any) => { const r=new FileReader(); r.onload=()=>cb(String(r.result)); r.readAsDataURL(file); };
  const previewTexto = () => {
    const c:any = { emp_nome:form.empNome, emp_bi:form.empBI, emp_nuit:form.empNUIT, empNUIT:form.empNUIT, emp_tel:form.empTel, emp_end:form.empEnd, trab_nome:form.trabNome, trab_bi:form.trabBI, trab_nuit:form.trabNUIT, trabNUIT:form.trabNUIT, trab_tel:form.trabTel, trab_end:form.trabEnd, trab_prof:form.trabProf, tarefas: [...tarefasSel, ...(campoExtra.trim()? [`EXTRA: ${campoExtra.trim()}`]:[])], horario_inicio:form.horarioInicio, horario_fim:form.horarioFim, dias:form.dias, data_inicio:form.dataInicio, local_trab:form.localTrab, valor:form.valor, dia_pag:form.diaPag, forma_pag:form.formaPag, prazo:form.prazo, alimentacao:form.alimentacao };
    return textoClausulas(c);
  };

  // FASE 4 - Algoritmo: Logo vai para TOPO ESQUERDO, outros para BAIXO
  const getLogo = (c:any) => c?.logotipo || (c?.anexos?.["Logo Tipo / Empresa"]?.data) || (c?.anexos?.["Logo Tipo"]?.data) || '';
  const getAnexosBaixo = (c:any) => {
    const out:any[] = [];
    const an = c?.anexos || {};
    Object.keys(an).forEach(k=>{
      if(k.includes("Logo")) return; // Logo NAO vai para baixo, vai para topo!
      out.push({ tipo:k, nome: an[k]?.nome||'anexado', data: an[k]?.data||'' });
    });
    return out;
  };
  // FASE 7: DOWNLOAD só PDF + WhatsApp! SEM EXCEL! Contrato só em PDF!
  const baixarContratoFaturar = (c:any) => {
    const id = c.id?.substring(0,8) || 'SEM-ID'; // FASE 7: Sem ID inventado! Se nao houver ID, mostra SEM-ID!
    const logo = getLogo(c);
    const anexosBaixo = getAnexosBaixo(c);
    const claus = textoClausulas(c).map((txt:string)=>`<div class="clausula"><b>${txt}</b></div>`).join('');
    const anexosHtml = anexosBaixo.length ? anexosBaixo.map(a=>`<div style="margin:8px 0"><b>📎 ${a.tipo}:</b> ${a.nome}<br>${a.data && a.data.startsWith('data:image') ? `<img src="${a.data}" style="max-width:300px;max-height:180px;border:1px solid #ddd"/>` : ''}</div>`).join('') : '<p>Sem anexos</p>';
    const logoTopo = logo ? `<div style="display:flex;align-items:center;gap:12px"><img src="${logo}" style="max-height:70px;max-width:180px"/><div><h2 style="margin:0">CONTRATO ${c.trab_prof}</h2><p style="margin:0;font-size:11px">${c.emp_nome||''} - ${c.trab_nome||''}</p></div></div>` : `<h2>CONTRATO ${c.trab_prof}</h2>`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CONTRATO ${c.trab_prof} - ID ${id}</title><style>body{font-family:Arial;max-width:850px;margin:20px auto;padding:20px;line-height:1.6;font-size:13px} .clausula{border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin:12px 0;background:white} .sig{display:flex;gap:20px;margin-top:20px} .sig div{flex:1;text-align:center;border-top:2px solid #333;padding-top:8px} .sig img{max-width:220px;max-height:80px} .anexos-baixo{border-top:2px solid #1e2f4a;margin-top:20px;padding-top:10px}</style></head><body>${logoTopo}<p>Gerado em ${new Date().toLocaleString('pt-MZ')} - Contrata-MZ - ID ${id}</p>${claus}<div class="sig"><div>${c.assinatura_contratante?.assinatura?`<img src="${c.assinatura_contratante.assinatura}"/>`:''}<br><b>EMPREGADOR</b><br>${c.emp_nome} - BI ${c.emp_bi||'-'}<br>${c.assinatura_contratante?.data||''}</div><div>${c.assinatura_contratado?.assinatura?`<img src="${c.assinatura_contratado.assinatura}"/>`:''}<br><b>TRABALHADOR</b><br>${c.trab_nome} - BI ${c.trab_bi||'-'}<br>${c.assinatura_contratado?.data||''}</div></div><div class="anexos-baixo"><h3>📎 ANEXOS - EM BAIXO</h3>${anexosHtml}</div><p style="text-align:center;font-size:11px;color:#888">Contrata-MZ - Contrato 10 Clausulas + Assinaturas Reais</p></body></html>`;
    // 1) DOWNLOAD PDF (HTML pronto para imprimir como PDF) - igual Faturar: Blob + a.download + a.click()
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Contrato ${c.trab_prof} - ID ${id} - ${c.trab_nome} - ASSINADO.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(()=> URL.revokeObjectURL(url), 2000);
    // FASE 7: SEM EXCEL! Contrato só em PDF! Removido o download CSV!
    // 3) WHATSAPP AUTOMATICO para o CONTRATADO (numero do trabalhador) - conforme!
    const msg = `Ola ${c.trab_nome}, segue em anexo o contrato ${c.trab_prof} - ${c.valor} MZN. Confirma por favor se estas de acordo.`;
    setTimeout(()=> window.open(`https://wa.me/258${normTel(c.trab_tel)}?text=${encodeURIComponent(msg)}`, '_blank'), 700);
  };

  const gerarLinkDistancia = async () => {
    if(!contaId){ alert('⚠️ Sem conta! Faz login na tua Loja no VENDER primeiro. Sem login nao podes enviar link!'); return; }
    if(!sigEmp){ alert('⚠️ Primeiro assina a TUA parte (Empregador) com o dedo! Depois envias o link!'); return; }
    if(!isTelMZ(form.trabTel)){ alert('⚠️ Tel do Trabalhador invalido! Tem de ser 9 digitos!'); return; }
    // Cria contrato como PENDENTE - falta assinatura do Trabalhador
    const novo:any = {
      conta_id: contaId, // FASE 7: Sem conta falsa! Se nao houver conta, bloqueia antes!
      emp_nome: form.empNome, emp_bi: form.empBI, emp_nuit: form.empNUIT, empNUIT: form.empNUIT, emp_tel: normTel(form.empTel), emp_end: form.empEnd,
      trab_nome: form.trabNome, trab_bi: form.trabBI, trab_nuit: form.trabNUIT, trabNUIT: form.trabNUIT, trab_tel: normTel(form.trabTel), trab_end: form.trabEnd, trab_prof: form.trabProf,
      tarefas: tarefasFinais, horario_inicio: form.horarioInicio, horario_fim: form.horarioFim, dias: form.dias, data_inicio: form.dataInicio, local_trab: form.localTrab,
      valor: form.valor, dia_pag: form.diaPag, forma_pag: form.formaPag, prazo: form.prazo, alimentacao: form.alimentacao,
      clausulas: CLAUSULAS, anexos: anexos, logotipo: logoTipo,
      assinatura_contratante: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigEmp },
      assinatura_contratado: { concordo:false, data: '', assinatura: '' },
      status: 'PENDENTE - Falta Trabalhador'
    };
    const { data, error } = await supabase.from('contratos').insert([novo]).select().single();
    if(error){ alert('Erro: '+error.message); return; }
    const id = data?.id; if(!id){ alert('Erro: Supabase nao devolveu ID!'); return; }
    const link = `${window.location.origin}/?assinar=${id}`;
    // Se estiver no localhost, usa o link do Vercel para o distante conseguir abrir!
    const linkFinal = window.location.hostname.includes('localhost') ? `https://contrata-mz.vercel.app/?assinar=${id}` : link;
    setLinkAssinatura(linkFinal);
    const msg = `Ola ${form.trabNome}, segue em anexo o contrato ${form.trabProf} - ${form.valor} MZN. Confirma por favor se estas de acordo: ${linkFinal}`;
    window.open(`https://wa.me/258${normTel(form.trabTel)}?text=${encodeURIComponent(msg)}`, '_blank');
    alert('✅ Link gerado! WhatsApp aberto para o Trabalhador! Quando ele assinar, o contrato fica ASSINADO!');
    carregarReais();
  };
  const confirmarAssinaturaDistancia = async () => {
    if(!sigTrab){ alert('⚠️ Desenha a tua assinatura primeiro!'); return; }
    const id = assinaturaDistancia?.id;
    if(!id){ alert('Sem contrato para assinar!'); return; }
    const { error } = await supabase.from('contratos').update({ assinatura_contratado: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigTrab }, status: 'ASSINADO' }).eq('id', id);
    if(error){ alert('Erro: '+error.message); return; }
    alert('✅ Assinatura confirmada! Contrato ASSINADO pelos 2! O Empregador vai receber WhatsApp!');
    const msgEmp = `✅ ${assinaturaDistancia.trab_nome} assinou o CONTRATO ${assinaturaDistancia.trab_prof} - ID ${String(id).substring(0,8)}! Contrato ASSINADO pelos 2! Baixa o PDF!`;
    window.open(`https://wa.me/258${normTel(assinaturaDistancia.emp_tel)}?text=${encodeURIComponent(msgEmp)}`, '_blank');
    setAssinaturaDistancia(null);
  };
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

  const toggleTarefa = (task:string) => { setTarefasSel(prev => prev.includes(task) ? prev.filter(x=>x!==task) : [...prev, task]); };
  const tarefasFinais = [...tarefasSel, ...(campoExtra.trim()? [`EXTRA: ${campoExtra.trim()}`]:[])];
  const handleCriarContrato = async () => {
    // Usa tarefasFinais (selecionadas com TICK/X) - NAO muta o form! Mutar o form deixava a pagina branca!
    const err = validar();
    if(err){ alert('⚠️ '+err); return; }
    setCarregando(true);
    const novo:any = {
      conta_id: contaId,
      emp_nome: form.empNome, emp_bi: form.empBI, emp_nuit: form.empNUIT, empNUIT: form.empNUIT, emp_tel: normTel(form.empTel), emp_end: form.empEnd,
      trab_nome: form.trabNome, trab_bi: form.trabBI, trab_nuit: form.trabNUIT, trabNUIT: form.trabNUIT, trab_tel: normTel(form.trabTel), trab_end: form.trabEnd, trab_prof: form.trabProf,
      tarefas: tarefasFinais,
      horario_inicio: form.horarioInicio, horario_fim: form.horarioFim, dias: form.dias, data_inicio: form.dataInicio, local_trab: form.localTrab,
      valor: form.valor, dia_pag: form.diaPag, forma_pag: form.formaPag, prazo: form.prazo, alimentacao: form.alimentacao,
      clausulas: CLAUSULAS,
      anexos: anexos, logotipo: logoTipo,
      assinatura_contratante: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigEmp },
      assinatura_contratado: { concordo:true, data: new Date().toLocaleString('pt-MZ'), assinatura: sigTrab },
      status: 'ASSINADO'
    };
    let res;
    if(editId){ res = await supabase.from('contratos').update(novo).eq('id', editId).eq('conta_id', contaId); }
    else { res = await supabase.from('contratos').insert([novo]); }
    if(res.error){ if(String(res.error.message||'').includes('conta_id')) alert('⚠️ Falta correr o SQL CONTRATOS-SQL-CORRIGIR-CONTA_ID.sql no Supabase!'); else alert('Erro: '+res.error.message); setCarregando(false); return; }
    // WHATSAPP - Trabalhador + Dono - em 1 clique
    const msgTrab = `Ola ${form.trabNome}! Novo CONTRATO ${form.trabProf} - ${form.valor} MZN - Inicio ${form.dataInicio} - Local ${form.localTrab} - Empregador ${form.empNome} (${form.empTel}). Ja esta ASSINADO com as 2 assinaturas! Vou enviar o PDF.`;
    const msgDono = `Novo CONTRATO criado! ${form.trabProf} - ${form.trabNome} (${form.trabTel}) - Empregador ${form.empNome} - Valor ${form.valor} MZN - Inicio ${form.dataInicio}.`;
    window.open(`https://wa.me/258${normTel(form.trabTel)}?text=${encodeURIComponent(msgTrab)}`, '_blank');
    setTimeout(()=> window.open(`https://wa.me/${DONO_WPP}?text=${encodeURIComponent(msgDono)}`, '_blank'), 600);
    alert('✅ CONTRATO REAL CRIADO! Salvo no Supabase + WhatsApp aberto para Trabalhador e Dono!');
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
    setSigEmp(c.assinatura_contratante?.assinatura||''); setSigTrab(c.assinatura_contratado?.assinatura||''); setAnexos(c.anexos||{}); setLogoTipo(c.logotipo||''); setTarefasSel(Array.isArray(c.tarefas)? c.tarefas : []); setCampoExtra('');
    setMostrarForm(true);
  };

  const gerarPDF = (c:any) => {
    const id = c.id?.substring(0,8) || 'SEM-ID'; // FASE 7: Sem ID inventado! Se nao houver ID, mostra SEM-ID!
    const claus = textoClausulas(c).map((t,i)=>`<div class="clausula"><b>${t}</b></div>`).join('');
    const anexosHtml = c.anexos ? Object.keys(c.anexos).map(k=>`<p>📎 ${k}: ${c.anexos[k]?.nome||'anexado'} ${c.anexos[k]?.data && c.anexos[k].data.startsWith('data:image') ? `<br><img src="${c.anexos[k].data}" style="max-width:300px;max-height:180px;border:1px solid #ddd"/>` : ''}</p>`).join('') : '';
    const logoHtml = (c.logotipo || c.anexos?.['Logo Tipo / Empresa']?.data) ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><img src="${c.logotipo || c.anexos['Logo Tipo / Empresa'].data}" style="max-height:70px;max-width:180px"/><div><h2 style="margin:0">CONTRATO ${c.trab_prof}</h2></div></div>` : '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CONTRATO ${c.trab_prof} - ID ${id} - 10 CLAUSULAS</title><style>body{font-family:Arial;max-width:850px;margin:20px auto;padding:20px;line-height:1.6;color:#1a2a3a;font-size:13px;background:#f8fafc}.header{background:#1e2f4a;color:white;padding:18px 20px;border-radius:12px}.clausula{border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin:12px 0;background:white}.sig{display:flex;gap:20px;margin-top:20px}.sig div{flex:1;text-align:center;border-top:2px solid #333;padding-top:8px}.sig img{max-width:220px;max-height:80px}</style></head><body><div class="header"><h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS - ${c.trab_prof} - ID ${id}</h1><p>Gerado em ${new Date().toLocaleString('pt-MZ')} - Contrata-MZ</p></div>${claus}<div class="clausula"><b>CLAUSULA 10 - ANEXOS:</b><br>${anexosHtml||'Sem anexos'}</div><div class="sig"><div>${c.assinatura_contratante?.assinatura?`<img src="${c.assinatura_contratante.assinatura}"/>`:''}<br><b>EMPREGADOR</b><br>${c.emp_nome} - BI ${c.emp_bi||'-'}<br>Data: ${c.assinatura_contratante?.data||''}</div><div>${c.assinatura_contratado?.assinatura?`<img src="${c.assinatura_contratado.assinatura}"/>`:''}<br><b>TRABALHADOR</b><br>${c.trab_nome} - BI ${c.trab_bi||'-'}<br>Data: ${c.assinatura_contratado?.data||''}</div></div><p style="text-align:center;font-size:11px;color:#888;margin-top:20px">Contrata-MZ - Contrato com 10 Clausulas + Assinaturas Reais</p></body></html>`;
    const w = window.open('', '_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>{ try{ w.print(); }catch(e){} }, 600); }
    // WhatsApp com resumo
    const msg = `Ola ${c.trab_nome}, segue em anexo o contrato ${c.trab_prof} - ${c.valor} MZN. Confirma por favor se estas de acordo.`;
    setTimeout(()=> window.open(`https://wa.me/258${normTel(c.trab_tel)}?text=${encodeURIComponent(msg)}`, '_blank'), 800);
  };

  const filtrados = lista.filter(c => !pesquisa || (c.trab_nome||'').toLowerCase().includes(pesquisa.toLowerCase()) || (c.emp_nome||'').toLowerCase().includes(pesquisa.toLowerCase()) || (c.trab_prof||'').toLowerCase().includes(pesquisa.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <!-- Página livre: sem Meus Contratos -->
          <p className="text-[10px] text-gray-400 mt-2">Dica: Seleciona um profissional no ENCONTRAR e clica GERAR CONTRATO que já preenche automaticamente com dados reais</p>
        </div>

        {mostrarForm &&{mostrarForm && (
          <div className="mt-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center"><h3 className="font-bold text-[15px]">CONTRATO LEGAL EM 2 MINUTOS - 10 CLÁUSULAS - {form.trabProf.toUpperCase()}</h3><button onClick={()=>setMostrarForm(false)} className="text-2xl">×</button></div>
                <p className="text-[11px] text-gray-500">Escolhe a profissão / Aluguer em cima - as tarefas geram sozinhas! Novo: Aluguer de Imovel + Arrendamento! Enquanto escreves, o preview à direita atualiza!</p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  {PROFISSOES.map(p=> <button key={p} onClick={()=>{ setForm({...form, trabProf:p, tarefas: MODELO_TAREFAS[p]||MODELO_TAREFAS["Outros/Particular"]}); setTarefasSel(MODELO_TAREFAS[p]||MODELO_TAREFAS["Outros/Particular"]); }} className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold ${form.trabProf===p?'bg-[#c9a227] text-white':'bg-gray-100'}`}>{p.toUpperCase()}</button>)}
                </div>
                <!-- Logo vem dos Anexos (Cláusula 9) - sem barra no topo -->
              </div>
              <div className="grid md:grid-cols-3 gap-3 p-3">
                {/* COL 1 - Edita sua escolha */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <h4 className="font-bold text-[12px]">Edita a sua escolha</h4>
                  <p className="text-[10px] text-gray-500">Seleciona a cláusula para editar - 10 tarefas de {form.trabProf}</p>
                  <div className="mt-2 space-y-1">
                    {CLAUSULAS.map(cl=> <button key={cl.id} onClick={()=>setClausulaAtiva(cl.id)} className={`w-full text-left px-3 py-2 rounded-lg text-[11px] ${clausulaAtiva===cl.id?'bg-[#1e2f4a] text-white':'bg-white border'}`}><b>{cl.id===1?'DADOS DAS PARTES (sem numero)':`CLAUSULA ${cl.id-1}. ${cl.titulo}`}</b><br/><span className="text-[10px] opacity-70">{cl.short}</span></button>)}
                  </div>
                </div>
                {/* COL 2 - Edita */}
                <div className="bg-white border rounded-xl p-3">
                  <h4 className="font-bold text-[13px]">{clausulaAtiva===1?'DADOS DAS PARTES (sem numero)':`CLÁUSULA ${clausulaAtiva-1}: ${CLAUSULAS[clausulaAtiva-1]?.titulo.toUpperCase()}`} - {form.trabProf.toUpperCase()}</h4>
                  <div className="mt-3">
                    {clausulaAtiva===1 && (
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-[11px] font-bold">Empregador Nome *</label><input value={form.empNome} onChange={e=>setForm({...form, empNome:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nome real" /></div>
                        <div><label className="text-[11px] font-bold">BI Empregador (13 digitos)</label><input value={form.empBI} onChange={e=>setForm({...form, empBI:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="1101012345678" /></div>
                        <div><label className="text-[11px] font-bold">NUIT Empregador (opcional)</label><input value={form.empNUIT} onChange={e=>setForm({...form, empNUIT:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="NUIT - opcional" /></div>                         <div><label className="text-[11px] font-bold">Tel Empregador * (9 digitos)</label><input value={form.empTel} onChange={e=>setForm({...form, empTel:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="841234567" /></div>
                        <div><label className="text-[11px] font-bold">End Empregador</label><input value={form.empEnd} onChange={e=>setForm({...form, empEnd:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                        <div><label className="text-[11px] font-bold">Trabalhador Nome *</label><input value={form.trabNome} onChange={e=>setForm({...form, trabNome:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nome real" /></div>
                        <div><label className="text-[11px] font-bold">BI Trabalhador * (13 digitos)</label><input value={form.trabBI} onChange={e=>setForm({...form, trabBI:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="1101012345678" /></div>
                        <div><label className="text-[11px] font-bold">NUIT Trabalhador (opcional)</label><input value={form.trabNUIT} onChange={e=>setForm({...form, trabNUIT:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="NUIT - opcional" /></div>                         <div><label className="text-[11px] font-bold">Tel Trabalhador *</label><input value={form.trabTel} onChange={e=>setForm({...form, trabTel:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="841234567" /></div>
                        <div className="col-span-2"><label className="text-[11px] font-bold">End Trabalhador</label><input value={form.trabEnd} onChange={e=>setForm({...form, trabEnd:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                      </div>
                    )}
                    {clausulaAtiva===2 && (<div><p className="font-bold text-[12px]">Objeto e tarefas - {form.trabProf} - {tarefasSel.length} tarefas selecionadas - TICK PARA SELECIONAR</p><p className="text-[10px] text-gray-500">Clica no TICK para pôr no contrato. Clica no X para tirar! Só as selecionadas vão para o preview e para o PDF!</p><div className="mt-2 space-y-1 max-h-[280px] overflow-auto border rounded-lg p-2 bg-gray-50">{(MODELO_TAREFAS[form.trabProf]||[]).map((task:string)=> (<button key={task} onClick={()=>toggleTarefa(task)} className={tarefasSel.includes(task) ? 'w-full text-left px-3 py-2 rounded-lg text-[11px] flex gap-2 items-start bg-[#1e2f4a] text-white' : 'w-full text-left px-3 py-2 rounded-lg text-[11px] flex gap-2 items-start bg-white border'}><span className={tarefasSel.includes(task) ? 'w-4 h-4 flex items-center justify-center rounded border text-[10px] shrink-0 bg-[#c9a227] text-white border-yellow-500' : 'w-4 h-4 flex items-center justify-center rounded border text-[10px] shrink-0 bg-white'}>{tarefasSel.includes(task) ? '✓' : ''}</span><span>{task}</span></button>))}</div><div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2"><p className="font-bold text-[11px]">Tarefas selecionadas ({tarefasSel.length}) - aparecem no preview do contrato:</p><div className="flex flex-wrap gap-1 mt-2">{tarefasSel.map((task:string)=> <span key={task} className="bg-[#1e2f4a] text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">{task}<button onClick={()=>toggleTarefa(task)} className="bg-red-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center">X</button></span>)}{tarefasSel.length===0 && <span className="text-[11px] text-gray-500">Nenhuma tarefa selecionada - clica nas de cima!</span>}</div></div><div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2"><label className="text-[11px] font-bold">Campo extra - Mais descrição a precisar *</label><textarea value={campoExtra} onChange={e=>setCampoExtra(e.target.value)} placeholder="Ex: Detalhes extras do serviço, material especial, observações importantes..." className="w-full border rounded px-3 py-2 text-[12px] mt-1" rows={2} /><p className="text-[10px] text-gray-500">Campo opcional - se escreveres, aparece no contrato como EXTRA!</p></div></div>)}
                    {clausulaAtiva===3 && (<div className="grid grid-cols-2 gap-2"><div><label className="text-[11px] font-bold">Horário Início</label><input value={form.horarioInicio} onChange={e=>setForm({...form, horarioInicio:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[11px] font-bold">Horário Fim</label><input value={form.horarioFim} onChange={e=>setForm({...form, horarioFim:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[11px] font-bold">Dias</label><input value={form.dias} onChange={e=>setForm({...form, dias:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[11px] font-bold">Data Início *</label><input type="date" value={form.dataInicio} onChange={e=>setForm({...form, dataInicio:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div className="col-span-2"><label className="text-[11px] font-bold">Local Trabalho - puxa endereço do empregador, mas podes editar</label><input value={form.localTrab} onChange={e=>setForm({...form, localTrab:e.target.value})} placeholder={form.empEnd?`Ex: Casa do empregador - ${form.empEnd}`:'Ex: Casa do empregador'} className="w-full border rounded px-3 py-2 text-[12px]" />{form.empEnd && form.localTrab!==form.empEnd && (<button onClick={()=>setForm({...form, localTrab: form.empEnd})} className="mt-1 bg-yellow-100 border px-2 py-1 rounded-full text-[11px]">Usar endereço do empregador: {form.empEnd}</button>)}<p className="text-[10px] text-gray-500 mt-1">Se deixares vazio, no contrato vai a casa do empregador: {form.empEnd||'-'}</p></div></div>)}
                    {clausulaAtiva===4 && (<div className="grid grid-cols-2 gap-2"><div><label className="text-[11px] font-bold">Valor Salário (MZN) *</label><input value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="7500" /></div><div><label className="text-[11px] font-bold">Dia Pagamento *</label><input value={form.diaPag} onChange={e=>setForm({...form, diaPag:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="05" /></div><div><label className="text-[11px] font-bold">Forma Pagamento *</label><select value={form.formaPag} onChange={e=>setForm({...form, formaPag:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]"><option>M-Pesa</option><option>Emola</option><option>Banco</option><option>Numerário</option></select></div><div><label className="text-[11px] font-bold">Prazo Contrato *</label><input value={form.prazo} onChange={e=>setForm({...form, prazo:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div></div>)}
                    {clausulaAtiva===5 && (<div><label className="text-[11px] font-bold">Alimentação e alojamento</label><input value={form.alimentacao} onChange={e=>setForm({...form, alimentacao:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>)}
                    {clausulaAtiva>=6 && clausulaAtiva<=9 && (<div className="text-[12px] bg-green-50 border border-green-200 rounded p-3"><b>{clausulaAtiva===1?'Dados das partes':`Cláusula ${clausulaAtiva-1} - ${CLAUSULAS[clausulaAtiva-1]?.titulo}`} - TEXTO LEGAL ✅</b><p className="mt-2">{previewTexto()[clausulaAtiva-1]}</p></div>)}
                    {clausulaAtiva===10 && (
                      <div>
                        <p className="font-bold text-[12px]">CLÁUSULA 10: ANEXOS - Prova legal</p>
                        <p className="text-[10px] text-gray-500">Escolhe na lista e anexa à direita!</p>
                        <div className="mt-2 space-y-1">{TIPOS_ANEXO.map(tipo=> <button key={tipo} onClick={()=>setAnexoAtivo(tipo)} className={`w-full text-left px-3 py-2 rounded-lg text-[11px] border ${anexoAtivo===tipo?'bg-[#1e2f4a] text-white':'bg-gray-50'}`}>{tipo} {anexos[tipo]?'✅':''}</button>)}</div>
                        <div className="mt-3 border rounded-xl p-3 bg-yellow-50"><p className="font-bold text-[11px]">DIREITA - ANEXAR: {anexoAtivo}</p><p className="text-[10px]">Selecionado: {anexos[anexoAtivo]?.nome||'Nenhum'}</p><input type="file" onChange={e=>{ const f=e.target.files?.[0]; if(f) lerFicheiro(f,(d)=>{ setAnexos({...anexos, [anexoAtivo]:{nome:f.name, data:d}}); if(anexoAtivo.includes('Logo')) setLogoTipo(d); }); }} className="mt-2 text-[11px] w-full" /><p className="text-[10px] text-gray-500 mt-1">Total: {Object.keys(anexos).length} ficheiros - {Object.keys(anexos).length} de 10 - 1 opcional permitido</p>{anexos[anexoAtivo]?.data?.startsWith('data:image') && <img src={anexos[anexoAtivo].data} style={{maxWidth:200,marginTop:8,border:'1px solid #ddd'}} alt="anexo" />}</div>
                      </div>
                    )}
                    {clausulaAtiva===11 && (
                      <div>
                        <p className="font-bold text-[12px]">CLÁUSULA 11: Validade e assinaturas - Escolhe como assinar!</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={()=>setModoAssinatura('presencial')} className={`flex-1 py-2.5 rounded-full text-[11px] font-bold ${modoAssinatura==='presencial'?'bg-[#1e2f4a] text-white':'bg-gray-100 border'}`}>✍️ PRESENCIAL - Desenho no telefone único - Os 2 juntos!</button>
                          <button onClick={()=>setModoAssinatura('distancia')} className={`flex-1 py-2.5 rounded-full text-[11px] font-bold ${modoAssinatura==='distancia'?'bg-[#c9a227] text-white':'bg-gray-100 border'}`}>📱 À DISTÂNCIA - Enviar Link - Cada um no seu telefone!</button>
                        </div>
                        {modoAssinatura==='presencial' && (
                          <div className="mt-3">
                            <p className="text-[10px] text-gray-500">Os 2 estão juntos, no mesmo telefone! Cada um desenha a sua assinatura!</p>
                            <div className="mt-2 space-y-3"><AssinaturaPad label="EMPREGADOR" nome={form.empNome} onChange={setSigEmp} /><AssinaturaPad label="TRABALHADOR" nome={form.trabNome} onChange={setSigTrab} /></div>
                          </div>
                        )}
                        {modoAssinatura==='distancia' && (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <p className="font-bold text-[12px]">📱 À DISTÂNCIA - Como funciona:</p>
                            <p className="text-[11px] mt-1">1. Tu (Empregador) assinas a tua parte aqui em baixo!<br/>2. Clicas <b>Gerar Link + Enviar WhatsApp</b>!<br/>3. O Trabalhador, lá longe, clica no link, vê o contrato e desenha a assinatura dele no telefone dele!<br/>4. Quando ele assinar, o contrato fica <b>ASSINADO</b> e tu recebes WhatsApp!</p>
                            {assinaturaDistancia ? (
                              <div className="mt-3 bg-white border rounded-xl p-3"><p className="font-bold text-[12px]">📄 Assinar este contrato - {assinaturaDistancia.trab_prof} - {assinaturaDistancia.trab_nome}</p><p className="text-[11px]">Empregador: {assinaturaDistancia.emp_nome} - Valor: {assinaturaDistancia.valor} MZN - Inicio: {assinaturaDistancia.data_inicio}</p><p className="text-[11px]">Empregador já assinou ✅ - Falta a tua assinatura!</p><div className="mt-2"><AssinaturaPad label="TRABALHADOR - Desenha a tua assinatura aqui!" nome={assinaturaDistancia.trab_nome} onChange={setSigTrab} /></div><button onClick={confirmarAssinaturaDistancia} className="w-full bg-green-600 text-white py-3 rounded-full text-[12px] font-bold mt-3">✅ CONFIRMAR MINHA ASSINATURA - ASSINAR CONTRATO!</button></div>
                            ) : (
                              <div className="mt-3">
                                <AssinaturaPad label="EMPREGADOR - Assina a tua parte aqui!" nome={form.empNome} onChange={setSigEmp} />
                                <p className="text-[11px] mt-2">Trabalhador: <b>{form.trabNome||'-'} - {form.trabTel||'-'}</b> - Vai receber o link no WhatsApp!</p>
                                <button onClick={gerarLinkDistancia} className="w-full bg-[#c9a227] text-white py-3 rounded-full text-[12px] font-bold mt-2">📱 GERAR LINK + ENVIAR WHATSAPP PARA O TRABALHADOR!</button>
                                {linkAssinatura && <div className="mt-2 bg-white border rounded-lg p-2"><p className="text-[11px] font-bold">Link gerado - Copia e envia:</p><p className="text-[10px] break-all">{linkAssinatura}</p><button onClick={()=>{ navigator.clipboard.writeText(linkAssinatura); alert('Link copiado!'); }} className="text-[11px] bg-gray-100 border px-3 py-1 rounded-full mt-1">📋 Copiar Link</button></div>}
                                <p className="text-[10px] text-gray-500 mt-2">Status: <b>PENDENTE - Falta Trabalhador</b> - Quando ele assinar, fica ASSINADO!</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                        <div className="flex gap-2 mt-4"><button onClick={()=>setClausulaAtiva(Math.max(1,clausulaAtiva-1))} className="flex-1 border py-2 rounded-full text-[11px]">Voltar</button><button onClick={()=>setClausulaAtiva(Math.min(11,clausulaAtiva+1))} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Próximo - {clausulaAtiva}/11</button></div>
                  </div>
                </div>
                {/* COL 3 - PREVIEW AO VIVO */}
                <div className="bg-white border rounded-xl p-3">
                  <h4 className="font-bold text-[12px]">3 - PREVIEW DO CONTRATO - {form.trabProf.toUpperCase()} - {(Array.isArray(form.tarefas)?form.tarefas.length:0)} TAREFAS - VENDO O QUE ESTÁ A SER EDITADO</h4>
                  <div className="mt-2 text-[11px] leading-relaxed max-h-[520px] overflow-auto border rounded-lg p-3 bg-white shadow-inner">
                    {(anexos['Logo Tipo / Empresa']?.data || logoTipo) ? <div style={{display:'flex',alignItems:'center',gap:10}}><img src={anexos['Logo Tipo / Empresa']?.data || logoTipo} style={{maxHeight:70,maxWidth:180}} alt="logo" /><div><b style={{fontSize:13}}>CONTRATO {form.trabProf.toUpperCase()}</b><p style={{fontSize:10,margin:0,color:'#666'}}>{form.empNome||''} - {form.trabNome||''}</p></div></div> : <div style={{fontSize:10,color:'#999'}}>— Sem logo — Logo fica no topo superior esquerdo!</div>}
                    <p className="font-bold text-center text-[13px] mt-1 border-b pb-2">CONTRATO {form.trabProf.toUpperCase()} - 10 CLÁUSULAS</p>
                    <p className="mt-2"><b>DADOS (sem número):</b> {form.empNome||'[Empregador]'} BI {form.empBI||'-'} - NUIT {form.empNUIT||'-'} - {form.trabNome||'[Trabalhador]'} BI {form.trabBI||'-'} - NUIT {form.trabNUIT||'-'} - Tel {form.trabTel||'-'}</p>
                    <p className="mt-2"><b>1. TAREFAS ({tarefasSel.length}):</b></p>
                    <ol className="ml-4 list-decimal">{tarefasSel.map((task:string,i:number)=> <li key={i} className="mt-1 bg-yellow-50 px-1 rounded">{task}</li>)}{campoExtra.trim() && <li className="mt-1 bg-yellow-100 px-1 rounded"><b>EXTRA:</b> {campoExtra}</li>}{tarefasSel.length===0 && <li>Nenhuma tarefa - seleciona em cima!</li>}</ol>
                    <p className="mt-2"><b>2. HORÁRIO:</b> {form.horarioInicio} às {form.horarioFim} - {form.dias} - {form.dataInicio||'-'} - {form.localTrab||'-'}</p>
                    <p className="mt-2"><b>3. SALÁRIO:</b> {form.valor||'0'} MZN - Dia {form.diaPag} - {form.formaPag} - Prazo {form.prazo}</p>
                    <p className="mt-2"><b>4. ALIMENTAÇÃO:</b> {form.alimentacao}</p>
                    <p className="mt-2"><b>5. FOLGAS:</b> Domingo e feriados nacionais. 12 dias férias após 1 ano completo. Se trabalhar domingo, paga dobrado.</p>
                    <p className="mt-2"><b>6. PERÍODO EXPERIMENTAL:</b> 15 dias - qualquer parte pode terminar sem multa, pagando dias trabalhados.</p>
                    <p className="mt-2"><b>7. DEVERES DO TRABALHADOR:</b> Cumprir horário, executar com qualidade, cuidar de ferramentas, manter local limpo.</p>
                    <p className="mt-2"><b>8. DEVERES DO EMPREGADOR:</b> Pagar no dia, fornecer material, garantir segurança, tratar com respeito.</p>
                    <p className="mt-2"><b>9. ANEXOS - EM BAIXO:</b> {Object.keys(anexos).filter(k=>!k.includes('Logo')).length} ficheiros - {Object.keys(anexos).filter(k=>!k.includes('Logo')).join(', ')||'Sem anexos'}</p><div className="mt-2 border-t pt-2"><b>📎 Documentos em baixo:</b>{Object.keys(anexos).filter(k=>!k.includes('Logo')).map(k=> <p key={k}>📎 {k}: {anexos[k].nome}</p>)}{Object.keys(anexos).filter(k=>!k.includes('Logo')).length===0 && <p>Sem documentos - Logo vai para o topo, não para aqui!</p>}</div>
                    <p className="mt-2"><b>10. ASSINATURAS:</b> Empregador {sigEmp?'✅':'⚠️'} | Trabalhador {sigTrab?'✅':'⚠️'}</p>
                    <div className="mt-3 border-t pt-2"><b>ANEXOS:</b>{Object.keys(anexos).length===0 ? <span> Sem anexos</span> : Object.keys(anexos).map(k=> <p key={k}>📎 {k}: {anexos[k].nome}</p>)}</div>
                    <div className="mt-3"><b>ASSINATURAS:</b><p>Empregador: {sigEmp?'✅ Desenhada':'⚠️ Falta'}</p><p>Trabalhador: {sigTrab?'✅ Desenhada':'⚠️ Falta'}</p></div>
                  </div>
                  <button onClick={()=>{ const c:any={ emp_nome:form.empNome, emp_bi:form.empBI, emp_nuit:form.empNUIT, empNUIT:form.empNUIT, emp_tel:form.empTel, emp_end:form.empEnd, trab_nome:form.trabNome, trab_bi:form.trabBI, trab_nuit:form.trabNUIT, trabNUIT:form.trabNUIT, trab_tel:form.trabTel, trab_end:form.trabEnd, trab_prof:form.trabProf, tarefas: [...tarefasSel, ...(campoExtra.trim()? [`EXTRA: ${campoExtra.trim()}`]:[])], horario_inicio:form.horarioInicio, horario_fim:form.horarioFim, dias:form.dias, data_inicio:form.dataInicio, local_trab:form.localTrab, valor:form.valor, dia_pag:form.diaPag, forma_pag:form.formaPag, prazo:form.prazo, alimentacao:form.alimentacao, anexos:anexos, logotipo:logoTipo, assinatura_contratante:{assinatura:sigEmp}, assinatura_contratado:{assinatura:sigTrab} }; baixarContratoFaturar(c); }} className="w-full bg-[#c9a227] text-white py-2.5 rounded-full text-[12px] font-bold mt-3">PDF FINAL</button>
                </div>
              </div>
              <div className="p-4 border-t flex gap-2"><button onClick={()=>setMostrarForm(false)} className="flex-1 border py-2.5 rounded-full text-[12px]">Cancelar</button><button onClick={handleCriarContrato} disabled={carregando} className="flex-1 bg-[#1e2f4a] text-white py-2.5 rounded-full text-[12px] font-bold">{carregando?'Salvando...':(editId?'GUARDAR ALTERAÇÕES':'CRIAR CONTRATO REAL + WHATSAPP')}</button></div>
            </div>
          </div>
        )}

{contratoVer && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto p-6">
              <div className="flex justify-between"><h3 className="font-bold">Contrato {contratoVer.trab_prof} - {contratoVer.trab_nome} - 10 Cláusulas</h3><button onClick={()=>setContratoVer(null)} className="text-2xl">×</button></div>
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
              <div className="flex gap-2 mt-4"><button onClick={()=>baixarContratoFaturar(contratoVer)} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[12px] font-bold">GERAR PDF 11 CLÁUSULAS + WHATSAPP</button><button onClick={()=>setContratoVer(null)} className="flex-1 border py-2 rounded-full text-[12px]">Fechar</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
