
import { useState, useEffect } from "react";

export default function App(){
  const [pagina,setPagina]=useState('home');
  const [cat,setCat]=useState('');
  const [metodo,setMetodo]=useState('');
  const [frase,setFrase]=useState(0);
  const [form,setForm]=useState({desc:'',ref:'',prov:'Maputo Cidade',valor:'',escola:'',aluno:'',nome:'',tel:'',email:''});

  useEffect(()=>{ const id=setInterval(()=>setFrase(f=>(f+1)%4),2500); return ()=>clearInterval(id); },[]);

  const frases=["Sem filas, sem stress!","Seu tempo vale ouro!","Resolvemos enquanto descansa!","100% digital e seguro!"];

  const categorias=[
    {id:'fiscal',nome:'Fiscal e Tributario',sub:'IVA, IRPS, IRPC, NUIT',icon:'[F]',cor:'#3b82f6',bg:'#eff6ff'},
    {id:'multas',nome:'Multas',sub:'Transito e municipais',icon:'[M]',cor:'#ef4444',bg:'#fef2f2'},
    {id:'inspecao',nome:'Inspecoes',sub:'Viaturas e estabelecimentos',icon:'[I]',cor:'#8b5cf6',bg:'#f5f3ff'},
    {id:'licencas',nome:'Licencas e Certificacoes',sub:'Alvaras, cartas, certidoes',icon:'[L]',cor:'#f59e0b',bg:'#fffbeb'},
    {id:'taxas',nome:'Taxas e Servicos Publicos',sub:'Agua, energia, taxas',icon:'[T]',cor:'#06b6d4',bg:'#ecfeff'},
    {id:'educacao',nome:'Educacao e Escolas',sub:'Propinas, matriculas, exames',icon:'[E]',cor:'#10b981',bg:'#ecfdf5',pop:true},
    {id:'empresa',nome:'Servicos Empresariais',sub:'INSS, registos',icon:'[S]',cor:'#6366f1',bg:'#eef2ff'},
    {id:'outro',nome:'Outro Servico',sub:'Diga-nos o que precisa',icon:'[*]',cor:'#ec4899',bg:'#fdf2f8'},
  ];

  const metodos=[
    {id:'mpesa',nome:'M-Pesa',oper:'Vodacom',cor:'#e30613',bg:'#fef2f2'},
    {id:'emola',nome:'e-Mola',oper:'Movitel',cor:'#ff6b00',bg:'#fff7ed'},
    {id:'mkesh',nome:'mKesh',oper:'Tmcel',cor:'#00a650',bg:'#f0fdf4'},
  ];

  const c = categorias.find(x=>x.id===cat);
  const v = parseInt(form.valor||'0')||0;
  const taxa = Math.round(v*0.10);
  const total = v+taxa;
  const provs=["Maputo Cidade","Maputo Provincia","Gaza","Inhambane","Sofala","Manica","Tete","Zambézia","Nampula","Niassa","Cabo Delgado"];

  if(pagina==='form'){
    return (
      <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'}}>
        <header style={{background:'white',padding:'12px 20px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',position:'sticky',top:0}}>
          <b>FM FACILITA MOZAMBIQUE</b>
          <button onClick={()=>setPagina('home')} style={{border:'1px solid #ddd',background:'white',padding:'6px 12px',borderRadius:20,cursor:'pointer'}}>Voltar</button>
        </header>
        <div style={{maxWidth:520,margin:'0 auto',padding:20}}>
          <div style={{background:c?.bg,borderLeft:`4px solid ${c?.cor}`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontWeight:900,fontSize:18,color:c?.cor}}>{c?.nome}</div><div style={{fontSize:12,color:'#666'}}>{c?.sub}</div>
          </div>
          <div style={{background:'white',borderRadius:12,border:'1px solid #eee',padding:16}}>
            <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600}}>Descricao do servico</label><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',height:70,boxSizing:'border-box'}}/></div>
            <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600}}>Valor oficial (MT)</label><input value={form.valor} onChange={e=>setForm({...form,valor:e.target.value.replace(/[^0-9]/g,'')})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box'}}/></div>
            <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600}}>Provincia</label><select value={form.prov} onChange={e=>setForm({...form,prov:e.target.value})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box'}}>{provs.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
            <div style={{background:'#ecfdf5',borderRadius:10,padding:10,border:'1px solid #a7f3d0',marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}><span>Valor oficial:</span><b>{v} MT</b></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:4}}><span>Taxa 10%:</span><b>{taxa} MT</b></div>
              <div style={{background:'#10b981',color:'white',borderRadius:6,padding:'6px 8px',display:'flex',justifyContent:'space-between',fontWeight:800,marginTop:6}}><span>Total:</span><span>{total} MT</span></div>
            </div>
            <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600}}>Nome completo</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box'}}/></div>
            <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600}}>Telefone (comprovativo)</label><input value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box'}}/></div>
            <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600}}>Email (comprovativo)</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{width:'100%',marginTop:6,padding:10,borderRadius:8,border:'1px solid #ddd',boxSizing:'border-box'}}/></div>
            <div style={{border:'1px solid #eee',borderRadius:10,padding:10}}>
              <div style={{fontWeight:800,fontSize:13}}>PAGUE - Igual Betway</div>
              <div style={{fontSize:11,color:'#666',marginBottom:8}}>Recebera alerta para por PIN</div>
              {metodos.map(m=><button key={m.id} onClick={()=>setMetodo(m.id)} style={{display:'flex',alignItems:'center',gap:10,padding:10,borderRadius:8,border:metodo===m.id?`2px solid ${m.cor}`:'1px solid #eee',background:metodo===m.id?m.bg:'white',width:'100%',marginBottom:6,cursor:'pointer',textAlign:'left'}}><b style={{color:m.cor}}>{m.nome}</b><span style={{fontSize:11,color:'#666'}}>{m.oper}</span>{metodo===m.id&&<span style={{marginLeft:'auto',color:m.cor}}>✓</span>}</button>)}
              {metodo && <button onClick={()=>alert(`Pedido criado! Total ${total} MT via ${metodo}`)} style={{width:'100%',marginTop:8,padding:12,borderRadius:8,background:'black',color:'white',fontWeight:800,border:'none',cursor:'pointer'}}>Confirmar e pagar {total} MT</button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#fcfcfd',fontFamily:'sans-serif'}}>
      <header style={{background:'white',padding:'12px 20px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:20}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:32,height:32,background:'black',color:'white',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>FM</div><b style={{fontSize:12}}>FACILITA MOZAMBIQUE</b></div>
        <button onClick={()=>document.getElementById('cats')?.scrollIntoView({behavior:'smooth'})} style={{background:'black',color:'white',border:'none',padding:'8px 14px',borderRadius:20,fontWeight:700,cursor:'pointer'}}>Solicitar servico</button>
      </header>

      <div style={{background:'linear-gradient(135deg,#f0fdf4,#ecfeff)',padding:'30px 20px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1.2fr 0.8fr',gap:20}}>
          <div>
            <div style={{background:'white',border:'1px solid #a7f3d0',padding:'6px 10px',borderRadius:20,fontSize:11,color:'#065f46',display:'inline-block'}}>Plataforma privada - Nao e entidade publica</div>
            <h1 style={{fontSize:44,fontWeight:900,lineHeight:0.9,margin:'14px 0 0'}}>Voce envia.<br/><span style={{color:'#10b981'}}>Nos facilitamos.</span></h1>
            <p style={{color:'#555',fontSize:13,marginTop:10,maxWidth:460}}>Chega de filas! Tratamos IVA, multas, inspecoes, licencas e muito mais por si.</p>
            <div style={{marginTop:12,background:'black',color:'white',padding:'6px 12px',borderRadius:20,fontSize:12,fontWeight:700,display:'inline-block'}}>{frases[frase]}</div>
            <div style={{marginTop:16}}><button onClick={()=>document.getElementById('cats')?.scrollIntoView({behavior:'smooth'})} style={{background:'black',color:'white',padding:'12px 20px',borderRadius:20,fontWeight:700,border:'none',cursor:'pointer'}}>Solicitar servico →</button></div>
            <div style={{marginTop:12,fontSize:12,color:'#666'}}>+2.340 pedidos facilitados • M-Pesa • e-Mola • mKesh</div>
          </div>
          <div style={{background:'white',borderRadius:12,padding:14,border:'1px solid #eee'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><b style={{fontSize:13}}>Pedido FMZ-2026-001024</b><span style={{background:'#dcfce7',color:'#166534',padding:'4px 8px',borderRadius:8,fontSize:11}}>Em processamento</span></div>
            <div style={{fontSize:12,display:'flex',flexDirection:'column',gap:6}}><div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#666'}}>Servico</span><b>IVA - 03/2026</b></div><div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#666'}}>Valor</span><b>12.500 MT</b></div></div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'20px'}}>
        <h3 style={{textAlign:'center',fontSize:18,fontWeight:800}}>Como funciona?</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginTop:12}}>
          {["Envie","Confirme","Pague","Nos facilitamos","Receba"].map((t,i)=><div key={i} style={{background:'white',border:'1px solid #eee',borderRadius:10,padding:10,textAlign:'center'}}><div style={{width:20,height:20,borderRadius:10,background:'black',color:'white',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',fontSize:10}}>{i+1}</div><div style={{fontWeight:700,fontSize:11,marginTop:6}}>{t}</div></div>)}
        </div>

        <div id="cats" style={{marginTop:30}}>
          <h3 style={{textAlign:'center',fontSize:16,fontWeight:800}}>Categorias de servico</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:12}}>
            {categorias.map(c=><button key={c.id} onClick={()=>{setCat(c.id); setPagina('form'); window.scrollTo(0,0)}} style={{textAlign:'left',background:c.bg,border:`1px solid ${c.cor}40`,borderRadius:12,padding:12,cursor:'pointer'}}><div style={{fontWeight:800,fontSize:12,color:c.cor}}>{c.nome}</div><div style={{fontSize:10,color:'#666'}}>{c.sub}</div></button>)}
          </div>
        </div>
      </div>

      <a href="https://wa.me/258823832513?text=Ola Facilita Mocambique! Preciso de ajuda." target="_blank" style={{position:'fixed',bottom:20,left:20,background:'#25d366',width:50,height:50,borderRadius:25,display:'flex',alignItems:'center',justifyContent:'center',color:'white',textDecoration:'none',fontWeight:900,zIndex:50}}>W</a>
      <div style={{position:'fixed',bottom:20,right:20,background:'black',color:'white',width:50,height:50,borderRadius:25,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,zIndex:50}}>Chat</div>
    </div>
  );
}
