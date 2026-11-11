
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
  // RELATORIO REAL - filtros (não mock)
  const [relFiltroProduto, setRelFiltroProduto] = useState('Todos');
  const [relFiltroGrupo, setRelFiltroGrupo] = useState('Todos');
  const [relDataInicio, setRelDataInicio] = useState('');
  const [relDataFim, setRelDataFim] = useState('');
  const [relAplicado, setRelAplicado] = useState(false);
  const [fornecedores, setFornecedores] = useState<any[]>([]); // REAL: carregado por loja (conta_id) - loja nova nao ve fornecedores da outra
  const [formForn, setFormForn] = useState({nome:'', tel:'', produto:'', nota:''});
  const [caixaTurno, setCaixaTurno] = useState<'Manha'|'Tarde'|'Noite'>('Manha');
  const [armazemAtivo, setArmazemAtivo] = useState('Todos');
  const [mostrarNovoItem, setMostrarNovoItem] = useState(false);
  // REGRA FIXA - LAPTOP NÃO MEXER: Faturar é página única, sem Mais Vendidos, sem Passo 1/2.
  // Qualquer tela de telefone futura tem de usar isMobile abaixo e NUNCA esconder o bloco
  // Produtos + ITENS + WhatsApp/DIVIDAS + botão Descarregar PDF da fatura.
  const [isMobile, setIsMobile] = useState(typeof window!=='undefined' ? window.innerWidth<768 : false);
  useEffect(()=>{ const f=()=>setIsMobile(window.innerWidth<768); window.addEventListener('resize',f); return ()=>window.removeEventListener('resize',f); },[]);
  const [mostrarEntrada, setMostrarEntrada] = useState(false);
  // V26: 1) tela cheia de produtos  2) azul (cliente) escondido SO no telefone, atras do botao vermelho
  const [mostrarProdutosCheio, setMostrarProdutosCheio] = useState(false);
  // Tela de produtos = V22 exacto: Lista / Grelha + categorias
  const [vistaProdutos, setVistaProdutos] = useState<'lista'|'grelha'>('grelha');
  const [catProdutos, setCatProdutos] = useState('Todos');
  const [mostrarClienteFat, setMostrarClienteFat] = useState(false);
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
  const [formLojaLogin, setFormLojaLogin] = useState({nomeLoja:'', tel:'', password:'', nuit:'', endereco:'', provincia:'', distrito:'', ramo:'', logoData:''}); // REAL: loja nova comeca vazia, sem dados da loja anterior

  const criarContaLoja = async () => {
    if(!formLojaLogin.nomeLoja || !formLojaLogin.tel || !formLojaLogin.password){ alert('Nome, Telefone e Password'); return; }
    const conta_id = `conta_${Date.now()}`;
    const novaLoja:any = { conta_id, nome_loja: formLojaLogin.nomeLoja, username: formLojaLogin.tel, password: formLojaLogin.password, nuit: formLojaLogin.nuit, endereco: formLojaLogin.endereco, provincia: formLojaLogin.provincia, cidade: formLojaLogin.distrito, ramo: formLojaLogin.ramo, logoData: formLojaLogin.logoData };
    try{
      const { error } = await supabase.from('lojas').insert([novaLoja]);
      if(error){ console.log(error); }
      localStorage.setItem('loja_sessao', JSON.stringify(novaLoja));
      setLojaLogada(novaLoja);
      setPerfilEdit({nomeLoja:novaLoja.nome_loja||'', nuit:novaLoja.nuit||'', endereco:novaLoja.endereco||'', provincia:novaLoja.provincia||'', distrito:novaLoja.cidade||'', ramo:novaLoja.ramo||'', tel:novaLoja.username||'', password:'', novaPassword:'', logoData:novaLoja.logoData||'', funcionarios: []});
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
    setPerfilEdit({nomeLoja:loja.nome_loja||'', nuit:loja.nuit||'', endereco:loja.endereco||'', provincia:loja.provincia||'', distrito:loja.cidade||'', ramo:loja.ramo||'', tel:loja.username||'', password:'', novaPassword:'', logoData:loja.logoData||'', funcionarios: loja.funcionarios||[]});
    carregarTudo(loja.conta_id);
  };

  const [novoFunc, setNovoFunc] = useState({nome:'', tel:'', password:'', cargo:'Vendedor Caixa'});

  // V31 - RAMOS COMPLETOS + IA CRIAR PRODUTOS COM REVISAO: nada entra com stock inventado.
  const RAMOS_ATIVIDADE = ['Ferragem e Material de Construcao','Mercearia e Mini Mercado','Boutique e Vestuario','Farmacia','Restaurante e Take Away','Padaria e Pastelaria','Talhao e Bebidas','Papelaria e Livraria','Cosmetica e Beleza','Eletronica e Telemoveis','Informatica e Acessorios','Eletrodomesticos','Auto Pecas e Oficina','Lubrificantes e Baterias','Agropecuaria e Racoes','Sementes e Fertilizantes','Material Escolar','Brinquedos','Moveis e Decoracao','Material Eletrico','Canalizacao e Hidraulica','Tintas e Vernizes','Vidros e Aluminio','Carpintaria e Marcenaria','Serralharia','Grafica e Impressao','Foto e Video','Florista e Presentes','Ourivesaria e Bijuteria','Otica','Clinica e Saude','Ginasio e Desporto','Pet Shop','Lava Jato e Car Wash','Salao de Beleza e Barbeiro','Cabeleireiro','Confeitaria','Cafe e Bar','Lanchonete','Acougue e Talho','Peixaria','Frutaria e Legumes','Armazem e Atacado','Distribuidora','Ferragem e Ferramentas','Construcao Civil','Outro'];
  const CATALOGO_IA:any = {
    'Ferragem e Material de Construcao': ['Cimento 50kg','Cimento 25kg','Varao 6mm 6m','Varao 8mm 6m','Varao 10mm 6m','Varao 12mm 6m','Varao 16mm 6m','Arame Recozido 1kg','Arame Farpado 500m','Prego 2 polegadas 1kg','Prego 3 polegadas 1kg','Prego 4 polegadas 1kg','Chapa Zinco 2m','Chapa Zinco 3m','Chapa Ondulada 2m','Tubo PVC 50mm','Tubo PVC 75mm','Tubo PVC 110mm','Tubo Galvanizado 1/2','Tubo Galvanizado 3/4','Bloco 15cm','Bloco 20cm','Tijolo 15cm','Areia 1m3','Brita 1m3','Cal Hidratada 20kg','Tinta Branca 5L','Tinta Branca 20L','Tinta Cor 5L','Massa Corrida 20kg','Lixa 80','Lixa 120','Fechadura Porta','Dobradica 3 polegadas','Cadeado 40mm','Cadeado 50mm','Parafuso 4x40 100un','Bucha 8mm 100un','Serra Manual','Martelo','Chave de Fenda','Alicate Universal','Trena 5m','Balde 20L','Pa','Enxada','Carro de Mao','Escada 6m','Mangueira 20m'],
    'Mercearia e Mini Mercado': ['Arroz 10kg','Arroz 25kg','Arroz 5kg','Feijao 1kg','Feijao 5kg','Acuar 1kg','Acuar 5kg','Farinha 1kg','Farinha 5kg','Oleo 1L','Oleo 5L','Sal 1kg','Massa Espaguete 500g','Massa Macarrao 500g','Leite em Po 400g','Leite UHT 1L','Cha 100g','Cafe 250g','Bolacha Maria','Bolacha Agua e Sal','Chocolate 100g','Sumo 1L','Refrigerante 500ml','Refrigerante 1L','Agua 500ml','Agua 5L','Cerveja 330ml','Vinho 750ml','Conserva Atum','Conserva Sardinha','Milho 1kg','Ervilha 400g','Tomate Pelado 400g','Ketchup 500g','Maionese 500g','Mostarda 300g','Vinagre 750ml','Pimenta 100g','Alho 500g','Cebola 1kg','Batata 1kg','Sabao em Po 1kg','Sabao em Barra','Detergente 1L','Lixivia 1L','Papel Higienico 4 rolos','Fralda M 20un','Fralda G 20un','Pasta de Dentes','Sabonete','Shampoo 400ml'],
    'Farmacia': ['Paracetamol 500mg 20comp','Ibuprofeno 400mg 20comp','Amoxicilina 500mg','Vitamina C 1000mg','Xarope Tosse 120ml','Pomada 30g','Alcool 70% 500ml','Algodao 100g','Gaze 10un','Pensio Rapido 20un','Soro Fisiologico 500ml','Omeprazol 20mg','Diclofenac Gel 50g','Antigripal 20comp','Anti-histaminico 10comp','Protetor Solar 50','Creme Hidratante 200ml','Termometro Digital','Mascara 50un','Luvas 100un'],
    'Boutique e Vestuario': ['Camiseta M','Camiseta G','Camiseta P','Calca Jeans 32','Calca Jeans 34','Calca Jeans 36','Vestido M','Vestido G','Saia M','Camisa Social M','Camisa Social G','Casaco M','Casaco G','Tenis 40','Tenis 41','Tenis 42','Tenis 43','Sandalias 38','Sandalias 39','Sandalias 40','Meia 3 pares','Cinto','Bone','Mala','Carteira','Cueca M','Cueca G','Soutien M','Meia-calca','Blusa M'],
    'Restaurante e Take Away': ['Frango Grelhado','Carne Grelhada','Peixe Grelhado','Arroz de Frango','Arroz de Carne','Massa a Bolonhesa','Pizza Media','Pizza Grande','Hamburger','Prego no Pao','Sandes de Frango','Batata Frita','Salada Mista','Sopa do Dia','Feijoada','Xima com Caril','Refrigerante 330ml','Sumo Natural 500ml','Agua 500ml','Cerveja 330ml','Sobremesa do Dia','Cafe','Cha','Bolo de Chocolate','Pudim'],
    'Papelaria e Livraria': ['Caderno A4 100fl','Caderno A5 80fl','Caneta Azul','Caneta Preta','Caneta Vermelha','Lapis HB','Borracha','Regua 30cm','Tesoura','Cola 100ml','Fita Cola','Papel A4 500fl','Envelope A4 10un','Marcador','Corretor','Mochila Escolar','Estojo','Calculadora','Dicionario','Livro Infantil','Caderno de Desenho'],
    'Cosmetica e Beleza': ['Shampoo 400ml','Condicionador 400ml','Creme de Pentear','Oleo de Coco 200ml','Pomada Capilar','Base Facial','Batom','Mascara de Cilios','Esmalte','Removedor 100ml','Sabonete Facial','Creme Hidratante 200ml','Perfume 50ml','Desodorizante 150ml','Pincel de Maquilhagem','Esponja','Secador de Cabelo','Prancha de Cabelo','Tesoura de Cabelo','Pente'],
    'Eletronica e Telemoveis': ['Carregador USB','Cabo USB 1m','Cabo USB 2m','Fone de Ouvido','Auricular Bluetooth','Capa Telemovel','Película Vidro','Power Bank 10000mAh','Cartao SD 32GB','Cartao SD 64GB','Lampada LED 9W','Lampada LED 12W','Extensao 3m','Pilhas AA 4un','Pilhas AAA 4un','Radio FM','Coluna Bluetooth','Telemovel Basico','Smartphone','Relogio Digital'],
  };
  const [mostrarIaProdutos, setMostrarIaProdutos] = useState(false);
  const [iaRamo, setIaRamo] = useState('Mercearia e Mini Mercado');
  const [iaQtd, setIaQtd] = useState(20);
  const [iaLista, setIaLista] = useState<any[]>([]);
  const gerarIaLista = () => {
    const base = CATALOGO_IA[iaRamo] || [];
    const lista = Array.from({length: iaQtd}, (_, i) => {
      const nome = base[i] || `${iaRamo} - Produto ${i+1}`;
      return { nome, codigo: `IA-${String(i+1).padStart(3,'0')}`, preco: '', stockArm: '', stockLoja: '' };
    });
    setIaLista(lista);
  };
  const salvarIaLista = async () => {
    const falta = iaLista.filter((r:any)=> !r.nome || r.preco==='' || r.preco===null);
    if(falta.length>0){ alert('Preenche o PRECO de todos os produtos antes de guardar. O preco e o stock sao teus numeros.'); return; }
    if(!confirm(`Guardar ${iaLista.length} produtos no Stock com os TEUS precos e stocks?`)) return;
    for(const r of iaLista){
      const novo:any = { conta_id: lojaLogada.conta_id, codigo: r.codigo, nome: r.nome, cat: iaRamo, preco: parseFloat(r.preco)||0, stock_armazem: parseInt(r.stockArm)||0, stock_loja: parseInt(r.stockLoja)||0, stock_inicial_armazem: parseInt(r.stockArm)||0, stock_inicial_loja: parseInt(r.stockLoja)||0, entrada:0, saida:0, recepcao:0, venda_hoje:0, armazem:'Matola - Principal', marca:'' };
      const { error } = await supabase.from('produtos_loja').insert([novo]);
      if(error){ alert('Erro a guardar: '+error.message); return; }
    }
    alert(`${iaLista.length} produtos guardados no Stock com os teus numeros!`);
    setMostrarIaProdutos(false); setIaLista([]); carregarTudo(lojaLogada.conta_id);
  };

  // V28 - PRECO SO DONO (opcao A): mudar preco pede a password da conta da loja. Sem ela, ninguem muda.
  const [mostrarMudarPreco, setMostrarMudarPreco] = useState(false);
  const [senhaDono, setSenhaDono] = useState('');
  const [precoDonoOk, setPrecoDonoOk] = useState(false);
  const [buscaPreco, setBuscaPreco] = useState('');
  const [novoPrecoPorId, setNovoPrecoPorId] = useState<any>({});
  const [historicoPrecos, setHistoricoPrecos] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem(`precos_historico_${JSON.parse(localStorage.getItem('loja_sessao')||'{}').conta_id||''}`)||'[]'); }catch(e){ return []; } });
  const verificarSenhaDono = async () => {
    let senhaCerta = lojaLogada?.password||'';
    if(!senhaCerta){ const { data } = await supabase.from('lojas').select('password').eq('conta_id', lojaLogada.conta_id).limit(1); senhaCerta = data?.[0]?.password||''; }
    if(senhaDono && senhaDono===senhaCerta){ setPrecoDonoOk(true); setSenhaDono(''); }
    else alert('Password errada - So o dono muda preco.');
  };
  const salvarNovoPreco = async (prod:any) => {
    const novo = Number(novoPrecoPorId[prod.id]);
    if(!novo || novo<=0){ alert('Mete um preco valido'); return; }
    if(!confirm(`Mudar preco de ${prod.nome}: ${prod.precoUnit}MT -> ${novo}MT ?`)) return;
    const { error } = await supabase.from('produtos_loja').update({ preco: novo }).eq('id', prod.id);
    if(error){ alert('Erro mudar preco: '+error.message); return; }
    const reg = { produto: prod.nome, codigo: prod.codigo||'', antigo: prod.precoUnit, novo, data: new Date().toLocaleString('pt-MZ') };
    const lista = [reg, ...historicoPrecos].slice(0, 30);
    setHistoricoPrecos(lista);
    try{ localStorage.setItem(`precos_historico_${lojaLogada.conta_id}`, JSON.stringify(lista)); }catch(e){}
    setNovoPrecoPorId({...novoPrecoPorId, [prod.id]: ''});
    alert(`Preco mudado! ${prod.nome}: ${prod.precoUnit}MT -> ${novo}MT`);
    carregarTudo(lojaLogada.conta_id);
  };

  useEffect(()=>{
    const sessao = localStorage.getItem('loja_sessao');
    if(sessao){ try{ const l=JSON.parse(sessao); setLojaLogada(l); carregarTudo(l.conta_id); setPerfilEdit({nomeLoja:l.nome_loja||'', nuit:l.nuit||'', endereco:l.endereco||'', provincia:l.provincia||'', distrito:l.cidade||'', ramo:l.ramo||'', tel:l.username||'', password:'', novaPassword:'', logoData:l.logoData||'', funcionarios: l.funcionarios||[]}); }catch(e){} }
  },[]);
  useEffect(()=>{ if(lojaLogada?.conta_id){ try{ const v=JSON.parse(localStorage.getItem(`loja_fornecedores_${lojaLogada.conta_id}`)||'[]'); setFornecedores(v); }catch(e){ setFornecedores([]); } } },[lojaLogada?.conta_id]);

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
    if(!produtoSelecionado){ alert('Escolhe o produto primeiro - abre o seletor no topo do modal.'); return; }
    if(!qtdEntrada){ alert('Escreve a quantidade.'); return; }
    const qtd = parseInt(qtdEntrada)||0;
    const novoEntrada = produtoSelecionado.entrada + qtd;
    const novoFinalArm = produtoSelecionado.stockInicialArmazem + novoEntrada - produtoSelecionado.saida;
    await supabase.from('produtos_loja').update({ entrada: novoEntrada, stock_armazem: novoFinalArm }).eq('id', produtoSelecionado.id);
    alert(`Entrada [F5] - ${qtd} - finalArm ${novoFinalArm}`); setMostrarEntrada(false); setQtdEntrada(''); setProdutoSelecionado(null); carregarTudo(lojaLogada.conta_id);
  };

  const fazerSaidaReal = async () => {
    if(!produtoSelecionado){ alert('Escolhe o produto primeiro - abre o seletor no topo do modal.'); return; }
    if(!qtdSaida){ alert('Escreve a quantidade.'); return; }
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

  // NUMERO FATURA - 01TM06/11/26 : 01=numero do dia+turno, TM=turno, 06/11/26=data. Reinicia cada dia e cada turno.
  const gerarNumeroFatura = (turnoNome:string) => {
    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2,'0');
    const mm = String(hoje.getMonth()+1).padStart(2,'0');
    const yy = String(hoje.getFullYear()).slice(2);
    const dataCurta = `${dd}/${mm}/${yy}`;
    const codTurno = turnoNome==='Manha' ? 'TM' : turnoNome==='Tarde' ? 'TT' : 'TN';
    const hojeISO = hoje.toISOString().slice(0,10);
    const hojePT = hoje.toLocaleDateString('pt-MZ');
    const count = (faturas||[]).filter((fat:any)=>{
      const nf = String(fat.numero_fatura||'');
      if(nf && nf.includes(codTurno+dataCurta)) return true;
      if(nf) return false;
      const d = String(fat.data||fat.created_at||'');
      const isHoje = d.slice(0,10)===hojeISO || d.includes(hojePT) || d.includes(`${dd}/${mm}/${hoje.getFullYear()}`);
      return isHoje;
    }).length;
    const seq = String(count+1).padStart(2,'0');
    return `${seq}${codTurno}${dataCurta}`;
  };
  // PDF VERDADEIRO - sem biblioteca, gera PDF real .pdf (nao HTML)
  const criarPdfBlob = (titulo:string, linhas:string[]) => {
    const esc = (s:string)=> s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E\u00C0-\u00FF]/g,' ');
    let content = 'BT /F1 11 Tf 40 780 Td 14 TL ';
    content += `(${esc(titulo)}) Tj T* T* `;
    linhas.forEach((l:string)=>{ const partes = l.match(/.{1,95}/g) || [l]; partes.forEach((p:string)=>{ content += `(${esc(p)}) Tj T* `; }); });
    content += 'ET';
    const objs:string[] = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objs[5] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    let pdf = '%PDF-1.4\n';
    const offsets:number[] = [0];
    for(let i=1;i<=5;i++){ offsets[i]=pdf.length; pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xrefPos = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    for(let i=1;i<=5;i++){ pdf += String(offsets[i]).padStart(10,'0') + ' 00000 n \n'; }
    pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF';
    return new Blob([pdf], {type:'application/pdf'});
  };
  // V27 - PDF REAL da fatura com TABELA (09/11): logotipo em texto, faixa amarela fina, tabela DESCRICAO|QTD|PRECO|DESC%|SUBTOTAL
  const gerarPdfFatura = (d:any) => {
    const limpa = (s:any)=> String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^ -~]/g,' ');
    const esc = (s:any)=> limpa(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    const txt = (f:string, sz:number, x:number, y:number, t:any)=> `0 0 0 rg BT /${f} ${sz} Tf 1 0 0 1 ${x} ${y} Tm (${esc(t)}) Tj ET `;
    const rect = (x:number, y:number, w:number, h:number, r:number, g:number, b:number, fill:boolean)=> `${r} ${g} ${b} ${fill?'rg':'RG'} ${x} ${y} ${w} ${h} re ${fill?'f':'S'} `;
    const linha = (x1:number, y1:number, x2:number, y2:number)=> `0.5 0.5 0.5 RG ${x1} ${y1} m ${x2} ${y2} l S `;
    let c = '';
    // Cabecalho loja - LOGO embutido no PDF (igual ao preview): foto JPEG ou circulo azul com a letra
    if(logoBin){
      c += `q 60 0 0 60 40 765 cm /Im1 Do Q `;
    } else {
      c += `0.12 0.18 0.29 rg 40 765 60 60 re f 1 1 1 rg BT /F2 26 Tf 1 0 0 1 60 785 Tm (${esc(String(d.loja||'A').charAt(0))}) Tj ET `;
    }
    c += txt('F2', 15, 110, 800, d.loja);
    c += txt('F1', 9, 110, 786, 'NUIT: ' + d.nuit + ' | Tel: +' + d.telLoja);
    c += txt('F1', 9, 110, 774, d.endereco);
    // Cliente (direita)
    c += txt('F1', 9, 330, 800, 'Cliente: ' + d.cliente);
    c += txt('F1', 9, 330, 788, 'Tel: ' + d.telCliente);
    c += txt('F1', 9, 330, 776, 'NUIT: ' + d.nuitCliente);
    c += txt('F1', 9, 330, 764, 'Data: ' + d.data);
    c += txt('F1', 9, 330, 752, 'Fatura No: ' + d.numero);
    c += txt('F1', 9, 330, 740, 'Turno: ' + d.turno);
    c += txt('F1', 9, 330, 728, 'Status: ' + d.status);
    c += txt('F1', 9, 330, 716, 'Vendido por: Dono');
    // Faixa amarela FINA
    c += rect(40, 696, 515, 14, 0.98, 0.8, 0.08, true);
    c += txt('F2', 11, 40, 700, 'Factura No: ' + d.numero);
    // Tabela - cabecalho
    const x0=40, xQ=330, xP=380, xD=440, xS=490, xF=555;
    const yTop=680;
    c += rect(x0, yTop-12, xF-x0, 14, 0.94, 0.96, 0.98, true);
    c += txt('F2', 9, x0+4, yTop-8, 'DESCRICAO');
    c += txt('F2', 9, xQ, yTop-8, 'QTD');
    c += txt('F2', 9, xP, yTop-8, 'PRECO');
    c += txt('F2', 9, xD, yTop-8, 'DESC%');
    c += txt('F2', 9, xS, yTop-8, 'SUBTOTAL');
    let y = yTop - 14;
    d.itens.forEach((it:any)=>{
      y -= 14;
      c += txt('F1', 9, x0+4, y, (it.nome + (it.codigo ? ' - ' + it.codigo : '')).slice(0, 48));
      c += txt('F1', 9, xQ, y, String(it.qtd));
      c += txt('F1', 9, xP, y, Number(it.preco).toFixed(0) + 'MT');
      c += txt('F1', 9, xD, y, Number(it.desc||0) + '%');
      c += txt('F1', 9, xS, y, Number(it.sub).toFixed(0) + 'MT');
      c += linha(x0, y-3, xF, y-3);
    });
    // Grelha vertical da tabela
    [x0, xQ-4, xP-4, xD-4, xS-4, xF].forEach((x:number)=>{ c += linha(x, yTop+2, x, y-3); }); // grelha vertical ate ao fim dos totais
    c += linha(x0, yTop+2, xF, yTop+2);
    // Totais DENTRO da tabela, na ultima coluna (onde o dono circulou a verde) - nao fora em letra clara
    const linhasTot = [
      { label: 'Subtotal', valor: Number(d.subtotal).toFixed(0) + 'MT', bold: false },
      { label: 'Desconto', valor: '-' + Number(d.desconto).toFixed(0) + 'MT', bold: false },
      { label: 'Subtotal liq.', valor: Number(d.subtotalLiq).toFixed(0) + 'MT', bold: false },
      { label: 'IVA (' + d.ivaPerc + '%)', valor: Number(d.ivaValor).toFixed(0) + 'MT', bold: false },
      { label: 'TOTAL', valor: Number(d.total).toFixed(0) + 'MT', bold: true },
    ];
    linhasTot.forEach((lt:any, idx:number)=>{
      y -= 15;
      if(idx===linhasTot.length-1){ c += rect(x0, y-3, xF-x0, 15, 0.98, 0.8, 0.08, true); }
      c += txt(lt.bold?'F2':'F1', lt.bold?11:9, x0+4, y, lt.label);
      c += txt(lt.bold?'F2':'F1', lt.bold?11:9, xS, y, lt.valor);
      c += linha(x0, y-3, xF, y-3);
    });
    y -= 3;
    const objs:string[] = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = logoBin ? '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> /XObject << /Im1 7 0 R >> >> /Contents 5 0 R >>' : '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >>';
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objs[5] = `<< /Length ${c.length} >>\nstream\n${c}\nendstream`;
    objs[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
    const totalObjs = logoBin ? 7 : 6;
    const logoBin = d.logoJpeg ? (()=>{ try{ return atob(d.logoJpeg); }catch(e){ return ''; } })() : '';
    if(logoBin){ objs[7] = `<< /Type /XObject /Subtype /Image /Width ${d.logoW||120} /Height ${d.logoH||120} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBin.length} >>\nstream\n${logoBin}\nendstream`; }
    let pdf = '%PDF-1.4\n';
    const offsets:number[] = [0];
    for(let i=1;i<=totalObjs;i++){ offsets[i]=pdf.length; pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xrefPos = pdf.length;
    pdf += `xref\n0 ${totalObjs+1}\n0000000000 65535 f \n`;
    for(let i=1;i<=totalObjs;i++){ pdf += String(offsets[i]).padStart(10,'0') + ' 00000 n \n'; }
    pdf += `trailer\n<< /Size ${totalObjs+1} /Root 1 0 R >>\nstartxref\n` + xrefPos + '\n%%EOF';
    const bytes = new Uint8Array(pdf.length); for(let bi=0; bi<pdf.length; bi++) bytes[bi] = pdf.charCodeAt(bi) & 0xFF;
    return new Blob([bytes], {type:'application/pdf'});
    // V30 - retorno ja feito acima em bytes
  };
  // ANULAR FATURA - volta stock, tira de tudo (Caixa, Clientes, Relatorios)
  const anularFatura = async (fat:any) => {
    if(!confirm(`Anular ${fat.numero_fatura || 'fatura'} - ${fat.cliente} - ${fat.total}MT ? O stock vai voltar!`)) return;
    const prods = Array.isArray(fat.produtos) ? fat.produtos : [];
    for(let item of prods){
      const prod = stockProdutos.find((pr:any)=> pr.id===item.id || pr.nome===item.nome);
      if(prod){
        const novaVenda = Math.max(0, (prod.vendaHoje||0) - Number(item.qtd||0));
        const novoFinal = (prod.stockInicialLoja||0) + (prod.recepcao||0) - novaVenda;
        await supabase.from('produtos_loja').update({ venda_hoje: novaVenda, stock_loja: novoFinal }).eq('id', prod.id);
      }
    }
    const { error } = await supabase.from('faturas_loja').update({ status: 'ANULADA', is_divida: false }).eq('id', fat.id);
    if(error){ alert('Erro anular: '+error.message); return; }
    alert(`Fatura ANULADA! Stock voltou!`);
    carregarTudo(lojaLogada.conta_id);
  };
  // BOTAO FATURAS (ao lado de PRODUTOS): desce logo para Faturas Recentes - Anular, sem sair de Faturar
  const irParaFaturas = () => { setNegocioTab('faturar'); setTimeout(()=>{ document.getElementById('faturas-recentes')?.scrollIntoView({behavior:'smooth', block:'start'}); }, 120); };
  const salvarFaturaDuplaFuncao = async (isDivida:boolean) => {
    if(produtosFat.length===0){ alert('Adicione produtos'); return; }
    // V28 - SEM CONDICAO: fatura baixa SEMPRE, mesmo sem telefone/nome do cliente. Cliente vazio = Cliente Balcao. Se houver numero WhatsApp, tambem envia para esse numero.
    const subtotalBruto = produtosFat.reduce((s,p)=>s+p.preco*p.qtd,0);
    const descontoItens = produtosFat.reduce((s,p)=>s+p.preco*p.qtd*p.desc/100,0);
    const subtotalLiquido = subtotalBruto - descontoItens;
    const ivaPerc = ivaTipo==='16'?16: ivaTipo==='5'?5:0;
    const ivaValor = subtotalLiquido * ivaPerc / 100;
    const total = subtotalLiquido + ivaValor;
    // FIX: NÃO enviar ivaTipo para Supabase, só dados que existem
    const numeroFatura = gerarNumeroFatura(caixaTurno);
    const nomeClienteFatura = (nomeFat||telFat||'Cliente Balcao').trim();
    const nova:any = { conta_id: lojaLogada.conta_id, cliente: nomeFat||telFat||'Cliente Balcao', tel: telFat, nuit: nuitFat||null, produtos: produtosFat, total, status: isDivida?'DIVIDA':'PAGO', is_divida: isDivida, data: new Date().toLocaleString('pt-MZ') }; // FIX: numero_fatura e turno sao SO locais para PDF/WhatsApp/nome ficheiro, NAO gravam no Supabase - igual ivaTipo
    const { error } = await supabase.from('faturas_loja').insert([nova]);
    if(error){ alert('Erro fatura: '+error.message); return; }
    for(let item of produtosFat){
      const prod = stockProdutos.find(pr=>pr.id===item.id);
      if(prod){ const novaVenda = prod.vendaHoje + item.qtd; const novoFinalLoja = prod.stockInicialLoja + prod.recepcao - novaVenda; await supabase.from('produtos_loja').update({ venda_hoje: novaVenda, stock_loja: novoFinalLoja }).eq('id', prod.id); }
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}</title><style>body{font-family:Arial;padding:20px;font-size:11px;max-width:700px;margin:auto} .top{display:flex;justify-content:space-between} .logo{width:60px;height:60px;border-radius:50%;background:#1e2f4a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;overflow:hidden} .logo img{width:100%;height:100%;object-fit:cover} .amarelo{background:#facc15;padding:3px 10px;font-weight:900;text-align:center;margin:6px 0;font-size:12px} table{width:100%;border-collapse:collapse;margin-top:8px} th,td{border:1px solid #ddd;padding:6px;font-size:10px} th{background:#f1f5f9;text-align:left} .tot{text-align:right;margin-top:10px;line-height:1.7} .tot b{font-size:13px}</style></head><body><div class="top"><div style="display:flex;gap:12px"><div class="logo">${perfilEdit.logoData ? `<img src="${perfilEdit.logoData}" />` : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div><div><b style="font-size:14px">${lojaLogada.nome_loja}</b><br/>NUIT: ${lojaLogada.nuit} | Tel: +${lojaLogada.username}<br/>${lojaLogada.endereco||'Maputo'} - ${lojaLogada.cidade||''}</div></div><div>Cliente: ${nomeClienteFatura}<br/>Tel: ${telFat}<br/>NUIT: ${nuitFat||'-'}<br/>Data: ${new Date().toLocaleDateString('pt-MZ')}<br/>Fatura No: ${numeroFatura}<br/>Turno: ${caixaTurno==='Manha'?'TM - Manha':caixaTurno==='Tarde'?'TT - Tarde':'TN - Noite'}<br/>Status: ${isDivida?'DIVIDA':'PAGO'}<br/>Vendido por: Dono</div></div><div class="amarelo">Factura No: ${numeroFatura}</div><table><thead><tr><th>DESCRICAO</th><th>QTD</th><th>PRECO</th><th>DESC%</th><th>SUBTOTAL</th></tr></thead><tbody>${produtosFat.map(p=>`<tr><td>${p.nome}${p.codigo?` - ${p.codigo}`:''}</td><td>${p.qtd}</td><td>${p.preco}MT</td><td>${p.desc}%</td><td>${(p.preco*p.qtd*(1-p.desc/100)).toFixed(0)}MT</td></tr>`).join('')}</tbody></table><div class="tot">Subtotal: ${subtotalLiquido.toFixed(0)}MT<br/>Desconto: -${descontoItens.toFixed(0)}MT<br/>Subtotal liq.: ${subtotalLiquido.toFixed(0)}MT<br/>IVA (${ivaPerc}%): ${ivaValor.toFixed(0)}MT<br/><b>TOTAL: ${total.toFixed(0)}MT</b></div></body></html>`;
    // V27 - 1 problema: fatura em PDF REAL, partilhavel direto para o numero do cliente.
    // COM numero -> baixa o PDF + abre a partilha do ficheiro (escolhes WhatsApp e o cliente).
    // SEM numero -> apenas baixa o PDF, nao abre WhatsApp nem partilha.
    const nomeFicheiro = `Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}`;
    // V29 - LOGO + DADOS ATUALIZADOS: converte o logo atual (perfil) para JPEG e usa os dados atuais da loja
    const logoAtual = perfilEdit.logoData || lojaLogada.logoData || '';
    let logoJpeg = '', logoW = 120, logoH = 120;
    if(logoAtual){
      try{
        const imgLogo = new Image();
        await new Promise((res, rej)=>{ imgLogo.onload=res; imgLogo.onerror=rej; imgLogo.src=logoAtual; });
        const cv = document.createElement('canvas'); const lado = Math.min(imgLogo.naturalWidth||120, imgLogo.naturalHeight||120, 300);
        cv.width=lado; cv.height=lado; const ctx=cv.getContext('2d'); if(ctx){ ctx.drawImage(imgLogo, 0, 0, lado, lado); const dj = cv.toDataURL('image/jpeg', 0.85); logoJpeg = dj.split(',')[1]||''; logoW=lado; logoH=lado; }
      }catch(e){}
    }
    const pdfBlob = gerarPdfFatura({ logoJpeg, logoW, logoH, loja: lojaLogada.nome_loja, nuit: lojaLogada.nuit||'', telLoja: lojaLogada.username||'', endereco: (lojaLogada.endereco||'Maputo') + ' - ' + (lojaLogada.cidade||''), cliente: nomeClienteFatura, telCliente: telFat, nuitCliente: nuitFat||'-', numero: numeroFatura, turno: caixaTurno==='Manha'?'TM - Manha':caixaTurno==='Tarde'?'TT - Tarde':'TN - Noite', status: isDivida?'DIVIDA':'PAGO', data: new Date().toLocaleDateString('pt-MZ'), itens: produtosFat.map((p:any)=>({ nome: p.nome, codigo: p.codigo||'', qtd: p.qtd, preco: p.preco, desc: p.desc, sub: p.preco*p.qtd*(1-p.desc/100) })), subtotal: subtotalLiquido, desconto: descontoItens, subtotalLiq: subtotalLiquido, ivaPerc, ivaValor, total });
    const urlPdf = URL.createObjectURL(pdfBlob);
    const aPdf = document.createElement('a'); aPdf.href=urlPdf; aPdf.download=`${nomeFicheiro}.pdf`; document.body.appendChild(aPdf); aPdf.click(); document.body.removeChild(aPdf);
    setTimeout(()=>URL.revokeObjectURL(urlPdf), 10000);
    // Numero do cliente: so digitos; 9 digitos (84...) -> 258 na frente; ja com 258 fica como esta.
    const numBruto = telFat.replace(/\D/g,'');
    const num = numBruto.length===9 ? '258'+numBruto : numBruto;
    if(num){
      const ficheiroPdf = new File([pdfBlob], `${nomeFicheiro}.pdf`, {type:'application/pdf'});
      const podePartilhar = (navigator as any).canShare && (navigator as any).canShare({files:[ficheiroPdf]});
      if(podePartilhar){
        try{ await (navigator as any).share({ files:[ficheiroPdf], title:`Fatura ${numeroFatura}`, text:`Fatura ${numeroFatura} - ${nomeClienteFatura} - TOTAL ${total.toFixed(0)} MT - ${isDivida?'DIVIDA':'PAGO'}` }); }catch(e){}
      } else {
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(`Fatura ${numeroFatura} - ${nomeClienteFatura} - TOTAL ${total.toFixed(0)} MT - ${isDivida?'DIVIDA':'PAGO'}. O PDF da fatura ja baixou - anexa o PDF aqui, por favor.`)}`, '_blank');
      }
    }
    alert(`✅ Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'} - Total ${total.toFixed(0)} MT - Ficheiro: Fatura ${numeroFatura} - ${nomeClienteFatura} - ${isDivida?'DIVIDA':'PAGO'}`); setProdutosFat([]); setTelFat(''); setNomeFat(''); setNuitFat(''); carregarTudo(lojaLogada.conta_id);
  };

  const salvarPerfilLoja = async () => {
    const update:any = { nome_loja: perfilEdit.nomeLoja, nuit: perfilEdit.nuit, provincia: perfilEdit.provincia, cidade: perfilEdit.distrito }; // V30 - dados gravam sempre; logo vai separado abaixo para nao travar se a coluna ainda nao existir
    if(perfilEdit.novaPassword) update.password = perfilEdit.novaPassword;
    const { error } = await supabase.from('lojas').update(update).eq('conta_id', lojaLogada.conta_id);
    // V30 - tenta gravar o logo no Supabase; se a coluna 'logoData' ainda nao existir, ignora sem erro (o logo fica guardado na sessao e sai na fatura na mesma)
    try{ const r:any = await supabase.from('lojas').update({ logoData: perfilEdit.logoData }).eq('conta_id', lojaLogada.conta_id); if(r?.error) console.log('logoData ainda sem coluna no Supabase - corre o SQL do V30'); }catch(e){}
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
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[8px] font-bold text-white">NOME DA LOJA / EMPRESA *</label><input value={formLojaLogin.nomeLoja} onChange={e=>setFormLojaLogin({...formLojaLogin, nomeLoja:e.target.value})} placeholder="Ex: Ferragem Central Matola" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">TELEFONE / WHATSAPP *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} placeholder="+258 ... " className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">PASSWORD *</label><input type="password" value={formLojaLogin.password} onChange={e=>setFormLojaLogin({...formLojaLogin, password:e.target.value})} placeholder="****" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">NUIT</label><input value={formLojaLogin.nuit} onChange={e=>setFormLojaLogin({...formLojaLogin, nuit:e.target.value})} placeholder="NUIT da loja" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">ENDERECO COMPLETO</label><input value={formLojaLogin.endereco} onChange={e=>setFormLojaLogin({...formLojaLogin, endereco:e.target.value})} placeholder="Av. Guerra Popular, Matola" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div><label className="text-[8px] font-bold text-white">PROVINCIA</label><select value={formLojaLogin.provincia} onChange={e=>setFormLojaLogin({...formLojaLogin, provincia:e.target.value})} className="w-full mt-1 h-8 border rounded px-2 text-[11px] bg-white"><option>Maputo Cidade</option><option>Maputo Provincia</option><option>Gaza</option><option>Inhambane</option><option>Sofala</option><option>Manica</option><option>Tete</option><option>Zambezia</option><option>Nampula</option><option>Niassa</option><option>Cabo Delgado</option></select></div>
                <div><label className="text-[8px] font-bold text-white">DISTRITO</label><input value={formLojaLogin.distrito} onChange={e=>setFormLojaLogin({...formLojaLogin, distrito:e.target.value})} placeholder="Distrito" className="w-full mt-1 h-8 border rounded px-3 text-[11px] bg-white" /></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">RAMO DE ACTIVIDADE - Lista Selecionavel</label><select value={formLojaLogin.ramo} onChange={e=>setFormLojaLogin({...formLojaLogin, ramo:e.target.value})} className="w-full mt-1 h-8 border rounded px-2 text-[11px] bg-white">{RAMOS_ATIVIDADE.map((r:string)=>(<option key={r}>{r}</option>))}</select></div>
                <div className="col-span-2"><label className="text-[8px] font-bold text-white">LOGOTIPO - Vai aparecer em facturas</label><input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>setFormLojaLogin({...formLojaLogin, logoData: reader.result as any}); reader.readAsDataURL(file); }} className="w-full mt-1 border rounded px-3 py-1.5 text-[10px] bg-[#2a3f5f] text-white" />{formLojaLogin.logoData && <img src={formLojaLogin.logoData} className="w-12 h-12 mt-2 rounded border" />}</div>
              </div>
              <button onClick={criarContaLoja} className="w-full mt-4 bg-[#16a34a] text-white py-3 rounded-full text-[11px] font-black">Criar conta - 10 segundos - Entrar no negocio e Faturacao</button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div><label className="text-[8px] font-bold text-white">TELEFONE / WHATSAPP *</label><input value={formLojaLogin.tel} onChange={e=>setFormLojaLogin({...formLojaLogin, tel:e.target.value})} className="w-full mt-1 h-10 border rounded px-3 text-[12px] bg-white" placeholder="+258 ... " /></div>
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
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-[11px]">M1</div><div><div className="font-black text-[11px]">CONTA INTERNA - {lojaLogada.provincia} - {lojaLogada.nome_loja}</div><div className="text-[7px] text-gray-500">{lojaLogada.nome_loja} - NUIT {lojaLogada.nuit} - Cidade: {lojaLogada.cidade} - {lojaLogada.ramo} - Stock: {stockProdutos.length} produtos - IVA {ivaTipo}% funcional</div></div></div>
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

        
        {negocioTab==='faturar' && (
          <div className="mt-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 bg-white border rounded-[12px] p-4 shadow-sm">
                {(!isMobile || mostrarClienteFat) && (<>
                <div className="flex justify-between items-center">
                  <div className="font-black text-[11px] flex items-center gap-2"><span className="w-2 h-2 bg-[#facc15] rounded-full"></span> FATURAR - com logotipo</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap"><span className="bg-[#facc15] px-3 py-1 rounded-full text-[10px] font-black">Fatura Nº: {gerarNumeroFatura(caixaTurno)} (próxima)</span><span className="text-[9px] font-bold">Turno:</span>{['Manha','Tarde','Noite'].map((t:any)=>(<button key={t} onClick={()=>setCaixaTurno(t)} className={`px-2 py-1 rounded-full text-[9px] font-bold ${caixaTurno===t?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>{t==='Manha'?'TM - Manhã':t==='Tarde'?'TT - Tarde':'TN - Noite'}</button>))}<span className="text-[9px] text-gray-500">01 = nº do dia+turno • TM/TT/TN = turno • Data de hoje - reinicia amanhã</span></div>
                  <div className="flex gap-1">
                    <span className="text-[7px] border px-2 py-1 rounded-full bg-white">Formato A5</span>
                    <span className="text-[7px] bg-[#dbeafe] border border-blue-200 px-2 py-1 rounded-full">NUIT na fatura</span>
                    <span className="text-[7px] bg-[#facc15] border px-2 py-1 rounded-full text-black">58/80 - Recibo</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] p-3">
                    <div className="text-[8px] font-black text-[#92400e] uppercase">CLIENTE - TELEFONE DINAMICO WHATSAPP</div>
                    <select value={nomeFat} onChange={e=>{ const val=e.target.value; setNomeFat(val.split(' - ')[0]||''); const telMatch=val.match(/\d{9,}/); if(telMatch) setTelFat(telMatch[0]); }} className="mt-2 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white font-bold">
                      <option value="">-- Escolher cliente real ou digitar em baixo --</option>
                      {[...new Map((faturas||[]).filter((f:any)=>f.status!=='ANULADA').map((f:any)=>[`${f.cliente} - ${f.tel}`, f])).values()].map((f:any)=>(<option key={f.id} value={`${f.cliente} - ${f.tel}`}>{f.cliente} - {f.tel}</option>))}
                    </select>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[8px]">
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">Tel dinamico:</span><b>{telFat||'+258 84 123 4567'}</b></div>
                      <div className="bg-white border rounded-[6px] px-2 py-1.5 flex justify-between"><span className="text-gray-500">NUIT:</span><b>{nuitFat||'--'}</b> <span className="ml-2 bg-[#f8fafc] border px-1 rounded">+ Detalhes</span></div>
                    </div>
                  </div>
                  <div className="bg-[#fffbeb] border-2 border-[#fde68a] rounded-[10px] p-3 flex gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-[10px] overflow-hidden">{perfilEdit.logoData ? <img src={perfilEdit.logoData} className="w-full h-full object-cover" /> : (lojaLogada?.nome_loja?.charAt(0)||'A')}</div>
                    <div className="flex-1">
                      <div className="text-[7px] font-bold text-[#64748b] uppercase">LOJA EMISSORA - CONTA DONO - {lojaLogada?.ramo||perfilEdit.ramo||''}</div>
                      <div className="font-black text-[12px] mt-1">{lojaLogada?.nome_loja||perfilEdit.nomeLoja||''} <span className="text-[8px] bg-black text-white px-1 rounded ml-1">LOGO</span></div>
                      <div className="text-[8px] text-[#334155] mt-1">NUIT {lojaLogada?.nuit||perfilEdit.nuit||''} + Tel {lojaLogada?.username||perfilEdit.tel||''} + {lojaLogada?.cidade||perfilEdit.distrito||''}</div>
                      <div className="text-[6px] text-[#94a3b8]">{lojaLogada?.provincia||''} - {lojaLogada?.cidade||''} - Logo OK</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-[#f8fafc] border rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Dados do comprador - ultra rapido</div><span className="text-[7px] bg-[#dcfce7] text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Rapido e ativo</span></div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div><div className="text-[7px] font-bold text-[#64748b]">TELEFONE / WHATSAPP *</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NOME / EMPRESA (opcional)</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Micheque Mungoi" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                    <div><div className="text-[7px] font-bold text-[#64748b]">NUIT (opcional)</div><input value={nuitFat} onChange={e=>setNuitFat(e.target.value)} placeholder="NUIT da loja" className="mt-1 w-full h-8 border rounded-[6px] px-2 text-[10px] bg-white" /></div>
                  </div>
                </div>
                </>)}
                <div className="mt-3 bg-white border rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[9px]">Produtos e Servicos - do Stock - IVA no fim - Clique para adicionar ao ITENS</div><span className="text-[7px] bg-[#f8fafc] border px-2 py-0.5 rounded-full">{stockProdutos.length} produtos</span></div>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 relative"><span className="absolute left-2 top-2 text-[10px]">🔍</span><input value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Digite 'Cimento' - busca no stock" className="w-full h-8 border rounded-full pl-7 pr-3 text-[10px] bg-[#f8fafc]" /></div><button onClick={()=>{ setBuscaFat(''); setMostrarProdutosCheio(true); }} className="bg-[#facc15] text-black text-[10px] font-black px-4 h-8 rounded-full border border-black whitespace-nowrap">🛒 PRODUTOS</button><button onClick={()=>setMostrarClienteFat(!mostrarClienteFat)} className="bg-red-600 text-white text-[10px] font-black px-4 h-8 rounded-full whitespace-nowrap">👤 CLIENTE {mostrarClienteFat?'▲':'▼'}</button><button onClick={irParaFaturas} className="bg-[#1e2f4a] text-white text-[10px] font-black px-4 h-8 rounded-full whitespace-nowrap">🧾 FATURAS ↓</button>
                  </div>
                  <div className="mt-2 flex gap-1 flex-wrap">{stockProdutos.filter(p=>!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())).slice(0,8).map(p=><button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="text-[7px] bg-[#1e3a8a] text-white px-2 py-1 rounded-full border border-[#1e3a8a]"> {p.nome} - {p.precoUnit}MT - Stock:{p.stockFinalLoja} </button>)}</div>
                </div>
                <div className="mt-3 bg-[#f0fdf4] border border-green-200 rounded-[10px] p-3">
                  <div className="flex justify-between"><div className="font-black text-[10px]">ITENS - {produtosFat.length} produtos no carrinho</div><button onClick={()=>setProdutosFat([])} className="text-[7px] bg-red-500 text-white px-3 py-0.5 rounded-full">Limpar</button></div>
                  <div className="mt-2 space-y-1.5">
                    {produtosFat.map((p,i)=><div key={p.id} className="grid grid-cols-12 gap-1.5 items-center bg-white border rounded-[6px] px-2 py-1.5">
                      <div className="col-span-5"><div className="font-bold text-[9px]">{p.nome}</div><div className="text-[6px] text-gray-500">{p.codigo||p.id} - Stock:{p.stockFinalLoja||'--'}</div></div>
                      <div className="col-span-2"><input type="number" value={p.qtd} onChange={e=>{ const n=[...produtosFat]; n[i].qtd=Number(e.target.value); setProdutosFat(n); }} className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center" /></div>
                      <div className="col-span-2"><input type="number" value={p.preco} readOnly title="Preco trancado - so o dono muda no Stock" className="w-full h-6 border rounded-[4px] px-1 text-[9px] text-center bg-gray-100" /></div>
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
            </div>
          </div>
        )}

        {negocioTab==='stock' && (
          <div className="bg-white rounded-[10px] border p-4">
            <div className="font-black text-[11px]">TABELA COMPLETA 11 COLUNAS 06:10 FORCA DIFF - {filtrados.length} itens - Alerta abaixo 50 - STOCK DIARIO - FIFO - NEGOCIO - FIX</div>
            <div className="flex flex-wrap gap-2 mt-3 items-center"><input type="date" value={dataStockDiario} onChange={e=>setDataStockDiario(e.target.value)} className="border rounded-full px-3 py-1 text-[10px]" /><input value={filtroRapidoStock} onChange={e=>setFiltroRapidoStock(e.target.value)} placeholder="Filtro rápido" className="border rounded-full px-3 py-1 text-[9px] w-56" /><select value={armazemAtivo} onChange={e=>setArmazemAtivo(e.target.value)} className="border rounded-full px-2 py-1 text-[8px]"><option>Todos</option><option>Matola - Principal</option></select></div>
            <div className="grid grid-cols-12 gap-3 mt-4">
              <div className="col-span-2"><div className="border rounded-[10px] p-3"><button onClick={()=>setMostrarNovoItem(true)} className="w-full border rounded-full py-2 text-[10px] font-bold">+ Novo Item</button><button onClick={()=>{ setMostrarIaProdutos(true); setIaLista([]); setIaRamo(lojaLogada?.ramo||'Mercearia e Mini Mercado'); }} className="w-full mt-2 bg-[#1e3a8a] text-white border rounded-full py-2 text-[10px] font-bold">🤖 Criar Produtos - IA</button><button onClick={()=>{ setProdutoSelecionado(null); setQtdEntrada(''); setMostrarEntrada(true); }} className="w-full mt-2 bg-yellow-100 border rounded-full py-2 text-[10px] font-bold">Entrada [F5]</button><button onClick={()=>{ setTipoSaida('saida_usa'); setProdutoSelecionado(null); setQtdSaida(''); setMostrarSaida(true); }} className="w-full mt-2 bg-red-50 border rounded-full py-2 text-[10px] font-bold">Saída [F6]</button><button onClick={()=>{ setTipoSaida('transferencia'); setProdutoSelecionado(null); setQtdSaida(''); setMostrarSaida(true); }} className="w-full mt-2 bg-blue-50 border rounded-full py-2 text-[10px] font-bold">Transferir Armazém → Loja</button><button onClick={()=>{ setMostrarMudarPreco(true); setPrecoDonoOk(false); setSenhaDono(''); }} className="w-full mt-2 bg-black text-white border rounded-full py-2 text-[10px] font-bold">🔒 Mudar Preço - Só Dono</button></div></div>
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

        
        {negocioTab==='faturar' && (
          <div id="faturas-recentes" className="mt-3 bg-white border rounded-[12px] p-4 scroll-mt-3">
            <div className="font-black text-[12px]">Faturas Recentes - Anular</div>
            <div className="text-[9px] text-gray-500 mt-1">Se o cliente mudar de ideia, clica ANULAR - o stock volta e a fatura sai do Caixa, Clientes e Relatorios.</div>
            <div className="mt-2 space-y-1">
              {(faturas||[]).length===0 ? (<div className="text-[10px] text-gray-500 p-2 text-center">Nenhuma fatura ainda.</div>) : (faturas||[]).slice(0,10).map((fat:any)=>(
                <div key={fat.id} className={fat.status==='ANULADA' ? 'flex items-center justify-between border rounded px-2 py-1.5 text-[10px] bg-red-50 opacity-60' : 'flex items-center justify-between border rounded px-2 py-1.5 text-[10px]'}>
                  <div><b>{fat.numero_fatura || fat.data}</b> - {fat.cliente} - {fat.total}MT - {fat.status} - {String(fat.data).slice(0,10)}</div>
                  <div className="flex gap-1">
                    {fat.status!=='ANULADA' ? (<button onClick={()=>anularFatura(fat)} className="px-2 py-1 bg-red-600 text-white rounded-full text-[9px] font-bold">ANULAR - Voltar Stock</button>) : (<span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[9px] font-bold">ANULADA</span>)}
                  </div>
                </div>
              ))}
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
                  <div className="mt-3 flex gap-1 flex-wrap">{stockProdutos.slice(0,4).map(p=><button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="text-[8px] bg-[#1e3a8a] text-white px-2 py-1 rounded-full">{p.nome} - {p.precoUnit}MT</button>)}</div>
                </div>
                <div className="bg-[#f0fdf4] border border-green-200 rounded-[10px] p-4">
                  <div className="font-bold text-[10px]">Finalizar venda</div>
                  <div className="text-[8px] text-gray-500 mt-1">Cliente Balcao - tel: +258 84 123 4567</div>
                  <div className="mt-2"><div className="text-[8px] font-bold">TELEFONE / CLIENTE</div><input value={telFat} onChange={e=>setTelFat(e.target.value)} placeholder="+258 84 123 4567" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="mt-2"><div className="text-[8px] font-bold">NOME / EMPRESA</div><input value={nomeFat} onChange={e=>setNomeFat(e.target.value)} placeholder="Nome do cliente" className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white" /></div>
                  <div className="font-black text-[14px] mt-3">TOTAL: {totalFat.toFixed(0)} MT</div>
                  <div className="text-[8px] text-gray-500">IVA {ivaTipo}% incluido - Subtotal {liqFat.toFixed(0)} + IVA {ivaVal.toFixed(0)}</div>
                  <button onClick={()=>salvarFaturaDuplaFuncao(false)} className="w-full mt-3 bg-[#16a34a] text-white py-2.5 rounded-[8px] text-[10px] font-black">Confirmar venda - Baixar stock</button>
                  <button onClick={()=>salvarFaturaDuplaFuncao(true)} className="w-full mt-2 bg-[#facc15] border-2 border-black text-black py-2 rounded-[8px] text-[9px] font-black">DIVIDA - FIADO - Baixar stock</button>
                </div>
              </div>
            </div>
          </div>
        )}
                {negocioTab==='relatorios' && (() => {
          // RELATORIO REAL - construído de Faturas + Stock (não mock)
          // Cada linha = 1 produto dentro de 1 fatura
          const linhas: any[] = []; const faturasValidas = (faturas||[]).filter((f:any)=> f.status!=='ANULADA');
          faturasValidas.forEach((fat:any)=>{
            const prods = Array.isArray(fat.produtos) ? fat.produtos : [];
            const dataFat = fat.data ? String(fat.data).slice(0,10) : (fat.created_at ? String(fat.created_at).slice(0,10) : dataStockDiario);
            prods.forEach((it:any)=>{
              const nomeProd = it.nome || it.nome_produto || 'Produto';
              const prodStock = (stockProdutos||[]).find((s:any)=> s.nome===nomeProd || s.codigo===it.codigo);
              const qtd = Number(it.qtd || it.quantidade || 1);
              const preco = Number(it.preco || it.precoUnit || prodStock?.precoUnit || 0);
              const valor = qtd * preco;
              linhas.push({
                data: dataFat,
                nome: nomeProd,
                grupo: prodStock?.cat || it.cat || 'Geral',
                stInicial: prodStock ? Number(prodStock.stockInicialLoja||0) : 0,
                recepcao: prodStock ? Number(prodStock.recepcao||0) : 0,
                vendas: prodStock ? Number(prodStock.vendaHoje||0) : qtd,
                cliente: fat.cliente || fat.tel || '-',
                quanti: qtd,
                valor,
                valorDivida: fat.is_divida ? valor : 0,
                total: valor,
              });
            });
          });
          // Se não há faturas, mostra 1 linha por produto do Stock (sem vendas) para não ficar vazio com mock
          const linhasFiltradas = linhas.filter((r:any)=>{
            if(relFiltroProduto!=='Todos' && r.nome!==relFiltroProduto) return false;
            if(relFiltroGrupo!=='Todos' && r.grupo!==relFiltroGrupo) return false;
            if(relDataInicio && r.data < relDataInicio) return false;
            if(relDataFim && r.data > relDataFim) return false;
            return true;
          });
          const totSt = linhasFiltradas.reduce((s:any,r:any)=>s+r.stInicial,0);
          const totRec = linhasFiltradas.reduce((s:any,r:any)=>s+r.recepcao,0);
          const totVendas = linhasFiltradas.reduce((s:any,r:any)=>s+r.vendas,0);
          const totQtd = linhasFiltradas.reduce((s:any,r:any)=>s+r.quanti,0);
          const totDivida = linhasFiltradas.reduce((s:any,r:any)=>s+r.valorDivida,0);
          const totTotal = linhasFiltradas.reduce((s:any,r:any)=>s+r.total,0);
          const produtosUnicos = [...new Set((stockProdutos||[]).map((p:any)=>p.nome))];
          const gruposUnicos = [...new Set((stockProdutos||[]).map((p:any)=>p.cat || 'Geral'))];
          const gerarPDF = () => {
            const linhasTxt = linhasFiltradas.map((r:any)=> `${r.data} | ${r.nome} | ST ${r.stInicial} | REC ${r.recepcao} | VENDAS ${r.vendas} | ${r.cliente} | QTD ${r.quanti} | ${r.valor}MT | DIVIDA ${r.valorDivida}MT | TOTAL ${r.total}MT`).join('\n');
            const conteudo = `RELATORIO - ${lojaLogada?.nome_loja || ''}\nDATA: ${relDataInicio||'...'} a ${relDataFim||'...'}\nPRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}\n\n${linhasTxt}\n\nTOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT`;
            const nomeRel = `Relatorio-${relDataInicio||'inicio'}-a-${relDataFim||'fim'}`;
            // PDF - HTML download automatico, sem Save
            const htmlRel = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${nomeRel}</title><style>body{font-family:Arial;padding:20px;font-size:11px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;font-size:10px}th{background:#1e2f4a;color:#fff}</style></head><body><h2>RELATORIO - ${lojaLogada?.nome_loja||''}</h2><p>DATA: ${relDataInicio||'...'} a ${relDataFim||'...'} | PRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}</p><table><thead><tr><th>DATA</th><th>PRODUTO</th><th>ST INICIAL</th><th>RECEPCAO</th><th>VENDAS</th><th>CLIENTE</th><th>QTD</th><th>VALOR</th><th>DIVIDA</th><th>TOTAL</th></tr></thead><tbody>${linhasFiltradas.map((r:any)=>`<tr><td>${r.data}</td><td>${r.nome}</td><td>${r.stInicial}</td><td>${r.recepcao}</td><td>${r.vendas}</td><td>${r.cliente}</td><td>${r.quanti}</td><td>${r.valor}MT</td><td>${r.valorDivida}MT</td><td>${r.total}MT</td></tr>`).join('')}</tbody></table><h3>TOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT</h3></body></html>`;
            const linhasPdfRel = [`RELATORIO - ${lojaLogada?.nome_loja||''}`, `DATA: ${relDataInicio||'...'} a ${relDataFim||'...'} | PRODUTO: ${relFiltroProduto} | GRUPO: ${relFiltroGrupo}`, ``, ...linhasFiltradas.map((r:any)=>`${r.data} | ${r.nome} | ST ${r.stInicial} | REC ${r.recepcao} | VENDAS ${r.vendas} | ${r.cliente} | QTD ${r.quanti} | ${r.valor}MT | DIVIDA ${r.valorDivida}MT | TOTAL ${r.total}MT`), ``, `TOTAIS: ST ${totSt} REC ${totRec} VENDAS ${totVendas} QTD ${totQtd} DIVIDA ${totDivida}MT TOTAL ${totTotal}MT`];
            const bPdf = criarPdfBlob(`Relatorio ${nomeRel}`, linhasPdfRel); const uPdf = URL.createObjectURL(bPdf); const aPdf = document.createElement('a'); aPdf.href=uPdf; aPdf.download=`${nomeRel}.pdf`; document.body.appendChild(aPdf); aPdf.click(); document.body.removeChild(aPdf); setTimeout(()=>URL.revokeObjectURL(uPdf),2000);
            // WhatsApp no mesmo clique - partilha o PDF (so PDF, sem Excel)
            const textoW = `RELATORIO ${lojaLogada?.nome_loja||''} - ${relDataInicio||'...'} a ${relDataFim||'...'} - ${linhasFiltradas.length} linhas - TOTAL ${totTotal}MT - DIVIDA ${totDivida}MT - PDF baixado!`;
            window.open(`https://wa.me/${String(lojaLogada?.username||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(textoW)}`, '_blank');
          };
          const enviarWhats = () => {
            const texto = `RELATORIO ${lojaLogada?.nome_loja||''} - ${relDataInicio||'...'} a ${relDataFim||'...'} - ${linhasFiltradas.length} linhas - TOTAL ${totTotal}MT - DIVIDA ${totDivida}MT`;
            window.open(`https://wa.me/${String(lojaLogada?.username||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(texto)}`, '_blank');
          };
          return (
          <div className="mt-3 space-y-3">
            <div className="bg-white border rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-1"><span className="text-[14px]">📊</span><span className="font-black text-[12px]">RELATORIO SIMPLES - Por Produto / Dia - REAL (Stock + Faturas)</span></div>
              <div className="text-[8px] text-[#64748b] mb-3">Tabela REAL: cada linha = 1 produto de 1 fatura. ST INICIAL e RECEPCAO vêm do Stock. CLIENTE, QUANTI, VALOR, DIVIDA vêm das Faturas. Sem mock.</div>
              <div className="grid grid-cols-4 gap-3">
                <div><div className="text-[8px] font-bold">PRODUTO</div><select value={relFiltroProduto} onChange={e=>setRelFiltroProduto(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option>{produtosUnicos.map((n:any)=><option key={n}>{n}</option>)}</select></div>
                <div><div className="text-[8px] font-bold">GRUPO</div><select value={relFiltroGrupo} onChange={e=>setRelFiltroGrupo(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px] bg-white"><option>Todos</option>{gruposUnicos.map((g:any)=><option key={g}>{g}</option>)}</select></div>
                <div><div className="text-[8px] font-bold">DATA INICIO</div><input type="date" value={relDataInicio} onChange={e=>setRelDataInicio(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
                <div><div className="text-[8px] font-bold">DATA FIM</div><input type="date" value={relDataFim} onChange={e=>setRelDataFim(e.target.value)} className="w-full mt-1 h-8 border rounded px-2 text-[10px]" /></div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={()=>{ setRelAplicado(true); carregarTudo(lojaLogada.conta_id); }} className="px-4 h-8 bg-[#facc15] text-black border-2 border-black rounded-full text-[9px] font-black">🔍 SEARCH / REFRESH - FILTRAR TABELA POR DATA</button>
                <button onClick={()=>{ setRelFiltroProduto('Todos'); setRelFiltroGrupo('Todos'); setRelDataInicio(''); setRelDataFim(''); setRelAplicado(false); }} className="px-4 h-8 bg-white border-2 border-black text-black rounded-full text-[9px] font-black">LIMPAR FILTRO</button>
                <button onClick={gerarPDF} className="px-4 h-8 bg-[#1e2f4a] text-white rounded-full text-[9px] font-black">GERAR RELATORIO - PDF COM DIVIDAS + FILTRO DATA</button>
                <button onClick={enviarWhats} className="px-4 h-8 bg-[#16a34a] text-white rounded-full text-[9px] font-black">ENVIAR WHATSAPP</button>
              </div>
              <div className="text-[9px] text-gray-500 mt-2">Stock: {stockProdutos.length} produtos reais | Faturas: {faturas.length} reais | Linhas: {linhasFiltradas.length} {relAplicado ? '(filtro aplicado)' : ''}</div>
            </div>
            <div className="bg-white border rounded-[12px] p-4">
              <div className="font-black text-[11px] mb-3">TABELA - DATA | PRODUTO | ST INICIAL | RECEPCAO | VENDAS | CLIENTE | QUANTI | VALOR | TOTAL - REAL</div>
              <div className="overflow-x-auto border rounded-[8px]">
                <table className="w-full text-[9px] min-w-[1100px]">
                  <thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">DATA</th><th className="p-2 text-left">NOME PRODUTO</th><th className="p-2 text-center">ST INICIAL</th><th className="p-2 text-center">RECEPCAO</th><th className="p-2 text-center">VENDAS</th><th className="p-2 text-left">CLIENTE</th><th className="p-2 text-center">QUANTI</th><th className="p-2 text-center">VALOR</th><th className="p-2 text-center bg-blue-600">VALOR DIVIDA</th><th className="p-2 text-center bg-yellow-400 text-black">TOTAL C/DIVIDAS</th></tr></thead>
                  <tbody>
                    {linhasFiltradas.length===0 ? (
                      <tr><td colSpan={10} className="p-4 text-center">Nenhuma venda com este filtro - Stock tem {stockProdutos.length} produto(s) reais: {(stockProdutos||[]).map((p:any)=>p.nome).join(', ') || 'nenhum'} - Faturas: {faturas.length} - Limpa o filtro para ver tudo.</td></tr>
                    ) : linhasFiltradas.map((r:any,idx:number)=>(
                      <tr key={idx} className="border-b"><td className="p-2">{r.data}</td><td className="p-2 font-bold">{r.nome}</td><td className="p-2 text-center bg-blue-50">{r.stInicial}</td><td className="p-2 text-center">{r.recepcao}</td><td className="p-2 text-center font-bold">{r.vendas}</td><td className="p-2">{r.cliente}</td><td className="p-2 text-center font-bold">{r.quanti}</td><td className="p-2 text-center">{r.valor}MT</td><td className="p-2 text-center bg-blue-100">{r.valorDivida}MT</td><td className="p-2 text-center bg-yellow-100 font-bold">{r.total}MT</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="bg-[#facc15] font-black text-[9px]"><td className="p-2" colSpan={2}>TOTAIS GERAIS REAIS: ST {totSt} REC {totRec} VENDAS {totVendas}</td><td className="p-2 text-center">{totSt}</td><td className="p-2 text-center">{totRec}</td><td className="p-2 text-center">{totVendas}</td><td className="p-2"></td><td className="p-2 text-center">{totQtd}</td><td className="p-2"></td><td className="p-2 text-center bg-blue-200">{totDivida}MT</td><td className="p-2 text-center bg-yellow-300">{totTotal}MT</td></tr></tfoot>
                </table>
              </div>
            </div>
          </div>
          );
        })()}
        {(negocioTab==='clientes' || negocioTab==='fornecedores' || negocioTab==='caixa') && (() => {
 const clientesMap:any={}; (faturas||[]).filter((f:any)=>f.status!=='ANULADA').forEach((fat:any)=>{ const chave=(fat.cliente||fat.tel||'Sem nome')+'|'+(fat.tel||''); if(!clientesMap[chave]) clientesMap[chave]={nome:fat.cliente||'Sem nome',tel:fat.tel||'-',nuit:fat.nuit||'-',qtdFaturas:0,totalCompras:0,totalDivida:0,ultimaData:fat.data||fat.created_at||''}; clientesMap[chave].qtdFaturas+=1; clientesMap[chave].totalCompras+=Number(fat.total||0); if(fat.is_divida) clientesMap[chave].totalDivida+=Number(fat.total||0); }); const clientes=Object.values(clientesMap); const totalDividaClientes=(clientes as any[]).reduce((s:any,c:any)=>s+Number(c.totalDivida||0),0); const hoje=new Date().toISOString().slice(0,10); const faturasHoje=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>String(f.data||f.created_at||'').slice(0,10)===hoje); const caixaHojePago=faturasHoje.filter((f:any)=>!f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaHojeDivida=faturasHoje.filter((f:any)=>f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotalPago=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>!f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotalDivida=(faturas||[]).filter((f:any)=>f.status!=='ANULADA').filter((f:any)=>f.is_divida).reduce((s:any,f:any)=>s+Number(f.total||0),0); const caixaTotal=caixaTotalPago+caixaTotalDivida;
 const salvarForn=()=>{ if(!formForn.nome||!formForn.tel){ alert('Nome e Telefone'); return; } const novo={...formForn,id:Date.now()}; const lista=[...fornecedores,novo]; setFornecedores(lista); localStorage.setItem(`loja_fornecedores_${lojaLogada?.conta_id||'geral'}`,JSON.stringify(lista)); setFormForn({nome:'',tel:'',produto:'',nota:''}); };
 return (<div className="mt-3 space-y-3">{negocioTab==='clientes' && (<div className="bg-white border rounded-[12px] p-4"><div className="font-black text-[13px]">CLIENTES - Reais das Faturas</div><div className="text-[9px] text-gray-500 mt-1">{clientes.length} cliente(s) - {faturas.length} fatura(s) - Divida total {totalDividaClientes}MT</div><div className="mt-3 overflow-x-auto border rounded-[8px]"><table className="w-full text-[10px] min-w-[700px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">CLIENTE</th><th className="p-2 text-left">TELEFONE</th><th className="p-2 text-left">NUIT</th><th className="p-2 text-center">FATURAS</th><th className="p-2 text-center">TOTAL COMPRAS</th><th className="p-2 text-center bg-blue-600">DIVIDA</th><th className="p-2 text-center">ULTIMA COMPRA</th><th className="p-2 text-center">ACAO</th></tr></thead><tbody>{clientes.length===0 ? (<tr><td colSpan={8} className="p-4 text-center">Nenhum cliente ainda - Faz a primeira venda em Faturar / Vender e o cliente aparece aqui automaticamente.</td></tr>) : (clientes as any[]).map((c:any,i:number)=>(<tr key={i} className="border-b"><td className="p-2 font-bold">{c.nome}</td><td className="p-2">{c.tel}</td><td className="p-2">{c.nuit}</td><td className="p-2 text-center">{c.qtdFaturas}</td><td className="p-2 text-center font-bold">{c.totalCompras}MT</td><td className="p-2 text-center bg-blue-50 font-bold">{c.totalDivida}MT</td><td className="p-2 text-center">{String(c.ultimaData).slice(0,10)}</td><td className="p-2 text-center"><button onClick={()=>window.open(`https://wa.me/${String(c.tel||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Ola ${c.nome}, a sua divida e ${c.totalDivida}MT.`)}`,'_blank')} className="px-2 py-1 bg-[#16a34a] text-white rounded-full text-[9px] font-bold">WhatsApp</button></td></tr>))}</tbody></table></div></div>)}{negocioTab==='fornecedores' && (<div className="bg-white border rounded-[12px] p-4"><div className="font-black text-[13px]">FORNECEDORES - Quem fornece o teu Stock</div><div className="text-[9px] text-gray-500 mt-1">{fornecedores.length} fornecedor(es) - Stock tem {stockProdutos.length} produto(s)</div><div className="mt-3 grid grid-cols-4 gap-2"><input value={formForn.nome} onChange={e=>setFormForn({...formForn,nome:e.target.value})} placeholder="Nome fornecedor *" className="border rounded px-3 py-2 text-[11px]" /><input value={formForn.tel} onChange={e=>setFormForn({...formForn,tel:e.target.value})} placeholder="Telefone *" className="border rounded px-3 py-2 text-[11px]" /><input value={formForn.produto} onChange={e=>setFormForn({...formForn,produto:e.target.value})} placeholder="Produto - ex: Cimento" className="border rounded px-3 py-2 text-[11px]" /><button onClick={salvarForn} className="bg-[#1e2f4a] text-white rounded px-3 py-2 text-[11px] font-bold">+ Adicionar</button></div><div className="mt-3 overflow-x-auto border rounded-[8px]"><table className="w-full text-[10px] min-w-[700px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">FORNECEDOR</th><th className="p-2 text-left">TELEFONE</th><th className="p-2 text-left">PRODUTO</th><th className="p-2 text-center">ACAO</th></tr></thead><tbody>{fornecedores.length===0 ? (<tr><td colSpan={4} className="p-4 text-center">Nenhum fornecedor ainda - Adiciona em cima. Produtos no Stock: {(stockProdutos||[]).map((p:any)=>p.nome).join(', ') || 'nenhum'}.</td></tr>) : fornecedores.map((f:any)=>(<tr key={f.id} className="border-b"><td className="p-2 font-bold">{f.nome}</td><td className="p-2">{f.tel}</td><td className="p-2">{f.produto}</td><td className="p-2 text-center"><button onClick={()=>window.open(`https://wa.me/${String(f.tel||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Ola ${f.nome}, preciso de ${f.produto}.`)}`,'_blank')} className="px-2 py-1 bg-[#16a34a] text-white rounded-full text-[9px] font-bold">WhatsApp</button></td></tr>))}</tbody></table></div></div>)}{negocioTab==='caixa' && (<div className="bg-white border rounded-[12px] p-4"><div className="flex items-center justify-between"><div><div className="font-black text-[13px]">CAIXA & TURNOS - Dinheiro Real das Faturas</div><div className="text-[9px] text-gray-500 mt-1">Turno: {caixaTurno} - Hoje: {hoje}</div></div><div className="flex gap-1">{['Manha','Tarde','Noite'].map((t:any)=>(<button key={t} onClick={()=>setCaixaTurno(t)} className={`px-3 py-1 rounded-full text-[10px] font-bold ${caixaTurno===t?'bg-[#1e2f4a] text-white':'bg-gray-100'}`}>{t}</button>))}</div></div><div className="mt-3 grid grid-cols-4 gap-2"><div className="bg-green-50 border border-green-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-green-700">CAIXA HOJE - PAGO</div><div className="font-black text-[16px] text-green-700 mt-1">{caixaHojePago}MT</div></div><div className="bg-blue-50 border border-blue-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-blue-700">HOJE - FIADO</div><div className="font-black text-[16px] text-blue-700 mt-1">{caixaHojeDivida}MT</div></div><div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-center"><div className="text-[9px] font-bold">TOTAL GERAL - PAGO</div><div className="font-black text-[16px] mt-1">{caixaTotalPago}MT</div></div><div className="bg-red-50 border border-red-200 rounded p-3 text-center"><div className="text-[9px] font-bold text-red-700">TOTAL DIVIDA A RECEBER</div><div className="font-black text-[16px] text-red-700 mt-1">{caixaTotalDivida}MT</div></div></div><div className="mt-3 border rounded-[8px] p-3"><div className="font-bold text-[11px]">Fecho de Caixa - Turno {caixaTurno}</div><div className="text-[10px] text-gray-600 mt-1">Caixa total = {caixaTotal}MT - Stock {stockProdutos.length} produto(s) - Faturas {faturas.length}</div><button onClick={()=>alert(`Fecho ${caixaTurno} - Hoje Pago ${caixaHojePago}MT + Fiado ${caixaHojeDivida}MT = ${caixaHojePago+caixaHojeDivida}MT`)} className="mt-2 px-4 py-2 bg-[#1e2f4a] text-white rounded-full text-[10px] font-bold">Fechar Turno {caixaTurno}</button></div></div>)}</div>); })()}
        {mostrarProdutosCheio && (<div className="fixed inset-0 bg-[#f0f2f5] z-[100] flex flex-col"><div className="bg-[#1e3a8a] text-white p-2"><div className="flex items-center justify-between gap-2"><button onClick={()=>setMostrarProdutosCheio(false)} className="bg-white/15 px-2 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap">Voltar a fatura</button><div className="flex-1 min-w-0 text-center"><div className="font-black text-[13px] leading-tight">Escolhe os produtos</div><div className="text-[9px] opacity-80">Os produtos ja estao a entrar na fatura</div></div><div className="bg-[#facc15] text-black px-2 py-1 rounded-full text-[10px] font-black whitespace-nowrap">CESTO: {produtosFat.length} itens</div></div><div className="mt-2 relative"><span className="absolute left-2 top-1.5 text-[11px]">🔍</span><input autoFocus value={buscaFat} onChange={e=>setBuscaFat(e.target.value)} placeholder="Procurar produto... ex: arroz" className="w-full h-8 border rounded-full pl-7 pr-3 text-[11px] bg-white text-black" /></div><div className="flex gap-1 mt-2 overflow-x-auto pb-1">{['Todos',...Array.from(new Set(stockProdutos.map((p:any)=>(p.cat||p.categoria||'Outros'))))].map(c=>(<button key={c} onClick={()=>setCatProdutos(c)} className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${catProdutos===c?'bg-[#facc15] text-black':'bg-white/15 text-white'}`}>{c}</button>))}</div></div><div className="p-2 flex gap-1 bg-white border-b"><button onClick={()=>setVistaProdutos('lista')} className={`flex-1 py-1.5 rounded-full text-[11px] font-bold border ${vistaProdutos==='lista'?'bg-black text-white border-black':'bg-white'}`}>Lista</button><button onClick={()=>setVistaProdutos('grelha')} className={`flex-1 py-1.5 rounded-full text-[11px] font-bold border ${vistaProdutos==='grelha'?'bg-black text-white border-black':'bg-white'}`}>Grelha</button><span className="self-center text-[10px] text-gray-500 px-1">{stockProdutos.filter((p:any)=>(!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())) && (catProdutos==='Todos' || (p.cat||p.categoria||'Outros')===catProdutos)).length} produtos</span></div>{vistaProdutos==='lista' ? (<div className="flex-1 overflow-y-auto p-2 space-y-1">{stockProdutos.filter((p:any)=>(!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())) && (catProdutos==='Todos' || (p.cat||p.categoria||'Outros')===catProdutos)).map((p:any)=>(<button key={p.id} onClick={()=>adicionarAoFaturar(p)} className="w-full flex items-center gap-2 bg-white border rounded-[8px] p-1.5 text-left"><span className="shrink-0">{(p.imagem||p.foto||p.image) ? <img src={p.imagem||p.foto||p.image} className="w-9 h-9 rounded object-cover" /> : <span className="w-9 h-9 rounded bg-[#eef2f7] flex items-center justify-center font-black text-[11px]">{(p.nome||'P').charAt(0)}</span>}</span><span className="flex-1 min-w-0"><span className="block font-bold text-[11px] truncate">{p.nome}</span><span className="block text-[9px] text-gray-500">{p.codigo||''} - {p.cat||p.categoria||''} - Stock: {p.stockFinalLoja}</span></span><span className="shrink-0 text-right"><span className="block font-black text-[11px]">{p.precoUnit} MT</span><span className="block bg-[#16a34a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5">+ Adicionar</span></span></button>))}</div>) : (<div className="flex-1 overflow-y-auto p-1 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1">{stockProdutos.filter((p:any)=>(!buscaFat || p.nome.toLowerCase().includes(buscaFat.toLowerCase())) && (catProdutos==='Todos' || (p.cat||p.categoria||'Outros')===catProdutos)).map((p:any)=>(<div key={p.id} className="bg-white border rounded-[6px] overflow-hidden flex flex-col">{(p.imagem||p.foto||p.image) ? <img src={p.imagem||p.foto||p.image} className="w-full h-10 object-cover" /> : <div className="w-full h-10 bg-[#eef2f7] flex items-center justify-center font-black text-[12px] text-[#64748b]">{(p.nome||'P').charAt(0)}</div>}<div className="p-1 flex-1"><div className="font-bold text-[8px] leading-none">{p.nome}</div><div className="text-[7px] text-gray-500 leading-none mt-0.5">{p.precoUnit} MT - Stk: {p.stockFinalLoja}</div></div><button onClick={()=>adicionarAoFaturar(p)} className="mx-1 mb-1 bg-[#16a34a] text-white text-[7px] font-bold py-0.5 rounded-full">+ ADICIONAR</button></div>))}</div>)}<div className="p-2 border-t bg-white"><div className="flex justify-between text-[10px] mb-2"><span className="font-black">CESTO: {produtosFat.length} itens - {totalFat.toFixed(0)} MT</span><span className="text-gray-500">Fatura: TOTAL {totalFat.toFixed(0)} MT - IVA {ivaTipo}%</span></div><div className="flex gap-1"><button onClick={()=>{ setMostrarProdutosCheio(false); setNegocioTab('stock'); setMostrarNovoItem(true); }} className="flex-1 border py-2.5 rounded-full text-[11px] font-bold">+ Novo produto</button><button onClick={()=>setMostrarProdutosCheio(false)} className="flex-[2] bg-[#16a34a] text-white py-2.5 rounded-full text-[11px] font-black">OK - Voltar a Fatura</button></div></div></div>)}
        {mostrarMudarPreco && (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto p-4"><div className="flex justify-between items-center"><h3 className="font-black text-[14px]">🔒 Mudar Preço - Só Dono</h3><button onClick={()=>setMostrarMudarPreco(false)} className="px-3 py-1 border rounded-full text-[11px] font-bold">✕ Fechar</button></div>{!precoDonoOk ? (<div className="mt-4"><div className="text-[11px] text-gray-600">Os preços sobem e descem. Só o dono muda preço. Mete a <b>password da tua conta da loja</b> para entrar.</div><input type="password" value={senhaDono} onChange={e=>setSenhaDono(e.target.value)} placeholder="Password do dono" className="w-full mt-3 border rounded px-3 py-2 text-[13px]" /><button onClick={verificarSenhaDono} className="w-full mt-3 bg-black text-white py-2.5 rounded-full text-[12px] font-black">Entrar - Sou o dono</button></div>) : (<div className="mt-3"><div className="text-[11px] text-green-700 font-bold">✅ Dono confirmado - podes mudar os preços. O preço novo passa logo para Faturar, Vender e Stock.</div><div className="mt-3 relative"><span className="absolute left-2 top-2 text-[10px]">🔍</span><input value={buscaPreco} onChange={e=>setBuscaPreco(e.target.value)} placeholder="Procurar produto... ex: arroz" className="w-full h-9 border rounded-full pl-7 pr-3 text-[11px] bg-[#f8fafc]" /></div><div className="mt-3 space-y-2">{stockProdutos.filter((p:any)=>!buscaPreco || p.nome.toLowerCase().includes(buscaPreco.toLowerCase()) || String(p.codigo||'').toLowerCase().includes(buscaPreco.toLowerCase())).map((p:any)=>(<div key={p.id} className="border rounded-[10px] p-2"><div className="flex justify-between"><div><div className="font-bold text-[12px]">{p.nome}</div><div className="text-[9px] text-gray-500">{p.codigo||''} - Preço atual: <b>{p.precoUnit} MT</b></div></div><div className="flex gap-1 items-center"><input type="number" value={novoPrecoPorId[p.id]||''} onChange={e=>setNovoPrecoPorId({...novoPrecoPorId, [p.id]: e.target.value})} placeholder="Novo preço" className="w-24 h-8 border rounded px-2 text-[12px]" /><button onClick={()=>salvarNovoPreco(p)} className="px-3 h-8 bg-[#16a34a] text-white rounded-full text-[10px] font-bold">Guardar</button></div></div></div>))}</div>{historicoPrecos.length>0 && (<div className="mt-4"><div className="font-black text-[11px]">Histórico - quem mudou e quando</div>{historicoPrecos.slice(0,10).map((h:any,i:number)=>(<div key={i} className="text-[10px] text-gray-600 border-b py-1">{h.produto} {h.codigo} - {h.antigo}MT → {h.novo}MT - Dono - {h.data}</div>))}</div>)}</div>)}</div></div>)}
        {mostrarIaProdutos && (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-3xl max-h-[92vh] overflow-auto p-4"><div className="flex justify-between items-center"><h3 className="font-black text-[14px]">🤖 Criar Produtos - IA</h3><button onClick={()=>setMostrarIaProdutos(false)} className="px-3 py-1 border rounded-full text-[11px] font-bold">✕ Fechar</button></div><div className="text-[11px] text-gray-600 mt-1">A IA sugere os NOMES. Os numeros sao teus: preenche o preco e o stock de CADA produto, um por um, antes de guardar. Nada entra com stock inventado.</div><div className="grid grid-cols-3 gap-2 mt-3"><div><label className="text-[10px] font-bold">RAMO DE ACTIVIDADE</label><select value={iaRamo} onChange={e=>setIaRamo(e.target.value)} className="w-full border rounded px-2 py-2 text-[12px] mt-1 bg-white">{RAMOS_ATIVIDADE.map((r:string)=>(<option key={r}>{r}</option>))}</select></div><div><label className="text-[10px] font-bold">QUANTOS PRODUTOS?</label><select value={iaQtd} onChange={e=>setIaQtd(Number(e.target.value))} className="w-full border rounded px-2 py-2 text-[12px] mt-1 bg-white"><option value={10}>10 produtos</option><option value={20}>20 produtos</option><option value={30}>30 produtos</option><option value={50}>50 produtos</option><option value={100}>100 produtos</option></select></div><div className="flex items-end"><button onClick={gerarIaLista} className="w-full bg-[#facc15] border border-black py-2 rounded-full text-[11px] font-black">Gerar lista para rever</button></div></div>{iaLista.length>0 && (<div className="mt-4"><div className="font-black text-[11px] mb-2">Reve e preenche: {iaLista.length} produtos - {iaRamo}</div><div className="border rounded-[10px] overflow-x-auto"><table className="w-full text-[10px] min-w-[640px]"><thead><tr className="bg-[#1e2f4a] text-white"><th className="p-2 text-left">#</th><th className="p-2 text-left">PRODUTO (podes mudar o nome)</th><th className="p-2">PRECO MT *</th><th className="p-2">STOCK ARMAZEM</th><th className="p-2">STOCK LOJA</th><th className="p-2"></th></tr></thead><tbody>{iaLista.map((r:any,i:number)=>(<tr key={i} className="border-b"><td className="p-1 text-center">{i+1}</td><td className="p-1"><input value={r.nome} onChange={e=>{ const n=[...iaLista]; n[i].nome=e.target.value; setIaLista(n); }} className="w-full border rounded px-2 py-1 text-[11px]" /></td><td className="p-1"><input type="number" value={r.preco} onChange={e=>{ const n=[...iaLista]; n[i].preco=e.target.value; setIaLista(n); }} placeholder="0" className="w-full border rounded px-2 py-1 text-[11px] text-center" /></td><td className="p-1"><input type="number" value={r.stockArm} onChange={e=>{ const n=[...iaLista]; n[i].stockArm=e.target.value; setIaLista(n); }} placeholder="0" className="w-full border rounded px-2 py-1 text-[11px] text-center" /></td><td className="p-1"><input type="number" value={r.stockLoja} onChange={e=>{ const n=[...iaLista]; n[i].stockLoja=e.target.value; setIaLista(n); }} placeholder="0" className="w-full border rounded px-2 py-1 text-[11px] text-center" /></td><td className="p-1 text-center"><button onClick={()=>setIaLista(iaLista.filter((_:any,j:number)=>j!==i))} className="text-red-600 font-bold text-[12px]">✕</button></td></tr>))}</tbody></table></div><button onClick={salvarIaLista} className="w-full mt-3 bg-[#16a34a] text-white py-3 rounded-full text-[12px] font-black">Guardar {iaLista.length} produtos no Stock com os MEUS numeros</button></div>)}</div></div>)}
{mostrarNovoItem && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-md p-5"><h3 className="font-bold text-[13px]">+ Novo Item - Só iniciais</h3><div className="grid grid-cols-2 gap-2 mt-3"><input value={formNovoItem.codigo} onChange={e=>setFormNovoItem({...formNovoItem, codigo:e.target.value})} placeholder="COD" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.nome} onChange={e=>setFormNovoItem({...formNovoItem, nome:e.target.value})} placeholder="Nome" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.preco} onChange={e=>setFormNovoItem({...formNovoItem, preco:e.target.value})} placeholder="Preço" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialArmazem} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialArmazem:e.target.value})} placeholder="Stock Inicial Arm" className="border rounded px-2 py-2 text-[11px]" /><input value={formNovoItem.stockInicialLoja} onChange={e=>setFormNovoItem({...formNovoItem, stockInicialLoja:e.target.value})} placeholder="Stock Inicial Loja" className="border rounded px-2 py-2 text-[11px]" /></div><div className="flex gap-2 mt-4"><button onClick={()=>setMostrarNovoItem(false)} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={salvarNovoItemReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Criar</button></div></div></div>)}
        {mostrarEntrada && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Entrada [F5]</h3><div className="text-[10px] font-bold mt-3">Produto - escolhe aqui</div><select value={produtoSelecionado?.id||''} onChange={e=>{ const p=stockProdutos.find((x:any)=>String(x.id)===e.target.value); setProdutoSelecionado(p||null); }} className="w-full border rounded px-3 py-2 text-[12px] mt-1 bg-white"><option value="">-- Escolher produto do Stock --</option>{stockProdutos.map((p:any)=><option key={p.id} value={p.id}>{p.nome} - Arm:{p.stockFinalArmazem} Loja:{p.stockFinalLoja}</option>)}</select>{produtoSelecionado && <div className="text-[10px] mt-1 text-gray-500">Selecionado: <b className="text-black">{produtoSelecionado.nome}</b> - Stock Arm atual: {produtoSelecionado.stockFinalArmazem}</div>}<input value={qtdEntrada} onChange={e=>setQtdEntrada(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarEntrada(false); setProdutoSelecionado(null); setQtdEntrada(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerEntradaReal} className="flex-1 bg-yellow-400 text-black py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}
        {mostrarSaida && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5"><h3 className="font-bold text-[13px]">Saída - {tipoSaida==='transferencia'?'Transferir Armazém → Loja':'Saída USA'}</h3><div className="text-[10px] font-bold mt-3">Produto - escolhe aqui</div><select value={produtoSelecionado?.id||''} onChange={e=>{ const p=stockProdutos.find((x:any)=>String(x.id)===e.target.value); setProdutoSelecionado(p||null); }} className="w-full border rounded px-3 py-2 text-[12px] mt-1 bg-white"><option value="">-- Escolher produto do Stock --</option>{stockProdutos.map((p:any)=><option key={p.id} value={p.id}>{p.nome} - Arm:{p.stockFinalArmazem} Loja:{p.stockFinalLoja}</option>)}</select>{produtoSelecionado && <div className="text-[10px] mt-1 text-gray-500">Selecionado: <b className="text-black">{produtoSelecionado.nome}</b> - Stock Arm atual: {produtoSelecionado.stockFinalArmazem}</div>}<div className="flex gap-1 mt-2"><button onClick={()=>setTipoSaida('saida_usa')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='saida_usa'?'bg-red-500 text-white':'bg-gray-100'}`}>Saída USA</button><button onClick={()=>setTipoSaida('transferencia')} className={`flex-1 py-1.5 rounded-full text-[9px] ${tipoSaida==='transferencia'?'bg-blue-500 text-white':'bg-gray-100'}`}>Transferência Armazém→Loja</button></div><input value={qtdSaida} onChange={e=>setQtdSaida(e.target.value)} placeholder="Quantidade" className="w-full border rounded px-3 py-2 text-[13px] mt-3" type="number" /><div className="flex gap-2 mt-4"><button onClick={()=>{ setMostrarSaida(false); setProdutoSelecionado(null); setQtdSaida(''); }} className="flex-1 border py-2 rounded-full text-[11px]">Cancelar</button><button onClick={fazerSaidaReal} className="flex-1 bg-[#1e2f4a] text-white py-2 rounded-full text-[11px] font-bold">Confirmar</button></div></div></div>)}
      </div>
    </div>
  )
}