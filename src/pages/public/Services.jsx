import React from 'react'
export default function Services(){
  const items=[
    { title:'EE. UU. – Turismo (B1/B2)', desc:'DS-160, gestión de citas, coaching y checklist de arraigo.' },
    { title:'EE. UU. – Estudiante (F-1)', desc:'Selección de escuela, I-20/SEVIS y preparación intensiva.' },
    { title:'Canadá – Estudio', desc:'SOP persuasiva, solvencia y portal oficial.' },
    { title:'España – Estudio', desc:'LOA, IPREM, seguros, alojamiento y visado nacional.' },
    { title:'España – No lucrativa', desc:'Seguro privado y solvencia 400% IPREM.' },
    { title:'España – Nómada digital', desc:'Contratos remotos e ingresos verificables.' },
  ]
  return (
    <section className="section">
      <h2 className="text-3xl font-bold">Servicios</h2>
      <p className="mt-2 text-ink-600">Acompañamiento experto de principio a fin.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(it=>(
          <article key={it.title} className="surface p-6 hover:shadow-glow transition">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-ink-600">{it.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
