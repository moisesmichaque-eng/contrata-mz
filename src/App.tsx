// @ts-nocheck
import React, { useState } from 'react';
import EncontrarReal from './EncontrarReal';
import ViajarReal from './ViajarReal';
import VenderReal from './VenderReal';
import ContratosReal from './ContratosReal';

export default function App(){
  const [tab, setTab] = useState('vender');
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w- mx-auto px-4 py-2 flex gap-2">
          <button onClick={()=>setTab('encontrar')} className={tab==='encontrar' ? 'px-5 py-2 rounded-full bg-[#0a66c2] text-white font-black text-' : 'px-5 py-2 rounded-full bg-white border text-'}>🔍 ENCONTRAR</button>
          <button onClick={()=>setTab('viajar')} className={tab==='viajar' ? 'px-5 py-2 rounded-full bg-[#1e2f4a] text-white font-black text-' : 'px-5 py-2 rounded-full bg-white border text-'}>🚌 VIAJAR</button>
          <button onClick={()=>setTab('vender')} className={tab==='vender' ? 'px-5 py-2 rounded-full bg-[#facc15] text-black border-2 border-black font-black text-' : 'px-5 py-2 rounded-full bg-white border text-'}>🛒 VENDER</button>
          <button onClick={()=>setTab('contratos')} className={tab==='contratos' ? 'px-5 py-2 rounded-full bg-[#8b5cf6] text-white font-black text-' : 'px-5 py-2 rounded-full bg-white border text-'}>📄 CONTRATOS</button>
        </div>
      </div>
      {tab==='encontrar' && <EncontrarReal />}
      {tab==='viajar' && <ViajarReal />}
      {tab==='vender' && <VenderReal />}
      {tab==='contratos' && <ContratosReal />}
    </div>
  )
}