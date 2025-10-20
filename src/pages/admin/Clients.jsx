import React from 'react'
export default function Clients(){
  const data=[
    { name:'Ana Pérez', country:'EE. UU.', status:'Pendiente' },
    { name:'Luis Gómez', country:'Canadá', status:'En revisión' },
    { name:'María Díaz', country:'España', status:'Completado' },
  ]
  return (
    <section className="section">
      <h2 className="text-2xl font-semibold">Clientes</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left bg-gray-50"><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">País</th><th className="px-4 py-2">Estado</th></tr></thead>
          <tbody>{data.map((r,i)=>(<tr key={i} className="border-b"><td className="px-4 py-2">{r.name}</td><td className="px-4 py-2">{r.country}</td><td className="px-4 py-2">{r.status}</td></tr>))}</tbody>
        </table>
      </div>
    </section>
  )
}
