
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bkwkulxuprpboozaehfh.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 127 bytes].XXXX';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export default function VenderFixIVATabs(){
  const [lojaLogada, setLojaLogada] = useState<any>(null);
  const [negocioTab, setNegocioTab] = useState<'painel'|'faturar'|'vender'|'stock'|'clientes'|'fornecedores'|'caixa'|'relatorios'>('painel');
  const [stockProdutos, setStockProdutos] = useState<any[]>([]);
  const [faturas, setFaturas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [dataStockDiario, setDataStockDiario] = useState(new Date().toISOString().slice(0,10));
  const [filtroRapidoStock, setFiltroRapidoStock] = useState('');
  const [armazemAtivo, setArmazemAtivo] = useState('Todos');
  const [mostrarNovoItem, setMostrarNovoItem] = useState(false);
  const [mostrarEntrada, setMostrarEntrada] = useState(false);
  const [mostrarSaida, setMostrarSaida] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [qtdEntrada, setQtdEntrada] = useState('');
  const [qtdSaida, setQtdSaida] = useState('');
  const [tipoSaida, setTipoSaida] = useState<'saida_usa'|'transferencia'>('transferencia');

  // FATURAR V90 - IVA FUNCIONAL
  const [produtosFat, setProdutosFat] = useState<any[]>([]);
  const [buscaFat, setBuscaFat] = useState('');
  const [telFat, setTelFat] = useState('');
  const [nomeFat, setNomeFat] = useState('');
  const [nuitFat, setNuitFat] = useState('');
  const [ivaTipo, setIvaTipo] = useState<'0'|'5'|'16'>('16'); // Local apenas, não grava no Supabase

  const [formNovoItem, setFormNovoItem] = useState({codigo:'', nome:'', marca:'', categoria:'Cimento', preco:'', stockInicialArmazem:'', stockInicialLoja:'', armazem:'Matola - Principal'});
  const [perfilEdit, setPerfilEdit] = useState({nomeLoja:'', nuit:'', endereco:'', provincia:'', distrito:'', ramo:'', tel:'', password:'', novaPassword:'', logoData:'', funcionarios: [] as any[]});

  const [mostrarLogin, setMostrarLogin] = useState<'cadastro'|'login'>('cadastro');
  const [passoCadastro, setPassoCadastro] = useState(1);
  const [passoFaturar, setPassoFaturar] = useState(1);
  const [mostrarPreviewFat, setMostrarPreviewFat] = useState(false);
  const [mostrarProdutosCheio, setMostrarProdutosCheio] = useState(false);
  const [turnoFat, setTurnoFat] = useState('TM - Manhã');
  const [formLojaLogin, setFormLojaLogin] = useState({nomeLoja:'', tel:'+258840532899', password:'', nuit:'400123456', endereco:'Av. Guerra Popular, Matola', provincia:'Maputo Cidade', distrito:'KaMpfumo', ramo:'Ferragem e Material de Construcao', logoData:''});

  const criarContaLoja = async () => {
    if(!formLojaLogin.nomeLoja || !formLojaLogin.tel || !formLojaLogin.password){ alert('Para criar a conta, preenche so Nome, Telefone e Password. O resto e opcional.'); return; }
    const conta_id = `conta_${Date.now()}`;
    const novaLoja:any = { conta_id, nome_loja: formLojaLogin.nomeLoja, username: formLojaLogin.tel, password: formLojaLogin.password, nuit: formLojaLogin.nuit, endereco: formLojaLogin.endereco, provincia: formLojaLogin.provincia, cidade: formLojaLogin.distrito, ramo: formLojaLogin.ramo, logoData: formLojaLogin.logoData };
    try{
      const { error } = await supabase.from('lojas').insert([novaLoja]);
      if(error){ console.log(error); }
      localStorage.setItem('loja_sessao', JSON.stringify(novaLoja));
      setLojaLogada(novaLoja);
      setPerfilEdit({nomeLoja:novaLoja.nome_loja||'', nuit:novaLoja.nuit||'', endereco:novaLoja.endereco||'', provincia:novaLoja.provincia||'Maputo Cidade', distrito:novaLoja.cidade||'KaMpfumo', ramo:novaLoja.ramo||'', tel:novaLoja.username||'', password:'', novaPassword:'', logoData:novaLoja.logoData||'', funcionarios: []});
      carregarTudo(novaLoja.conta_id);
    }catch(e:any){ alert(e.message); }
  };

  const fazerLoginLoja = async () => {
    if(!formLojaLogin.tel || !formLojaLogin.password){ alert('Telefone e Password'); return; }
    const { data, error } = await supabase.from('lojas').select('*').eq('username', formLojaLogin.tel).eq('password', formLojaLogin.password).limit(1);
    if(error || !data || data.length===0){ alert('Loja não encontrada - verifica telefone e password ou cria conta'); return; }
    const loja = data[0];
    localStorage.setItem('loja_sessao', JSON.stringify(loja));
    setLojaLogada(loja);
    setPerfilEdit({nomeLoja:loja.nome_loja||'', nuit:loja.nuit||'', endereco:loja.endereco||'', provincia:loja.provincia||'Maputo Cidade', distrito:loja.cidade||'KaMpfumo', ramo:loja.ramo||'', tel:loja.username||'', password:'', novaPassword:'', logoData:loja.logoData||'', funcionarios: loja.funcionarios||[]});
    carregarTudo(loja.conta_id);
  };

  const [novoFunc, setNovoFunc] = useState({nome:'', tel:'', password:'', cargo:'Vendedor Caixa'});

  // FINAL REAL - NÃO FAZ AUTO-LOGIN - Primeira tela é sempre Porta de Entrada (Vercel exacto)
  // A sessão fica guardada mas só entra depois de clicar LOGIN / CADASTRO
  // Se já tem conta salva, o campo TELEFONE já vem preenchido para login rápido
  useEffect(()=>{
    const sessao = localStorage.getItem('loja_sessao');
    if(sessao){ try{ const l=JSON.parse(sessao); setFormLojaLogin((prev:any)=>({...prev, tel:l.username||prev.tel, nomeLoja:l.nome_loja||prev.nomeLoja})); }catch(e){} }
    // NÃO setLojaLogada aqui - fica null para mostrar Porta de Entrada primeiro
  },[]);

  const carregarTudo = async (conta_id:string) => {
    setCarregando(true);
    const { data: prods, error: errP } = await supabase.from('produtos_loja').select('*').eq('conta_id', conta_id).order('created_at',{ascending:true});
    if(errP) console.error(errP);
    const { data: fats } = await supabase.from('faturas_loja').select('*').eq('conta_id', conta_id).order('created_at',{ascending:false});
    const lista = (prods||[]).map((p:any)=>{
      const stockInicialArm = p.stock_inicial_armazem ?? p.stock_armazem ?? 0;
      const entrada = p.entrada ?? 0;
      const saida = p.saida ?? 0;
      const stockFinalArm = stockInicialArm + entrada - saida;
      const stockInicialLoja = p.stock_inicial_loja ?? p.stock_loja ?? 0;
      const recepcao = p.recepcao ?? 0;
      const vendaHoje = p.venda_hoje ?? 0;
      const stockFinalLoja = stockInicialLoja + recepcao - vendaHoje;
      return {...p, codigo:p.codigo||`COD-${Math.floor(Math.random()*90000)+10000}`, dataEntrada:p.created_at?new Date(p.created_at).toISOString().slice(0,10):dataStockDiario, stockInicialArmazem:stockInicialArm, entrada, saida, stockFinalArmazem:stockFinalArm, stockInicialLoja, recepcao, vendaHoje, stockFinalLoja, stockTotal:stockFinalArm+stockFinalLoja, precoUnit:p.preco||0, armazem:p.armazem||'Matola - Principal'};
    });
    setStockProdutos(lista);
    setFaturas((fats as any)||[]);
    setCarregando(false);
  };

  const salvarNovoItemReal = async () => {
    if(!formNovoItem.nome || !formNovoItem.codigo){ alert('Código e Nome'); return; }
    const novo:any = { conta_id: lojaLogada.conta_id, codigo: formNovoItem.codigo, nome: formNovoItem.nome, cat: formNovoItem.categoria, preco: parseFloat(formNovoItem.preco)||0, stock_armazem: parseInt(formNovoItem.stockInicialArmazem)||0, stock_loja: parseInt(formNovoItem.stockInicialLoja)||0, stock_inicial_armazem: parseInt(formNovoItem.stockInicialArmazem)||0, stock_inicial_loja: parseInt(formNovoItem.stockInicialLoja)||0, entrada:0, saida:0, recepcao:0, venda_hoje:0, armazem: formNovoItem.armazem, marca: formNovoItem.marca };
    const { error } = await supabase.from('produtos_loja').insert([novo]); if(error) alert(error.message); else { setMostrarNovoItem(false); setFormNovoItem({codigo:'', nome:'', marca:'', categoria:'Cimento', preco:'', stockInicialArmazem:'', stockInicialLoja:'', armazem:'Matola - Principal'}); carregarTudo(lojaLogada.conta_id); }
  };

  const fazerEntradaReal = async () => {
    if(!produtoSelecionado || !qtdEntrada) return;
    const qtd = parseInt(qtdEntrada)||0;
    const novoEntrada = produtoSelecionado.entrada + qtd;
    const novoFinalArm = produtoSelecionado.stockInicialArmazem + novoEntrada - produtoSelecionado.saida;
    await supabase.from('produtos_loja').update({ entrada: novoEntrada, stock_armazem: novoFinalArm }).eq('id', produtoSelecionado.id);
    alert(`Entrada [F5] - ${qtd} - finalArm ${novoFinalArm}`); setMostrarEntrada(false); setQtdEntrada(''); setProdutoSelecionado(null); carregarTudo(lojaLogada.conta_id);
  };

  const fazerSaidaReal = async () => {
    if(!produtoSelecionado || !qtdSaida) return;
    const qtd = parseInt(qtdSaida)||0;
    if(tipoSaida==='saida_usa'){
      if(qtd > produtoSelecionado.stockFinalArmazem){ alert('Stock insuficiente'); return; }
      const novoSaida = produtoSelecionado.saida + qtd;
      const novoFinalArm = produtoSelecionado.stockInicialArmazem + produtoSelecionado.entrada - novoSaida;
      await supabase.from('produtos_loja').update({ saida: novoSaida, stock_armazem: novoFinalArm }).eq('id', produtoSelecionado.id);
    } else {
      if(qtd > produtoSelecionado.stockFinalArmazem){ alert('Stock insuficiente'); return; }
      const novoSaida = produtoSelecionado.saida + qtd;
      const novoFinalArm = produtoSelecionado.stockInicialArmazem + produtoSelecionado.entrada - novoSaida;
      const novaRecepcao = produtoSelecionado.recepcao + qtd;
      const novoFinalLoja = produtoSelecionado.stockInicialLoja + novaRecepcao - produtoSelecionado.vendaHoje;
      await supabase.from('produtos_loja').update({ saida: novoSaida, stock_armazem: novoFinalArm, recepcao: novaRecepcao, stock_loja: novoFinalLoja }).eq('id', produtoSelecionado.id);
    }
    setMostrarSaida(false); setQtdSaida(''); setProdutoSelecionado(null); carregarTudo(lojaLogada.conta_id);
  };

  const adicionarAoFaturar = (p:any) => {
    const disp = p.stockFinalLoja;
    const noCarrinho = produtosFat.find(x=>x.id===p.id);
    if((noCarrinho?.qtd||0)+1 > disp){ alert(`Stock loja insuficiente! Tem ${disp}`); return; }
    if(noCarrinho) setProdutosFat(produtosFat.map(x=>x.id===p.id?{...x,qtd:x.qtd+1}:x));
    else setProdutosFat([...produtosFat, {...p, qtd:1, desc:0, preco: p.precoUnit}]);
  };

  const salvarFaturaDuplaFuncao = async (isDivida:boolean) => {
    if(produtosFat.length===0){ alert('Adicione produtos'); return; }
    if(!telFat && !nomeFat){ alert('Telefone ou nome'); return; }
    const subtotalBruto = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
    const descontoItens = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
    const subtotalLiquido = subtotalBruto - descontoItens;
    const ivaPerc = ivaTipo==='16'?16: ivaTipo==='5'?5:0;
    const ivaValor = subtotalLiquido * ivaPerc / 100;
    const total = subtotalLiquido + ivaValor;
    // FIX: NÃO enviar ivaTipo para Supabase, só dados que existem
    const nova:any = { conta_id: lojaLogada.conta_id, cliente: nomeFat||telFat, tel: telFat, nuit: nuitFat||null, produtos: produtosFat, total, status: isDivida?'DIVIDA':'PAGO', is_divida: isDivida, data: new Date().toLocaleString('pt-MZ') };
    const { error } = await supabase.from('faturas_loja').insert([nova]);
    if(error){ alert('Erro fatura: '+error.message); return; }
    for(let item of produtosFat){
      const prod = stockProdutos.find(pr=>pr.id===item.id);
      if(prod){ const novaVenda = prod.vendaHoje + item.qtd; const novoFinalLoja = prod.stockInicialLoja + prod.recepcao - novaVenda; await supabase.from('produtos_loja').update({ venda_hoje: novaVenda, stock_loja: novoFinalLoja }).eq('id', prod.id); }
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>FATURA</title><style>body{font-family:Arial;padding:15px;font-size:11px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #999;padding:6px;font-size:10px}th{background:#1e2f4a;color:#fff}</style></head><body><h2>${lojaLogada.nome_loja}</h2><div>NUIT: ${lojaLogada.nuit} - IVA ${ivaTipo}%</div><p>Cliente: ${nomeFat} - Tel: ${telFat} - NUIT: ${nuitFat}</p><table><thead><tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Desc</th><th>Total</th></tr></thead><tbody>${produtosFat.map(p=>`<tr><td>${p.nome}</td><td>${p.qtd}</td><td>${p.preco} MT</td><td>${p.desc}%</td><td>${(p.preco*p.qtd*(1-p.desc/100)).toFixed(0)} MT</td></tr>`).join('')}</tbody></table><h3>Subtotal: ${subtotalBruto.toFixed(0)} - Desconto: ${descontoItens.toFixed(0)} - IVA ${ivaPerc}%: ${ivaValor.toFixed(0)} - TOTAL: ${total.toFixed(0)} MT</h3></body></html>`;
    const win = window.open('', '_blank'); if(win){ win.document.write(html); win.document.close(); setTimeout(()=>win.print(),500); }
    const msg = `*FATURA ${lojaLogada.nome_loja}* - ${isDivida?'DIVIDA':'PAGO'}\nCliente: ${nomeFat}\nTotal: ${total.toFixed(0)} MT - IVA ${ivaTipo}%\nIVA Valor: ${ivaValor.toFixed(0)} MT`;
    const num = telFat.replace(/\D/g,''); if(num){ setTimeout(()=>window.open(`https://wa.me/${num.startsWith('258')?num:`258${num}`}?text=${encodeURIComponent(msg)}`, '_blank'),800); }
    alert(`✅ Fatura ${isDivida?'DIVIDA':'PAGO'} - IVA ${ivaTipo}% aplicado - Subtotal ${subtotalBruto} - IVA ${ivaValor.toFixed(0)} - Total ${total.toFixed(0)} MT - VENDA atualizada`); setProdutosFat([]); setTelFat(''); setNomeFat(''); setNuitFat(''); carregarTudo(lojaLogada.conta_id);
  };

  const salvarPerfilLoja = async () => {
    const update:any = { nome_loja: perfilEdit.nomeLoja, nuit: perfilEdit.nuit, provincia: perfilEdit.provincia, cidade: perfilEdit.distrito };
    if(perfilEdit.novaPassword) update.password = perfilEdit.novaPassword;
    const { error } = await supabase.from('lojas').update(update).eq('conta_id', lojaLogada.conta_id);
    if(error) alert(error.message); else { const novaSessao = {...lojaLogada, ...update, logoData: perfilEdit.logoData, funcionarios: perfilEdit.funcionarios}; setLojaLogada(novaSessao); localStorage.setItem('loja_sessao', JSON.stringify(novaSessao)); alert('Perfil atualizado'); }
  };


  if(!lojaLogada){
    return (
      <div className="min-h-screen bg-[#1e2f4a] flex items-center justify-center p-4">
        <div className="w-full max-w-[600px] bg-[#1e2f4a] border-2 border-[#2a3f5f] rounded-[16px] p-6 shadow-2xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8b5cf6] rounded-[12px] flex items-center justify-center mx-auto text-white font-black text-[18px]">N</div>
            <h1 className="mt-3 text-white font-black text-[18px]">Minha Loja - Porta de Entrada Negocio</h1>
            <p className="text-[8px] text-[#94a3b8] mt-1">Cadastre sua loja em 10 segundos - Depois preencha mais dados da sua loja e incorpore logotipo que vai aparecer em facturas e tudo que fizer na sua loja</p>
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={()=>setMostrarLogin('cadastro')} className={mostrarLogin==='cadastro' ? 'px-5 py-1.5 rounded-full bg-[#facc15] text-black font-black text-[10px]' : 'px-5 py-1.5 rounded-full bg-white/10 text-white text-[10px]'}>CADASTRO SIMPLES</button>
              <button onClick={()=>setMostrarLogin('login')} className={mostrarLogin==='login' ? 'px-5 py-1.5 rounded-full bg-[#facc15] text-black font-black text-[10px]' : 'px-5 py-1.5 rounded-full bg-white/10 text-white text-[10px]'}>LOGIN</button>
            </div>
          </div>
          {mostrarLogin==='cadastro' ? (
            <div className="mt-4 space-y-3 w-full min-w-0 overflow-x-hidden">
              <div className="flex gap-1"><button onClick={()=>setPassoCadastro(1)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${passoCadastro===1?'bg-[#facc15] text-black':'bg-white/10 text-white'}`}>1 Loja</button><button onClick={()=>setPassoCadastro(2)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${passoCadastro===2?'bg-[#facc15] text-black':'bg-white/10 text-white'}`}>2 Local + Logo</button></div>
              {passoCadastro===1 && (<div className="space-y-2 w-full min-w-0">
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Nome da loja *</label><input value={formLojaLogin.nomeLoja} onChange={e=>setFormLojaLogin({...formLojaLogin, nomeLoja:e.target.value})} placeholder="Ex: Ferragem Central Matola" className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Telefone / WhatsApp *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} placeholder="+258..." className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Password *</label><input type="password" value={formLojaLogin.password} onChange={e=>setFormLojaLogin({...formLojaLogin, password:e.target.value})} placeholder="****" className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">NUIT</label><input value={formLojaLogin.nuit} onChange={e=>setFormLojaLogin({...formLojaLogin, nuit:e.target.value})} placeholder="NUIT da loja" className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <button onClick={()=>setPassoCadastro(2)} className="w-full mt-2 bg-[#facc15] text-black py-3 rounded-full text-[13px] font-bold">Seguinte →</button>
              </div>)}
              {passoCadastro===2 && (<div className="space-y-2 w-full min-w-0">
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Endereço</label><input value={formLojaLogin.endereco} onChange={e=>setFormLojaLogin({...formLojaLogin, endereco:e.target.value})} placeholder="Av. Guerra Popular, Matola" className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Província</label><select value={formLojaLogin.provincia} onChange={e=>setFormLojaLogin({...formLojaLogin, provincia:e.target.value})} className="w-full min-w-0 mt-1 h-10 border rounded px-2 text-[13px] bg-white"><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Gaza</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Distrito</label><input value={formLojaLogin.distrito} onChange={e=>setFormLojaLogin({...formLojaLogin, distrito:e.target.value})} placeholder="Distrito" className="w-full min-w-0 mt-1 h-10 border rounded px-3 text-[13px] bg-white" /></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Ramo</label><select value={formLojaLogin.ramo} onChange={e=>setFormLojaLogin({...formLojaLogin, ramo:e.target.value})} className="w-full min-w-0 mt-1 h-10 border rounded px-2 text-[13px] bg-white"><option>Ferragem e Material de Construcao</option><option>Mercearia e Mini Mercado</option><option>Boutique</option><option>Farmacia</option><option>Restaurante</option><option>Outro</option></select></div>
                <div className="w-full min-w-0"><label className="text-[11px] font-bold text-white">Logotipo - aparece na fatura</label><input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>setFormLojaLogin({...formLojaLogin, logoData: reader.result as any}); reader.readAsDataURL(file); }} className="w-full min-w-0 mt-1 border rounded px-3 py-2 text-[11px] bg-[#2a3f5f] text-white" />{formLojaLogin.logoData && <img src={formLojaLogin.logoData} className="w-12 h-12 mt-2 rounded border" />}</div>
                <div className="flex gap-2"><button onClick={()=>setPassoCadastro(1)} className="flex-1 bg-white/10 text-white py-3 rounded-full text-[13px] font-bold">← Voltar</button><button onClick={criarContaLoja} className="flex-[2] bg-[#16a34a] text-white py-3 rounded-full text-[13px] font-bold">Criar conta</button></div>
              </div>)}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div><label className="text-[8px] font-bold text-white">TELEFONE / WHATSAPP *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} className="w-full mt-1 h-10 border rounded px-3 text-[12px] bg-white" placeholder="+258840532899" /></div>
              <div><label className="text-[8px] font-bold text-white">PASSWORD *</label><input type="password" value={formLojaLogin.password} onChange={e=>setFormLojaLogin({...formLojaLogin, password:e.target.value})} className="w-full mt-1 h-10 border rounded px-3 text-[12px] bg-white" placeholder="****" /></div>
              <button onClick={fazerLoginLoja} className="w-full mt-4 bg-[#facc15] text-black py-3 rounded-full text-[11px] font-black">Entrar - Login</button>
              <button onClick={()=>setMostrarLogin('cadastro')} className="w-full mt-2 bg-white/10 text-white py-2 rounded-full text-[10px]">Ainda não tem conta? Criar conta</button>
            </div>
          )}
        </div>
      </div>
    );
  }


  const filtrados = stockProdutos.filter(p=>{ if(filtroRapidoStock && !(`${p.codigo} ${p.nome}`.toLowerCase().includes(filtroRapidoStock.toLowerCase()))) return false; if(armazemAtivo!=='Todos' && p.armazem!==armazemAtivo) return false; return true; });

  const subtotalFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
  const descFat = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
  const liqFat = subtotalFat - descFat;
  const ivaPerc = ivaTipo==='16'?16: ivaTipo==='5'?5:0;
  const ivaVal = liqFat * ivaPerc / 100;
  const totalFat = liqFat + ivaVal;

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-2 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-[10px] border p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-[11px]">M1</div><div><div className="font-black text-[11px]">CONTA INTERNA - {lojaLogada.provincia} - {lojaLogada.nome_loja} - Gaza - ESSE</div><div className="text-[7px] text-gray-500">Aderito - NUIT {lojaLogada.nuit} - Cidade: {lojaLogada.cidade} - Loja de Tintas e Vernizes - Stock: {stockProdutos.length} produtos - IVA {ivaTipo}% funcional</div></div></div>
          <div className="flex items-center gap-2"><button onClick={()=>{ localStorage.removeItem('loja_sessao'); setLojaLogada(null); setMostrarLogin('login'); }} className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-bold">Sair da Conta</button><div className="text-[7px] border px-2 py-1 rounded-full">{dataStockDiario} - {filtrados.length} itens</div></div>
        </div>

        <div className="bg-white rounded-[10px] border p-2 mb-3 flex gap-1 flex-wrap">
          <button onClick={()=>setNegocioTab('painel')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='painel'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📊 Painel</button>
          <button onClick={()=>setNegocioTab('faturar')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='faturar'?'bg-yellow-400 text-black border border-black':'bg-gray-100'}`}>🧾 Faturar</button>
          <button onClick={()=>setNegocioTab('vender')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='vender'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>🛒 Vender</button>
          <button onClick={()=>setNegocioTab('stock')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='stock'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📦 Stock</button>
          <button onClick={()=>setNegocioTab('clientes')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='clientes'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>👥 Clientes</button>
          <button onClick={()=>setNegocioTab('fornecedores')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='fornecedores'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>🚚 Fornecedores</button>
          <button onClick={()=>setNegocioTab('caixa')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='caixa'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>💰 Caixa & Turnos</button>
          <button onClick={()=>setNegocioTab('relatorios')} className={`px-3 py-1.5 rounded-full text-[8px] font-bold ${negocioTab==='relatorios'?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>📈 Relatórios</button>
        </div>

        
        <style>{`@media (max-width:1023px){ .vender-faturar-phone{ zoom:0.82; } .vender-faturar-phone input,.vender-faturar-phone select,.vender-faturar-phone button{ max-width:100%; } }`}</style>
          {negocioTab==='faturar' && (
          <div className="mt-3 w-full min-w-0 overflow-x-hidden vender-faturar-phone">
            <div className="bg-white border rounded-[12px] p-3"><div className="font-black text-[13px]">Faturar</div><div className="text-[11px] text-gray-500">Cada passo abre sozinho - nao precisas preencher o passo anterior. Campos vazios ficam em branco.</div><div className="flex gap-1 mt-2"><button onClick={()=>setPassoFaturar(1)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${passoFaturar===1?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>1 Cliente</button><button onClick={()=>setPassoFaturar(2)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${passoFaturar===2?'bg-[#0a66c2] text-white':'bg-gray-100'}`}>2 Produtos</button></div><div className="flex gap-1 mt-2"><button onClick={()=>setTurnoFat('TM - Manhã')} className={`flex-1 py-1.5 rounded-full text-[11px] font-bold ${turnoFat==='TM - Manhã'?'bg-[#facc15]':'bg-gray-100'}`}>TM Manhã</button><button onClick={()=>setTurnoFat('TT - Tarde')} className={`flex-1 py-1.5 rounded-full text-[11px] font-bold ${turnoFat==='TT - Tarde'?'bg-[#facc15]':'bg-gray-100'}`}>TT Tarde</button><button onClick={()=>setTurnoFat('TN - Noite')} className={`flex-1 py-1.5 rounded-full text-[11px] font-bold ${turnoFat==='TN - Noite'?'bg-[#facc15]':'bg-gray-100'}`}>TN Noite</button></div></div>
            <div className={passoFaturar===1 ? "block" : "hidden"}><div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
              <div className="col-span-1 lg:col-span-8 bg-white border rounded-[12px] p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="font-black text-[11px] flex items-center gap-2"><span className="w-2 h-2 bg-[#facc15] rounded-full"></span> Faturar</div>
                  <div className="flex gap-1">
                    <span className="text-[7px] border px-2 py-1 rounded-full bg-white">Formato A5</span>
                    <span className="text-[7px] bg-[#dbeafe] border border-blue-200 px-2 py-1 rounded-full">NUIT na fatura</span>
                    <span className="text-[7px] bg-[#facc15] border px-2 py-1 rounded-full text-black">58/80 - Recibo</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] p-3">
                    <div className="text-[8px] font-black text-[#92400e] uppercase">Cliente</div>
                    <select value={nomeFat} onChange={e=>{ const val=e.target.value; setNomeFat(val.split(' - ')[0]||''); const telMatch=val.match(/\d{9,}/); if(telMatch) setTelFat(telMatch[0]); }} className="mt-2 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white font-bold">
                      <option value="">Joao Manhique - Obra Zimpeto - 258828756432</option>
                      <option value="Joao Manhique - Obra Zimpeto - 258828756432">Joao Manhique - Obra Zimpeto - 258828756432</option>
                      <option value="Nordino Mungoi - 258841234567">Nordino Mungoi - 258841234567</option>
                      <option value="Aderito Moises - 258828765432">Aderito Moises - 258828765432</option>
                      <option value="Cliente Balcao - 258840000000">Cliente Balcao - 258840000000</option>
                    </select>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[8px]">
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">Tel dinamico:</span><b>{telFat||'+258 84 123 4567'}</b></div>
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">NUIT:</span><b>{nuitFat||'--'}</b> <span className="ml-2 bg-[#f8fafc] border px-1 rounded">+ Detalhes</span></div>
                    </div>
                  </div>
                  <div className="bg-[#fffbeb] border-2 border-[#fde68a] rounded-[10px] p-3 flex gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-[10px] overflow-hidden">{perfilEdit.logoData ? <img src={perfilEdit.logoData} className="w-full h-full object-cover" /> : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div>
                    <div className="flex-1">
                      <div className="text-[7px] font-bold text-[#64748b] uppercase">LOJA EMISSORA - CONTA DONO - Loja de Tintas e Vernizes</div>
                      <div className="font-black text-[12px] mt-1">{lojaLogada?.nome_loja||perfilEdit.nomeLoja||'Aderito'} <span className="text-[8px] bg-black text-white px-1 rounded ml-1">LOGO</span></div>
                      <div className="text-[8px] text-[#334155] mt-1">NUIT {lojaLogada?.nuit||perfilEdit.nuit||'123456789'} + Tel {lojaLogada?.username||perfilEdit.tel||'258840532899'} + KaMpfumo</div>
                      <div className="text-[6px] text-[#94a3b8]">Maputo - Maputo Cidade - Logo OK</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-[#f8fafc] border rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Dados do comprador</div><span className="text-[7px] bg-[#dcfce7] text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Rapido e ativo</span></div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div><div className="text-[7px] font-bold text-[#64748b]">TELEFONE / WHATSAPP *</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NOME / EMPRESA (opcional)</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Micheque Mungoi" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NUIT (opcional)</div><input value={nuitFat} onChange={e=>setNuitFat(e.target.value)} placeholder="400123456" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                  </div>
                </div>
                </div></div><div className={passoFaturar===2 ? "block" : "hidden"}><div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3"><div className="bg-white border rounded-[12px] p-3"><div className="mt-3 bg-white border rounded-[10px] p-3">
                  <button onClick={()=>setMostrarProdutosCheio(true)} className="w-full flex justify-between items-center bg-black text-white rounded-[10px] px-4 py-3 text-left"><span><span className="block font-black text-[13px]">🛒 Produtos - Abrir tela cheia</span><span className="block text-[11px] opacity-80">Toca para ver todos os produtos e escolher</span></span><span className="bg-[#facc15] text-black text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">{stockProdutos.length} produtos →</span></button>
                  <div className="mt-2 text-[11px] text-gray-500">Carrinho: <b className="text-black">{produtosFat.length} itens</b> - Toca no botão acima para escolher produtos.</div>
                </div>
                <div className="mt-3 bg-[#f0fdf4] border border-green-200 rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[10px]">ITENS - {produtosFat.length} produtos no carrinho</div><button onClick={()=>setProdutosFat([])} className="text-[7px] bg-red-500 text-white px-3 py-0.5 rounded-full">Limpar</button></div>
                  <div className="mt-2 space-y-1.5">
                    {produtosFat.map((p,i)=><div key={p.id} className="grid grid-cols-12 gap-1.5 items-center bg-white border rounded-[6px] px-2 py-1.5">
                      <div className="col-span-5"><div className="font-bold text-[9px]">{p.nome}</div><div className="text-[6px] text-gray-500">{p.codigo||p.id} - Stock:{p.stockFinalLoja||'--'}</div></div>
                      <div className="col-span-2"><input type="number" value={p.qtd} onChange={e=>{ const n=[...produtosFat]; n[i].qtd=Number(e.target.value); setProdutosFat(n); }} className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-2"><input type="number" value={p.preco} onChange={e=>{ const n=[...produtosFat]; n[i].preco=Number(e.target.value); setProdutosFat(n); }} className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-2"><input type="number" value={p.desc} onChange={e=>{ const n=[...produtosFat]; n[i].desc=Number(e.target.value); setProdutosFat(n); }} placeholder="Desc%" className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-1 flex justify-center"><button onClick={()=>setProdutosFat(produtosFat.filter(x=>x.id!==p.id))} className="text-[10px]">🗑️</button></div>
                    </div>)}
                    {produtosFat.length===0 && <div className="text-center text-[9px] text-gray-400 py-3">Nenhum produto - clique nos produtos acima</div>}
                  </div>
                  <div className="mt-3 text-right text-[9px] space-y-0.5 border-t pt-2">
                    <div>Subtotal bruto: {subtotalFat.toFixed(0)} MT</div>
                    <div>Descontos: -{descFat.toFixed(0)} MT</div>
                    <div>Subtotal liquido: {liqFat.toFixed(0)} MT</div>
                    <div className="font-bold">IVA ({ivaTipo}%): {ivaVal.toFixed(0)} MT</div>
                    <div className="font-black text-[12px]">TOTAL: {totalFat.toFixed(0)} MT</div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <button onClick={()=>setIvaTipo('0')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='0'?'bg-black text-white':'bg-white'}`}>Sem IVA</button>
                    <button onClick={()=>setIvaTipo('16')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='16'?'bg-green-600 text-white':'bg-white'}`}>Com IVA 16%</button>
                    <button onClick={()=>setIvaTipo('5')} className={`text-[7px] px-3 py-1 rounded-full border ${ivaTipo==='5'?'bg-blue-600 text-white':'bg-white'}`}>Com IVA 5%</button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="flex-1 h-10 bg-[#16a34a] text-white rounded-[8px] text-[9px] font-black">Enviar via WhatsApp para {telFat||'+258 84 123 4567'} - {produtosFat.length} itens - Baixa Stock Auto - PAGO - TOTAL {totalFat.toFixed(0)} MT IVA {ivaTipo}%</button>
                    <button onClick={()=>salvarFaturaDuplaFuncao(true)} className="px-4 h-10 bg-[#facc15] border-2 border-black text-black rounded-[8px] text-[8px] font-black">DIVIDAS - FIADO - {produtosFat.length} itens</button>
                  </div>
                  <div className="mt-2 text-[6px] text-gray-500">Dupla funcao: PDF baixa automatico com nome Fatura DD-MM-AAAA - Nome - PAGO/DIVIDA + WhatsApp direto - Numero fatura por data dia de hoje</div>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-4">
                <button onClick={()=>setMostrarPreviewFat(!mostrarPreviewFat)} className="w-full lg:hidden bg-[#facc15] text-black py-2.5 rounded-full text-[12px] font-bold mb-2">{mostrarPreviewFat ? 'Ocultar pré-visualização ▲' : 'Ver pré-visualização ▼'}</button>
                <div className={mostrarPreviewFat ? "block" : "hidden lg:block"}>
                <div className="bg-white border rounded-[12px] p-3 sticky top-3 shadow-sm">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Pré-visualização - Fatura - IVA {ivaTipo}% - TOTAL {totalFat.toFixed(0)} MT</div><div className="w-2 h-2 bg-[#facc15] rounded-full"></div></div>
                  <div className="mt-3 border-2 border-[#fde68a] bg-[#fffbeb] rounded-[8px] p-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[8px] font-black overflow-hidden">{perfilEdit.logoData ? <img src={perfilEdit.logoData} className="w-full h-full object-cover" /> : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div>
                      <div>
                        <div className="text-[7px] font-bold text-[#64748b]">LOJA EMISSORA - CONTA DONO</div>
                        <div className="font-black text-[10px]">{lojaLogada?.nome_loja||perfilEdit.nomeLoja||'Aderito'} <span className="text-[6px] border px-1 rounded">LOGO</span></div>
                        <div className="text-[6px]">NUIT {lojaLogada?.nuit||perfilEdit.nuit||'123456789'} + Tel {lojaLogada?.username||perfilEdit.tel||'258840532899'} + KaMpfumo</div>
                      </div>
                    </div>
                    <div className="mt-3 text-[7px] space-y-1 bg-white rounded p-2 border">
                      <div className="font-bold">Fatura N {faturas.length+1}/{new Date().toLocaleDateString('pt-MZ').replace(/\//g,'-')} Cliente: {nomeFat||'Joao Manhique'} - {telFat}</div>
                      <div>Data: {new Date().toLocaleDateString('pt-MZ')} - NUIT: {nuitFat||'--'}</div>
                      <div className="mt-2 border-t pt-1">
                        <div className="grid grid-cols-4 font-bold"><span>Item</span><span>Qtd</span><span>Preco</span><span>Total</span></div>
                        {produtosFat.map(p=><div key={p.id} className="grid grid-cols-4"><span>{p.nome.substring(0,12)}</span><span>{p.qtd}</span><span>{p.preco}MT</span><span>{(p.preco*p.qtd).toFixed(0)}</span></div>)}
                        <div className="mt-2 font-black text-right">TOTAL: {totalFat.toFixed(0)} MT IVA {ivaTipo}%</div>
                      </div>
                    </div>
                    <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="w-full mt-3 bg-[#facc15] text-black py-1.5 rounded-full text-[7px] font-bold border">Descarregar PDF - Fatura {faturas.length+1}/{new Date().toLocaleDateString('pt-MZ').replace(/\//g,'-')} - {nomeFat||'Cliente'}</button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}

        {negocioTab==='stock' && (
          <div className="bg-white rounded-[10px] border p-4">
            <div className="font-black text-[11px]">TABELA COMPLETA 11 COLUNAS 06:10 FORCA DIFF - {filtrados.length} itens - Alerta abaixo 50 - STOCK DIARIO - FIFO - NEGOCIO - FIX</div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><input type="date" value={dataStockDiario} onChange={e=>setDataStockDiario(e.target.value)} className="border rounded-full px-3 py-1 text-[10px]" /><input value={filtroRapidoStock} onChange={e=>setFiltroRapidoStock(e.target.value)} placeholder="Filtro rápido" className="border rounded-full px-3 py-1 text-[9px] w-56" /><select value={armazemAtivo} onChange={e=>setArmazemAtivo(e.target.value)} className="border rounded-full px-2 py-1 text-[8px]"><option>Todos</option><option>Matola - Principal</option></select></div>
            <div className="grid grid-cols-12 gap-3 mt-4">
              <div className="col-span-2"><div className="border rounded-[10px] p-3"><button onClick={()=>setMostrarNovoItem(true)} className="w-full border rounded-full py-2 text-[10px] font-bold">+ Novo Item</button><button onClick={()=>setMostrarEntrada(true)} className="w-full mt-2 bg-yellow-100 border rounded-full py-2 text-[10px] font-bold">Entrada [F5]</button><button onClick={()=>{ setTipoSaida('saida_usa'); setMostrarSaida(true); }} className="w-full mt-2 bg-red-50 border rounded-full py-2 text-[10px] font-bold">Saída [F6]</button><button onClick={()=>{ setTipoSaida('transferencia'); setMostrarSaida(true); }} className="w-full mt-2 bg-blue-50 border rounded-full py-2 text-[10px] font-bold">Transferir Armazém → Loja</button></div></div>
              <div className="col-span-10"><div className="overflow-x-auto border rounded-[10px]"><table className="w-full text-[8px] min-w-[1100px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">ITEM/CÓDIGO</th><th className="p-2">DATA</th><th className="p-2 bg-blue-500">STOCK INICIAL ARM</th><th className="p-2 bg-blue-500">ENTRADA</th><th className="p-2 bg-blue-500">SAÍDA - Só formulário</th><th className="p-2 bg-yellow-300 text-black">STOCK FINAL ARM</th><th className="p-2 bg-green-500">STOCK INICIAL LOJA</th><th className="p-2 bg-green-500">RECEPÇÃO - Automático</th><th className="p-2 bg-green-500">VENDA - Só faturar</th><th className="p-2 bg-green-300 text-black">STOCK FINAL LOJA</th><th className="p-2 bg-yellow-300 text-black">TOTAL</th><th className="p-2">AÇÃO</th></tr></thead><tbody>{filtrados.length===0?<tr><td colSpan={12} className="p-4 text-center">Nenhum produto - Clica + Novo Item - Stock: {stockProdutos.length} total - Filtro: {filtroRapidoStock}</td></tr>:filtrados.map(p=><tr key={p.id} className="border-b"><td className="p-2"><div className="font-bold">{p.codigo}</div><div className="text-[6px]">{p.nome}</div></td><td className="p-2 text-center">{p.dataEntrada}</td><td className="p-2 text-center bg-blue-50">{p.stockInicialArmazem}</td><td className="p-2 text-center bg-blue-50">{p.entrada}</td><td className="p-2 text-center bg-blue-100 font-bold">{p.saida>0?`> ${p.saida}`:0}</td><td className="p-2 text-center font-black bg-yellow-100">{p.stockFinalArmazem}</td><td className="p-2 text-center bg-green-50">{p.stockInicialLoja}</td><td className="p-2 text-center bg-purple-100">{p.recepcao}</td><td className="p-2 text-center bg-orange-100">{p.vendaHoje}</td><td className="p-2 text-center font-black bg-green-100">{p.stockFinalLoja}</td><td className="p-2 text-center font-black bg-yellow-100">{p.stockTotal}</td><td className="p-2"><button onClick={()=>{ setProdutoSelecionado(p); setMostrarEntrada(true); }} className="bg-black text-white px-2 py-1 rounded-full text-[7px]">+ Reforçar</button></td></tr>)}</tbody></table></div></div>
            </div>
          </div>
        )}

        {negocioTab==='painel' && (
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-black text-[13px]">PAINEL DA LOJA - Perfil do proprietário - Alterar password, logo, funcionários - Mesmo stock</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div><label className="text-[10px] font-bold">NOME DA LOJA</label><input value={perfilEdit.nomeLoja} onChange={e=>setPerfilEdit({...perfilEdit, nomeLoja:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">NUIT</label><input value={perfilEdit.nuit} onChange={e=>setPerfilEdit({...perfilEdit, nuit:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[10px] font-bold">PROVINCIA</label><input value={perfilEdit.provincia} onChange={e=>setPerfilEdit({...perfilEdit, provincia:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">DISTRITO</label><input value={perfilEdit.distrito} onChange={e=>setPerfilEdit({...perfilEdit, distrito:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div><div><label className="text-[10px] font-bold">RAMO</label><input value={perfilEdit.ramo} onChange={e=>setPerfilEdit({...perfilEdit, ramo:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" /></div></div>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold">PASSWORD ATUAL</label><input type="password" value={perfilEdit.password} onChange={e=>setPerfilEdit({...perfilEdit, password:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="••••" /></div><div><label className="text-[10px] font-bold">NOVA PASSWORD</label><input type="password" value={perfilEdit.novaPassword} onChange={e=>setPerfilEdit({...perfilEdit, novaPassword:e.target.value})} className="w-full border rounded px-3 py-2 text-[12px]" placeholder="Nova" /></div></div>
                <div><label className="text-[10px] font-bold">LOGOTIPO - Vai aparecer em facturas</label><input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>setPerfilEdit({...perfilEdit, logoData: reader.result as any}); reader.readAsDataURL(file); }} className="w-full border rounded px-3 py-2 text-[11px] mt-1" />{perfilEdit.logoData && <img src={perfilEdit.logoData} className="w-16 h-16 mt-2 rounded border" />}</div>
                <button onClick={salvarPerfilLoja} className="w-full bg-[#1e2f4a] text-white py-2.5 rounded-full text-[12px] font-bold">Salvar Perfil - 100% Supabase</button>
              </div>
              <div className="border rounded-xl p-4"><h4 className="font-bold text-[12px]">Funcionários - 2 funcionários que vendem no caixa mas tiram do mesmo stock</h4><div className="mt-3 space-y-2"><input value={novoFunc.nome} onChange={e=>setNovoFunc({...novoFunc, nome:e.target.value})} placeholder="Nome funcionário" className="w-full border rounded px-3 py-2 text-[11px]" /><div className="grid grid-cols-2 gap-2"><input value={novoFunc.tel} onChange={e=>setNovoFunc({...novoFunc, tel:e.target.value})} placeholder="Telefone" className="border rounded px-3 py-2 text-[11px]" /><input value={novoFunc.password} onChange={e=>setNovoFunc({...novoFunc, password:e.target.value})} placeholder="Password" type="password" className="border rounded px-3 py-2 text-[11px]" /></div><select value={novoFunc.cargo} onChange={e=>setNovoFunc({...novoFunc, cargo:e.target.value})} className="w-full border rounded px-3 py-2 text-[11px]"><option>Vendedor Caixa</option><option>Gerente</option><option>Armazém</option></select><button onClick={()=>{ if(!novoFunc.nome||!novoFunc.tel) return; const lista=[...perfilEdit.funcionarios, {...novoFunc, id:Date.now()}]; setPerfilEdit({...perfilEdit, funcionarios: lista}); setNovoFunc({nome:'', tel:'', password:'', cargo:'Vendedor Caixa'}); }} className="w-full bg-[#facc15] text-black py-2 rounded-full text-[11px] font-bold">+ Adicionar Funcionário</button></div><div className="mt-4 space-y-1">{perfilEdit.funcionarios.map((f:any)=><div key={f.id} className="flex justify-between text-[11px] border-b py-1"><span>{f.nome} - {f.cargo}</span><span>{f.tel}</span></div>)}</div></div>
            </div>
          </div>
        )}

        
        {negocioTab==='vender' && (
          <div className="mt-3">
            <div className="bg-white border rounded-[12px] p-4">
              <div className="font-black text-[12px]">VENDER - Venda Rapida - Ligado ao Stock e Faturar</div>
              <div className="text-[8px] text-[#64748b] mt-1">Mesmo carrinho que Faturar - Quando vender aqui, baixa stock automatico - VERCEL EXACTO</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border rounded-[10px] p-3">
                  <div className="font-bold text-[10px]">Carrinho atual - {produtosFat.length} itens</div>
                  <div className="mt-2 space-y-1.5">
                    {produtosFat.map((p:any)=><div key={p.id} className="flex justify-between border-b pb-1 text-[10px]"><span>{p.nome} - CIMPOR v3</span><span className="font-bold">{(p.preco*p.qtd).toFixed(0)} MT</span></div>)}
                    {produtosFat.length===0 && <div className="text-[10px] text-gray-400 py-2">Saco de Cimento 50kg - CIMPOR v3 - 2550 MT<br/>Bloco 15cm - 40x20 x20 - 840 MT<br/><span className="text-[8px]">Adiciona no Faturar ou no Stock para aparecer aqui - mesmo carrinho</span></div>}
                  </div>
                  <div className="mt-3 flex gap-1 flex-wrap">{stockProdutos.slice(0,4).map(p=><button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="text-[8px] bg-black text-white px-2 py-1 rounded-full">{p.nome} - {p.precoUnit}MT</button>)}</div>
                </div>
                <div className="bg-[#f0fdf4] border border-green-200 rounded-[10px] p-4">
                  <div className="font-bold text-[10px]">Finalizar venda</div>
                  <div className="text-[8px] text-gray-500 mt-1">Cliente Balcao - tel: +258 84 123 4567</div>
                  <div className="mt-2"><div className="text-[8px] font-bold">TELEFONE / CLIENTE</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="mt-2"><div className="text-[8px] font-bold">NOME / EMPRESA</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Joao Manhique" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="font-black text-[14px] mt-3">TOTAL: {totalFat.toFixed(0)} MT</div>
                  <div className="text-[8px] text-gray-500">IVA {ivaTipo}% incluido - Subtotal {liqFat.toFixed(0)} + IVA {ivaVal.toFixed(0)}</div>
                  <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="w-full mt-3 bg-[#16a34a] text-white py-2.5 rounded-[8px] text-[10px] font-black">Confirmar venda - Baixar stock</button>
                  <button onClick={()=>salvarFaturaDuplaFuncao(true)} className="w-full mt-2 bg-[#facc15] border-2 border-black text-black py-2 rounded-[8px] text-[9px] font-black">DIVIDA - FIADO - Baixar stock</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {negocioTab==='relatorios' && (
          <div className="mt-3 space-y-3">
            <div className="bg-white border rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-1"><span className="text-[14px]">📊</span><span className="font-black text-[12px]">RELATORIO SIMPLES - Por Produto / Dia - VERCEL EXACTO</span></div>
              <div className="text-[8px] text-[#64748b] mb-3">Tabela: DATA | NOME PRODUTO | STOCK INICIAL | RECEPCAO | VENDAS | CLIENTE | QUANTI | VALOR | TOTAL com totais no fim - EXACTO VERCEL contrata-mz.vercel.app</div>
              <div className="grid grid-cols-4 gap-3">
                <div><div className="text-[8px] font-bold">PRODUTO</div><select className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option><option>Produto</option><option>caixa Agua vumba 1.5l</option><option>Exemplo - Cimento 42.5N 50kg</option></select></div>
                <div><div className="text-[8px] font-bold">GRUPO</div><select className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option><option>Cimento</option><option>Bebidas</option></select></div>
                <div><div className="text-[8px] font-bold">DATA INICIO</div><input type="date" className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
                <div><div className="text-[8px] font-bold">DATA FIM</div><input type="date" className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button className="px-4 h-8 bg-[#facc15] text-black border-2 border-black rounded-full text-[9px] font-black">🔍 SEARCH / REFRESH - FILTRAR TABELA POR DATA</button>
                <button className="px-4 h-8 bg-white border-2 border-black text-black rounded-full text-[9px] font-black">LIMPAR FILTRO</button>
                <button className="px-4 h-8 bg-[#1e2f4a] text-white rounded-full text-[9px] font-black">GERAR RELATORIO - PDF COM DIVIDAS + FILTRO DATA</button>
                <button className="px-4 h-8 bg-[#16a34a] text-white rounded-full text-[9px] font-black">ENVIAR WHATSAPP</button>
              </div>
            </div>
            <div className="bg-white border rounded-[12px] p-4">
              <div className="font-black text-[11px] mb-3">TABELA - DATA | PRODUTO | ST INICIAL | RECEPCAO | VENDAS | CLIENTE | QUANTI | VALOR | TOTAL - EXACTO PRINT</div>
              <div className="overflow-x-auto border rounded-[8px]">
                <table className="w-full text-[9px] min-w-[1100px]">
                  <thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">DATA</th><th className="p-2 text-left">NOME PRODUTO</th><th className="p-2 text-center">ST INICIAL</th><th className="p-2 text-center">RECEPCAO</th><th className="p-2 text-center">VENDAS</th><th className="p-2 text-left">CLIENTE</th><th className="p-2 text-center">QUANTI</th><th className="p-2 text-center">VALOR</th><th className="p-2 text-center bg-[#3b82f6]">VALOR DIVIDA</th><th className="p-2 text-center bg-[#facc15] text-black">TOTAL C/DIVIDAS</th></tr></thead>
                  <tbody>
                    <tr className="border-b"><td className="p-2">02/11/2026</td><td className="p-2 font-bold">Produto</td><td className="p-2 text-center bg-blue-50">20</td><td className="p-2 text-center">0</td><td className="p-2 text-center font-bold">1</td><td className="p-2">+258 84 123 4567</td><td className="p-2 text-center font-bold">1</td><td className="p-2 text-center">31320MT</td><td className="p-2 text-center bg-blue-50 font-bold">0MT</td><td className="p-2 text-center bg-yellow-50 font-black">31320MT</td></tr>
                    <tr className="border-b bg-[#f8fafc]"><td className="p-2">03/11/2026</td><td className="p-2 font-bold">caixa Agua vumba 1.5l</td><td className="p-2 text-center bg-blue-50">62</td><td className="p-2 text-center">20</td><td className="p-2 text-center font-bold">14</td><td className="p-2">+258 84 123 4567</td><td className="p-2 text-center font-bold">10</td><td className="p-2 text-center">100MT</td><td className="p-2 text-center bg-blue-50 font-bold">1000MT</td><td className="p-2 text-center bg-yellow-50 font-black">1000MT</td></tr>
                    <tr className="border-b"><td className="p-2">03/11/2026</td><td className="p-2 font-bold">caixa Agua vumba 1.5l</td><td className="p-2 text-center bg-blue-50">62</td><td className="p-2 text-center">20</td><td className="p-2 text-center font-bold">14</td><td className="p-2">Nordino Mungoi</td><td className="p-2 text-center font-bold">8</td><td className="p-2 text-center">100MT</td><td className="p-2 text-center bg-blue-50 font-bold">800MT</td><td className="p-2 text-center bg-yellow-50 font-black">800MT</td></tr>
                    <tr className="border-b bg-[#f8fafc]"><td className="p-2">03/11/2026</td><td className="p-2 font-bold">Exemplo - Cimento 42.5N 50kg</td><td className="p-2 text-center bg-blue-50">20</td><td className="p-2 text-center">50</td><td className="p-2 text-center font-bold">18</td><td className="p-2">Aderito Moises</td><td className="p-2 text-center font-bold">5</td><td className="p-2 text-center">850MT</td><td className="p-2 text-center bg-blue-50 font-bold">4250MT</td><td className="p-2 text-center bg-yellow-50 font-black">4250MT</td></tr>
                  </tbody>
                  <tfoot><tr className="bg-[#facc15] font-black text-[9px]"><td className="p-2" colSpan={2}>TOTAIS GERAIS: ST.678 REC.989 V.414</td><td className="p-2 text-center">164</td><td className="p-2 text-center">70</td><td className="p-2 text-center">47</td><td className="p-2"></td><td className="p-2 text-center">24</td><td className="p-2"></td><td className="p-2 text-center bg-blue-200">6050MT</td><td className="p-2 text-center bg-yellow-300">37370MT</td></tr></tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
        {(negocioTab==='clientes' || negocioTab==='fornecedores' || negocioTab==='caixa') && (
          <div className="mt-3 bg-white rounded-[12px] border p-8 text-center">
            <div className="text-[14px]">{negocioTab==='clientes'?'👥 CLIENTES': negocioTab==='fornecedores'?'🚚 FORNECEDORES':'💰 CAIXA & TURNOS'}</div>
            <div className="font-black text-[12px] mt-2">{negocioTab.toUpperCase()} - Em desenvolvimento - Preservado - Stock {stockProdutos.length} - Faturas {faturas.length}</div>
            <div className="text-[10px] text-gray-500 mt-2">Esta aba nao foi mexida - Painel, Faturar, Vender, Stock e Relatorios ja bons - Vercel exacto</div>
            <button onClick={()=>setNegocioTab('faturar')} className="mt-4 px-6 py-2 bg-[#1e2f4a] text-white rounded-full text-[10px] font-bold">Ir para Faturar - Vercel Exacto</button>
          </div>
        )}

{mostrarNovoItem && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-md p-5"><h3 className="font-bold text-[13px]">+ Novo Item - Só iniciais</h3><div className="grid grid-cols-2 gap-2 mt-3"><input value={formNovoItem.codigo} onChange={e=>setFormNovoItem({...formNovoItem, codigo:e.target.value})} placeholder="COD" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.nome} onChange={e=>setFormNovoItem({...formNovoItem, nome:e.target.value})} placeholder="Nome" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.preco} onChange={e=>setFormNovoItem({...formNovoItem, preco:e.target.value})} placeholder="Preço" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialArmazem} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialArmazem:e.target.value})} placeholder="Stock Inicial Arm" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialLoja} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialLoja:e.target.value})} placeholder="Stock Inicial Loja" className="border rounded px-2 py-2 text-[11px]" /></div><div className="flex gap-2 mt-4"><button onClick={()=>setMostrarNovoItem(false)} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={salvarNovoItemReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Criar</button></div></div></div>)}
        {mostrarEntrada && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Entrada [F5]</h3><input value={qtdEntrada} onChange={e=>setQtdEntrada(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarEntrada(false); setProdutoSelecionado(null); setQtdEntrada(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerEntradaReal} className="flex-1 bg-yellow-400 text-black py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}
        {mostrarSaida && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Saída - {tipoSaida}</h3><div className="flex gap-1 mt-2"><button onClick={()=>setTipoSaida('saida_usa')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='saida_usa'?'bg-red-500 text-white':'bg-gray-100'}`}>Saída USA</button><button onClick={()=>setTipoSaida('transferencia')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='transferencia'?'bg-blue-500 text-white':'bg-gray-100'}`}>Transferência Armazém→Loja</button></div><input value={qtdSaida} onChange={e=>setQtdSaida(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarSaida(false); setProdutoSelecionado(null); setQtdSaida(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerSaidaReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}{mostrarProdutosCheio && (<div className="fixed inset-0 bg-white z-[100] flex flex-col"><div className="p-3 border-b flex items-center justify-between gap-2"><div><div className="font-black text-[15px]">🛒 Produtos</div><div className="text-[11px] text-gray-500">{stockProdutos.length} produtos - Toca num produto para adicionar</div></div><button onClick={()=>setMostrarProdutosCheio(false)} className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap">✕ Fechar</button></div><div className="p-3 border-b"><div className="relative"><span className="absolute left-3 top-2.5 text-[13px]">🔍</span><input autoFocus value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Procurar... ex: Cimento" className="w-full h-10 border rounded-full pl-9 pr-3 text-[13px] bg-[#f8fafc]" /></div><div className="mt-2 text-[11px]">Carrinho: <b>{produtosFat.length} itens - {totalFat.toFixed(0)} MT</b></div></div><div className="flex-1 overflow-y-auto p-3 space-y-2">{stockProdutos.filter(p=>!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())).map(p=>(<button key={p.id} onClick={()=>{ adicionarAoFaturar(p); }} className="w-full text-left bg-white border rounded-[12px] p-3 flex justify-between items-center gap-2"><span className="min-w-0"><span className="block font-bold text-[13px] truncate">{p.nome}</span><span className="block text-[11px] text-gray-500">{p.codigo||''} - Stock: {p.stockFinalLoja}</span></span><span className="text-right shrink-0"><span className="block font-black text-[13px]">{p.precoUnit} MT</span><span className="block bg-[#16a34a] text-white text-[11px] font-bold px-3 py-1 rounded-full mt-1">+ Adicionar</span></span></button>))}{stockProdutos.filter(p=>!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())).length===0 && <div className="text-center text-[12px] text-gray-400 py-6">Nenhum produto - muda a busca</div>}</div><div className="p-3 border-t bg-white"><button onClick={()=>setMostrarProdutosCheio(false)} className="w-full bg-[#16a34a] text-white py-3 rounded-full text-[13px] font-bold">✓ Voltar ao Faturar - {produtosFat.length} itens - {totalFat.toFixed(0)} MT</button></div></div>)}

      </div>
    </div>
  )
}