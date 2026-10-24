// @ts-nocheck
import React from 'react';

export default function AdminPanel(){
  return (
    <div className="p-4 bg-[#f8fafc] min-h- max-w- mx-auto">
      <div className="text- font-black text-[#1e2f4a]">PAINEL ADMIN - CONTRATA-MZ</div>
      <div className="text- mt-2 text-[#64748b]">Este arquivo sempre teve - gestão de contratos e viagens</div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border-2 border-[#e2e8f0] p-4 rounded-">
          <div className="text- font-black">Contratos</div>
          <div className="text- font-black mt-2">11</div>
          <div className="text- text-[#64748b]">cláusulas ativas</div>
        </div>
        <div className="bg-white border-2 border-[#e2e8f0] p-4 rounded-">
          <div className="text- font-black">Viagens</div>
          <div className="text- font-black mt-2">5</div>
          <div className="text- text-[#64748b]">viaturas Coaster 29</div>
        </div>
        <div className="bg-white border-2 border-[#e2e8f0] p-4 rounded-">
          <div className="text- font-black">Transportadores</div>
          <div className="text- font-black mt-2">3</div>
          <div className="text- text-[#64748b]">nagi, raul, joao</div>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded- p-4">
        <div className="text- font-black">Últimas atividades</div>
        <div className="text- mt-2">? Contrato gerado - Maputo-Beira</div>
        <div className="text-">? Viatura 29 lugares registada</div>
      </div>
    </div>
  )
}