
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
{/* BACKSTAGE VIAJAR - não visível para o utilizador, só para o dono / dev:
  - VIAJAR 100% REAL, 2 Painéis, Passageiro GPS coords, Escolhe a tua porta, Enable location, Só podes..., Formulário dentro da viatura, Mapa REAL explicação
  - Estas infos ficam aqui escondidas, não aparecem na página.
*/}

function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
const CIDADES:any = {'Xai-Xai':{lat:-25.0519,lng:32.6426},'Maputo':{lat:-25.9655,lng:32.5832},'Matola':{lat:-25.9622,lng:32.4586},'Chokwe':{lat:-24.5333,lng:32.9833},'Bilene':{lat:-25.2700,lng:33.2300},'Manhica':{lat:-25.4022,lng:32.8072},'Magude':{lat:-25.0222,lng:32.6417},'Boane':{lat:-26.0431,lng:32.3244}};
export default function ViajarReal(){
  const [aba, setAba] = useState<'transportador'|'passageiro'>('passageiro');
  // 2 PORTAS - como inDrive: passageiro e transportador separados. Passageiro NAO ve area do transportador.
  const [papel, setPapel] = useState<'passageiro'|'transportador'|null>(null);
  const [passLogado, setPassLogado] = useState<any>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_passageiro_sessao')||'null'); }catch(e){ return null; } });
  const [formPass, setFormPass] = useState({nome:'', tel:''});
  const validarTelMZ = (t:string) => { const d=String(t||'').replace(/[^0-9]/g,''); const n9=d.startsWith('258')?d.slice(3):d; return n9.length===9 && /^(82|83|84|85|86|87|88|89)/.test(n9) ? n9 : null; };
  // FASE 1 - CONTA PASSAGEIRO REAL (Supabase viagens_passageiros)
  const getContasPass = () => { try{ return JSON.parse(localStorage.getItem('viajar_passageiro_contas')||'[]'); }catch(e){ return []; } };
  const salvarContaPassLocal = (conta:any) => { const lista=getContasPass(); const sem=lista.filter((c:any)=>c.tel!==conta.tel); sem.unshift(conta); localStorage.setItem('viajar_passageiro_contas', JSON.stringify(sem)); return sem; };
  const entrarPassageiro = async () => {
    // Se a pessoa pôs o telefone no campo NOME (como na foto: 840532899 no Nome), troca sozinho
    let nomeCampo = formPass.nome.trim();
    let telCampo = formPass.tel.trim();
    if(/^[0-9 +]+$/.test(nomeCampo) && !validarTelMZ(telCampo) && validarTelMZ(nomeCampo)){
      telCampo = nomeCampo; nomeCampo = 'Passageiro';
    }
    if(!nomeCampo){ alert('Escreve o teu nome'); return; }
    const telOK=validarTelMZ(telCampo);
    if(!telOK){ alert('Telefone inválido. Ex: 84 123 4567'); return; }
    const nome=nomeCampo;
    try{
      const {data:ex} = await supabase.from('viagens_passageiros').select('*').eq('username', telOK).limit(1);
      if(ex && ex.length>0){
        const r=ex[0]; const p={nome:r.nome||nome, tel:telOK, conta_id:r.conta_id, data:r.criado||new Date().toLocaleString('pt-MZ')};
        salvarContaPassLocal(p); setPassLogado(p); localStorage.setItem('viajar_passageiro_sessao', JSON.stringify(p));
        setNomePass(p.nome); setTelPass(p.tel); setAba('passageiro');
        alert('Bem-vindo de volta '+p.nome+'! (conta real do servidor)');
        return;
      }
    }catch(e){}
    const p={nome, tel:telOK, conta_id:'pass_'+telOK+'_'+Date.now(), data:new Date().toLocaleString('pt-MZ')};
    let guardado=false;
    try{ const {error} = await supabase.from('viagens_passageiros').insert([{conta_id:p.conta_id, nome:p.nome, username:telOK, tel:telOK, criado:p.data}]); if(!error) guardado=true; }catch(e){}
    if(!guardado){ alert('Atenção: tabela viagens_passageiros ainda não existe no Supabase! Vou guardar neste telefone, mas cria a tabela com o SQL em baixo para funcionar noutro telefone.'); }
    salvarContaPassLocal(p); setPassLogado(p); localStorage.setItem('viajar_passageiro_sessao', JSON.stringify(p));
    setNomePass(p.nome); setTelPass(p.tel); setAba('passageiro');
    alert('Bem-vindo '+p.nome+'!');
  };
  const sairPassageiro = () => { setPassLogado(null); localStorage.removeItem('viajar_passageiro_sessao'); setPapel(null); };
  const sairTransportador = () => { setTransLogado(null); localStorage.removeItem('viajar_transportador_sessao'); setPapel(null); };
  const [passageiroPos, setPassageiroPos] = useState<{lat:number,lng:number}|null>(null);
  // FASE 1 - MAPA REAL (Leaflet + OpenStreetMap)
  const mapaRef = useRef<HTMLDivElement|null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarcadoresRef = useRef<any[]>([]);
  const carregarLeaflet = () => new Promise<void>((resolve)=>{
    if((window as any).L){ resolve(); return; }
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload=()=>resolve(); s.onerror=()=>resolve(); document.head.appendChild(s);
  });
  useEffect(()=>{
    let cancel=false;
    carregarLeaflet().then(()=>{
      if(cancel || !mapaRef.current || leafletMapRef.current) return;
      const L=(window as any).L; if(!L) return;
      const centro = passageiroPos ? [passageiroPos.lat, passageiroPos.lng] : [-25.9655, 32.5832];
      const m=L.map(mapaRef.current).setView(centro, 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap'}).addTo(m);
      leafletMapRef.current=m;
    });
    return ()=>{ cancel=true; };
  },[]);
  const [permissao, setPermissao] = useState<any>('unknown');
  const [lista, setLista] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const watchIdRef = useRef<number|null>(null); const intervaloRef = useRef<any>(null);
  // TRANSPORTADOR - perfil como VENDER
  const [transLogado, setTransLogado] = useState<any>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_transportador_sessao')||'null'); }catch(e){ return null; } });
  // FASE 1 - CONTA TRANSPORTADOR REAL
  const normalizarTel = (t:string) => { const d=String(t||'').replace(/[^0-9]/g,''); const n9=d.startsWith('258')?d.slice(3):d; return n9; };
  const getContasTrans = () => { try{ return JSON.parse(localStorage.getItem('viajar_transportador_contas')||'[]'); }catch(e){ return []; } };
  const salvarContaTransLocal = (conta:any) => { const lista=getContasTrans(); const telN=normalizarTel(conta.tel); const sem=lista.filter((c:any)=>normalizarTel(c.tel)!==telN); sem.unshift({...conta, tel:telN}); localStorage.setItem('viajar_transportador_contas', JSON.stringify(sem)); return sem; };
  try{ const s:any=JSON.parse(localStorage.getItem('viajar_transportador_sessao')||'null'); if(s && s.tel && getContasTrans().length===0){ salvarContaTransLocal(s); } }catch(e){}
  const [mostrarLoginTrans, setMostrarLoginTrans] = useState<'cadastro'|'login'>('cadastro');
  const [formTrans, setFormTrans] = useState({nome:'', tel:'', password:'', nuit:'', endereco:'', provincia:'', distrito:'', email:''});
  const [docs, setDocs] = useState({carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:'', bi:''});
  const [docsFiles, setDocsFiles] = useState<any>({bi:'', carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:''});
  const [docsNums, setDocsNums] = useState<any>({bi:'', carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:''});
  const [viaturasTrans, setViaturasTrans] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_viaturas_trans')||'[]'); }catch(e){ return []; } });
  const [formViat, setFormViat] = useState({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo', nomeMotorista:'', telMotorista:'', nomeDono:'', telDono:''});
  const [mostrarMaisCarros, setMostrarMaisCarros] = useState(false);
  // PASSAGEIRO - reservar
  const [origem, setOrigem] = useState('Xai-Xai'); const [destino, setDestino] = useState('Maputo');
  const [numPass, setNumPass] = useState(1); const [nomePass, setNomePass] = useState(''); const [telPass, setTelPass] = useState('');
  const [telFamiliar, setTelFamiliar] = useState(''); const [nomeFamiliar, setNomeFamiliar] = useState(''); const [biPass, setBiPass] = useState(''); const [idadeTipo, setIdadeTipo] = useState('Adulto'); const [localEmbarque, setLocalEmbarque] = useState(''); const [destinoCustom, setDestinoCustom] = useState(''); const [assentoSel, setAssentoSel] = useState<number|null>(null); const [modoPag, setModoPag] = useState('M-Pesa'); const [acompanhantes, setAcompanhantes] = useState<any[]>([{nome:'', tel:'', tipo:'Adulto'}]);
  const [viaturaSel, setViaturaSel] = useState('');
  const [reservas, setReservas] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('viagens_reservas')||'[]'); }catch(e){ return []; } });
  const [chatAberto, setChatAberto] = useState<string|null>(null); const [chatMsgs, setChatMsgs] = useState<any[]>([]); const [chatTexto, setChatTexto] = useState('');
  const [filtroCor, setFiltroCor] = useState('Todas'); const [filtroRota, setFiltroRota] = useState('Todas');
  const [reservaViatura, setReservaViatura] = useState<any>(null);
  const [notificacoes, setNotificacoes] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_notificacoes')||'[]'); }catch(e){ return []; } });
  const carregarReais = async () => {
    setCarregando(true);
    const { data } = await supabase.from('viagens_motoristas').select('*').eq('status','ONLINE').order('ultima_atualizacao',{ascending:false});
    setLista((data as any[])||[]); setCarregando(false);
  };
  const pedirGPS = () => { if(!navigator.geolocation){ alert('Este telefone nao tem GPS'); return; } navigator.geolocation.getCurrentPosition((pos:any)=>{ setPassageiroPos({lat:pos.coords.latitude,lng:pos.coords.longitude}); setPermissao('granted'); },()=>{ setPermissao('denied'); alert('Localizacao nao permitida! Clica Permitir para veres os carros perto de ti.'); },{enableHighAccuracy:true, timeout:10000}); };
  // Como inDrive: Permitir - pede localizacao com Precise: On
  const pedirLocalizacaoPassageiro = () => { if(!navigator.geolocation){ alert('Este telefone nao tem GPS'); return; } setPermissao('prompt'); navigator.geolocation.getCurrentPosition((pos:any)=>{ setPassageiroPos({lat:pos.coords.latitude,lng:pos.coords.longitude}); setPermissao('granted'); alert('Localizacao ativada! Agora vês os carros perto de ti + distancia + ETA a 90 km/h.'); },()=>{ setPermissao('denied'); alert('Clica Permitir no aviso do telefone para ativares a localizacao.'); },{enableHighAccuracy:true, timeout:15000, maximumAge:0}); };
  useEffect(()=>{ carregarReais(); pedirGPS(); if(navigator.permissions) navigator.permissions.query({name:'geolocation' as any}).then((r:any)=>setPermissao(r.state)); },[]);
  // FASE 1 - Marcadores MAPA REAL - aqui 'lista' já existe, sem erro TDZ!
  useEffect(()=>{
    const L=(window as any).L; const m=leafletMapRef.current; if(!L || !m) return;
    leafletMarcadoresRef.current.forEach((mk:any)=>{ try{ m.removeLayer(mk); }catch(e){} });
    leafletMarcadoresRef.current=[];
    if(passageiroPos){
      const mk=L.marker([passageiroPos.lat, passageiroPos.lng]).addTo(m).bindPopup('<b>Tu - Passageiro</b><br/>GPS real: '+passageiroPos.lat.toFixed(5)+', '+passageiroPos.lng.toFixed(5));
      leafletMarcadoresRef.current.push(mk);
    }
    lista.forEach((v:any)=>{
      if(!v.lat || !v.lng) return;
      const mk=L.marker([v.lat, v.lng]).addTo(m).bindPopup('<b>'+(v.matricula||'')+' - '+(v.carro||v.marca||'')+'</b><br/>Motorista: '+(v.nome||v.nomeMotorista||'')+'<br/>Tel: '+(v.telefone||v.telMotorista||'')+'<br/>Rota: '+(v.destino_atual||v.rota||'')+'<br/>Lat/Lng real Supabase: '+v.lat+', '+v.lng);
      leafletMarcadoresRef.current.push(mk);
    });
  },[lista, passageiroPos]);
  // TRANSPORTADOR - criar conta / login (local + sessao, como VENDER)
  const criarContaTrans = async () => {
    const nome=(formTrans.nome||'').trim(); const telN=normalizarTel(formTrans.tel); const pass=(formTrans.password||'').trim();
    if(!nome || !telN || !pass){ alert('Nome, Telefone e Password'); return; }
    if(telN.length!==9){ alert('Telefone invalido! Escreve 9 digitos: ex: 84 123 4567'); return; }
    if(!formTrans.nuit){ alert('NUIT e obrigatorio - documento'); return; }
    const localExiste=getContasTrans().find((c:any)=>normalizarTel(c.tel)===telN);
    if(localExiste){ alert('Ja tens conta com este numero neste telefone! Clica em Ja tenho conta - Entrar.'); setMostrarLoginTrans('login'); return; }
    try{ const {data:ex} = await supabase.from('viagens_transportadores').select('*').eq('username', telN).limit(1); if(ex && ex.length>0){ alert('Ja existe conta com este numero no servidor! Clica em Ja tenho conta - Entrar.'); setMostrarLoginTrans('login'); return; } }catch(e){}
    const nova = {...formTrans, nome, tel:telN, password:pass, conta_id:`trans_${telN}_${Date.now()}`, criado:new Date().toLocaleString('pt-MZ')};
    let guardadoTrans=false;
    try{ const {error} = await supabase.from('viagens_transportadores').insert([{conta_id:nova.conta_id, nome:nova.nome, username:telN, tel:telN, password:pass, nuit:nova.nuit, endereco:nova.endereco, provincia:nova.provincia, cidade:nova.distrito, email:nova.email, criado:nova.criado}]); if(!error) guardadoTrans=true; }catch(e){}
    if(!guardadoTrans){ alert('Atenção: tabela viagens_transportadores ainda não existe no Supabase! Vou guardar neste telefone, mas cria a tabela com o SQL em baixo.'); }
    salvarContaTransLocal(nova);
    localStorage.setItem('viajar_transportador_sessao', JSON.stringify(nova)); setTransLogado(nova); setPapel('transportador');
    alert('Conta transportador REAL criada! Numero: '+telN+' - Agora preenche documentos e submete viatura.');
  };
  const loginTrans = async () => {
    const telN=normalizarTel(formTrans.tel); const pass=(formTrans.password||'').trim();
    if(!telN || !pass){ alert('Escreve Telefone e Password'); return; }
    if(telN.length!==9){ alert('Telefone invalido! Escreve 9 digitos: ex: 84 123 4567'); return; }
    try{ const {data} = await supabase.from('viagens_transportadores').select('*').eq('username', telN).eq('password', pass).limit(1); if(data && data.length>0){ const r=data[0]; const conta={nome:r.nome, tel:telN, password:pass, nuit:r.nuit||'', endereco:r.endereco||'', provincia:r.provincia||'', distrito:r.cidade||'', email:r.email||'', conta_id:r.conta_id}; salvarContaTransLocal(conta); localStorage.setItem('viajar_transportador_sessao', JSON.stringify(conta)); setTransLogado(conta); setPapel('transportador'); alert('Bem-vindo '+conta.nome+'! (conta real do servidor)'); return; } }catch(e){}
    const local=getContasTrans().find((c:any)=>normalizarTel(c.tel)===telN && String(c.password).trim()===pass);
    if(local){ localStorage.setItem('viajar_transportador_sessao', JSON.stringify(local)); setTransLogado(local); setPapel('transportador'); alert('Bem-vindo '+local.nome+'!'); return; }
    try{ const s=JSON.parse(localStorage.getItem('viajar_transportador_sessao')||'null'); if(s && normalizarTel(s.tel)===telN && String(s.password).trim()===pass){ salvarContaTransLocal(s); setTransLogado(s); setPapel('transportador'); alert('Bem-vindo '+s.nome+'! Conta recuperada!'); return; } }catch(e){}
    const existeTel=getContasTrans().find((c:any)=>normalizarTel(c.tel)===telN);
    if(existeTel){ alert('Telefone encontrado, mas Password errada!'); return; }
    alert('Nenhuma conta com o numero '+telN+' neste telefone nem no servidor. Verifica se escreveste o mesmo numero com que criaste a conta.');
  };
  const submeterViatura = async () => {
    if(!formViat.matricula || !formViat.marca || !formViat.modelo){ alert('Matricula, Marca e Modelo'); return; }
    if(!formViat.nomeMotorista || !formViat.telMotorista){ alert('Nome do Motorista e Numero do Motorista sao obrigatorios - o motorista e quem anda com GPS ligado!'); return; }
    if(!docsFiles.carta || !docsFiles.livrete || !docsFiles.seguro){ alert('Documentos obrigatorios: faz upload do FILE da Carta + Livrete + Seguro (numero e opcional)'); return; }
    const rotaDef = `${formViat.provOrig} - ${formViat.distOrig} -> ${formViat.provDest} - ${formViat.distDest}`;
    const nova:any = {...formViat, destino:rotaDef, rota:rotaDef, provOrig:formViat.provOrig, distOrig:formViat.distOrig, provDest:formViat.provDest, distDest:formViat.distDest, id:Date.now(), nome:formViat.nomeMotorista, nomeMotorista:formViat.nomeMotorista, telMotorista:formViat.telMotorista, telefone:formViat.telMotorista, nomeDono:formViat.nomeDono||transLogado.nome, telDono:formViat.telDono||transLogado.tel, transportador:formViat.nomeDono||transLogado.nome, tel:formViat.telDono||transLogado.tel, docs:{...docsNums, files:{...docsFiles}}, docsFiles:{...docsFiles}, docsNums:{...docsNums}, status:'PENDENTE', dataSubmissao:new Date().toLocaleString('pt-MZ')};
    const listaN=[nova, ...viaturasTrans]; setViaturasTrans(listaN); localStorage.setItem('viajar_viaturas_trans', JSON.stringify(listaN));
    // Tambem tenta criar no Supabase como OFFLINE (aguardar aprovacao, nao aparece para passageiro)
    try{ await supabase.from('viagens_motoristas').insert([{nome:formViat.nomeMotorista, carro:`${formViat.marca} ${formViat.modelo}`, matricula:formViat.matricula.toUpperCase(), provincia:formViat.provincia, cidade:formViat.cidade, telefone:formViat.telMotorista, lugares:parseInt(formViat.lugares)||15, destino_atual:formViat.destino, status:'OFFLINE', conta_id:transLogado.conta_id, ultima_atualizacao:new Date().toISOString(), updated_at:new Date().toISOString()}]); }catch(e){}
    setFormViat({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo', nomeMotorista:'', telMotorista:'', nomeDono:'', telDono:''}); setMostrarMaisCarros(true);
    alert('Viatura SUBMETIDA! A aguardar aprovacao do dono do aplicativo.');
  };
  const aprovarViatura = (id:any) => { // DONO DO APLICATIVO aprova
    if(!confirm('Aprovar esta viatura como DONO? Ela vai aparecer para passageiros.')) return;
    const listaN = viaturasTrans.map((v:any)=> v.id===id ? {...v, status:'APROVADA'} : v); setViaturasTrans(listaN); localStorage.setItem('viajar_viaturas_trans', JSON.stringify(listaN));
    const v = viaturasTrans.find((x:any)=>x.id===id); if(v){ supabase.from('viagens_motoristas').update({status:'ONLINE'}).eq('matricula', v.matricula.toUpperCase()); }
    carregarReais(); alert('Aprovada! Agora aparece para passageiros.');
  };
  const rejeitarViatura = (id:any) => { const listaN = viaturasTrans.map((v:any)=> v.id===id ? {...v, status:'REJEITADA'} : v); setViaturasTrans(listaN); localStorage.setItem('viajar_viaturas_trans', JSON.stringify(listaN)); };
  const ligarGps = () => {
    if(!transLogado) return; const mat = viaturasTrans.find((v:any)=>v.status==='APROVADA')?.matricula || lista.find((v:any)=>v.conta_id===transLogado.conta_id)?.matricula;
    if(!mat){ alert('Primeiro submete e espera aprovar, ou usa viatura ja aprovada'); return; }
    setGpsAtivo(true);
    watchIdRef.current = navigator.geolocation.watchPosition(async (pos:any)=>{ await supabase.from('viagens_motoristas').update({lat:pos.coords.latitude, lng:pos.coords.longitude, status:'ONLINE', ultima_atualizacao:new Date().toISOString(), updated_at:new Date().toISOString()}).eq('matricula', mat.toUpperCase()); },()=>{}, {enableHighAccuracy:true});
    intervaloRef.current = setInterval(()=>{ navigator.geolocation.getCurrentPosition(async (p:any)=>{ await supabase.from('viagens_motoristas').update({lat:p.coords.latitude, lng:p.coords.longitude, status:'ONLINE', ultima_atualizacao:new Date().toISOString()}).eq('matricula', mat.toUpperCase()); }); },10000);
    alert('GPS LIGADO - ONLINE a cada 10s');
  };
  // PASSAGEIRO - rota / preco
  const calcRota = () => { const a=CIDADES[origem]; const b=CIDADES[destino]; if(!a||!b) return {distEstrada:0, etaMin:0, precoPP:0}; const reta=haversine(a.lat,a.lng,b.lat,b.lng); const distEstrada=reta*1.7; const etaMin=Math.ceil(distEstrada/90*60); const precoPP=Math.round(Math.max(50, distEstrada*2.5)/10)*10; return {distEstrada, etaMin, precoPP}; };
  const rotaInfo = calcRota();
  const viaturasAprovadas = viaturasTrans.filter((v:any)=>v.status==='APROVADA');
  const listaPassageiro = lista.filter((v:any)=>{ if(filtroRota!=='Todas' && v.destino_atual!==filtroRota) return false; return true; });
  const reservarViagem = async () => {
    if(!nomePass || !telPass){ alert('Nome e Telefone do passageiro'); return; }
    if(origem===destino){ alert('Origem e Destino nao podem ser iguais'); return; }
    const v = reservaViatura || lista.find((x:any)=>x.id===viaturaSel) || lista[0] || viaturasAprovadas[0];
    if(!v){ alert('Nenhuma viatura ONLINE / APROVADA'); return; }
    if(assentoSel && reservas.some((r:any)=>r.matricula===v.matricula && r.assento===assentoSel)){ alert(`Assento ${assentoSel} ja esta OCUPADO nesta viatura! Escolhe outro.`); return; }
    const total = rotaInfo.precoPP * numPass;
    const nova:any = {id:Date.now(), origem, destino:destinoCustom||destino, dist:rotaInfo.distEstrada.toFixed(1), eta:rotaInfo.etaMin, precoPP:rotaInfo.precoPP, numPass, total, nomePass, telPass, telFamiliar, nomeFamiliar, bi:biPass, idadeTipo, localEmbarque, acompanhantes, assento:assentoSel, modoPag, motorista:v.nome||v.transportador, matricula:v.matricula, telMotorista:v.telefone||v.tel, data:new Date().toLocaleString('pt-MZ'), status:'RESERVADA'};
    const listaN=[nova, ...reservas]; setReservas(listaN); localStorage.setItem('viagens_reservas', JSON.stringify(listaN));
    const noti:any = {id:Date.now(), tipo:'RESERVA', matricula:v.matricula, motorista:v.nomeMotorista||v.nome||v.transportador, telMotorista:v.telMotorista||v.telefone||v.tel, telDono:v.telDono||v.tel, passageiro:nomePass, telPass, origem, destino:destinoCustom||destino, assento:assentoSel, total, modoPag, data:new Date().toLocaleString('pt-MZ'), lida:false, msg:`NOVA RESERVA! Bilhete Assento ${assentoSel||'-'} - ${nomePass} - ${origem} -> ${destinoCustom||destino} - ${total}MT - ${modoPag}`};
    const notiN=[noti, ...notificacoes]; setNotificacoes(notiN); localStorage.setItem('viajar_notificacoes', JSON.stringify(notiN));
    const msg=`RESERVA BILHETE Assento ${assentoSel||'-'} - ${origem} -> ${destinoCustom||destino} | ${numPass} pessoa(s) | ${rotaInfo.distEstrada.toFixed(1)} km | Total ${total}MT | Passageiro: ${nomePass} - ${telPass} | Familiar: ${nomeFamiliar} - ${telFamiliar} | Pag: ${modoPag} | Viatura: ${v.matricula}`;
    const num=String(v.telMotorista||v.telefone||v.tel||'').replace(/[^0-9]/g,''); if(num) window.open('https://wa.me/' + (num.startsWith('258')?num:'258'+num) + '?text=' + encodeURIComponent(msg), '_blank');
    alert(`RESERVADA! Bilhete Assento ${assentoSel||'-'} - ${origem} -> ${destino} - ${total}MT - ${v.matricula} - Motorista + Dono notificados!`);
    setReservaViatura(null); setAssentoSel(null);
  };
  const enviarChat = (v:any) => { if(!chatTexto.trim()) return; const m1={de:'Tu', texto:chatTexto, hora:new Date().toLocaleTimeString('pt-MZ',{hour:'2-digit',minute:'2-digit'})}; setChatMsgs([...chatMsgs, m1]); setChatTexto(''); setTimeout(()=>{ setChatMsgs((prev:any)=>[...prev, {de:v.nome, texto:`Recebido! Estou a caminho ${origem} -> ${destino}. ETA ${rotaInfo.etaMin} min.`, hora:new Date().toLocaleTimeString('pt-MZ',{hour:'2-digit',minute:'2-digit'})}]); },1200); };
  // FASE 1 - Mapa antigo (esquema falso) REMOVIDO - agora Leaflet + OpenStreetMap.
  return (
    <div className="min-h-screen bg-[#f0f2f5] text-black p-4 font-sans"><div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
        
        
        
        
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={()=>{ setPapel('passageiro'); setAba('passageiro'); }} className={`px-5 py-2 rounded-full text-[13px] font-bold ${papel==='passageiro'?'bg-green-600 text-white':'bg-green-100 text-green-800'}`}>Sou Passageiro</button>
          <button onClick={()=>{ setPapel('transportador'); setAba('transportador'); }} className={`px-5 py-2 rounded-full text-[13px] font-bold ${papel==='transportador'?'bg-[#0a66c2] text-white':'bg-blue-100 text-blue-800'}`}>Sou Transportador</button>
          {(papel||passLogado||transLogado) && (<button onClick={()=>{ setPapel(null); setPassLogado(null); localStorage.removeItem('viajar_passageiro_sessao'); }} className="bg-gray-100 px-4 py-2 rounded-full text-[11px]">Sair / Trocar de Porta</button>)}
          <button onClick={carregarReais} className="bg-gray-100 px-4 py-2 rounded-full text-[11px]">Recarregar</button>
        </div>
        
      </div>
      {/* PORTA PASSAGEIRO - como inDrive: numero valido -> entra so para procurar carros, reservar e viajar. NAO ve transportador. */}
      {papel==='passageiro' && !passLogado && (
        <div className="space-y-4">
          <div className="bg-green-600 rounded-xl p-6 text-white">
            <h2 className="font-black text-[18px]">Passageiro</h2>
            <p className="text-[11px] mt-1">Escreve nome + telefone e entra.</p>
            <div className="grid grid-cols-2 gap-3 mt-4 bg-white text-black rounded-xl p-4">
              <div><label className="text-[11px] font-bold">Nome Completo *</label><input value={formPass.nome} onChange={e=>setFormPass({...formPass,nome:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Teu nome" /></div>
              <div><label className="text-[11px] font-bold">Numero de Telefone * - Valido Mocambique</label><input value={formPass.tel} onChange={e=>setFormPass({...formPass,tel:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="84 123 4567" /></div>
            </div>
            <p className="text-[10px] mt-2">Ex: 84 123 4567</p>
            <button onClick={entrarPassageiro} className="w-full mt-3 bg-white text-green-700 py-3 rounded-full font-bold text-[13px]">ENTRAR</button>
            
            {getContasPass().length>0 && (<div className="mt-2 bg-white text-black rounded p-2 text-[11px]"><b>Contas passageiro neste telefone ({getContasPass().length}):</b>{getContasPass().map((c:any)=>(<div key={c.tel} className="flex justify-between mt-1"><span>{c.nome} - {c.tel}</span><button onClick={()=>{ setFormPass({nome:c.nome, tel:c.tel}); }} className="bg-green-600 text-white px-2 py-1 rounded-full text-[10px]">Usar este numero</button></div>))}</div>)}
          </div>
          {permissao!=='granted' && permissao!=='denied' && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-[16px]">Permitir localização?</h3>
            <p className="text-[12px] text-gray-600 mt-1">Mostra os carros mais perto de ti.</p>
            <div className="mt-3 bg-[#e8f5e9] border rounded p-3 text-[12px]"><span className="bg-white px-2 py-1 rounded-full text-[#0a66c2] font-bold">Precise: On</span><span className="ml-2">Vês os carros perto de ti.</span></div>
            <div className="grid gap-2 mt-3">
              <button onClick={pedirLocalizacaoPassageiro} className="w-full py-2 rounded-full text-[#0a66c2] font-bold text-[14px] border">Permitir</button>
              <button onClick={pedirLocalizacaoPassageiro} className="w-full py-2 rounded-full text-[#0a66c2] text-[13px] border">Permitir uma vez</button>
              <button onClick={()=>{ setPermissao('denied'); alert('Sem localizacao, nao consegues ver a distancia dos carros ate ti. Podes procurar por rota, mas sem ETA.'); }} className="w-full py-2 rounded-full text-[#0a66c2] text-[13px] border">Don&apos;t Allow</button>
            </div>
            <p className="text-[11px] mt-2">A tua localização mostra os carros mais perto de ti.</p>
          </div>
          )}
        </div>
      )}
      {papel==='transportador' && (
        <div className="space-y-4">
          {!transLogado ? (
            <div className="bg-[#0a66c2] rounded-xl p-6 text-white">
              <h2 className="font-black text-[18px]">Transportador - Criar Conta / Entrar</h2>
              
              <div className="grid grid-cols-2 gap-3 mt-4 bg-white text-black rounded-xl p-4">
                <div><label className="text-[11px] font-bold">Nome Completo *</label><input value={formTrans.nome} onChange={e=>setFormTrans({...formTrans,nome:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Nome do transportador" /></div>
                <div><label className="text-[11px] font-bold">Telefone / WhatsApp *</label><input value={formTrans.tel} onChange={e=>setFormTrans({...formTrans,tel:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="84..." /></div>
                <div><label className="text-[11px] font-bold">Password *</label><input type="password" value={formTrans.password} onChange={e=>setFormTrans({...formTrans,password:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" /></div>
                <div><label className="text-[11px] font-bold">NUIT * (documento)</label><input value={formTrans.nuit} onChange={e=>setFormTrans({...formTrans,nuit:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="NUIT" /></div>
                <div><label className="text-[11px] font-bold">Endereco</label><input value={formTrans.endereco} onChange={e=>setFormTrans({...formTrans,endereco:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Endereco" /></div>
                <div><label className="text-[11px] font-bold">Provincia / Distrito</label><div className="flex gap-2"><input value={formTrans.provincia} onChange={e=>setFormTrans({...formTrans,provincia:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Provincia" /><input value={formTrans.distrito} onChange={e=>setFormTrans({...formTrans,distrito:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Distrito" /></div></div>
              </div>
              <div className="flex gap-2 mt-3"><button onClick={()=>setMostrarLoginTrans('cadastro')} className="px-4 py-2 rounded-full bg-white text-black text-[12px] font-bold">Criar Conta</button><button onClick={()=>setMostrarLoginTrans('login')} className="px-4 py-2 rounded-full border text-[12px] font-bold">Ja tenho conta - Entrar</button></div>
              <div className="mt-3 bg-white/10 rounded p-2 text-[11px]">Conta real: fica guardada no servidor + neste telefone. <b>Sair NAO apaga a conta</b> - para entrar de novo usa o <b>mesmo numero (9 digitos, ex: 84...)</b> + password.</div>
              {getContasTrans().length>0 && (<div className="mt-2 bg-white text-black rounded p-2 text-[11px]"><b>Contas neste telefone ({getContasTrans().length}):</b>{getContasTrans().map((c:any)=>(<div key={c.tel} className="flex justify-between mt-1"><span>{c.nome} - {normalizarTel(c.tel)}</span><button onClick={()=>{ setFormTrans({...formTrans, tel:normalizarTel(c.tel)}); setMostrarLoginTrans('login'); }} className="bg-[#0a66c2] text-white px-2 py-1 rounded-full text-[10px]">Usar este numero</button></div>))}</div>)}
              <button onClick={()=>{ if(mostrarLoginTrans==='cadastro') criarContaTrans(); else loginTrans(); }} className="w-full mt-3 bg-green-600 text-white py-3 rounded-full font-bold text-[13px]">{mostrarLoginTrans==='cadastro'?'CRIAR CONTA TRANSPORTADOR':'ENTRAR COMO TRANSPORTADOR'}</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-6"><div className="flex justify-between"><div><h2 className="font-bold text-[16px]">Perfil Transportador - {transLogado.nome}</h2><button onClick={sairTransportador} className="bg-gray-100 px-3 py-1 rounded-full text-[11px]">Sair como Transportador</button><p className="text-[11px] text-gray-500">Tel: {transLogado.tel} | NUIT: {transLogado.nuit} | {transLogado.endereco} - {transLogado.provincia} / {transLogado.distrito}</p></div><button onClick={()=>{ localStorage.removeItem('viajar_transportador_sessao'); setTransLogado(null); }} className="bg-red-500 text-white px-3 py-1 rounded-full text-[11px]">Sair</button></div>
                <h3 className="font-bold text-[13px] mt-4">Documentos Necessarios (todos obrigatorios para submeter)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {[{k:'bi',l:'BI / Passaporte'},{k:'carta',l:'Carta de Conducao'},{k:'livrete',l:'Livrete da Viatura'},{k:'seguro',l:'Seguro'},{k:'licenca',l:'Licenca de Transporte'},{k:'fotoViatura',l:'Foto da Viatura'}].map((d:any)=>(<div key={d.k} className="border rounded p-2"><label className="text-[11px] font-bold">{d.l} {['carta','livrete','seguro'].includes(d.k)?'* FILE obrigatorio':''}</label><input type="file" onChange={e=>{ const fn=e.target.files?.[0]?.name||''; setDocsFiles((prev:any)=>({...prev,[d.k]:fn})); }} className="w-full border rounded px-2 py-1 text-[11px] mt-1" /><input value={docsNums[d.k]||''} onChange={e=>setDocsNums((prev:any)=>({...prev,[d.k]:e.target.value}))} className="w-full border rounded px-2 py-1 text-[11px] mt-1" placeholder="Numero (opcional - nao obrigatorio)" /><div className="text-[10px] text-green-600 mt-1">{docsFiles[d.k] ? `FILE: ${docsFiles[d.k]}` : 'Sem FILE ainda'}</div></div>))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2">FILE e obrigatorio para Carta + Livrete + Seguro. Numero e opcional - podes escrever ou deixar vazio.</p>
              </div>
              <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Submeter Viatura - Aguardar Aprovacao do Dono</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div><label className="text-[11px] font-bold">Matricula *</label><input value={formViat.matricula} onChange={e=>setFormViat({...formViat,matricula:e.target.value.toUpperCase()})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="AJP036MC" /></div>
                  <div><label className="text-[11px] font-bold">Marca *</label><input value={formViat.marca} onChange={e=>setFormViat({...formViat,marca:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Toyota" /></div>
                  <div><label className="text-[11px] font-bold">Modelo *</label><input value={formViat.modelo} onChange={e=>setFormViat({...formViat,modelo:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Hiace" /></div>
                  <div><label className="text-[11px] font-bold">Cor do Carro *</label><select value={formViat.cor} onChange={e=>setFormViat({...formViat,cor:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]"><option>Branco</option><option>Preto</option><option>Prateado</option><option>Vermelho</option><option>Azul</option><option>Verde</option><option>Amarelo</option><option>Cinzento</option></select></div>
                  <div><label className="text-[11px] font-bold">Lotacao</label><input type="number" value={formViat.lugares} onChange={e=>setFormViat({...formViat,lugares:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold">Foto (link / file)</label><input value={formViat.foto} onChange={e=>setFormViat({...formViat,foto:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Link foto" /></div>
                  <div className="md:col-span-4 border rounded p-2 bg-blue-50"><div className="font-bold text-[12px]">Motorista + Dono - Telefone com GPS</div><p className="text-[10px] text-gray-600">O MOTORISTA deve andar com o telefone ligado com GPS. O numero do motorista e usado para 2 coisas: 1) receber chamadas do passageiro 2) mostrar distancia + tempo de chegada (ETA) onde o passageiro estiver, a 90 km/h. O numero do dono e so para notificacao.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"><div><label className="text-[11px] font-bold">Nome Motorista *</label><input value={formViat.nomeMotorista} onChange={e=>setFormViat({...formViat,nomeMotorista:e.target.value})} className="w-full border rounded px-2 py-2 text-[13px]" placeholder="Nome do motorista" /></div><div><label className="text-[11px] font-bold">Numero Motorista * - GPS + Chamadas</label><input value={formViat.telMotorista} onChange={e=>setFormViat({...formViat,telMotorista:e.target.value})} className="w-full border rounded px-2 py-2 text-[13px]" placeholder="84... - telefone com GPS ligado" /></div><div><label className="text-[11px] font-bold">Nome Dono</label><input value={formViat.nomeDono} onChange={e=>setFormViat({...formViat,nomeDono:e.target.value})} className="w-full border rounded px-2 py-2 text-[13px]" placeholder="Nome do dono (se diferente)" /></div><div><label className="text-[11px] font-bold">Numero Dono - Notificacao</label><input value={formViat.telDono} onChange={e=>setFormViat({...formViat,telDono:e.target.value})} className="w-full border rounded px-2 py-2 text-[13px]" placeholder="84... - dono recebe notificacao" /></div></div></div>
                </div>
                <div className="mt-4 border rounded p-3 bg-[#f8fafc]"><div className="font-bold text-[13px]">Registar Rota do Carro - Escolhe Provincia + Distrito dos dois lados</div><div className="grid grid-cols-2 gap-3 mt-2"><div className="border rounded p-2 bg-white"><div className="font-bold text-[11px]">ORIGEM - Lado 1</div><label className="text-[11px]">Provincia Origem</label><select value={formViat.provOrig} onChange={e=>setFormViat({...formViat,provOrig:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]"><option>Gaza</option><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select><label className="text-[11px]">Distrito Origem</label><input value={formViat.distOrig} onChange={e=>setFormViat({...formViat,distOrig:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]" placeholder="Ex: Xai-Xai" /></div><div className="border rounded p-2 bg-white"><div className="font-bold text-[11px]">DESTINO - Lado 2</div><label className="text-[11px]">Provincia Destino</label><select value={formViat.provDest} onChange={e=>setFormViat({...formViat,provDest:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]"><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Gaza</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select><label className="text-[11px]">Distrito Destino</label><input value={formViat.distDest} onChange={e=>setFormViat({...formViat,distDest:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]" placeholder="Ex: Maputo" /></div></div><div className="text-[12px] mt-2 font-bold">Rota definida: {formViat.provOrig} - {formViat.distOrig} -&gt; {formViat.provDest} - {formViat.distDest}</div></div>
                <div className="flex gap-2 mt-4"><button onClick={submeterViatura} className="flex-1 bg-[#0a66c2] text-white py-3 rounded-full font-bold text-[13px]">SUBMETER VIATURA - Esperar Aprovacao</button><button onClick={ligarGps} className="flex-1 bg-green-600 text-white py-3 rounded-full font-bold text-[13px]">{gpsAtivo?'GPS LIGADO - Telefone do Motorista':'LIGAR GPS AO VIVO - No Telefone do Motorista'}</button></div>
                {mostrarMaisCarros && (<div className="mt-3 bg-green-50 border border-green-200 rounded p-3 text-center"><div className="text-[12px] font-bold">Viatura submetida! Queres registar mais carros?</div><button onClick={()=>{ setMostrarMaisCarros(false); setFormViat({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo', nomeMotorista:'', telMotorista:'', nomeDono:'', telDono:''}); }} className="mt-2 bg-[#0a66c2] text-white px-5 py-2 rounded-full font-bold text-[12px]">+ REGISTAR MAIS CARROS</button></div>)}
              </div>
              <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Minhas Viaturas Submetidas ({viaturasTrans.length}) - Estado</h3>
                {viaturasTrans.length===0 ? (<p className="text-[12px] text-gray-500 mt-2">Nenhuma viatura submetida ainda.</p>) : viaturasTrans.map((v:any)=>(<div key={v.id} className="border rounded p-3 mt-2 flex justify-between items-center"><div><b>{v.matricula} - {v.marca} {v.modelo} - Cor: {v.cor}</b><div className="text-[11px] text-gray-500">{v.destino} | {v.lugares} lugares | {v.dataSubmissao} | Docs: Carta {v.docs.carta} | Livrete {v.docs.livrete} | Seguro {v.docs.seguro}</div></div><div className="flex gap-2 items-center"><span className={`px-2 py-1 rounded-full text-[11px] font-bold ${v.status==='APROVADA'?'bg-green-100 text-green-700':v.status==='REJEITADA'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{v.status}</span>{v.status==='PENDENTE' && (<><button onClick={()=>aprovarViatura(v.id)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">Aprovar (Dono)</button><button onClick={()=>rejeitarViatura(v.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-[11px]">Rejeitar</button></>)}</div></div>))}
                <p className="text-[10px] text-gray-500 mt-2">PENDENTE = a aguardar dono. APROVADA = aparece para passageiros. REJEITADA = corrige documentos e submete de novo.</p>
              </div>
              <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Notificacoes - Reservas das Tuas Viaturas ({notificacoes.length}) - Motorista + Dono</h3><p className="text-[11px] text-gray-500">Quando passageiro reserva, tu (dono/motorista) recebes aqui + WhatsApp. O bilhete fica ocupado.</p>
                {notificacoes.length===0 ? (<p className="text-[12px] text-gray-500 mt-2">Nenhuma reserva ainda.</p>) : notificacoes.slice(0,10).map((n:any)=>(<div key={n.id} className="border rounded p-3 mt-2 flex justify-between"><div><b>{n.msg}</b><div className="text-[11px] text-gray-500">{n.data} | Passageiro: {n.passageiro} - {n.telPass} | Motorista: {n.motorista} - {n.matricula}</div></div><button onClick={()=>{ const nn=notificacoes.map((x:any)=>x.id===n.id?{...x,lida:true}:x); setNotificacoes(nn); localStorage.setItem('viajar_notificacoes', JSON.stringify(nn)); }} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px]">{n.lida?'Lida':'Marcar Lida'}</button></div>))}
                <div className="mt-3 border-t pt-2"><div className="font-bold text-[12px]">Bilhetes Ocupados por Viatura</div>{viaturasTrans.map((v:any)=>{ const occ=reservas.filter((r:any)=>r.matricula===v.matricula); return (<div key={v.id} className="text-[11px] border rounded px-2 py-1 mt-1"><b>{v.matricula} - {v.marca} {v.modelo}</b> - Ocupados: {occ.length>0?occ.map((o:any)=>`Assento ${o.assento||'-'} (${o.nomePass})`).join(', '):'nenhum - todos livres'}</div>); })}</div>
              </div>
            </div>
          )}
        </div>
      )}
      {papel==='passageiro' && passLogado && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[16px]">Passageiro - {passLogado?.nome} - {passLogado?.tel}</h3><div className="flex gap-2 mt-2 flex-wrap"><button onClick={pedirLocalizacaoPassageiro} className="bg-green-600 text-white px-4 py-2 rounded-full text-[12px] font-bold">Permitir localização</button><button onClick={sairPassageiro} className="bg-gray-100 px-3 py-1 rounded-full text-[11px]">Sair como Passageiro</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3"><div><label className="text-[11px] font-bold">Origem</label><select value={origem} onChange={e=>setOrigem(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select></div><div><label className="text-[11px] font-bold">Destino</label><select value={destino} onChange={e=>setDestino(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select></div><div className="bg-[#fffbeb] border rounded p-2 text-[12px]">Rota: <b>{origem} -&gt; {destino}</b><br/>Distancia: <b>{rotaInfo.distEstrada.toFixed(1)} km</b> | ETA <b>{rotaInfo.etaMin} min</b> | <b>{rotaInfo.precoPP}MT/pessoa</b></div><div className="bg-green-50 border rounded p-2 text-[12px]">Minhas Reservas: <b>{reservas.length}</b><br/>{reservas.slice(0,3).map((r:any)=>(<div key={r.id}>{r.matricula} - Assento {r.assento||'-'} - {r.total}MT - {r.status}</div>))}</div></div>
            <div className="flex gap-2 mt-3"><select value={filtroRota} onChange={e=>setFiltroRota(e.target.value)} className="border rounded px-3 py-1 text-[12px]"><option>Todas</option><option>Xai-Xai -&gt; Maputo</option><option>Maputo -&gt; Xai-Xai</option><option>Matola -&gt; Maputo</option></select><select value={filtroCor} onChange={e=>setFiltroCor(e.target.value)} className="border rounded px-3 py-1 text-[12px]"><option>Todas</option><option>Branco</option><option>Preto</option><option>Prateado</option><option>Vermelho</option><option>Azul</option></select></div>
            {reservas.filter((r:any)=>!passLogado || r.telPass===passLogado.tel).length>0 && (<div className="mt-3 border-t pt-2"><div className="font-bold text-[12px]">Minhas Reservas ({reservas.filter((r:any)=>!passLogado || r.telPass===passLogado.tel).length}) - {passLogado?.nome}</div>{reservas.filter((r:any)=>!passLogado || r.telPass===passLogado.tel).slice(0,5).map((r:any)=>(<div key={r.id} className="text-[11px] border rounded px-2 py-1 mt-1 flex justify-between"><span><b>{r.origem} -&gt; {r.destino}</b> - {r.numPass} pessoa(s) - {r.total}MT - {r.matricula} - {r.status}</span><span>{r.data}</span></div>))}</div>)}
          </div>
          <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Mapa - Carros ONLINE</h3><p className="text-[11px] text-gray-500">Clica no ponto para ver o carro.</p>
            <div ref={mapaRef} className="w-full h-[380px] border rounded mt-3 z-0" style={{minHeight:380}}></div>
            
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {listaPassageiro.length===0 && viaturasAprovadas.length===0 && (<div className="bg-white p-6 rounded-xl border text-center text-[13px] text-gray-500">Nenhuma viatura ONLINE / APROVADA - transportador deve submeter e dono aprovar, depois ligar GPS.</div>)}
            {listaPassageiro.map((v:any)=>{
              let distTxt='Ativa GPS'; let etaTxt='';
              if(passageiroPos && v.lat && v.lng){ const d=haversine(passageiroPos.lat, passageiroPos.lng, v.lat, v.lng); if(d<0.05){ distTxt='Aqui mesmo - <50m'; etaTxt='~1 min'; } else if(d<1){ distTxt=`${Math.round(d*1000)} m`; etaTxt='~2 min'; } else { distTxt=`${d.toFixed(2)} km`; etaTxt=`~${Math.ceil(d/90*60)} min a 90 km/h`; } }
              const cor = viaturasTrans.find((x:any)=>x.matricula===v.matricula)?.cor || 'Branco';
              if(filtroCor!=='Todas' && cor!==filtroCor) return null;
              return (
                <div key={v.id} className="bg-white rounded-xl border p-4">
                  <div className="flex justify-between"><h4 className="font-bold text-[14px]">{v.matricula} - {v.carro}</h4><span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">{v.status}</span></div>
                  <div className="flex gap-2 mt-2 items-center"><span className="w-6 h-6 rounded-full border" style={{backgroundColor: cor==='Branco'?'#fff':cor==='Preto'?'#000':cor==='Prateado'?'#c0c0c0':cor==='Vermelho'?'#ef4444':cor==='Azul'?'#3b82f6':cor==='Verde'?'#22c55e':'#eab308'}}></span><span className="text-[12px] font-bold">Cor: {cor}</span><span className="text-[11px] text-gray-500">| Matricula: {v.matricula}</span></div>
                  <p className="text-[12px] mt-1">Motorista: {v.nomeMotorista||v.nome} - {v.telMotorista||v.telefone} (GPS + Chamadas)</p><p className="text-[11px] text-gray-600">Dono: {v.nomeDono||v.transportador} - {v.telDono||v.tel||''}</p>
                  <p className="text-[11px] text-gray-600">{v.cidade}, {v.provincia} -&gt; {v.destino_atual} - {v.lugares} lugares</p>
                  <p className="text-[11px] mt-1">Distancia ate ti: {distTxt} {etaTxt && `| ETA: ${etaTxt}`} | Rota {origem} -&gt; {destino}: {rotaInfo.distEstrada.toFixed(1)} km - {rotaInfo.precoPP}MT/pessoa</p>
                  <p className="text-[10px] text-gray-400">Atualizado: {v.ultima_atualizacao}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <a href={`tel:${String(v.telefone||'').replace(/[^0-9]/g,'')}`} className="text-[11px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">Ligar</a>
                    <button onClick={()=>{ const msg=`Ola ${v.nomeMotorista||v.nome}, quero ir ${origem} -> ${destino} - ${rotaInfo.distEstrada.toFixed(1)} km - ${rotaInfo.precoPP}MT/pessoa - ETA ${rotaInfo.etaMin} min a 90 km/h`; const num=String(v.telefone||'').replace(/[^0-9]/g,''); window.open('https://wa.me/' + (num.startsWith('258')?num:'258'+num) + '?text=' + encodeURIComponent(msg), '_blank'); }} className="text-[11px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">WhatsApp</button>
                    <button onClick={()=>{ setChatAberto(chatAberto===v.id?null:v.id); setChatMsgs([]); }} className="text-[11px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Chat</button>
                  {reservaViatura && reservaViatura.id===v.id && (
                    <div className="mt-3 border-2 border-[#0a66c2] rounded p-3 bg-blue-50">
                      <div className="flex justify-between"><h3 className="font-bold text-[13px]">Reservar - Viatura {v.matricula} - {v.carro} - Cor: {cor}</h3><button onClick={()=>setReservaViatura(null)} className="bg-gray-100 px-2 py-1 rounded-full text-[11px]">X Fechar</button></div>
                      <p className="text-[10px] text-gray-500">Formulario dentro desta viatura - quando confirmares, motorista + dono recebem notificacao e o bilhete fica ocupado.</p>
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        <div className="space-y-1">
                          <div><label className="text-[11px] font-bold">NOME COMPLETO PASSAGEIRO *</label><input value={nomePass} onChange={e=>setNomePass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Nome completo" /></div>
                          <div><label className="text-[11px] font-bold">CONTACTO WHATSAPP *</label><input value={telPass} onChange={e=>setTelPass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="84..." /></div>
                          <div><label className="text-[11px] font-bold">CONTACTO DO FAMILIAR - emergencias</label><input value={telFamiliar} onChange={e=>setTelFamiliar(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Contacto familiar" /></div>
                          <div><label className="text-[11px] font-bold">NOME FAMILIAR</label><input value={nomeFamiliar} onChange={e=>setNomeFamiliar(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Nome do familiar" /></div>
                          <div className="flex gap-1"><div className="flex-1"><label className="text-[11px] font-bold">BI</label><input value={biPass} onChange={e=>setBiPass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="BI" /></div><div className="flex-1"><label className="text-[11px] font-bold">IDADE / TIPO</label><select value={idadeTipo} onChange={e=>setIdadeTipo(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]"><option>Adulto</option><option>Crianca</option><option>Idoso</option></select></div></div>
                          <div><label className="text-[11px] font-bold">LOCAL SERA ENCONTRADO / DESEMBARQUE</label><input value={localEmbarque} onChange={e=>setLocalEmbarque(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Ex: Marracuene" /></div>
                          <div><label className="text-[11px] font-bold">DESTINO CUSTOM</label><input value={destinoCustom} onChange={e=>setDestinoCustom(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Ex: Cidade da Beira" /></div>
                          <div className="border rounded p-1 bg-yellow-50"><div className="font-bold text-[11px]">ACOMPANHANTES - ate 3</div>{acompanhantes.map((a:any,i:number)=>(<div key={i} className="flex gap-1 mt-1"><input value={a.nome} onChange={e=>{ const n=[...acompanhantes]; n[i].nome=e.target.value; setAcompanhantes(n); }} className="flex-1 border rounded px-1 py-1 text-[11px]" placeholder="Nome" /><input value={a.tel} onChange={e=>{ const n=[...acompanhantes]; n[i].tel=e.target.value; setAcompanhantes(n); }} className="w-[80px] border rounded px-1 py-1 text-[11px]" placeholder="Tel" /><select value={a.tipo} onChange={e=>{ const n=[...acompanhantes]; n[i].tipo=e.target.value; setAcompanhantes(n); }} className="border rounded px-1 py-1 text-[11px]"><option>Adulto</option><option>Crianca</option><option>Filho</option></select></div>))}<button onClick={()=>{ if(acompanhantes.length<3) setAcompanhantes([...acompanhantes, {nome:'', tel:'', tipo:'Adulto'}]); }} className="mt-1 bg-gray-100 px-2 py-1 rounded-full text-[11px]">+ Acompanhante</button></div>
                        </div>
                        <div className="space-y-1">
                          <div><label className="text-[11px] font-bold">Origem / Destino</label><div className="flex gap-1"><select value={origem} onChange={e=>setOrigem(e.target.value)} className="flex-1 border rounded px-1 py-1 text-[12px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select><select value={destino} onChange={e=>setDestino(e.target.value)} className="flex-1 border rounded px-1 py-1 text-[12px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select></div></div>
                          <div><label className="text-[11px] font-bold">Passageiros</label><input type="number" min={1} max={15} value={numPass} onChange={e=>setNumPass(Number(e.target.value)||1)} className="w-full border rounded px-2 py-1 text-[12px]" /></div>
                          <div className="border rounded p-1"><div className="font-bold text-[11px]">Escolher lugar / assento - {v.matricula} - bloqueados os reservados</div><div className="grid grid-cols-5 gap-1 mt-1">{Array.from({length:25},(_,i)=>i+1).map((n:number)=>{ const ocupado = reservas.some((r:any)=>r.matricula===v.matricula && r.assento===n); const sel = assentoSel===n; return (<button key={n} disabled={ocupado} onClick={()=>setAssentoSel(n)} className={`py-1 rounded text-[11px] font-bold ${ocupado?'bg-red-300 text-white':sel?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>{n}{ocupado?' X':''}</button>); })}</div><div className="text-[10px] text-gray-500 mt-1">Assento: {assentoSel||'nenhum'} | Vermelho X = OCUPADO</div></div>
                          <div className="border rounded p-1"><div className="font-bold text-[11px]">MODO DE PAGAMENTO</div><div className="grid grid-cols-2 gap-1 mt-1">{['M-Pesa','E-Mola','mKesh','Dinheiro no terminal'].map((mp:string)=>(<button key={mp} onClick={()=>setModoPag(mp)} className={`py-1 rounded-full text-[11px] font-bold ${modoPag===mp?'bg-green-600 text-white':'bg-gray-100'}`}>{mp}</button>))}</div></div>
                          <div className="bg-green-50 border border-green-200 rounded p-2"><div className="text-[11px]">Total: {numPass} x {rotaInfo.precoPP}MT - Viatura {v.matricula}</div><div className="font-black text-[16px] text-green-700">{(rotaInfo.precoPP*numPass)}MT</div><button onClick={reservarViagem} className="w-full mt-1 bg-green-600 text-white py-2 rounded-full font-bold text-[12px]">Confirmar {(rotaInfo.precoPP*numPass)}MT - Gerar Bilhete (QR)</button><div className="text-[10px] text-gray-500 mt-1">Bilhete: {nomePass||'--'} | {origem} -&gt; {destinoCustom||destino} | Assento {assentoSel||'-'} | {modoPag}</div></div>
                        </div>
                      </div>
                    </div>
                  )}
                    <button onClick={()=>{ setReservaViatura(v); setViaturaSel(v.id); setOrigem(v.cidade||origem); }} className="text-[11px] bg-[#0a66c2] text-white px-3 py-1 rounded-full font-bold">Reservar</button>
                  </div>
                  {chatAberto===v.id && (<div className="mt-3 border rounded p-2 bg-gray-50"><div className="font-bold text-[11px]">Chat - {v.nome} - {v.matricula}</div><div className="mt-1 space-y-1 max-h-[120px] overflow-auto">{chatMsgs.length===0 ? (<div className="text-[11px] text-gray-500">Escreve para o motorista.</div>) : chatMsgs.map((m:any,i:number)=>(<div key={i} className="text-[11px]"><b>{m.de}:</b> {m.texto} <span className="text-gray-400">{m.hora}</span></div>))}</div><div className="flex gap-1 mt-2"><input value={chatTexto} onChange={e=>setChatTexto(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') enviarChat(v); }} placeholder="Escreve..." className="flex-1 border rounded px-2 py-1 text-[12px]" /><button onClick={()=>enviarChat(v)} className="bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">Enviar</button></div></div>)}
                </div>
              );
            })}
            {viaturasAprovadas.filter((v:any)=>!listaPassageiro.find((x:any)=>x.matricula===v.matricula)).map((v:any)=>(
              <div key={v.id} className="bg-white rounded-xl border p-4 opacity-90"><div className="flex justify-between"><h4 className="font-bold text-[14px]">{v.matricula} - {v.marca} {v.modelo}</h4><span className="text-[10px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">APROVADA - OFFLINE</span></div><div className="flex gap-2 mt-2 items-center"><span className="w-6 h-6 rounded-full border" style={{backgroundColor:'#fff'}}></span><span className="text-[12px] font-bold">Cor: {v.cor}</span><span className="text-[11px]">| Matricula: {v.matricula}</span></div><p className="text-[12px] mt-1">Motorista: {v.transportador} - {v.tel}</p><p className="text-[11px] text-gray-600">{v.cidade}, {v.provincia} -&gt; {v.destino} - {v.lugares} lugares</p><p className="text-[11px] mt-1">Rota {origem} -&gt; {destino}: {rotaInfo.distEstrada.toFixed(1)} km - {rotaInfo.precoPP}MT/pessoa - Motorista ainda nao ligou GPS, mas ja podes reservar.</p><div className="flex gap-2 mt-3"><a href={`tel:${String(v.tel||'').replace(/[^0-9]/g,'')}`} className="text-[11px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">Ligar</a><button onClick={()=>{ const num=String(v.tel||'').replace(/[^0-9]/g,''); window.open('https://wa.me/' + (num.startsWith('258')?num:'258'+num) + '?text=' + encodeURIComponent('Ola ' + v.transportador + ', quero reservar ' + origem + ' -> ' + destino), '_blank'); }} className="text-[11px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">WhatsApp</button><button onClick={()=>{ setReservaViatura(v); setViaturaSel(v.id); }} className="text-[11px] bg-[#0a66c2] text-white px-3 py-1 rounded-full font-bold">Reservar</button></div>{reservaViatura && reservaViatura.id===v.id && (<div className="mt-3 border-2 border-[#0a66c2] rounded p-3 bg-blue-50"><div className="flex justify-between"><h3 className="font-bold text-[13px]">Reservar - Viatura {v.matricula} - {v.marca} {v.modelo}</h3><button onClick={()=>setReservaViatura(null)} className="bg-gray-100 px-2 py-1 rounded-full text-[11px]">X Fechar</button></div><p className="text-[10px]">Formulario dentro desta viatura - motorista + dono recebem notificacao.</p><div className="grid md:grid-cols-2 gap-3 mt-2"><div className="space-y-1"><div><label className="text-[11px] font-bold">NOME COMPLETO PASSAGEIRO *</label><input value={nomePass} onChange={e=>setNomePass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Nome completo" /></div><div><label className="text-[11px] font-bold">CONTACTO WHATSAPP *</label><input value={telPass} onChange={e=>setTelPass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="84..." /></div><div><label className="text-[11px] font-bold">CONTACTO DO FAMILIAR</label><input value={telFamiliar} onChange={e=>setTelFamiliar(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Contacto familiar" /></div><div><label className="text-[11px] font-bold">NOME FAMILIAR</label><input value={nomeFamiliar} onChange={e=>setNomeFamiliar(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Nome do familiar" /></div><div className="flex gap-1"><div className="flex-1"><label className="text-[11px] font-bold">BI</label><input value={biPass} onChange={e=>setBiPass(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="BI" /></div><div className="flex-1"><label className="text-[11px] font-bold">IDADE / TIPO</label><select value={idadeTipo} onChange={e=>setIdadeTipo(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]"><option>Adulto</option><option>Crianca</option><option>Idoso</option></select></div></div><div><label className="text-[11px] font-bold">LOCAL SERA ENCONTRADO</label><input value={localEmbarque} onChange={e=>setLocalEmbarque(e.target.value)} className="w-full border rounded px-2 py-1 text-[12px]" placeholder="Ex: Marracuene" /></div></div><div className="space-y-1"><div><label className="text-[11px] font-bold">Passageiros</label><input type="number" min={1} max={15} value={numPass} onChange={e=>setNumPass(Number(e.target.value)||1)} className="w-full border rounded px-2 py-1 text-[12px]" /></div><div className="border rounded p-1"><div className="font-bold text-[11px]">Escolher lugar / assento - {v.matricula}</div><div className="grid grid-cols-5 gap-1 mt-1">{Array.from({length:25},(_,i)=>i+1).map((n:number)=>{ const ocupado = reservas.some((r:any)=>r.matricula===v.matricula && r.assento===n); const sel = assentoSel===n; return (<button key={n} disabled={ocupado} onClick={()=>setAssentoSel(n)} className={`py-1 rounded text-[11px] font-bold ${ocupado?'bg-red-300 text-white':sel?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>{n}{ocupado?' X':''}</button>); })}</div></div><div className="border rounded p-1"><div className="font-bold text-[11px]">MODO DE PAGAMENTO</div><div className="grid grid-cols-2 gap-1 mt-1">{['M-Pesa','E-Mola','mKesh','Dinheiro no terminal'].map((mp:string)=>(<button key={mp} onClick={()=>setModoPag(mp)} className={`py-1 rounded-full text-[11px] font-bold ${modoPag===mp?'bg-green-600 text-white':'bg-gray-100'}`}>{mp}</button>))}</div></div><div className="bg-green-50 border rounded p-2"><div className="text-[11px]">Total: {numPass} x {rotaInfo.precoPP}MT - {v.matricula}</div><div className="font-black text-[16px] text-green-700">{(rotaInfo.precoPP*numPass)}MT</div><button onClick={reservarViagem} className="w-full mt-1 bg-green-600 text-white py-2 rounded-full font-bold text-[12px]">Confirmar {(rotaInfo.precoPP*numPass)}MT - Gerar Bilhete (QR)</button></div></div></div></div>)}</div>
            ))}
          </div>
        </div>
      )}
    </div></div>
    );
}
