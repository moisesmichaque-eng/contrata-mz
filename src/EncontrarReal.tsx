
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

type TecnicoRealDB = {
  id: string; nome: string; profissao: string; telefone: string; email: string;
  zona: string | null; provincia: string | null; avaliacao: number | null; trabalhos: number | null;
  descricao: string | null; conta_id: string | null; created_at: string | null; password: string | null;
  nuit: string | null; whatsapp: string | null; distrito: string | null; pais: string | null;
  username: string | null; empresa: string | null; arquivos: string[] | string | null; tipo: string | null;
};

export default function EncontrarReal({ onGerarContrato }: { onGerarContrato?: (prof: TecnicoRealDB) => void }){
  const [lista, setLista] = useState<TecnicoRealDB[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tipoForm, setTipoForm] = useState<'PROFISSIONAL' | 'EMPRESA'>('PROFISSIONAL');
  const [perfilAberto, setPerfilAberto] = useState<TecnicoRealDB | null>(null);

  const [form, setForm] = useState({
    nome: '', email: '', username: '', password: '', confirmar: '', telefone: '', whatsapp: '',
    pais: 'Moçambique', provincia: 'Maputo Cidade', distrito: '', zona: '', profissao: '', empresa: '', descricao: '', nuit: '',
  });
  const [anexos, setAnexos] = useState<File[]>([]);

  const carregarReais = async () => {
    setCarregando(true);
    const { data } = await supabase.from('tecnicos').select('*').order('created_at', { ascending: false });
    let filtrada = (data as TecnicoRealDB[]) || [];
    if (busca.trim()) {
      const b = busca.toLowerCase();
      filtrada = filtrada.filter(t => (t.nome?.toLowerCase().includes(b)) || (t.profissao?.toLowerCase().includes(b)) || (t.zona?.toLowerCase().includes(b)) || (t.provincia?.toLowerCase().includes(b)));
    }
    setLista(filtrada);
    setCarregando(false);
  };

  useEffect(()=>{ carregarReais(); },[]);

  const handleCadastro = async () => {
    if (!form.nome || !form.email || !form.username || !form.password) { alert('Preencha nome, email, username, password'); return; }
    if (form.password !== form.confirmar) { alert('Password não coincide'); return; }
    setCarregando(true);
    const nomesAnexos = anexos.map(f => f.name);
    const novo:any = {
      nome: form.nome, email: form.email, username: form.username, password: form.password,
      telefone: form.telefone, whatsapp: form.whatsapp || form.telefone, pais: form.pais, provincia: form.provincia,
      distrito: form.distrito, zona: form.zona || form.provincia,
      profissao: tipoForm === 'PROFISSIONAL' ? (form.profissao || 'Profissional') : 'Empresa',
      empresa: tipoForm === 'EMPRESA' ? (form.empresa || form.nome) : null,
      descricao: form.descricao, nuit: form.nuit || null, tipo: tipoForm, conta_id: `conta_${Date.now()}`, avaliacao: 5, trabalhos: 0, arquivos: nomesAnexos,
    };
    const { error } = await supabase.from('tecnicos').insert([novo]).select();
    if (error) alert('Erro: '+error.message);
    else { alert('✅ PERFIL REAL CRIADO!'); setMostrarForm(false); setForm({ nome: '', email: '', username: '', password: '', confirmar: '', telefone: '', whatsapp: '', pais: 'Moçambique', provincia: 'Maputo Cidade', distrito: '', zona: '', profissao: '', empresa: '', descricao: '', nuit: '' }); setAnexos([]); carregarReais(); }
    setCarregando(false);
  };

  const gerarContratoReal = (prof: TecnicoRealDB) => {
    localStorage.setItem('prof_selecionado_contrato', JSON.stringify(prof));
    if(onGerarContrato) onGerarContrato(prof);
    else { alert(`✅ Profissional ${prof.nome} selecionado! Vai para aba CONTRATOS que o formulário já vai estar preenchido com dados reais.`); window.dispatchEvent(new CustomEvent('mudarParaContratos')); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-black p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#0a66c2]">ENCONTRAR - 100% REAL - CONECTADO</h1>
          <p className="text-[11px] text-gray-600 mt-1">Compatível com Supabase tecnicos - {lista.length} reais - Zero Mock - FASE 1: Conecta com CONTRATOS</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <button onClick={() => { setTipoForm('PROFISSIONAL'); setMostrarForm(true); }} className="bg-[#0a66c2] text-white px-5 py-2.5 rounded-full text-[12px] font-bold">REGISTAR-ME - PROFISSIONAL</button>
            <button onClick={() => { setTipoForm('EMPRESA'); setMostrarForm(true); }} className="bg-white text-[#0a66c2] border-2 border-[#0a66c2] px-5 py-2.5 rounded-full text-[12px] font-bold">CADASTRAR-ME - EMPRESA</button>
            <button onClick={carregarReais} className="bg-gray-100 px-4 py-2.5 rounded-full text-[11px] ml-auto">🔄 Recarregar</button>
          </div>
          <div className="mt-5 flex gap-2">
            <input value={busca} onChange={e => setBusca(e.target.value)} onKeyDown={e => e.key === 'Enter' && carregarReais()} placeholder="Pesquisar real: nome, profissão, zona..." className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 text-[13px] outline-none" />
            <button onClick={carregarReais} className="bg-[#0a66c2] text-white px-6 py-2.5 rounded-full text-[13px]">PESQUISAR REAL</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carregando && <div className="col-span-3 text-center py-8 text-[13px]">Carregando reais...</div>}
          {lista.map(t=>(
            <div key={t.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start"><h3 className="font-bold text-[14px]">{t.nome}</h3><span className="text-[10px] bg-blue-50 text-[#0a66c2] px-2 py-1 rounded-full">{t.tipo}</span></div>
              <p className="text-[12px] text-gray-600 mt-1">{t.profissao} {t.empresa?`- ${t.empresa}`:''}</p>
              <p className="text-[11px] text-gray-500 mt-1">📍 {t.zona}, {t.provincia} | ⭐ {t.avaliacao} ({t.trabalhos} trabalhos)</p>
              <p className="text-[11px] text-gray-500">📧 {t.email} {t.username?`@${t.username}`:''}</p>
              <p className="text-[11px] text-gray-500">📱 {t.telefone} {t.whatsapp?`- WhatsApp ${t.whatsapp}`:''}</p>
              <p className="text-[11px] text-gray-600 mt-2 line-clamp-2">{t.descricao}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>setPerfilAberto(t)} className="flex-1 border border-gray-300 py-2 rounded-full text-[11px] font-bold">VER PERFIL</button>
                <button onClick={()=>gerarContratoReal(t)} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">📝 GERAR CONTRATO REAL</button>
              </div>
            </div>
          ))}
        </div>

        {mostrarForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6 border-b flex justify-between"><h3 className="font-bold text-[16px]">Cadastrar {tipoForm} Real - 100% Supabase</h3><button onClick={()=>setMostrarForm(false)} className="text-2xl">×</button></div>
              <div className="p-6 grid grid-cols-2 gap-3">
                <div className="col-span-2 flex gap-2">
                  <button onClick={() => setTipoForm('PROFISSIONAL')} className={`flex-1 py-2 rounded-full text-[12px] font-bold ${tipoForm==='PROFISSIONAL'?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>Profissional</button>
                  <button onClick={() => setTipoForm('EMPRESA')} className={`flex-1 py-2 rounded-full text-[12px] font-bold ${tipoForm==='EMPRESA'?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>Empresa</button>
                </div>
                <div><label className="text-[11px] font-bold">Nome *</label><input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Email *</label><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" type="email" /></div>
                <div><label className="text-[11px] font-bold">Username *</label><input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Telefone *</label><input value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Password *</label><input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Confirmar *</label><input type="password" value={form.confirmar} onChange={e=>setForm({...form, confirmar:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">País</label><input value={form.pais} onChange={e=>setForm({...form, pais:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Província</label><input value={form.provincia} onChange={e=>setForm({...form, provincia:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Distrito</label><input value={form.distrito} onChange={e=>setForm({...form, distrito:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Zona</label><input value={form.zona} onChange={e=>setForm({...form, zona:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Profissão</label><input value={form.profissao} onChange={e=>setForm({...form, profissao:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">NUIT</label><input value={form.nuit} onChange={e=>setForm({...form, nuit:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" /></div>
                <div><label className="text-[11px] font-bold">Anexos Múltiplos</label><input type="file" multiple onChange={e=>setAnexos(Array.from(e.target.files || []))} className="w-full border rounded-lg px-3 py-2 text-[11px] mt-1" /></div>
                <div className="col-span-2"><label className="text-[11px] font-bold">Descrição</label><textarea value={form.descricao} onChange={e=>setForm({...form, descricao:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-[13px] mt-1" rows={3} /></div>
              </div>
              <div className="p-6 border-t flex gap-3"><button onClick={()=>setMostrarForm(false)} className="flex-1 border py-3 rounded-full text-[13px]">Cancelar</button><button onClick={handleCadastro} disabled={carregando} className="flex-1 bg-[#0a66c2] text-white py-3 rounded-full text-[13px] font-bold">{carregando?'Gravando...':'CRIAR PERFIL REAL'}</button></div>
            </div>
          </div>
        )}

        {perfilAberto && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-auto">
              <div className="p-6 border-b flex justify-between"><h3 className="font-bold">{perfilAberto.nome} - {perfilAberto.tipo}</h3><button onClick={()=>setPerfilAberto(null)} className="text-2xl">×</button></div>
              <div className="p-6 text-[13px] space-y-2">
                <p><b>Email:</b> {perfilAberto.email} @{perfilAberto.username}</p>
                <p><b>Telefone:</b> {perfilAberto.telefone} - WhatsApp: {perfilAberto.whatsapp}</p>
                <p><b>Zona:</b> {perfilAberto.zona}, {perfilAberto.distrito}, {perfilAberto.provincia}</p>
                <p><b>Profissão:</b> {perfilAberto.profissao}</p>
                <p><b>Descrição:</b> {perfilAberto.descricao}</p>
              </div>
              <div className="p-6 border-t flex gap-2">
                <button onClick={()=>{ gerarContratoReal(perfilAberto); setPerfilAberto(null); }} className="flex-1 bg-[#1e2f4a] text-white py-2.5 rounded-full text-[13px] font-bold">📝 GERAR CONTRATO REAL - 11 CLÁUSULAS</button>
                <button onClick={()=>setPerfilAberto(null)} className="flex-1 border py-2.5 rounded-full text-[13px]">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
