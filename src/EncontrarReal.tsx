
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2t1bHh1cHJwYm9vemFlamZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Mjk2MzIsImV4cCI6MjA3NTEwNTYzMn0.XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Schema REAL que você mostrou no print
type TecnicoRealDB = {
  id: string;
  nome: string;
  profissao: string;
  telefone: string;
  email: string;
  zona: string | null;
  provincia: string | null;
  avaliacao: number | null;
  trabalhos: number | null;
  descricao: string | null;
  conta_id: string | null;
  created_at: string | null;
  password: string | null;
  nuit: string | null;
  whatsapp: string | null;
  distrito: string | null;
  pais: string | null;
  username: string | null;
  empresa: string | null;
  arquivos: string[] | string | null; // pode ser array ou null
  tipo: string | null; // PROFISSIONAL ou EMPRESA
};

export default function EncontrarReal() {
  const [lista, setLista] = useState<TecnicoRealDB[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS'|'PROFISSIONAL'|'EMPRESA'>('TODOS');
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [filtroDistrito, setFiltroDistrito] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tipoForm, setTipoForm] = useState<'PROFISSIONAL' | 'EMPRESA'>('PROFISSIONAL');
  const [perfilAberto, setPerfilAberto] = useState<TecnicoRealDB | null>(null);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    username: '',
    password: '',
    confirmar: '',
    telefone: '',
    whatsapp: '',
    pais: 'Moçambique',
    provincia: 'Maputo Cidade',
    distrito: '',
    zona: '',
    profissao: '',
    empresa: '',
    descricao: '',
    nuit: '',
  });
  const [anexos, setAnexos] = useState<File[]>([]);

  const carregarReais = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from('tecnicos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(error);
      setLista([]);
    } else {
      let filtrada = (data as TecnicoRealDB[]) || [];
      if (busca.trim()) {
        const b = busca.toLowerCase();
        filtrada = filtrada.filter(t =>
          (t.nome?.toLowerCase().includes(b)) ||
          (t.profissao?.toLowerCase().includes(b)) ||
          (t.zona?.toLowerCase().includes(b)) ||
          (t.provincia?.toLowerCase().includes(b)) ||
          (t.empresa?.toLowerCase().includes(b))
        );
      }
      setLista(filtrada);
    }
    setCarregando(false);
  };

  useEffect(() => { carregarReais(); }, []);

  const handleCadastro = async () => {
    if (!form.nome || !form.username || !form.password) {
      alert('Preencha nome, username e password. Email é opcional!');
      return;
    }
    if (form.password !== form.confirmar) {
      alert('Password não coincide com confirmar!');
      return;
    }

    setCarregando(true);
    try {
      const nomesAnexos = anexos.map(f => f.name);
      
      // INSERT COMPATIVEL COM TUA TABELA REAL
      const novo: any = {
        nome: form.nome,
        email: form.email,
        username: form.username,
        password: form.password,
        telefone: form.telefone,
        whatsapp: form.whatsapp || form.telefone,
        pais: form.pais,
        provincia: form.provincia,
        distrito: form.distrito,
        zona: form.zona || form.provincia,
        profissao: tipoForm === 'PROFISSIONAL' ? (form.profissao || 'Profissional') : 'Empresa',
        empresa: tipoForm === 'EMPRESA' ? (form.empresa || form.nome) : null,
        descricao: form.descricao,
        nuit: form.nuit || null,
        tipo: tipoForm, // PROFISSIONAL ou EMPRESA - tua coluna
        conta_id: `conta_${Date.now()}`,
        avaliacao: 5,
        trabalhos: 0,
        arquivos: nomesAnexos, // tua coluna arquivos
      };

      const { data, error } = await supabase.from('tecnicos').insert([novo]).select();
      if (error) {
        alert('Erro Supabase: ' + error.message);
        console.error(error);
      } else {
        alert('✅ PERFIL REAL CRIADO! Agora aparece na lista.');
        setMostrarForm(false);
        setForm({ nome: '', email: '', username: '', password: '', confirmar: '', telefone: '', whatsapp: '', pais: 'Moçambique', provincia: 'Maputo Cidade', distrito: '', zona: '', profissao: '', empresa: '', descricao: '', nuit: '' });
        setAnexos([]);
        carregarReais();
      }
    } catch (e: any) {
      alert('Erro: ' + e.message);
    }
    setCarregando(false);
  };

  const listaFiltrada = lista.filter((p:any)=> {
    // Tipo: Profissional / Empresa / Todos
    if(filtroTipo!=='TODOS'){
      const tipo = String(p.tipo||p.tipo_perfil||p.profissao||'').toUpperCase();
      if(filtroTipo==='EMPRESA' && !(tipo.includes('EMPRESA') || String(p.empresa||'').length>0)) return false;
      if(filtroTipo==='PROFISSIONAL' && (tipo.includes('EMPRESA') || String(p.empresa||'').length>0)) return false;
    }
    // Perto de ti: Pais / Provincia / Distrito - tudo real do Supabase
    if(filtroPais && String(p.pais||'').toLowerCase() !== filtroPais.toLowerCase()) return false;
    if(filtroProvincia && String(p.provincia||'').toLowerCase() !== filtroProvincia.toLowerCase()) return false;
    if(filtroDistrito && !String(p.distrito||p.zona||'').toLowerCase().includes(filtroDistrito.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-black p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div style={{borderRadius:16, overflow:'hidden', background:'linear-gradient(90deg,#0B3D91,#134E9E)', color:'white', padding:0}}>
            <div style={{padding:'14px 16px'}}>
              <h1 style={{margin:0, fontSize:22, fontWeight:900}}>Encontra o teu profissional perto de ti! 🛠️</h1>
              <p style={{margin:'6px 0 0', fontSize:13, opacity:.92}}>Precisas de um Carpinteiro? Um Serralheiro? Um Eletricista? Um Pedreiro? Estão aqui, em Maputo, Matola, Boane, Xai-Xai - verificados, com fotos e contrato! {lista.length} profissionais à tua espera!</p>
              <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
                <span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:800}}>🪵 Carpinteiro - Faz a tua porta!</span>
                <span style={{background:'white', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:800}}>⚡ Eletricista - Luz segura!</span>
                <span style={{background:'#F5B81D', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:800}}>🔥 Serralheiro - Grade forte!</span>
                <span style={{background:'white', color:'#0B3D91', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:800}}>🧱 Pedreiro - Casa firme!</span>
              </div>
            </div>
          </div>
          
          
          <div className="flex gap-3 mt-4 flex-wrap">
            <button onClick={() => { setTipoForm('PROFISSIONAL'); setMostrarForm(true); }} className="bg-[#0a66c2] text-white px-5 py-2.5 rounded-full text-[13px] font-bold">REGISTAR-ME - PROFISSIONAL</button>
            <button onClick={() => { setTipoForm('EMPRESA'); setMostrarForm(true); }} className="bg-white text-[#0a66c2] border-2 border-[#0a66c2] px-5 py-2.5 rounded-full text-[13px] font-bold">CADASTRAR-ME - EMPRESA</button>
            <button onClick={carregarReais} className="bg-gray-100 px-4 py-2.5 rounded-full text-[12px] ml-auto">🔄 Atualizar</button>
          </div>

          <div style={{background:'#FFF7E6', borderRadius:14, padding:14, marginTop:18}}>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
              <div style={{flex:1, minWidth:220}}>
                <label style={{fontSize:11, fontWeight:800}}>O que precisas? - Estás à procura de...?</label>
                <input value={busca} onChange={e => setBusca(e.target.value)} onKeyDown={e => e.key === 'Enter' && carregarReais()} placeholder="Ex: Serralheiro, Pedreiro, Eletricista, Doméstica..." style={{width:'100%', border:'1px solid #ddd', borderRadius:999, padding:'10px 14px', fontSize:13, marginTop:4}} />
              </div>
              <div>
                <label style={{fontSize:11, fontWeight:800}}>Mostrar só:</label>
                <div style={{display:'flex', gap:6, marginTop:4}}>
                  {(['TODOS','PROFISSIONAL','EMPRESA'] as const).map((f:any)=> <button key={f} onClick={()=> setFiltroTipo(f)} style={{padding:'8px 14px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:12, background: filtroTipo===f ? '#0B3D91' : '#fff', color: filtroTipo===f ? 'white' : '#333', boxShadow:'0 1px 3px rgba(0,0,0,.1)'}}>{f==='TODOS' ? 'Todos' : f==='PROFISSIONAL' ? '👤 Profissional' : '🏢 Empresa'}</button>)}
                </div>
              </div>
              <button onClick={carregarReais} style={{background:'black', color:'white', padding:'11px 20px', borderRadius:999, fontWeight:800, fontSize:13, border:'none', cursor:'pointer', marginTop:18}}>PESQUISAR</button>
            </div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12, alignItems:'end'}}>
              <div style={{flex:1, minWidth:130}}>
                <label style={{fontSize:11, fontWeight:800}}>📍 País - Onde estás?</label>
                <select value={filtroPais} onChange={e=> setFiltroPais(e.target.value)} style={{width:'100%', border:'1px solid #ddd', borderRadius:999, padding:'9px 10px', fontSize:12, marginTop:4, background:'white'}}>
                  <option value="">Todos os países</option>
                  <option value="Moçambique">Moçambique</option>
                  <option value="África do Sul">África do Sul</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Tanzânia">Tanzânia</option>
                </select>
              </div>
              <div style={{flex:1, minWidth:150}}>
                <label style={{fontSize:11, fontWeight:800}}>🏠 Província</label>
                <select value={filtroProvincia} onChange={e=> setFiltroProvincia(e.target.value)} style={{width:'100%', border:'1px solid #ddd', borderRadius:999, padding:'9px 10px', fontSize:12, marginTop:4, background:'white'}}>
                  <option value="">Todas as províncias</option>
                  <option value="Maputo Cidade">Maputo Cidade</option>
                  <option value="Maputo Província">Maputo Província</option>
                  <option value="Gaza">Gaza</option>
                  <option value="Inhambane">Inhambane</option>
                  <option value="Sofala">Sofala</option>
                  <option value="Manica">Manica</option>
                  <option value="Tete">Tete</option>
                  <option value="Zambézia">Zambézia</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Niassa">Niassa</option>
                  <option value="Cabo Delgado">Cabo Delgado</option>
                </select>
              </div>
              <div style={{flex:1, minWidth:140}}>
                <label style={{fontSize:11, fontWeight:800}}>📌 Distrito / Zona - Perto de ti!</label>
                <input value={filtroDistrito} onChange={e=> setFiltroDistrito(e.target.value)} placeholder="Ex: Xai-Xai, Matola, KaMpfumo..." style={{width:'100%', border:'1px solid #ddd', borderRadius:999, padding:'9px 12px', fontSize:12, marginTop:4}} />
              </div>
              <button onClick={()=>{ setFiltroPais(''); setFiltroProvincia(''); setFiltroDistrito(''); }} style={{background:'white', border:'1px solid #ddd', padding:'9px 14px', borderRadius:999, fontSize:11, fontWeight:800, cursor:'pointer'}}>Limpar perto de mim</button>
            </div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:10, alignItems:'center'}}>
              <span style={{fontSize:11, fontWeight:800}}>Tags Populares:</span>
              {['Pedreiro','Carpinteiro','Eletricista','Canalizador','Pintor','Serralheiro','Doméstica','Motorista'].map((tag:any)=> <button key={tag} onClick={()=>{ setBusca(tag); carregarReais(); }} style={{background:'white', border:'1px solid #eee', padding:'4px 10px', borderRadius:999, fontSize:11, cursor:'pointer'}}>{tag}</button>)}
            </div>
          </div>
        </div>

        {carregando ? <div className="text-center py-20">Carregando reais...</div> : listaFiltrada.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold">Nenhum profissional real</h3>
            <p className="text-[12px] text-gray-500 mt-2">ZERO MOCK confirmado - Clica REGISTAR-ME para criar primeiro perfil real</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listaFiltrada.map(p => (
              <div key={p.id} className="bg-white rounded-xl border p-5 hover:shadow-md">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold">{p.nome?.charAt(0)?.toUpperCase()}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[14px]">{p.nome}</h4>
                    <p className="text-[12px] text-[#0a66c2]">{p.profissao} {p.empresa ? `- ${p.empresa}` : ''}</p>
                    <p className="text-[11px] text-gray-500">{p.zona} - {p.provincia} - {p.pais || 'Moçambique'}</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-600 mt-3 line-clamp-2">{p.descricao || 'Sem descrição'}</p>
                <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-500">
                  <span>📧 {p.email}</span>
                  <span>• {p.tipo}</span>
                  <span>• ⭐ {p.avaliacao || 5}</span>
                  {p.arquivos && Array.isArray(p.arquivos) && p.arquivos.length > 0 && <span>• 📎 {p.arquivos.length}</span>}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setPerfilAberto(p)} className="flex-1 bg-black text-white py-2 rounded-full text-[12px] font-bold">VER PERFIL</button>
                  <button className="flex-1 border py-2 rounded-full text-[12px]">💬 {p.whatsapp || p.telefone}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {mostrarForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
              <div className="p-6 border-b flex justify-between">
                <div>
                  <h2 className="font-bold">{tipoForm === 'PROFISSIONAL' ? 'REGISTAR-ME - Profissional' : 'CADASTRAR-ME - Empresa'}</h2>
                  <p className="text-[11px] text-gray-500">Cria o teu perfil com o teu telefone - rápido e fácil!</p>
                </div>
                <button onClick={() => setMostrarForm(false)} className="text-2xl px-2">×</button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-auto">
                <div className="md:col-span-2">
                  <span style={{display:'inline-block', background: tipoForm==='EMPRESA' ? '#0B3D91' : '#0E7A5A', color:'white', padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:800}}>{tipoForm==='EMPRESA' ? '🏢 A criar como EMPRESA' : '👤 A criar como PROFISSIONAL'}</span>
                  <span style={{fontSize:11, color:'#666', marginLeft:8}}>Escolheste fora, já ficou travado aqui!</span>
                </div>

                <div><label className="text-[11px] font-bold">Nome *</label><input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="Michaque Mungoi" /></div>
                <div><label className="text-[11px] font-bold">Email (opcional - se não tens, deixa vazio)</label><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" type="email" placeholder="Ex: nome@gmail.com (opcional)" /></div>
                <div><label className="text-[11px] font-bold">Username *</label><input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="maderitomoises" /></div>
                <div><label className="text-[11px] font-bold">Telefone *</label><input value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="840532899" /></div>
                <div><label className="text-[11px] font-bold">Password *</label><input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Confirmar Password *</label><input value={form.confirmar} onChange={e=>setForm({...form, confirmar:e.target.value})} type="password" className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">País</label><input value={form.pais} onChange={e=>setForm({...form, pais:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Província</label><input value={form.provincia} onChange={e=>setForm({...form, provincia:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="Gaza - Xai-Xai" /></div>
                <div><label className="text-[11px] font-bold">Distrito</label><input value={form.distrito} onChange={e=>setForm({...form, distrito:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="KaMpfumo" /></div>
                <div><label className="text-[11px] font-bold">Zona / Bairro</label><input value={form.zona} onChange={e=>setForm({...form, zona:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="Xai-Xai" /></div>
                <div><label className="text-[11px] font-bold">Profissão</label><input value={form.profissao} onChange={e=>setForm({...form, profissao:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="Pedreiro" /></div>
                <div><label className="text-[11px] font-bold">Empresa (se Empresa)</label><input value={form.empresa} onChange={e=>setForm({...form, empresa:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" placeholder="Nagi Invest" /></div>
                <div><label className="text-[11px] font-bold">NUIT</label><input value={form.nuit} onChange={e=>setForm({...form, nuit:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Anexos Múltiplos</label><input type="file" multiple onChange={e=>setAnexos(Array.from(e.target.files || []))} className="w-full border rounded-lg px-3 py-2.5 text-[11px] mt-1" />{anexos.length>0 && <div className="text-[10px] mt-1">{anexos.length} ficheiros: {anexos.map(f=>f.name).join(', ')}</div>}</div>
                <div className="md:col-span-2"><label className="text-[11px] font-bold">Descrição</label><textarea value={form.descricao} onChange={e=>setForm({...form, descricao:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-[13px] mt-1" rows={3} /></div>
              </div>

              <div className="p-6 border-t flex gap-3">
                <button onClick={()=>setMostrarForm(false)} className="flex-1 border py-3 rounded-full text-[13px]">Cancelar</button>
                <button onClick={handleCadastro} disabled={carregando} className="flex-1 bg-[#0a66c2] text-white py-3 rounded-full text-[13px] font-bold">{carregando ? 'A criar...' : 'CRIAR PERFIL'}</button>
              </div>
            </div>
          </div>
        )}

        {perfilAberto && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-auto">
              <div className="p-6 border-b flex justify-between"><h3 className="font-bold">{perfilAberto.nome} - {perfilAberto.tipo}</h3><button onClick={()=>setPerfilAberto(null)} className="text-2xl">×</button></div>
              <div className="p-6 text-[13px] space-y-2">
                <p>{perfilAberto.email ? `Email: ${perfilAberto.email} ` : ''}{perfilAberto.username ? `@${perfilAberto.username}` : '(sem username - antigo)'}</p>
                <p><b>Telefone:</b> {perfilAberto.telefone} - WhatsApp: {perfilAberto.whatsapp}</p>
                <p><b>Zona:</b> {perfilAberto.zona}, {perfilAberto.distrito}, {perfilAberto.provincia}</p>
                <p><b>Profissão:</b> {perfilAberto.profissao}</p>
                <p><b>Descrição:</b> {perfilAberto.descricao}</p>
                <p><b>NUIT:</b> {perfilAberto.nuit}</p>
                <p><b>Avaliação:</b> ⭐ {perfilAberto.avaliacao} - {perfilAberto.trabalhos} trabalhos</p>
                <div><b>Arquivos ({Array.isArray(perfilAberto.arquivos) ? perfilAberto.arquivos.length : 0}):</b>
                  {perfilAberto.arquivos && Array.isArray(perfilAberto.arquivos) && perfilAberto.arquivos.length >0 ? <ul className="list-disc ml-5 mt-1 text-[12px]">{perfilAberto.arquivos.map((a,i)=><li key={i}>📎 {a}</li>)}</ul> : <p className="text-[11px] text-gray-500">Sem anexos - este perfil foi criado antes dos múltiplos anexos</p>}
                </div>
              </div>
              <div className="p-6 border-t flex gap-2"><button className="flex-1 bg-green-600 text-white py-2.5 rounded-full text-[13px] font-bold">💬 WhatsApp</button><button onClick={()=>setPerfilAberto(null)} className="flex-1 border py-2.5 rounded-full text-[13px]">Fechar</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
