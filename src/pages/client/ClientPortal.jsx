import React, { useState } from 'react'
import { uploadFilesApi } from '../../utils/fakeApi'
export default function ClientPortal(){
  const [files,setFiles]=useState([])
  const [uploaded,setUploaded]=useState([])
  const [busy,setBusy]=useState(false)
  const onChange = (e)=> setFiles(Array.from(e.target.files||[]))
  const onSubmit = async (e)=>{
    e.preventDefault(); setBusy(true)
    const res = await uploadFilesApi(files); setBusy(false)
    if(res.ok){ setUploaded(res.uploaded); alert('Archivos enviados (demo). Conecta tu backend para guardarlos.') }
  }
  return (
    <section className="section max-w-2xl">
      <h1 className="text-3xl font-bold">Portal del Cliente</h1>
      <p className="mt-2 muted">Carga documentos y completa tu formulario.</p>
      <div className="mt-6 grid gap-6">
        <form className="surface p-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm">Subir documentos (PDF, JPG, PNG)</label>
            <input type="file" className="mt-2 block w-full" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={onChange}/>
          </div>
          {files.length>0 && <ul className="text-sm text-ink-600">{files.map((f,i)=>(<li key={i}>• {f.name} ({Math.round(f.size/1024)} KB)</li>))}</ul>}
          <button className="btn-xiomara w-full h-12 rounded-xl" disabled={busy}>{busy?'Enviando...':'Subir'}</button>
          {uploaded.length>0 && <p className="text-sm text-green-700">Subidos: {uploaded.map(u=>u.name).join(', ')}</p>}
        </form>
        <a href="/formulario" className="btn h-12 rounded-xl bg-gray-900 text-white text-center">Completar Formulario de Datos</a>
        <div className="surface p-6">
          <h3 className="font-semibold">Recordatorio</h3>
          <ul className="mt-2 text-sm text-ink-600 list-disc pl-5">
            <li>Pasaporte y DNI escaneados</li>
            <li>Estados de cuenta y certificados financieros</li>
            <li>Historial de viajes y cartas laborales/estudio</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
