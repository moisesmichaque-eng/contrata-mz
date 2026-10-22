
// V90 FINAL - 22/10/2026 22:18 - FIX DEFINITIVO BRANCO - BASE V86 QUE DEU VERDE + LAYOUT FOTOS
import React, { useState } from 'react';

export default function App() {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [tab, setTab] = useState('frota');

  const viaturas = [
    { id: 1, mat: 'MMN-123-MP', marca: 'Toyota Coaster', lot: 29, estado: 'Ativa', km: 45200 },
    { id: 2, mat: 'MMN-456-MP', marca: 'Toyota Hiace', lot: 15, estado: 'Manutenção', km: 32100 },
    { id: 3, mat: 'MMN-789-MP', marca: 'Mitsubishi Rosa', lot: 33, estado: 'Ativa', km: 58900 },
  ];

  const reservas = [
    { id: 1, cliente: 'João Machava', mat: 'MMN-123-MP', lugar: 5, rota: 'Maputo - Xai-Xai', status: 'Pendente' },
    { id: 2, cliente: 'Ana Mondlane', mat: 'MMN-123-MP', lugar: 12, rota: 'Maputo - Beira', status: 'Pendente' },
  ];

  const assentos = Array.from({ length: 29 }, (_, i) => i + 1);

  if (!logado) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
        <div style={{ background: 'white', padding: 30, borderRadius: 12, width: 350 }}>
          <h1 style={{ textAlign: 'center', color: '#0f172a' }}>CONTRATA-MZ</h1>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12 }}>Gestão de Frotas</p>
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuario: nagi" style={{ width: '100%', padding: 12, marginTop: 20, borderRadius: 8, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
          <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Senha: 123" style={{ width: '100%', padding: 12, marginTop: 10, borderRadius: 8, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
          <button onClick={() => { if (user === 'nagi' && pass === '123') setLogado(true); else alert('Use nagi / 123'); }} style={{ width: '100%', padding: 12, marginTop: 15, background: '#0f172a', color: 'white', border: 0, borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>ENTRAR</button>
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>V90 FIX BRANCO - BASE V86</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial' }}>
      <div style={{ background: '#0f172a', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b>CONTRATA-MZ | NAGI INVEST</b>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setTab('frota')} style={{ padding: '8px 14px', borderRadius: 6, border: 0, cursor: 'pointer', background: tab === 'frota' ? '#f59e0b' : '#1e293b', color: 'white', fontWeight: 'bold' }}>Minha Frota</button>
          <button onClick={() => setTab('registar')} style={{ padding: '8px 14px', borderRadius: 6, border: 0, cursor: 'pointer', background: tab === 'registar' ? '#f59e0b' : '#1e293b', color: 'white', fontWeight: 'bold' }}>Registar Viatura</button>
          <button onClick={() => setTab('mapa')} style={{ padding: '8px 14px', borderRadius: 6, border: 0, cursor: 'pointer', background: tab === 'mapa' ? '#f59e0b' : '#1e293b', color: 'white', fontWeight: 'bold' }}>Mapa 29</button>
          <button onClick={() => setLogado(false)} style={{ padding: '8px 14px', borderRadius: 6, border: 0, cursor: 'pointer', background: '#ef4444', color: 'white' }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: '#dcfce7', border: '1px solid #22c55e', padding: 10, borderRadius: 8, marginBottom: 15, color: '#15803d' }}>
          LOGADO COM SUCESSO | Area: {tab} | Frota: 3 viaturas | V90 FIX BRANCO
        </div>

        {tab === 'frota' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
            <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3>Minhas Viaturas</h3>
              {viaturas.map(v => (
                <div key={v.id} style={{ border: '1px solid #e2e8f0', padding: 10, borderRadius: 8, marginBottom: 8, background: v.estado === 'Ativa' ? '#f0fdf4' : '#fef3c7' }}>
                  <b>{v.mat}</b> - {v.marca}<br />
                  <small>Lotação: {v.lot} | {v.estado} | {v.km}km</small>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3>Mapa 29 - Lugares 1-28 + WC</h3>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'center', fontSize: 10, background: '#0f172a', color: 'white', padding: 4, borderRadius: 4, marginBottom: 8 }}>FRENTE</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {assentos.map(n => (
                    <div key={n} style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center', borderRadius: 6, fontSize: 12, background: n === 28 ? '#f1f5f9' : 'white' }}>
                      {n === 28 ? 'WC' : n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3>Reservas</h3>
              {reservas.map(r => (
                <div key={r.id} style={{ border: '1px solid #f59e0b', padding: 10, borderRadius: 8, marginBottom: 8, background: '#fffbeb' }}>
                  <b>{r.cliente}</b><br />
                  <small>Lugar {r.lugar} | {r.mat}<br />{r.rota}</small><br />
                  <button style={{ marginTop: 6, background: '#22c55e', color: 'white', border: 0, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Aprovar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'registar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 15 }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, borderBottom: '2px solid #f59e0b', paddingBottom: 8 }}>REGISTAR NOVA VIATURA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 15 }}>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>MATRICULA</label><input placeholder="MMN-123-MP" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>MARCA</label><input placeholder="Toyota Coaster" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>MODELO</label><input placeholder="Coaster 2020" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>ANO</label><input placeholder="2020" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>LOTACAO</label><input placeholder="29" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>TIPO</label><select style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}><option>Mini-Bus</option><option>Coaster</option><option>Hiace</option></select></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>COMBUSTIVEL</label><select style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}><option>Diesel</option><option>Gasolina</option></select></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>ESTADO</label><select style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}><option>Ativa</option><option>Manutenção</option></select></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>ROTA</label><input placeholder="Maputo - Xai-Xai" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 'bold' }}>KM</label><input placeholder="45200" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 11, fontWeight: 'bold' }}>DOCUMENTOS / FOTOS</label><input type="file" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px dashed #cbd5e1' }} /></div>
              </div>
              <button style={{ width: '100%', marginTop: 15, padding: 12, background: '#0f172a', color: 'white', border: 0, borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>GUARDAR VIATURA</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}><h4>Frota Atual</h4>{viaturas.map(v => <div key={v.id} style={{ fontSize: 12, padding: 6, borderBottom: '1px solid #f1f5f9' }}><b>{v.mat}</b> - {v.estado}</div>)}</div>
              <div style={{ background: '#fffbeb', padding: 15, borderRadius: 10, border: '1px solid #f59e0b' }}><h4 style={{ margin: 0 }}>Info</h4><p style={{ fontSize: 12 }}>Preencha todos os campos obrigatórios. Foto da viatura ajuda aprovação.</p></div>
            </div>
          </div>
        )}

        {tab === 'mapa' && (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: 15 }}>
            <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4>Viaturas</h4>
              {viaturas.map(v => <div key={v.id} style={{ padding: 8, borderRadius: 6, marginBottom: 6, background: '#0f172a', color: 'white', fontSize: 12, cursor: 'pointer' }}>{v.mat}<br /><small>{v.lot} lugares</small></div>)}
            </div>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h3 style={{ textAlign: 'center', marginTop: 0 }}>MAPA 29 LUGARES - {viaturas[0].mat}</h3>
              <div style={{ maxWidth: 320, margin: '0 auto', background: '#f8fafc', padding: 15, borderRadius: 10, border: '2px solid #0f172a' }}>
                <div style={{ background: '#0f172a', color: 'white', textAlign: 'center', padding: 6, borderRadius: 6, fontSize: 11, marginBottom: 10 }}>FRENTE - MOTORISTA</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.3fr 1fr 1fr', gap: 8 }}>
                  {Array.from({ length: 28 }, (_, i) => {
                    const num = i + 1;
                    return <div key={num} style={{ border: '1px solid #94a3b8', background: 'white', padding: 10, textAlign: 'center', borderRadius: 6, fontWeight: 'bold', fontSize: 12 }}>{num}</div>;
                  })}
                  <div style={{ gridColumn: 'span 5', height: 10 }}></div>
                  <div style={{ gridColumn: '4 / span 2', border: '1px solid #94a3b8', background: '#e2e8f0', padding: 10, textAlign: 'center', borderRadius: 6, fontSize: 11 }}>WC</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4>Reservas - Aprovar</h4>
              {reservas.map(r => (
                <div key={r.id} style={{ border: '1px solid #e2e8f0', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                  <b style={{ fontSize: 12 }}>{r.cliente}</b><br />
                  <span style={{ fontSize: 11 }}>Lugar {r.lugar} | {r.mat}<br />{r.rota} | {r.status}</span>
                  <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                    <button style={{ flex: 1, background: '#22c55e', color: 'white', border: 0, padding: 6, borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Aprovar</button>
                    <button style={{ flex: 1, background: '#ef4444', color: 'white', border: 0, padding: 6, borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Rejeitar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
