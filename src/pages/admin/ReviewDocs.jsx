// src/pages/admin/ReviewDocs.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

export default function ReviewDocs() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [docs, setDocs] = useState([]);

  const loadCustomers = async () => setCustomers(await api.get('/api/v1/admin/customers'));
  const loadDocs = async (uid) => setDocs(await api.get(`/api/v1/admin/customers/${uid}/documents`));

  useEffect(() => { loadCustomers(); }, []);

  const onSelect = async (uid) => {
    setSelected(uid);
    await loadDocs(uid);
  };

  const review = async (docId, status) => {
    await api.json(`/api/v1/admin/documents/${docId}`, {
      method: 'PATCH',
      headers: api.headers(),
      body: JSON.stringify({ status, admin_notes: status === 'approved' ? 'OK' : 'Falta nitidez' })
    });
    await loadDocs(selected);
  };

  return (
    <section className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Revisión de documentos</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-4">
        <aside className="surface p-3">
          <h2 className="font-semibold mb-2">Clientes</h2>
          <ul className="space-y-1 text-sm">
            {customers.map(c => (
              <li key={c.id}>
                <button className={`w-full text-left px-3 py-2 rounded-lg ${selected===c.id?'bg-slate-200':''}`}
                        onClick={()=>onSelect(c.id)}>{c.email}</button>
              </li>
            ))}
            {customers.length===0 && <li className="text-slate-500">Sin clientes.</li>}
          </ul>
        </aside>
        <main className="md:col-span-2">
          <h2 className="font-semibold mb-2">Documentos</h2>
          <div className="grid gap-2">
            {docs.map(d => (
              <div key={d.id} className="surface p-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{d.category} — {d.original_name}</div>
                  <div className="text-xs text-slate-500">{d.status}{d.admin_notes ? ` · ${d.admin_notes}` : ''}</div>
                </div>
                <div className="flex gap-2">
                  <a className="btn-secondary h-9" href={`${api.baseUrl}/api/v1/admin/documents/${d.id}/download`} target="_blank" rel="noreferrer">Ver</a>
                  <button className="h-9 px-3 rounded-2xl bg-green-600 text-white" onClick={()=>review(d.id,'approved')}>Aprobar</button>
                  <button className="h-9 px-3 rounded-2xl bg-red-600 text-white" onClick={()=>review(d.id,'rejected')}>Rechazar</button>
                </div>
              </div>
            ))}
            {selected && docs.length===0 && <div className="text-slate-500 text-sm">Sin documentos.</div>}
          </div>
        </main>
      </div>
    </section>
  );
}
