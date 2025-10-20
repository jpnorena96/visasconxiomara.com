import React from 'react'
import { Link } from 'react-router-dom'
export default function Dashboard(){
  return (
    <section className="section">
      <h1 className="text-3xl font-bold">Panel Administrador</h1>
      <p className="mt-2 text-ink-600">Control central de clientes y documentos.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="surface p-6"><h3 className="font-semibold">Clientes</h3><p className="mt-2 muted">Revisa datos y documentos.</p><Link to="/admin/clientes" className="btn-xiomara rounded-xl mt-4 inline-flex h-11 px-4">Abrir</Link></div>
        <div className="surface p-6"><h3 className="font-semibold">Plantillas</h3><p className="mt-2 muted">Gestiona formularios.</p><button className="btn h-11 px-4 bg-gray-900 text-white rounded-xl mt-4">Configurar</button></div>
        <div className="surface p-6"><h3 className="font-semibold">Reportes</h3><p className="mt-2 muted">Descarga resúmenes.</p><button className="btn h-11 px-4 bg-gray-900 text-white rounded-xl mt-4">Ver</button></div>
      </div>
    </section>
  )
}
