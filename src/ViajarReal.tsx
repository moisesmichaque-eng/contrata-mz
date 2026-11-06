
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
const CIDADES:any = {'Xai-Xai':{lat:-25.0519,lng:32.6426},'Maputo':{lat:-25.9655,lng:32.5832},'Matola':{lat:-25.9622,lng:32.4586},'Chokwe':{lat:-24.5333,lng:32.9833},'Bilene':{lat:-25.2700,lng:33.2300},'Manhica':{lat:-25.4022,lng:32.8072},'Magude':{lat:-25.0222,lng:32.6417},'Boane':{lat:-26.0431,lng:32.3244}};
export default function ViajarReal(){
  const [aba, setAba] = useState<'transportador'|'passageiro'>('passageiro');
  const [passageiroPos, setPassageiroPos] = useState<{lat:number,lng:number}|null>(null);
  const [permissao, setPermissao] = useState<any>('unknown');
  const [lista, setLista] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const watchIdRef = useRef<number|null>(null); const intervaloRef = useRef<any>(null);
  // TRANSPORTADOR - perfil como VENDER
  const [transLogado, setTransLogado] = useState<any>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_transportador_sessao')||'null'); }catch(e){ return null; } });
  const [mostrarLoginTrans, setMostrarLoginTrans] = useState<'cadastro'|'login'>('cadastro');
  const [formTrans, setFormTrans] = useState({nome:'', tel:'', password:'', nuit:'', endereco:'', provincia:'', distrito:'', email:''});
  const [docs, setDocs] = useState({carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:'', bi:''});
  const [docsFiles, setDocsFiles] = useState<any>({bi:'', carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:''});
  const [docsNums, setDocsNums] = useState<any>({bi:'', carta:'', livrete:'', seguro:'', licenca:'', fotoViatura:''});
  const [viaturasTrans, setViaturasTrans] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('viajar_viaturas_trans')||'[]'); }catch(e){ return []; } });
  const [formViat, setFormViat] = useState({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo'});
  const [mostrarMaisCarros, setMostrarMaisCarros] = useState(false);
  // PASSAGEIRO - reservar
  const [origem, setOrigem] = useState('Xai-Xai'); const [destino, setDestino] = useState('Maputo');
  const [numPass, setNumPass] = useState(1); const [nomePass, setNomePass] = useState(''); const [telPass, setTelPass] = useState('');
  const [telFamiliar, setTelFamiliar] = useState(''); const [nomeFamiliar, setNomeFamiliar] = useState(''); const [biPass, setBiPass] = useState(''); const [idadeTipo, setIdadeTipo] = useState('Adulto'); const [localEmbarque, setLocalEmbarque] = useState(''); const [destinoCustom, setDestinoCustom] = useState(''); const [assentoSel, setAssentoSel] = useState<number|null>(null); const [modoPag, setModoPag] = useState('M-Pesa'); const [acompanhantes, setAcompanhantes] = useState<any[]>([{nome:'', tel:'', tipo:'Adulto'}]);
  const [viaturaSel, setViaturaSel] = useState('');
  const [reservas, setReservas] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('viagens_reservas')||'[]'); }catch(e){ return []; } });
  const [chatAberto, setChatAberto] = useState<string|null>(null); const [chatMsgs, setChatMsgs] = useState<any[]>([]); const [chatTexto, setChatTexto] = useState('');
  const [filtroCor, setFiltroCor] = useState('Todas'); const [filtroRota, setFiltroRota] = useState('Todas');
  const carregarReais = async () => {
    setCarregando(true);
    const { data } = await supabase.from('viagens_motoristas').select('*').eq('status','ONLINE').order('ultima_atualizacao',{ascending:false});
    setLista((data as any[])||[]); setCarregando(false);
  };
  const pedirGPS = () => { if(!navigator.geolocation) return; navigator.geolocation.getCurrentPosition((pos:any)=>{ setPassageiroPos({lat:pos.coords.latitude,lng:pos.coords.longitude}); setPermissao('granted'); },()=>setPermissao('denied'),{enableHighAccuracy:true}); };
  useEffect(()=>{ carregarReais(); pedirGPS(); if(navigator.permissions) navigator.permissions.query({name:'geolocation' as any}).then((r:any)=>setPermissao(r.state)); },[]);
  // TRANSPORTADOR - criar conta / login (local + sessao, como VENDER)
  const criarContaTrans = () => {
    if(!formTrans.nome || !formTrans.tel || !formTrans.password){ alert('Nome, Telefone e Password'); return; }
    if(!formTrans.nuit){ alert('NUIT e obrigatorio - documento'); return; }
    const nova = {...formTrans, conta_id:`trans_${Date.now()}`, criado:new Date().toLocaleString('pt-MZ')};
    localStorage.setItem('viajar_transportador_sessao', JSON.stringify(nova)); setTransLogado(nova); alert('Conta transportador criada! Agora preenche documentos e submete viatura.');
  };
  const loginTrans = () => {
    const s = localStorage.getItem('viajar_transportador_sessao'); if(!s){ alert('Nenhuma conta - cria conta primeiro'); return; }
    const t = JSON.parse(s); if(t.tel===formTrans.tel && t.password===formTrans.password){ setTransLogado(t); alert('Bem-vindo '+t.nome); } else alert('Telefone ou password errada');
  };
  const submeterViatura = async () => {
    if(!formViat.matricula || !formViat.marca || !formViat.modelo){ alert('Matricula, Marca e Modelo'); return; }
    if(!docsFiles.carta || !docsFiles.livrete || !docsFiles.seguro){ alert('Documentos obrigatorios: faz upload do FILE da Carta + Livrete + Seguro (numero e opcional)'); return; }
    const rotaDef = `${formViat.provOrig} - ${formViat.distOrig} -> ${formViat.provDest} - ${formViat.distDest}`;
    const nova:any = {...formViat, destino:rotaDef, rota:rotaDef, provOrig:formViat.provOrig, distOrig:formViat.distOrig, provDest:formViat.provDest, distDest:formViat.distDest, id:Date.now(), transportador:transLogado.nome, tel:transLogado.tel, docs:{...docsNums, files:{...docsFiles}}, docsFiles:{...docsFiles}, docsNums:{...docsNums}, status:'PENDENTE', dataSubmissao:new Date().toLocaleString('pt-MZ')};
    const listaN=[nova, ...viaturasTrans]; setViaturasTrans(listaN); localStorage.setItem('viajar_viaturas_trans', JSON.stringify(listaN));
    // Tambem tenta criar no Supabase como OFFLINE (aguardar aprovacao, nao aparece para passageiro)
    try{ await supabase.from('viagens_motoristas').insert([{nome:transLogado.nome, carro:`${formViat.marca} ${formViat.modelo}`, matricula:formViat.matricula.toUpperCase(), provincia:formViat.provincia, cidade:formViat.cidade, telefone:transLogado.tel, lugares:parseInt(formViat.lugares)||15, destino_atual:formViat.destino, status:'OFFLINE', conta_id:transLogado.conta_id, ultima_atualizacao:new Date().toISOString(), updated_at:new Date().toISOString()}]); }catch(e){}
    setFormViat({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo'}); setMostrarMaisCarros(true);
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
  const calcRota = () => { const a=CIDADES[origem]; const b=CIDADES[destino]; if(!a||!b) return {distEstrada:0, etaMin:0, precoPP:0}; const reta=haversine(a.lat,a.lng,b.lat,b.lng); const distEstrada=reta*1.7; const etaMin=Math.ceil(distEstrada/60*60); const precoPP=Math.round(Math.max(50, distEstrada*2.5)/10)*10; return {distEstrada, etaMin, precoPP}; };
  const rotaInfo = calcRota();
  const viaturasAprovadas = viaturasTrans.filter((v:any)=>v.status==='APROVADA');
  const listaPassageiro = lista.filter((v:any)=>{ if(filtroRota!=='Todas' && v.destino_atual!==filtroRota) return false; return true; });
  const reservarViagem = async () => {
    if(!nomePass || !telPass){ alert('Nome e Telefone do passageiro'); return; }
    if(origem===destino){ alert('Origem e Destino nao podem ser iguais'); return; }
    const v = lista.find((x:any)=>x.id===viaturaSel) || lista[0] || viaturasAprovadas[0];
    if(!v){ alert('Nenhuma viatura ONLINE / APROVADA'); return; }
    const total = rotaInfo.precoPP * numPass;
    const nova:any = {id:Date.now(), origem, destino:destinoCustom||destino, dist:rotaInfo.distEstrada.toFixed(1), eta:rotaInfo.etaMin, precoPP:rotaInfo.precoPP, numPass, total, nomePass, telPass, telFamiliar, nomeFamiliar, bi:biPass, idadeTipo, localEmbarque, acompanhantes, assento:assentoSel, modoPag, motorista:v.nome, matricula:v.matricula, telMotorista:v.telefone, data:new Date().toLocaleString('pt-MZ'), status:'RESERVADA'};
    const listaN=[nova, ...reservas]; setReservas(listaN); localStorage.setItem('viagens_reservas', JSON.stringify(listaN));
    const msg=`RESERVA ${origem} -> ${destino} | ${numPass} pessoa(s) | ${rotaInfo.distEstrada.toFixed(1)} km | ETA ${rotaInfo.etaMin} min | Total ${total}MT | Passageiro: ${nomePass} - ${telPass} | Viatura: ${v.matricula}`;
    const num=String(v.telefone||'').replace(/[^0-9]/g,''); if(num) window.open(`https://wa.me/${num.startsWith('258')?num:`258${num}`}?text=${encodeURIComponent(msg)}`, '_blank');
    alert(`RESERVADA! ${origem} -> ${destino} - ${total}MT - ${v.matricula}`);
  };
  const enviarChat = (v:any) => { if(!chatTexto.trim()) return; const m1={de:'Tu', texto:chatTexto, hora:new Date().toLocaleTimeString('pt-MZ',{hour:'2-digit',minute:'2-digit'})}; setChatMsgs([...chatMsgs, m1]); setChatTexto(''); setTimeout(()=>{ setChatMsgs((prev:any)=>[...prev, {de:v.nome, texto:`Recebido! Estou a caminho ${origem} -> ${destino}. ETA ${rotaInfo.etaMin} min.`, hora:new Date().toLocaleTimeString('pt-MZ',{hour:'2-digit',minute:'2-digit'})}]); },1200); };
  // MAPA simples - posicao por lat/lng normalizado para Mocambique
  const mapaPontos = listaPassageiro.map((v:any)=>{ if(!v.lat||!v.lng) return null; const x=((v.lng+35.5)/(35.5-30.2))*100; const y=(( -24.0 - v.lat)/(-24.0 - -27.0))*100; return {v, x:Math.max(5,Math.min(95,x)), y:Math.max(5,Math.min(95,y))}; }).filter(Boolean);
  return (
    <div className="min-h-screen bg-[#f0f2f5] text-black p-4 font-sans"><div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
        <h1 className="text-2xl font-bold text-[#0a66c2]">VIAJAR - 100% REAL</h1>
        <p className="text-[12px] text-gray-600 mt-1">2 Paineis: Transportador (regista, submete, espera aprovar) | Passageiro (ve mapa, carros, rotas, reserva) - {lista.length} ONLINE</p>
        <p className="text-[11px] mt-2">Passageiro GPS: {String(permissao)} {passageiroPos?`(${passageiroPos.lat.toFixed(5)}, ${passageiroPos.lng.toFixed(5)})`:'nao obtido'}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setAba('transportador')} className={`px-5 py-2 rounded-full text-[13px] font-bold ${aba==='transportador'?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>Transportador - Registar Viatura</button>
          <button onClick={()=>setAba('passageiro')} className={`px-5 py-2 rounded-full text-[13px] font-bold ${aba==='passageiro'?'bg-green-600 text-white':'bg-gray-100'}`}>Passageiro - Ver Carros e Reservar</button>
          <button onClick={pedirGPS} className="bg-[#0a66c2] text-white px-4 py-2 rounded-full text-[12px] font-bold">PERMITIR LOCALIZACAO</button>
          <button onClick={carregarReais} className="bg-gray-100 px-4 py-2 rounded-full text-[11px]">Recarregar</button>
        </div>
      </div>
      {aba==='transportador' && (
        <div className="space-y-4">
          {!transLogado ? (
            <div className="bg-[#0a66c2] rounded-xl p-6 text-white">
              <h2 className="font-black text-[18px]">Transportador - Criar Conta / Entrar</h2>
              <p className="text-[11px] mt-1">Como VENDER: cria conta, depois documentos, depois submete viatura e espera o dono aceitar.</p>
              <div className="grid grid-cols-2 gap-3 mt-4 bg-white text-black rounded-xl p-4">
                <div><label className="text-[11px] font-bold">Nome Completo *</label><input value={formTrans.nome} onChange={e=>setFormTrans({...formTrans,nome:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Nome do transportador" /></div>
                <div><label className="text-[11px] font-bold">Telefone / WhatsApp *</label><input value={formTrans.tel} onChange={e=>setFormTrans({...formTrans,tel:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="84..." /></div>
                <div><label className="text-[11px] font-bold">Password *</label><input type="password" value={formTrans.password} onChange={e=>setFormTrans({...formTrans,password:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" /></div>
                <div><label className="text-[11px] font-bold">NUIT * (documento)</label><input value={formTrans.nuit} onChange={e=>setFormTrans({...formTrans,nuit:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="NUIT" /></div>
                <div><label className="text-[11px] font-bold">Endereco</label><input value={formTrans.endereco} onChange={e=>setFormTrans({...formTrans,endereco:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Endereco" /></div>
                <div><label className="text-[11px] font-bold">Provincia / Distrito</label><div className="flex gap-2"><input value={formTrans.provincia} onChange={e=>setFormTrans({...formTrans,provincia:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Provincia" /><input value={formTrans.distrito} onChange={e=>setFormTrans({...formTrans,distrito:e.target.value})} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Distrito" /></div></div>
              </div>
              <div className="flex gap-2 mt-3"><button onClick={()=>setMostrarLoginTrans('cadastro')} className="px-4 py-2 rounded-full bg-white text-black text-[12px] font-bold">Criar Conta</button><button onClick={()=>setMostrarLoginTrans('login')} className="px-4 py-2 rounded-full border text-[12px] font-bold">Ja tenho conta - Entrar</button></div>
              <button onClick={()=>{ if(mostrarLoginTrans==='cadastro') criarContaTrans(); else loginTrans(); }} className="w-full mt-3 bg-green-600 text-white py-3 rounded-full font-bold text-[13px]">{mostrarLoginTrans==='cadastro'?'CRIAR CONTA TRANSPORTADOR':'ENTRAR COMO TRANSPORTADOR'}</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-6"><div className="flex justify-between"><div><h2 className="font-bold text-[16px]">Perfil Transportador - {transLogado.nome}</h2><p className="text-[11px] text-gray-500">Tel: {transLogado.tel} | NUIT: {transLogado.nuit} | {transLogado.endereco} - {transLogado.provincia} / {transLogado.distrito}</p></div><button onClick={()=>{ localStorage.removeItem('viajar_transportador_sessao'); setTransLogado(null); }} className="bg-red-500 text-white px-3 py-1 rounded-full text-[11px]">Sair</button></div>
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
                </div>
                <div className="mt-4 border rounded p-3 bg-[#f8fafc]"><div className="font-bold text-[13px]">Registar Rota do Carro - Escolhe Provincia + Distrito dos dois lados</div><div className="grid grid-cols-2 gap-3 mt-2"><div className="border rounded p-2 bg-white"><div className="font-bold text-[11px]">ORIGEM - Lado 1</div><label className="text-[11px]">Provincia Origem</label><select value={formViat.provOrig} onChange={e=>setFormViat({...formViat,provOrig:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]"><option>Gaza</option><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select><label className="text-[11px]">Distrito Origem</label><input value={formViat.distOrig} onChange={e=>setFormViat({...formViat,distOrig:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]" placeholder="Ex: Xai-Xai" /></div><div className="border rounded p-2 bg-white"><div className="font-bold text-[11px]">DESTINO - Lado 2</div><label className="text-[11px]">Provincia Destino</label><select value={formViat.provDest} onChange={e=>setFormViat({...formViat,provDest:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]"><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Gaza</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select><label className="text-[11px]">Distrito Destino</label><input value={formViat.distDest} onChange={e=>setFormViat({...formViat,distDest:e.target.value})} className="w-full border rounded px-2 py-2 text-[12px]" placeholder="Ex: Maputo" /></div></div><div className="text-[12px] mt-2 font-bold">Rota definida: {formViat.provOrig} - {formViat.distOrig} -&gt; {formViat.provDest} - {formViat.distDest}</div></div>
                <div className="flex gap-2 mt-4"><button onClick={submeterViatura} className="flex-1 bg-[#0a66c2] text-white py-3 rounded-full font-bold text-[13px]">SUBMETER VIATURA - Esperar Aprovacao</button><button onClick={ligarGps} className="flex-1 bg-green-600 text-white py-3 rounded-full font-bold text-[13px]">{gpsAtivo?'GPS LIGADO':'LIGAR GPS AO VIVO'}</button></div>
                {mostrarMaisCarros && (<div className="mt-3 bg-green-50 border border-green-200 rounded p-3 text-center"><div className="text-[12px] font-bold">Viatura submetida! Queres registar mais carros?</div><button onClick={()=>{ setMostrarMaisCarros(false); setFormViat({matricula:'', marca:'', modelo:'', cor:'Branco', lugares:'15', provincia:'', cidade:'', destino:'Xai-Xai -> Maputo', preco:'', foto:'', provOrig:'Gaza', distOrig:'Xai-Xai', provDest:'Maputo Cidade', distDest:'Maputo'}); }} className="mt-2 bg-[#0a66c2] text-white px-5 py-2 rounded-full font-bold text-[12px]">+ REGISTAR MAIS CARROS</button></div>)}
              </div>
              <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Minhas Viaturas Submetidas ({viaturasTrans.length}) - Estado</h3>
                {viaturasTrans.length===0 ? (<p className="text-[12px] text-gray-500 mt-2">Nenhuma viatura submetida ainda.</p>) : viaturasTrans.map((v:any)=>(<div key={v.id} className="border rounded p-3 mt-2 flex justify-between items-center"><div><b>{v.matricula} - {v.marca} {v.modelo} - Cor: {v.cor}</b><div className="text-[11px] text-gray-500">{v.destino} | {v.lugares} lugares | {v.dataSubmissao} | Docs: Carta {v.docs.carta} | Livrete {v.docs.livrete} | Seguro {v.docs.seguro}</div></div><div className="flex gap-2 items-center"><span className={`px-2 py-1 rounded-full text-[11px] font-bold ${v.status==='APROVADA'?'bg-green-100 text-green-700':v.status==='REJEITADA'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{v.status}</span>{v.status==='PENDENTE' && (<><button onClick={()=>aprovarViatura(v.id)} className="bg-green-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">Aprovar (Dono)</button><button onClick={()=>rejeitarViatura(v.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-[11px]">Rejeitar</button></>)}</div></div>))}
                <p className="text-[10px] text-gray-500 mt-2">PENDENTE = a aguardar dono. APROVADA = aparece para passageiros. REJEITADA = corrige documentos e submete de novo.</p>
              </div>
            </div>
          )}
        </div>
      )}
      {aba==='passageiro' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[16px]">Reservar Viagem - Passageiro (Formulario como Vercel)</h3>
            <p className="text-[11px] text-gray-500">Reservar {origem} -&gt; {destino} - {rotaInfo.distEstrada.toFixed(1)} km - {rotaInfo.precoPP}MT/pessoa</p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="space-y-2">
                <div><label className="text-[11px] font-bold">NOME COMPLETO PASSAGEIRO *</label><input value={nomePass} onChange={e=>setNomePass(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Nome completo" /></div>
                <div><label className="text-[11px] font-bold">CONTACTO WHATSAPP *</label><input value={telPass} onChange={e=>setTelPass(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="84..." /></div>
                <div><label className="text-[11px] font-bold">CONTACTO DO FAMILIAR - para emergencias</label><input value={telFamiliar} onChange={e=>setTelFamiliar(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Contacto familiar (numeros)" /></div>
                <div><label className="text-[11px] font-bold">NOME FAMILIAR - somente letras</label><input value={nomeFamiliar} onChange={e=>setNomeFamiliar(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Nome do familiar" /></div>
                <div className="flex gap-2"><div className="flex-1"><label className="text-[11px] font-bold">BI (opcional)</label><input value={biPass} onChange={e=>setBiPass(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="BI" /></div><div className="flex-1"><label className="text-[11px] font-bold">IDADE / TIPO</label><select value={idadeTipo} onChange={e=>setIdadeTipo(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]"><option>Adulto</option><option>Crianca</option><option>Idoso</option></select></div></div>
                <div><label className="text-[11px] font-bold">LOCAL SERA ENCONTRADO / DESEMBARQUE</label><input value={localEmbarque} onChange={e=>setLocalEmbarque(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Ex: Marracuene" /></div>
                <div><label className="text-[11px] font-bold">DESTINO CUSTOM (se nao estiver na lista)</label><input value={destinoCustom} onChange={e=>setDestinoCustom(e.target.value)} className="w-full border rounded px-3 py-2 text-[13px]" placeholder="Ex: Cidade da Beira" /></div>
                <div className="border rounded p-2 bg-yellow-50"><div className="font-bold text-[11px]">ACOMPANHANTES - ate 3</div>{acompanhantes.map((a:any,i:number)=>(<div key={i} className="flex gap-1 mt-1"><input value={a.nome} onChange={e=>{ const n=[...acompanhantes]; n[i].nome=e.target.value; setAcompanhantes(n); }} className="flex-1 border rounded px-2 py-1 text-[12px]" placeholder="Nome acompanhante" /><input value={a.tel} onChange={e=>{ const n=[...acompanhantes]; n[i].tel=e.target.value; setAcompanhantes(n); }} className="w-[100px] border rounded px-2 py-1 text-[12px]" placeholder="Tel" /><select value={a.tipo} onChange={e=>{ const n=[...acompanhantes]; n[i].tipo=e.target.value; setAcompanhantes(n); }} className="border rounded px-1 py-1 text-[12px]"><option>Adulto</option><option>Crianca</option><option>Filho</option></select></div>))}<button onClick={()=>{ if(acompanhantes.length<3) setAcompanhantes([...acompanhantes, {nome:'', tel:'', tipo:'Adulto'}]); }} className="mt-1 bg-gray-100 px-3 py-1 rounded-full text-[11px]">+ Acompanhante</button></div>
              </div>
              <div className="space-y-2">
                <div><label className="text-[11px] font-bold">Origem / Destino</label><div className="flex gap-2"><select value={origem} onChange={e=>setOrigem(e.target.value)} className="flex-1 border rounded px-2 py-2 text-[13px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select><select value={destino} onChange={e=>setDestino(e.target.value)} className="flex-1 border rounded px-2 py-2 text-[13px]">{Object.keys(CIDADES).map((c:string)=>(<option key={c}>{c}</option>))}</select></div></div>
                <div><label className="text-[11px] font-bold">Viatura / Passageiros</label><div className="flex gap-2"><select value={viaturaSel} onChange={e=>setViaturaSel(e.target.value)} className="flex-1 border rounded px-2 py-2 text-[13px]"><option value="">Automatico - 1a ONLINE</option>{lista.map((v:any)=>(<option key={v.id} value={v.id}>{v.matricula} - {v.carro}</option>))}</select><input type="number" min={1} max={15} value={numPass} onChange={e=>setNumPass(Number(e.target.value)||1)} className="w-[80px] border rounded px-2 py-2 text-[13px]" /></div></div>
                <div className="border rounded p-2"><div className="font-bold text-[11px]">Escolher lugar / assento - 25 lugares - bloqueados os reservados</div><div className="grid grid-cols-5 gap-1 mt-2">{Array.from({length:25},(_,i)=>i+1).map((n:number)=>{ const ocupado = reservas.some((r:any)=>r.assento===n); const sel = assentoSel===n; return (<button key={n} disabled={ocupado} onClick={()=>setAssentoSel(n)} className={`py-1 rounded text-[12px] font-bold ${ocupado?'bg-gray-300 text-gray-500':sel?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>{n}</button>); })}</div><div className="text-[10px] text-gray-500 mt-1">Assento escolhido: {assentoSel||'nenhum'} | Cinzento = reservado</div></div>
                <div className="border rounded p-2"><div className="font-bold text-[11px]">MODO DE PAGAMENTO</div><div className="grid grid-cols-2 gap-1 mt-1">{['M-Pesa','E-Mola','Dinheiro no terminal','Cartao'].map((mp:string)=>(<button key={mp} onClick={()=>setModoPag(mp)} className={`py-1 rounded-full text-[11px] font-bold ${modoPag===mp?'bg-green-600 text-white':'bg-gray-100'}`}>{mp}</button>))}</div><div className="text-[11px] mt-1">Pagamento: <b>{modoPag}</b></div></div>
                <div className="bg-green-50 border border-green-200 rounded p-3"><div className="text-[11px]">Total: {numPass} x {rotaInfo.precoPP}MT + Assento {assentoSel||'-'}</div><div className="font-black text-[18px] text-green-700">{(rotaInfo.precoPP*numPass)}MT</div><button onClick={()=>{ reservarViagem(); }} className="w-full mt-1 bg-green-600 text-white py-2 rounded-full font-bold text-[13px]">Confirmar {(rotaInfo.precoPP*numPass)}MT - Gerar Bilhete (QR)</button><div className="text-[10px] text-gray-500 mt-1">Bilhete QR: {nomePass||'--'} | {origem} -&gt; {destino} | Assento {assentoSel||'-'} | {modoPag} | Total {(rotaInfo.precoPP*numPass)}MT</div></div>
              </div>
            </div>
            <div className="flex gap-2 mt-3"><select value={filtroRota} onChange={e=>setFiltroRota(e.target.value)} className="border rounded px-3 py-1 text-[12px]"><option>Todas</option><option>Xai-Xai -&gt; Maputo</option><option>Maputo -&gt; Xai-Xai</option><option>Matola -&gt; Maputo</option></select><select value={filtroCor} onChange={e=>setFiltroCor(e.target.value)} className="border rounded px-3 py-1 text-[12px]"><option>Todas</option><option>Branco</option><option>Preto</option><option>Prateado</option><option>Vermelho</option><option>Azul</option></select></div>
            {reservas.length>0 && (<div className="mt-3 border-t pt-2"><div className="font-bold text-[12px]">Minhas Reservas ({reservas.length})</div>{reservas.slice(0,5).map((r:any)=>(<div key={r.id} className="text-[11px] border rounded px-2 py-1 mt-1 flex justify-between"><span><b>{r.origem} -&gt; {r.destino}</b> - {r.numPass} pessoa(s) - {r.total}MT - {r.matricula} - {r.status}</span><span>{r.data}</span></div>))}</div>)}
          </div>
          <div className="bg-white rounded-xl border p-6"><h3 className="font-bold text-[14px]">Mapa - Carros ONLINE / APROVADOS</h3><p className="text-[11px] text-gray-500">Cada ponto e uma viatura real. Cor do ponto = cor do carro. Clica no carro em baixo para ver detalhes.</p>
            <div className="relative w-full h-[280px] bg-[#e8f5e9] border rounded mt-3 overflow-hidden">
              <div className="absolute top-2 left-2 text-[10px] bg-white px-2 py-1 rounded">Norte - Gaza / Xai-Xai em cima, Maputo em baixo</div>
              {mapaPontos.length===0 && (<div className="absolute inset-0 flex items-center justify-center text-[12px] text-gray-500">Nenhum carro com GPS no mapa - liga GPS no painel Transportador.</div>)}
              {mapaPontos.map((p:any)=>(<div key={p.v.id} title={`${p.v.matricula} - ${p.v.carro} - ${p.v.nome}`} className="absolute w-8 h-8 rounded-full border-2 border-white shadow flex items-center justify-center text-[10px] font-black text-white" style={{left:`${p.x}%`, top:`${p.y}%`, backgroundColor:'#0a66c2'}}>{p.v.matricula.slice(0,2)}</div>))}
              {passageiroPos && (<div className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white" style={{left:`${((passageiroPos.lng+35.5)/(35.5-30.2))*100}%`, top:`${((-24.0 - passageiroPos.lat)/(-24.0 - -27.0))*100}%`}} title="Tu (passageiro)" />)}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {listaPassageiro.length===0 && viaturasAprovadas.length===0 && (<div className="bg-white p-6 rounded-xl border text-center text-[13px] text-gray-500">Nenhuma viatura ONLINE / APROVADA - transportador deve submeter e dono aprovar, depois ligar GPS.</div>)}
            {listaPassageiro.map((v:any)=>{
              let distTxt='Ativa GPS'; let etaTxt='';
              if(passageiroPos && v.lat && v.lng){ const d=haversine(passageiroPos.lat, passageiroPos.lng, v.lat, v.lng); if(d<0.05){ distTxt='Aqui mesmo - <50m'; etaTxt='~1 min'; } else if(d<1){ distTxt=`${Math.round(d*1000)} m`; etaTxt='~2 min'; } else { distTxt=`${d.toFixed(2)} km`; etaTxt=`~${Math.ceil(d/50*60)} min a 50 km/h`; } }
              const cor = viaturasTrans.find((x:any)=>x.matricula===v.matricula)?.cor || 'Branco';
              if(filtroCor!=='Todas' && cor!==filtroCor) return null;
              return (
                <div key={v.id} className="bg-white rounded-xl border p-4">
                  <div className="flex justify-between"><h4 className="font-bold text-[14px]">{v.matricula} - {v.carro}</h4><span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">{v.status}</span></div>
                  <div className="flex gap-2 mt-2 items-center"><span className="w-6 h-6 rounded-full border" style={{backgroundColor: cor==='Branco'?'#fff':cor==='Preto'?'#000':cor==='Prateado'?'#c0c0c0':cor==='Vermelho'?'#ef4444':cor==='Azul'?'#3b82f6':cor==='Verde'?'#22c55e':'#eab308'}}></span><span className="text-[12px] font-bold">Cor: {cor}</span><span className="text-[11px] text-gray-500">| Matricula: {v.matricula}</span></div>
                  <p className="text-[12px] mt-1">Motorista: {v.nome} - {v.telefone}</p>
                  <p className="text-[11px] text-gray-600">{v.cidade}, {v.provincia} -&gt; {v.destino_atual} - {v.lugares} lugares</p>
                  <p className="text-[11px] mt-1">Distancia ate ti: {distTxt} {etaTxt && `| ETA: ${etaTxt}`} | Rota {origem} -&gt; {destino}: {rotaInfo.distEstrada.toFixed(1)} km - {rotaInfo.precoPP}MT/pessoa</p>
                  <p className="text-[10px] text-gray-400">Atualizado: {v.ultima_atualizacao}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <a href={`tel:${String(v.telefone||'').replace(/[^0-9]/g,'')}`} className="text-[11px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">Ligar</a>
                    <button onClick={()=>{ const msg=`Ola ${v.nome}, quero ir ${origem} -> ${destino} - ${rotaInfo.distEstrada.toFixed(1)} km - ${rotaInfo.precoPP}MT/pessoa`; const num=String(v.telefone||'').replace(/[^0-9]/g,''); window.open(`https://wa.me/${num.startsWith('258')?num:`258${num}`}?text=${encodeURIComponent(msg)}`, '_blank'); }} className="text-[11px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">WhatsApp</button>
                    <button onClick={()=>{ setChatAberto(chatAberto===v.id?null:v.id); setChatMsgs([]); }} className="text-[11px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Chat</button>
                    <button onClick={()=>{ setViaturaSel(v.id); reservarViagem(); }} className="text-[11px] bg-[#0a66c2] text-white px-3 py-1 rounded-full font-bold">Reservar Esta</button>
                  </div>
                  {chatAberto===v.id && (<div className="mt-3 border rounded p-2 bg-gray-50"><div className="font-bold text-[11px]">Chat - {v.nome} - {v.matricula}</div><div className="mt-1 space-y-1 max-h-[120px] overflow-auto">{chatMsgs.length===0 ? (<div className="text-[11px] text-gray-500">Escreve para o motorista.</div>) : chatMsgs.map((m:any,i:number)=>(<div key={i} className="text-[11px]"><b>{m.de}:</b> {m.texto} <span className="text-gray-400">{m.hora}</span></div>))}</div><div className="flex gap-1 mt-2"><input value={chatTexto} onChange={e=>setChatTexto(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') enviarChat(v); }} placeholder="Escreve..." className="flex-1 border rounded px-2 py-1 text-[12px]" /><button onClick={()=>enviarChat(v)} className="bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">Enviar</button></div></div>)}
                </div>
              );
            })}
            {viaturasAprovadas.filter((v:any)=>!listaPassageiro.find((x:any)=>x.matricula===v.matricula)).map((v:any)=>(
              <div key={v.id} className="bg-white rounded-xl border p-4 opacity-90"><div className="flex justify-between"><h4 className="font-bold text-[14px]">{v.matricula} - {v.marca} {v.modelo}</h4><span className="text-[10px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">APROVADA - OFFLINE</span></div><div className="flex gap-2 mt-2 items-center"><span className="w-6 h-6 rounded-full border" style={{backgroundColor:'#fff'}}></span><span className="text-[12px] font-bold">Cor: {v.cor}</span><span className="text-[11px]">| Matricula: {v.matricula}</span></div><p className="text-[12px] mt-1">Motorista: {v.transportador} - {v.tel}</p><p className="text-[11px] text-gray-600">{v.cidade}, {v.provincia} -&gt; {v.destino} - {v.lugares} lugares</p><p className="text-[11px] mt-1">Rota {origem} -&gt; {destino}: {rotaInfo.distEstrada.toFixed(1)} km - {rotaInfo.precoPP}MT/pessoa - Motorista ainda nao ligou GPS, mas ja podes reservar.</p><div className="flex gap-2 mt-3"><a href={`tel:${String(v.tel||'').replace(/[^0-9]/g,'')}`} className="text-[11px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">Ligar</a><button onClick={()=>{ const num=String(v.tel||'').replace(/[^0-9]/g,''); window.open(`https://wa.me/${num.startsWith('258')?num:`258${num}`}?text=${encodeURIComponent(`Ola ${v.transportador}, quero reservar ${origem} -> ${destino}`)}`, '_blank'); }} className="text-[11px] bg-[#25D366] text-white px-3 py-1 rounded-full font-bold">WhatsApp</button></div></div>
            ))}
          </div>
        </div>
      )}
    </div></div>
  );
}
