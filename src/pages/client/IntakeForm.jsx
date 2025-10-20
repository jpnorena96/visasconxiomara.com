import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  apellidos: z.string().min(2,'Requerido'),
  nombres: z.string().min(2,'Requerido'),
  fechaNacimiento: z.string().min(1,'Requerido'),
  nacionalidad: z.string().min(1,'Requerido'),
  pasaporte: z.string().min(3,'Requerido'),
  nivelEducativo: z.string().optional(),
  institucion: z.string().optional(),
  ocupacion: z.string().optional(),
  compania: z.string().optional(),
  padreNombre: z.string().optional(),
  madreNombre: z.string().optional(),
  viajes: z.string().optional(),
  familiaresExterior: z.string().optional(),
})

const steps = ['Personales','Académica','Laboral','Familiar','Viajes','Generales','Confirmación']

export default function IntakeForm(){
  const methods = useForm({ resolver: zodResolver(schema), defaultValues:{} })
  const { handleSubmit, register, formState:{ errors } } = methods
  const [step,setStep] = React.useState(0)
  const next = ()=> setStep(s=>Math.min(s+1,steps.length-1))
  const prev = ()=> setStep(s=>Math.max(s-1,0))
  const goto = (n)=> setStep(Math.max(0,Math.min(steps.length-1,n)))

  const onSubmit = (data)=>{
    if(step < steps.length-1){ next(); return }
    alert('Formulario enviado (demo). Conecta backend para guardar.')
    console.log('DATA', data)
  }

  return (
    <section className="section max-w-3xl">
      <h1 className="text-3xl font-bold">Formulario de Datos – Visa</h1>
      <p className="mt-2 muted">Completa la información requerida.</p>
      <FormProvider {...methods}>
        <form className="surface p-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
          <Stepper step={step} setStep={goto} />
          {step===0 && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Field label="Apellidos" name="apellidos" register={register} errors={errors} />
              <Field label="Nombres" name="nombres" register={register} errors={errors} />
              <Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" register={register} errors={errors} />
              <Field label="Nacionalidad(es)" name="nacionalidad" register={register} errors={errors} />
              <Field label="Número de pasaporte" name="pasaporte" register={register} errors={errors} />
            </div>
          )}
          {step===1 && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Field label="Nivel educativo más alto" name="nivelEducativo" register={register} errors={errors} />
              <Field label="Institución" name="institucion" register={register} errors={errors} />
            </div>
          )}
          {step===2 && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Field label="Ocupación/Puesto" name="ocupacion" register={register} errors={errors} />
              <Field label="Compañía" name="compania" register={register} errors={errors} />
            </div>
          )}
          {step===3 && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Field label="Nombre del Padre" name="padreNombre" register={register} errors={errors} />
              <Field label="Nombre de la Madre" name="madreNombre" register={register} errors={errors} />
            </div>
          )}
          {step===4 && (
            <div className="mt-6">
              <label className="block text-sm">Historial de viajes (PAÍS | AÑO | MOTIVO | ENTRADA | SALIDA)</label>
              <textarea className="mt-2 w-full border rounded-xl p-3" rows="6" placeholder="Ej: EEUU | 2023 | Turismo | 2023-06-01 | 2023-06-20" {...register('viajes')}></textarea>
            </div>
          )}
          {step===5 && (
            <div className="mt-6 grid gap-4">
              <Field label="¿Familiares en Canadá/EEUU? (nombres, relación, dirección)" name="familiaresExterior" register={register} errors={errors} />
              <p className="text-sm text-ink-500">Más preguntas (visa anterior, huellas, negaciones, residencia) se pueden habilitar aquí.</p>
            </div>
          )}
          {step===6 && (<div className="mt-6"><p className="text-ink-700">Revisa tu información. Al enviar, se guardará (demo).</p></div>)}
          <div className="mt-8 flex items-center justify-between">
            <button type="button" className="btn h-11 px-4 bg-white border border-ink-200 rounded-xl hover:bg-ink-50" onClick={prev} disabled={step===0}>Atrás</button>
            <button type="submit" className="btn-xiomara h-11 px-6 rounded-xl">{step===steps.length-1 ? 'Enviar' : 'Continuar'}</button>
          </div>
        </form>
      </FormProvider>
    </section>
  )
}
function Field({ label, name, type='text', register, errors }){
  return (
    <label className="block text-sm">
      {label}
      <input type={type} className="mt-1 w-full border rounded-xl px-3 py-2" {...register(name)} />
      {errors[name] && <span className="text-xs text-red-600">{errors[name].message}</span>}
    </label>
  )
}
function Stepper({ step, setStep }){
  const s=['Personales','Académica','Laboral','Familiar','Viajes','Generales','Confirmación']
  return (
    <ol className="grid md:grid-cols-7 gap-2 text-xs">
      {s.map((t,i)=>(
        <li key={i}><button type="button" onClick={()=>setStep(i)} className={`w-full px-2 py-2 rounded-xl border ${i===step? 'bg-xiomara-sky text-white border-xiomara-sky':'bg-white hover:bg-gray-50'}`}>{i+1}. {t}</button></li>
      ))}
    </ol>
  )
}
