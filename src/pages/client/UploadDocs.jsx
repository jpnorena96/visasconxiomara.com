// src/pages/client/UploadDocs.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import CategoryChecklist from '../../components/CategoryChecklist';

export default function UploadDocs() {
  const [docs, setDocs] = useState([]);
  const [cats, setCats] = useState([]);
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    const [c, d] = await Promise.all([
      api.get('/api/v1/categories'),
      api.get('/api/v1/documents')
    ]);
    setCats(c);
    setDocs(d);
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file || !category) return setErr('Selecciona categoría y archivo');
    setErr(null); setBusy(true);
    try {
      const fd = new FormData();
      fd.append('category', category);  // soportado por backend (Form o Query)
      fd.append('file', file);
      await api.upload('/api/v1/documents', fd);
      setFile(null); setCategory('');
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Borrar documento?')) return;
    await api.json(`/api/v1/documents/${id}`, { method: 'DELETE', headers: api.headers() });
    await load();
  };

  return (
    <section className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Mis documentos</h1>
      <p className="text-sm text-slate-600">Sube cada documento en su categoría exacta.</p>

      <form onSubmit={onUpload} className="surface p-4 mt-4 grid sm:grid-cols-3 gap-3 items-end">
        <label className="block text-sm">
          Categoría
          <select className="form-select w-full mt-1" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Selecciona…</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          Archivo
          <input type="file" className="form-input w-full mt-1" onChange={e=>setFile(e.target.files[0])}/>
        </label>
        <button className="btn-primary h-11" disabled={busy}>{busy ? 'Subiendo…' : 'Subir'}</button>
      </form>

      {err && <div className="mt-2 text-red-600 text-sm">{err}</div>}

      <h2 className="mt-6 font-semibold">Progreso</h2>
      <CategoryChecklist uploaded={docs} />

      <h2 className="mt-6 font-semibold">Mis archivos</h2>
      <div className="mt-2 grid gap-2">
        {docs.map(d => (
          <div key={d.id} className="surface p-3 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">{d.category} — {d.original_name}</div>
              <div className="text-xs text-slate-500">{d.status}{d.admin_notes ? ` · ${d.admin_notes}` : ''}</div>
            </div>
            <div className="flex gap-2">
              <a className="btn-secondary h-9"
                 href={`${api.baseUrl}/api/v1/documents/${d.id}`} target="_blank" rel="noreferrer">Descargar</a>
              <button className="btn-primary h-9" onClick={()=>onDelete(d.id)}>Borrar</button>
            </div>
          </div>
        ))}
        {docs.length === 0 && <div className="text-sm text-slate-500">Aún no has subido archivos.</div>}
      </div>
    </section>
  );
}
