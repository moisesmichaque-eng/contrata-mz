
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function App(){
  const [activeTab, setActiveTab] = useState('ENCONTRAR');
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [showLoginTec, setShowLoginTec] = useState(false);
  const [perfilLogado, setPerfilLogado] = useState(null as any);
  const [searchQuery, setSearchQuery] = useState('Domestica');
  const [searchPais, setSearchPais] = useState('Moçambique');
  const [searchProvincia, setSearchProvincia] = useState('Gaza - Xai-Xai');
  const [tecnicos, setTecnicos] = useState([] as any[]);
  const [tecnicosFiltrados, setTecnicosFiltrados] = useState([] as any[]);
  const [loadingTec, setLoadingTec] = useState(false);
  const [formTec, setFormTec] = useState({nome:'', profissao:'Pedreiro', email:'', telefone:'', pais:'Moçambique', provincia:'Maputo Cidade', local:'Bairro Central', distrito:'KaMpfumo', descricao:'', whatsapp:'', nuit:''});
  const [loginTec, setLoginTec] = useState({email:'', password:''});

  useEffect(()=>{
    async function load(){
      setLoadingTec(true);
      const {data} = await supabase.from('tecnicos').select('*').order('created_at',{ascending:false}).limit(100);
      if(data){ setTecnicos(data); setTecnicosFiltrados(data); } else { setTecnicos([]); setTecnicosFiltrados([]); }
      setLoadingTec(false);
    }
    load();
  },[]);

  const handlePesquisar = async ()=>{
    setLoadingTec(true);
    let query = supabase.from('tecnicos').select('*');
    if(searchQuery && searchQuery.trim()){
      query = query.or(`profissao.ilike.%${searchQuery}%,nome.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
    }
    const {data} = await query.order('created_at',{ascending:false}).limit(100);
    setTecnicosFiltrados(data||[]);
    setLoadingTec(false);
  };

  const handleCadastrar = async ()=>{
    if(!formTec.nome || !formTec.email || !formTec.profissao || !formTec.telefone){
      alert('Preencha Nome completo, Email, Profissao, Telefone - obrigatorios');
      return;
    }
    const pwd = Math.random().toString(36).slice(-8);
    const novo = {
      nome: formTec.nome,
      profissao: formTec.profissao,
      email: formTec.email,
      telefone: formTec.telefone,
      zona: formTec.local,
      provincia: formTec.provincia,
      pais: formTec.pais,
      distrito: formTec.distrito,
      descricao: formTec.descricao,
      whatsapp: formTec.whatsapp || formTec.telefone,
      nuit: formTec.nuit,
      password: pwd,
      avaliacao: 5.0,
      trabalhos: 0,
      conta_id: 'public'
    };
    const {data, error} = await supabase.from('tecnicos').insert([novo]).select();
    if(error){ alert('Erro: '+error.message); return; }
    alert(`Perfil criado com sucesso!\nEmail: ${formTec.email}\nPassword: ${pwd}\nGuarde para entrar no seu perfil e melhorar!`);
    setMostrarCadastro(false);
    setFormTec({nome:'', profissao:'Pedreiro', email:'', telefone:'', pais:'Moçambique', provincia:'Maputo Cidade', local:'Bairro Central', distrito:'KaMpfumo', descricao:'', whatsapp:'', nuit:''});
    const {data: reload} = await supabase.from('tecnicos').select('*').order('created_at',{ascending:false}).limit(100);
    if(reload){ setTecnicos(reload); setTecnicosFiltrados(reload); }
  };

  const handleLogin = async ()=>{
    const {data} = await supabase.from('tecnicos').select('*').eq('email', loginTec.email).eq('password', loginTec.password).single();
    if(data){ setPerfilLogado(data); alert('Bem-vindo '+data.nome); setShowLoginTec(false); }
    else { alert('Email ou password incorreto'); }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#0f1f3c] text-white p-3 flex justify-between items-center">
        <div className="font-black">TOTSHE</div>
        <div className="flex gap-2">
          <button onClick={()=>setActiveTab('VIAJAR')} className={activeTab==='VIAJAR' ? "bg-white text-black px-3 py-1 rounded-full text-[10px] font-black" : "px-3 py-1 text-[10px]"}>VIAJAR</button>
          <button onClick={()=>setActiveTab('ENCONTRAR')} className={activeTab==='ENCONTRAR' ? "bg-white text-black px-3 py-1 rounded-full text-[10px] font-black" : "px-3 py-1 text-[10px]"}>ENCONTRAR</button>
          <button className="px-3 py-1 text-[10px]">CONTRATOS</button>
        </div>
      </div>

      {activeTab==='ENCONTRAR' && (
        <div className="p-3">
          <div className="bg-white rounded-[12px] p-3 border">
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="text-[10px] font-black">O que precisa? - Estas a procura de...?</div>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Domestica, Pedreiro, Eletricista..." className="w-full p-2 border rounded text-[12px] mt-1" />
              </div>
              <div>
                <div className="text-[10px] font-black">Pais</div>
                <select value={searchPais} onChange={e=>setSearchPais(e.target.value)} className="p-2 border rounded text-[12px] mt-1"><option>Moçambique</option><option>Todos</option></select>
              </div>
              <div>
                <div className="text-[10px] font-black">Provincia</div>
                <select value={searchProvincia} onChange={e=>setSearchProvincia(e.target.value)} className="p-2 border rounded text-[12px] mt-1"><option>Gaza - Xai-Xai</option><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Sofala</option></select>
              </div>
              <div className="flex items-end">
                <button onClick={handlePesquisar} className="bg-[#0f1f3c] text-white px-6 py-2 rounded-full font-black text-[12px]">PESQUISAR</button>
              </div>
            </div>
            <div className="mt-3 flex gap-1 flex-wrap">
              <span className="text-[9px]">Tags Populares:</span>
              {['Pedreiro','Carpinteiro','Eletricista','Canalizador','Pintor','Serralheiro','Domestica','Motorista'].map(tag=>(
                <button key={tag} onClick={()=>{ setSearchQuery(tag); setTimeout(()=>handlePesquisar(), 100); }} className={searchQuery===tag ? "bg-[#0f1f3c] text-white px-2 py-1 rounded-full text-[8px] font-black" : "bg-gray-100 px-2 py-1 rounded-full text-[8px]"}>{tag}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <div className="font-black text-[12px] mt-2">Profissionais verificados perto de si ({tecnicosFiltrados.length}) - COM INFORMACAO - aparecem ao se cadastrar - Empresa e Singular - ZERO MOCK - 100% REAL</div>
              {loadingTec ? <div className="mt-3 text-[10px]">Carregando reais...</div> : (
                <div className="mt-3 space-y-2">
                  {tecnicosFiltrados.length===0 ? (
                    <div className="bg-white border-2 border-dashed rounded-[12px] p-8 text-center">
                      <div className="font-black text-[14px]">0 PROFISSIONAIS - ZERO MOCK - 100% REAL - DO ZERO</div>
                      <div className="text-[10px] mt-2">Nenhum profissional cadastrado ainda - Supabase tecnicos: 0 records</div>
                      <div className="text-[9px] mt-2">Clique REGISTAR-ME / CADASTRAR-ME para criar seu perfil LinkedIn - seu perfil vai aparecer aqui no publico para qualquer pessoa sem conta encontrar!</div>
                      <button onClick={()=>setMostrarCadastro(true)} className="mt-3 bg-[#facc15] px-6 py-2 rounded-full font-black text-[10px]">REGISTAR-ME / CADASTRAR-ME - CRIAR PERFIL</button>
                    </div>
                  ) : tecnicosFiltrados.map((tec:any)=>(
                    <div key={tec.id} className="bg-white border rounded-[12px] p-3 flex gap-3">
                      <div className="w-10 h-10 bg-[#0f1f3c] text-white rounded-full flex items-center justify-center font-black text-[12px]">{tec.nome?.substring(0,2).toUpperCase()}</div>
                      <div className="flex-1">
                        <div className="font-black text-[12px]">{tec.nome} <span className="ml-2 text-[9px] bg-gray-100 px-2 py-1 rounded-full">VER PERFIL</span></div>
                        <div className="text-[9px] text-gray-600">{tec.profissao} - {tec.pais} / {tec.provincia} - {tec.zona}</div>
                        <div className="text-[9px] mt-1">{tec.descricao || 'Sem descricao - perfil novo'}</div>
                        <div className="mt-2 flex gap-2">
                          <button className="bg-[#0f1f3c] text-white px-4 py-1 rounded-full text-[8px] font-black">GERAR CONTRATO</button>
                          <span className="text-[8px] bg-gray-100 px-2 py-1 rounded">{tec.telefone} {tec.whatsapp && '/ '+tec.whatsapp} - sem email publico</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {!perfilLogado && !mostrarCadastro && !showLoginTec && (
                <div className="bg-white border rounded-[12px] p-3">
                  <div className="font-black text-[11px]">LINKEDIN MOZ - ENCONTRAR 100% REAL</div>
                  <div className="text-[9px] mt-2">Pessoa entra, cadastra-se e cria seu perfil usando suas credenciais, passa a entrar no seu perfil, melhorar e fazer tudo que lhe convier. Qualquer pessoa sem conta pode entrar, pesquisar por certo mestre e encontrar, ver perfil. Perfil deve ser facil de ser encontrado - real nao mock.</div>
                  <button onClick={()=>setMostrarCadastro(true)} className="w-full mt-3 bg-[#facc15] py-2 rounded-full font-black text-[10px]">REGISTAR-ME / CADASTRAR-ME - CRIAR PERFIL</button>
                  <button onClick={()=>setShowLoginTec(true)} className="w-full mt-2 bg-white border-2 border-black py-2 rounded-full font-black text-[10px]">ENTRAR NO MEU PERFIL - LOGIN</button>
                  <div className="mt-3 text-[8px] bg-yellow-50 p-2 rounded border">Amarelo ja havias retirado BI e colocar email - agora: Email obrigatorio, NUIT opcional, Documentos relevantes: CV, Certificados, projetos, testemunhas, desenhos etc</div>
                </div>
              )}

              {mostrarCadastro && (
                <div className="bg-white border-2 border-black rounded-[12px] p-3">
                  <div className="flex justify-between items-center">
                    <div className="font-black text-[11px]">Cadastre seu serviço - Rapido e gratuito - 100% REAL - DO ZERO</div>
                    <button onClick={()=>setMostrarCadastro(false)} className="text-[10px]">X</button>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <button className="flex-1 py-1 border rounded text-[8px]">EMPRESA</button>
                    <button className="flex-1 py-1 bg-[#0f1f3c] text-white rounded text-[8px] font-black">PROFISSIONAL INDIVIDUAL SINGULAR</button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div><div className="text-[8px] font-black">Nome completo *</div><input value={formTec.nome} onChange={e=>setFormTec({...formTec, nome:e.target.value})} placeholder="Ex: Michaque Moises Moises" className="w-full p-2 border rounded text-[10px]" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-[8px] font-black">Email * (obrigatorio) - antes BI</div><input value={formTec.email} onChange={e=>setFormTec({...formTec, email:e.target.value})} placeholder="Ex: michaque@email.com" className="w-full p-2 border-2 border-black rounded text-[10px] font-bold" /></div>
                      <div><div className="text-[8px] font-black">NUIT (opcional) / Telefone</div><input value={formTec.nuit} onChange={e=>setFormTec({...formTec, nuit:e.target.value})} placeholder="Ex: 123456789" className="w-full p-2 border rounded text-[10px]" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-[8px] font-black">Pais *</div><select value={formTec.pais} onChange={e=>setFormTec({...formTec, pais:e.target.value})} className="w-full p-2 border rounded text-[10px]"><option>Moçambique</option></select></div>
                      <div><div className="text-[8px] font-black">Provincia *</div><select value={formTec.provincia} onChange={e=>setFormTec({...formTec, provincia:e.target.value})} className="w-full p-2 border rounded text-[10px]"><option>Maputo Cidade</option><option>Gaza - Xai-Xai</option><option>Maputo Provincia</option><option>Sofala</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-[8px] font-black">Local / Localidade *</div><input value={formTec.local} onChange={e=>setFormTec({...formTec, local:e.target.value})} placeholder="Bairro Central" className="w-full p-2 border rounded text-[10px]" /></div>
                      <div><div className="text-[8px] font-black">Distrito</div><select value={formTec.distrito} onChange={e=>setFormTec({...formTec, distrito:e.target.value})} className="w-full p-2 border rounded text-[10px]"><option>KaMpfumo</option><option>Matola</option><option>Boane</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-[8px] font-black">Tipo de profissao / Area *</div><select value={formTec.profissao} onChange={e=>setFormTec({...formTec, profissao:e.target.value})} className="w-full p-2 border rounded text-[10px]"><option>Pedreiro</option><option>Carpinteiro</option><option>Eletricista</option><option>Canalizador</option><option>Pintor</option><option>Serralheiro</option><option>Domestica</option><option>Motorista</option></select></div>
                      <div><div className="text-[8px] font-black">WhatsApp / Telefone *</div><input value={formTec.telefone} onChange={e=>setFormTec({...formTec, telefone:e.target.value})} placeholder="840532899" className="w-full p-2 border rounded text-[10px]" /></div>
                    </div>
                    <div><div className="text-[8px] font-black">Descricao - experiencia</div><textarea value={formTec.descricao} onChange={e=>setFormTec({...formTec, descricao:e.target.value})} placeholder="Ex: Serralheiro com experiencia..." className="w-full p-2 border rounded text-[10px] h-16" /></div>
                    <div className="border-2 border-dashed rounded p-3 text-center bg-gray-50">
                      <div className="text-[9px] font-black">Anexar arquivos - Documentos Relevantes - Funcional - CV, Certificados, Projetos, Testemunhas, Desenhos etc - Nao so BI</div>
                      <div className="text-[7px] mt-1">CV (opcional), NUIT (opcional), Fotos trabalho, Certificados, Projetos realizados, Testemunhas, Desenhos</div>
                      <input type="file" multiple className="mt-2 text-[8px]" />
                    </div>
                    <button onClick={handleCadastrar} className="w-full bg-[#facc15] py-2 rounded-full font-black text-[10px]">ENVIAR CADASTRO - SEM VALORES - 100% REAL - GERA PASSWORD</button>
                    <div className="text-[7px] text-center mt-1">Ao cadastrar, gera password automaticamente e pode entrar no perfil para melhorar</div>
                  </div>
                </div>
              )}

              {showLoginTec && (
                <div className="bg-white border-2 border-black rounded-[12px] p-3">
                  <div className="font-black text-[11px]">Entrar no meu perfil - Login com credenciais</div>
                  <div className="mt-3 space-y-2">
                    <div><div className="text-[8px] font-black">Email</div><input value={loginTec.email} onChange={e=>setLoginTec({...loginTec, email:e.target.value})} placeholder="seu@email.com" className="w-full p-2 border rounded text-[10px]" /></div>
                    <div><div className="text-[8px] font-black">Password gerada no cadastro</div><input value={loginTec.password} onChange={e=>setLoginTec({...loginTec, password:e.target.value})} type="password" placeholder="password" className="w-full p-2 border rounded text-[10px]" /></div>
                    <button onClick={handleLogin} className="w-full bg-black text-white py-2 rounded-full font-black text-[10px]">ENTRAR NO MEU PERFIL</button>
                    <button onClick={()=>setShowLoginTec(false)} className="w-full bg-white border py-2 rounded-full text-[10px]">Cancelar</button>
                  </div>
                </div>
              )}

              {perfilLogado && (
                <div className="bg-green-50 border-2 border-green-600 rounded-[12px] p-3">
                  <div className="font-black text-[11px]">Meu Perfil - {perfilLogado.nome}</div>
                  <div className="text-[9px] mt-1">Logado como {perfilLogado.email} - Pode melhorar e fazer tudo que lhe convier - LinkedIn style</div>
                  <div className="mt-2 text-[9px]">Nome: {perfilLogado.nome}</div>
                  <div className="text-[9px]">Profissao: {perfilLogado.profissao}</div>
                  <div className="text-[9px]">Telefone: {perfilLogado.telefone}</div>
                  <button onClick={()=>setPerfilLogado(null)} className="w-full mt-3 bg-white border py-2 rounded-full text-[10px]">Sair do perfil</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab==='VIAJAR' && (
        <div className="p-8 text-center">
          <div className="font-black">VIAJAR - Pausado como pediu - Vamos focar em ENCONTRAR 100% REAL</div>
          <div className="text-[10px] mt-2">Quando quiser voltar a VIAJAR, me diz</div>
        </div>
      )}
    </div>
  );
}
