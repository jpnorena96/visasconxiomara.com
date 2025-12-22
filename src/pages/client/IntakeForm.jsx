import React from 'react'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, GraduationCap, Briefcase, Users, Plane, Globe,
  CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Plus, Trash2
} from 'lucide-react'
import { api } from '../../utils/api'
import { toast } from 'sonner'

const schema = z.object({
  apellidos: z.string().min(2, 'Requerido'),
  nombres: z.string().min(2, 'Requerido'),
  fechaNacimiento: z.string().min(1, 'Requerido'),
  nacionalidad: z.string().min(1, 'Requerido'),
  pasaporte: z.string().min(3, 'Requerido'),

  // Arrays
  educationHistory: z.array(z.object({
    nivel: z.string().min(1, 'Requerido'),
    institucion: z.string().min(1, 'Requerido'),
    desde: z.string().optional(),
    hasta: z.string().optional(),
  })).optional(),
  workHistory: z.array(z.object({
    empresa: z.string().min(1, 'Requerido'),
    cargo: z.string().min(1, 'Requerido'),
    desde: z.string().optional(),
    hasta: z.string().optional(),
  })).optional(),

  // Parents
  padre: z.object({
    nombres: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    lugarNacimiento: z.string().optional(),
    ocupacion: z.string().optional(),
    fallecido: z.boolean().optional(),
    fechaDefuncion: z.string().optional()
  }).optional(),
  madre: z.object({
    nombres: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    lugarNacimiento: z.string().optional(),
    ocupacion: z.string().optional(),
    fallecido: z.boolean().optional(),
    fechaDefuncion: z.string().optional()
  }).optional(),

  // Arrays - New Dynamic Sections
  travelHistory: z.array(z.object({
    pais: z.string().min(1, 'Requerido'),
    motivo: z.string().optional(),
    fechaEntrada: z.string().optional(),
    fechaSalida: z.string().optional()
  })).optional(),

  relativesHistory: z.array(z.object({
    nombre: z.string().min(1, 'Requerido'),
    parentesco: z.string().min(1, 'Requerido'),
    direccion: z.string().optional(),
    estatus: z.string().optional()
  })).optional(),

  // Legacy/Other
  familyMembers: z.array(z.object({
    nombres: z.string().min(1, 'Requerido'),
    apellidos: z.string().min(1, 'Requerido'),
    parentesco: z.string().min(1, 'Requerido'),
    fechaNacimiento: z.string().min(1, 'Requerido'),
    nacionalidad: z.string().min(1, 'Requerido'),
    pasaporte: z.string().min(1, 'Requerido'),
    ocupacion: z.string().optional(),
  })).optional()
})

const steps = [
  { id: 0, title: 'Personales', icon: User, description: 'Información básica del solicitante' },
  { id: 1, title: 'Académica', icon: GraduationCap, description: 'Historial educativo' },
  { id: 2, title: 'Laboral', icon: Briefcase, description: 'Experiencia profesional' },
  { id: 3, title: 'Familiar', icon: Users, description: 'Información familiar' },
  { id: 4, title: 'Viajes', icon: Plane, description: 'Historial de viajes' },
  { id: 5, title: 'Generales', icon: Globe, description: 'Información adicional' },
  { id: 6, title: 'Confirmación', icon: CheckCircle2, description: 'Revisar y enviar' },
]

export default function IntakeForm() {
  const methods = useForm({ resolver: zodResolver(schema), defaultValues: { familyMembers: [] } })
  const { handleSubmit, register, formState: { errors }, watch, reset, control } = methods
  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({ control, name: "familyMembers" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "educationHistory" });
  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control, name: "workHistory" });
  const { fields: travelFields, append: appendTravel, remove: removeTravel } = useFieldArray({ control, name: "travelHistory" });
  const { fields: relativeFields, append: appendRelative, remove: removeRelative } = useFieldArray({ control, name: "relativesHistory" });

  const [step, setStep] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState(new Set())
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [isFamily, setIsFamily] = React.useState(false)

  // Cargar datos existentes del formulario y perfil
  React.useEffect(() => {
    loadFormData()
    checkClientType()
  }, [])

  const checkClientType = async () => {
    try {
      const profile = await api.clients.getMyProfile()
      if (profile.application_type === 'family') {
        setIsFamily(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const loadFormData = async () => {
    setLoading(true)
    try {
      const formData = await api.forms.getMy()
      if (formData) {
        let family = [], edu = [], work = [], parents = {}, travel = [], relatives = [];
        try { family = formData.family_members_data ? JSON.parse(formData.family_members_data) : [] } catch (e) { }
        try { edu = formData.education_data ? JSON.parse(formData.education_data) : [] } catch (e) { }
        try { work = formData.work_data ? JSON.parse(formData.work_data) : [] } catch (e) { }
        try { parents = formData.parents_data ? JSON.parse(formData.parents_data) : {} } catch (e) { }

        try { travel = formData.viajes && formData.viajes.startsWith('[') ? JSON.parse(formData.viajes) : [] } catch (e) { }
        try { relatives = formData.familiares_exterior && formData.familiares_exterior.startsWith('[') ? JSON.parse(formData.familiares_exterior) : [] } catch (e) { }

        reset({
          apellidos: formData.apellidos || '',
          nombres: formData.nombres || '',
          fechaNacimiento: formData.fecha_nacimiento || '',
          nacionalidad: formData.nacionalidad || '',
          pasaporte: formData.pasaporte || '',

          educationHistory: edu,
          workHistory: work,
          travelHistory: travel,
          relativesHistory: relatives,

          padre: parents.padre || {},
          madre: parents.madre || {},
          familyMembers: family
        })
      }
    } catch (error) {
      // Si no existe formulario, está bien (es nuevo)
      console.log('No hay formulario previo')
    } finally {
      setLoading(false)
    }
  }

  const saveFormData = async (data, isCompleted = false) => {
    setSaving(true)
    try {
      // Mapear campos del frontend al backend
      const formData = {
        apellidos: data.apellidos,
        nombres: data.nombres,
        fecha_nacimiento: data.fechaNacimiento,
        nacionalidad: data.nacionalidad,
        pasaporte: data.pasaporte,

        education_data: JSON.stringify(data.educationHistory || []),
        work_data: JSON.stringify(data.workHistory || []),
        parents_data: JSON.stringify({ padre: data.padre, madre: data.madre }),

        viajes: JSON.stringify(data.travelHistory || []),
        familiares_exterior: JSON.stringify(data.relativesHistory || []),
        family_members_data: JSON.stringify(data.familyMembers || []),
        is_completed: isCompleted,
      }

      // Update client profile to reflect family status
      if (isFamily) {
        try {
          await api.clients.updateMyProfile({ application_type: 'family' });
        } catch (e) { console.error("Could not update profile type", e); }
      }

      await api.forms.createOrUpdate(formData)
      toast.success(isCompleted ? 'Formulario enviado exitosamente' : 'Progreso guardado')
    } catch (error) {
      toast.error('Error al guardar: ' + error.message)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const next = () => {
    setCompletedSteps(prev => new Set([...prev, step]))
    setStep(s => Math.min(s + 1, steps.length - 1))
  }
  const prev = () => setStep(s => Math.max(s - 1, 0))
  const goto = (n) => setStep(Math.max(0, Math.min(steps.length - 1, n)))

  const onSubmit = async (data) => {
    if (step < steps.length - 1) {
      // Guardar progreso y continuar
      try {
        await saveFormData(data, false)
        next()
      } catch (error) {
        // Error ya mostrado en saveFormData
      }
      return
    }

    // Último paso: enviar formulario completo
    try {
      await saveFormData(data, true)
      toast.success('¡Formulario enviado exitosamente!')
      // Opcional: redirigir al portal
      // window.location.href = '/portal'
    } catch (error) {
      // Error ya mostrado en saveFormData
    }
  }

  const progress = ((step + 1) / steps.length) * 100
  const allData = watch()

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-xiomara-sky/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-xiomara-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-xiomara-navy mb-3">
            Formulario de Solicitud de Visa
          </h1>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Complete la información requerida paso a paso. Todos sus datos están protegidos y cifrados.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-ink-700">
              Paso {step + 1} de {steps.length}
            </span>
            <span className="text-sm font-semibold text-xiomara-sky">
              {Math.round(progress)}% Completado
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-xiomara-sky to-xiomara-pink rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Step Navigation */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-7">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = i === step
              const isCompleted = completedSteps.has(i)
              const isPast = i < step

              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => goto(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex flex-col items-center p-4 rounded-xl border-2 transition-all
                    ${isActive
                      ? 'bg-gradient-to-br from-xiomara-sky to-xiomara-pink text-white border-transparent shadow-lg'
                      : isPast || isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-xiomara-sky/30 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="text-xs font-semibold text-center">{s.title}</span>
                  {(isCompleted || isPast) && !isActive && (
                    <CheckCircle2 size={16} className="absolute top-2 right-2" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <FormProvider {...methods}>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Step Header */}
            <div className="bg-gradient-to-r from-xiomara-sky/10 to-xiomara-pink/10 border-b border-gray-100 p-6">
              <div className="flex items-center gap-4">
                {React.createElement(steps[step].icon, {
                  size: 32,
                  className: 'text-xiomara-sky'
                })}
                <div>
                  <h2 className="text-2xl font-bold text-xiomara-navy">
                    {steps[step].title}
                  </h2>
                  <p className="text-sm text-ink-600 mt-1">
                    {steps[step].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field
                        label="Apellidos"
                        name="apellidos"
                        register={register}
                        errors={errors}
                        placeholder="Ingrese sus apellidos"
                        required
                      />
                      <Field
                        label="Nombres"
                        name="nombres"
                        register={register}
                        errors={errors}
                        placeholder="Ingrese sus nombres"
                        required
                      />
                      <Field
                        label="Fecha de Nacimiento"
                        name="fechaNacimiento"
                        type="date"
                        register={register}
                        errors={errors}
                        required
                      />
                      <Field
                        label="Nacionalidad(es)"
                        name="nacionalidad"
                        register={register}
                        errors={errors}
                        placeholder="Ej: Colombiana"
                        required
                      />
                      <Field
                        label="Número de Pasaporte"
                        name="pasaporte"
                        register={register}
                        errors={errors}
                        placeholder="Ej: AB123456"
                        required
                        className="md:col-span-2"
                      />
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-xiomara-navy">Historial Educativo</h3>
                        <button
                          type="button"
                          onClick={() => appendEdu({ nivel: '', institucion: '' })}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-xiomara-sky bg-xiomara-sky/10 rounded-lg hover:bg-xiomara-sky/20 transition-colors"
                        >
                          <Plus size={16} /> Agregar Institución
                        </button>
                      </div>

                      {eduFields.map((field, index) => (
                        <div key={field.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => removeEdu(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div className="grid md:grid-cols-2 gap-4">
                            <SelectField
                              label="Nivel Educativo"
                              name={`educationHistory.${index}.nivel`}
                              register={register}
                              errors={errors}
                              options={[
                                { value: '', label: 'Seleccione...' },
                                { value: 'secundaria', label: 'Secundaria' },
                                { value: 'tecnico', label: 'Técnico' },
                                { value: 'universitario', label: 'Universitario' },
                                { value: 'posgrado', label: 'Posgrado' },
                              ]}
                              required
                            />
                            <Field
                              label="Institución"
                              name={`educationHistory.${index}.institucion`}
                              register={register}
                              errors={errors}
                              placeholder="Nombre de la institución"
                              required
                            />
                            <Field
                              label="Fecha Inicio"
                              name={`educationHistory.${index}.desde`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                            <Field
                              label="Fecha Fin (Deje vacío si actual)"
                              name={`educationHistory.${index}.hasta`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                          </div>
                        </div>
                      ))}
                      {eduFields.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          Agregue su historial educativo.
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-xiomara-navy">Experiencia Laboral</h3>
                        <button
                          type="button"
                          onClick={() => appendWork({ empresa: '', cargo: '' })}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-xiomara-sky bg-xiomara-sky/10 rounded-lg hover:bg-xiomara-sky/20 transition-colors"
                        >
                          <Plus size={16} /> Agregar Trabajo
                        </button>
                      </div>

                      {workFields.map((field, index) => (
                        <div key={field.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => removeWork(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Field
                              label="Empresa / Empleador"
                              name={`workHistory.${index}.empresa`}
                              register={register}
                              errors={errors}
                              placeholder="Nombre de la empresa"
                              required
                            />
                            <Field
                              label="Cargo / Puesto"
                              name={`workHistory.${index}.cargo`}
                              register={register}
                              errors={errors}
                              placeholder="Su cargo"
                              required
                            />
                            <Field
                              label="Fecha Inicio"
                              name={`workHistory.${index}.desde`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                            <Field
                              label="Fecha Fin (Deje vacío si actual)"
                              name={`workHistory.${index}.hasta`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                          </div>
                        </div>
                      ))}
                      {workFields.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          Agregue su experiencia laboral reciente.
                        </div>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      {/* Family Mode Toggle */}
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <Users className="text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900">¿Aplica con su grupo familiar?</h4>
                          <p className="text-xs text-blue-700">Active esta opción para agregar miembros de su familia a la solicitud.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFamily}
                            onChange={(e) => setIsFamily(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Padre */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-xiomara-navy mb-3">Información del Padre</h4>
                          <div className="space-y-3">
                            <Field
                              label="Nombres Completos"
                              name="padre.nombres"
                              register={register}
                              errors={errors}
                              placeholder="Nombres y apellidos"
                            />
                            <Field
                              label="Fecha de Nacimiento"
                              name="padre.fechaNacimiento"
                              type="date"
                              register={register}
                              errors={errors}
                            />
                            <Field
                              label="Lugar de Nacimiento"
                              name="padre.lugarNacimiento"
                              register={register}
                              errors={errors}
                              placeholder="Ciudad, País"
                            />
                            <Field
                              label="Ocupación"
                              name="padre.ocupacion"
                              register={register}
                              errors={errors}
                              placeholder="Ocupación principal"
                            />
                            <div className="flex items-center gap-2 py-2">
                              <input
                                type="checkbox"
                                {...register("padre.fallecido")}
                                id="padreDead"
                                className="w-4 h-4 text-xiomara-sky rounded border-gray-300 focus:ring-xiomara-sky"
                              />
                              <label htmlFor="padreDead" className="text-sm font-medium text-gray-700">¿Fallecido?</label>
                            </div>
                            {watch("padre.fallecido") && (
                              <Field
                                label="Fecha de Defunción"
                                name="padre.fechaDefuncion"
                                type="date"
                                register={register}
                                errors={errors}
                              />
                            )}
                          </div>
                        </div>

                        {/* Madre */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-xiomara-navy mb-3">Información de la Madre</h4>
                          <div className="space-y-3">
                            <Field
                              label="Nombres Completos"
                              name="madre.nombres"
                              register={register}
                              errors={errors}
                              placeholder="Nombres y apellidos"
                            />
                            <Field
                              label="Fecha de Nacimiento"
                              name="madre.fechaNacimiento"
                              type="date"
                              register={register}
                              errors={errors}
                            />
                            <Field
                              label="Lugar de Nacimiento"
                              name="madre.lugarNacimiento"
                              register={register}
                              errors={errors}
                              placeholder="Ciudad, País"
                            />
                            <Field
                              label="Ocupación"
                              name="madre.ocupacion"
                              register={register}
                              errors={errors}
                              placeholder="Ocupación principal"
                            />
                            <div className="flex items-center gap-2 py-2">
                              <input
                                type="checkbox"
                                {...register("madre.fallecido")}
                                id="madreDead"
                                className="w-4 h-4 text-xiomara-sky rounded border-gray-300 focus:ring-xiomara-sky"
                              />
                              <label htmlFor="madreDead" className="text-sm font-medium text-gray-700">¿Fallecida?</label>
                            </div>
                            {watch("madre.fallecido") && (
                              <Field
                                label="Fecha de Defunción"
                                name="madre.fechaDefuncion"
                                type="date"
                                register={register}
                                errors={errors}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {isFamily && (
                        <div className="border-t border-gray-200 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-xiomara-navy">Miembros del Grupo Familiar</h3>
                            <button
                              type="button"
                              onClick={() => appendFamily({ nombres: '', apellidos: '', parentesco: '', fechaNacimiento: '', nacionalidad: '', pasaporte: '' })}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-xiomara-sky bg-xiomara-sky/10 rounded-lg hover:bg-xiomara-sky/20 transition-colors"
                            >
                              <Plus size={16} />
                              Agregar Miembro
                            </button>
                          </div>

                          <div className="space-y-4">
                            {familyFields.map((field, index) => {
                              const dob = watch(`familyMembers.${index}.fechaNacimiento`);
                              const age = dob ? Math.floor((new Date() - new Date(dob)) / 31557600000) : 0;
                              const isMinor = age > 0 && age < 18;

                              return (
                                <div key={field.id} className="bg-gray-50 p-4 rounded-xl relative border border-gray-200">
                                  <button
                                    type="button"
                                    onClick={() => removeFamily(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>

                                  <div className="mb-4">
                                    <h4 className="text-sm font-bold text-xiomara-navy uppercase tracking-wide">
                                      Miembro #{index + 1} {isMinor && <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Menor de Edad ({age} años)</span>}
                                    </h4>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4 pr-8">
                                    <Field
                                      label="Nombres"
                                      name={`familyMembers.${index}.nombres`}
                                      register={register}
                                      errors={errors}
                                      placeholder="Nombres"
                                      required
                                    />
                                    <Field
                                      label="Apellidos"
                                      name={`familyMembers.${index}.apellidos`}
                                      register={register}
                                      errors={errors}
                                      placeholder="Apellidos"
                                      required
                                    />
                                    <Field
                                      label="Parentesco"
                                      name={`familyMembers.${index}.parentesco`}
                                      register={register}
                                      errors={errors}
                                      placeholder="Ej: Hijo/a, Esposo/a"
                                      required
                                    />
                                    <Field
                                      label="Fecha de Nacimiento"
                                      name={`familyMembers.${index}.fechaNacimiento`}
                                      type="date"
                                      register={register}
                                      errors={errors}
                                      required
                                    />
                                    <Field
                                      label="Nacionalidad"
                                      name={`familyMembers.${index}.nacionalidad`}
                                      register={register}
                                      errors={errors}
                                      placeholder="Nacionalidad"
                                      required
                                    />
                                    <Field
                                      label="Número de Pasaporte"
                                      name={`familyMembers.${index}.pasaporte`}
                                      register={register}
                                      errors={errors}
                                      placeholder="Número de Pasaporte"
                                      required
                                    />
                                    <Field
                                      label={isMinor ? "Institución Educativa / Grado" : "Ocupación / Empresa"}
                                      name={`familyMembers.${index}.ocupacion`}
                                      register={register}
                                      errors={errors}
                                      placeholder={isMinor ? "Ej: Colegio San José - 5to Grado" : "Ej: Ingeniero - Google"}
                                    />
                                  </div>
                                </div>
                              )
                            })}
                            {familyFields.length === 0 && (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                No hay miembros agregados al grupo familiar.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-xiomara-navy">Historial de Viajes Internacionales</h3>
                        <button
                          type="button"
                          onClick={() => appendTravel({ pais: '', motivo: '' })}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-xiomara-sky bg-xiomara-sky/10 rounded-lg hover:bg-xiomara-sky/20 transition-colors"
                        >
                          <Plus size={16} /> Agregar Viaje
                        </button>
                      </div>

                      {travelFields.map((field, index) => (
                        <div key={field.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => removeTravel(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Field
                              label="País"
                              name={`travelHistory.${index}.pais`}
                              register={register}
                              errors={errors}
                              placeholder="Ej: Estados Unidos"
                              required
                            />
                            <Field
                              label="Motivo del Viaje"
                              name={`travelHistory.${index}.motivo`}
                              register={register}
                              errors={errors}
                              placeholder="Ej: Turismo"
                            />
                            <Field
                              label="Fecha Entrada"
                              name={`travelHistory.${index}.fechaEntrada`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                            <Field
                              label="Fecha Salida"
                              name={`travelHistory.${index}.fechaSalida`}
                              type="date"
                              register={register}
                              errors={errors}
                            />
                          </div>
                        </div>
                      ))}
                      {travelFields.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          Si ha viajado al extranjero en los últimos 10 años, agregue los registros aquí.
                        </div>
                      )}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-xiomara-navy">Familiares en EE.UU. o Canadá</h3>
                        <button
                          type="button"
                          onClick={() => appendRelative({ nombre: '', parentesco: '' })}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-xiomara-sky bg-xiomara-sky/10 rounded-lg hover:bg-xiomara-sky/20 transition-colors"
                        >
                          <Plus size={16} /> Agregar Familiar
                        </button>
                      </div>

                      {relativeFields.map((field, index) => (
                        <div key={field.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => removeRelative(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>

                          <div className="grid md:grid-cols-2 gap-4">
                            <Field
                              label="Nombre Completo"
                              name={`relativesHistory.${index}.nombre`}
                              register={register}
                              errors={errors}
                              placeholder="Nombres y apellidos"
                              required
                            />
                            <Field
                              label="Parentesco"
                              name={`relativesHistory.${index}.parentesco`}
                              register={register}
                              errors={errors}
                              placeholder="Ej: Hermano, Tía"
                              required
                            />
                            <Field
                              label="Dirección Completa"
                              name={`relativesHistory.${index}.direccion`}
                              register={register}
                              errors={errors}
                              placeholder="Dirección en el extranjero"
                            />
                            <Field
                              label="Estatus Legal"
                              name={`relativesHistory.${index}.estatus`}
                              register={register}
                              errors={errors}
                              placeholder="Ej: Ciudadano, Residente, Visa Vigente"
                            />
                          </div>
                        </div>
                      ))}
                      {relativeFields.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          Si tiene familiares directos en EE.UU. o Canadá, agréguelos aquí.
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                        <div className="flex gap-3">
                          <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                          <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-1">Información Adicional</p>
                            <p className="text-blue-700">
                              Asegúrese de declarar correctamente a familiares inmediatos (Diferente grupo familiar) para evitar inconsistencias en su solicitud consular.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="text-white" size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-emerald-900 mb-2">
                              ¡Casi Listo!
                            </h3>
                            <p className="text-emerald-700">
                              Revise cuidadosamente la información proporcionada antes de enviar.
                              Puede regresar a cualquier paso para hacer correcciones.
                            </p>
                          </div>
                        </div>
                      </div>

                      <SummarySection title="Información Personal" data={allData} fields={[
                        { key: 'apellidos', label: 'Apellidos' },
                        { key: 'nombres', label: 'Nombres' },
                        { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
                        { key: 'nacionalidad', label: 'Nacionalidad' },
                        { key: 'pasaporte', label: 'Pasaporte' },
                      ]} />

                      {/* Educación Summary */}
                      {allData.educationHistory?.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                          <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">Educación</h4>
                          <div className="space-y-3">
                            {allData.educationHistory.map((e, i) => (
                              <div key={i} className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                <div className="font-semibold text-ink-700">{e.nivel} en {e.institucion}</div>
                                <div className="text-xs text-ink-500">{e.desde} - {e.hasta || 'Actual'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trabajo Summary */}
                      {allData.workHistory?.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                          <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">Experiencia Laboral</h4>
                          <div className="space-y-3">
                            {allData.workHistory.map((w, i) => (
                              <div key={i} className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                <div className="font-semibold text-ink-700">{w.cargo} en {w.empresa}</div>
                                <div className="text-xs text-ink-500">{w.desde} - {w.hasta || 'Actual'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Padres Summary */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                        <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">Padres</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-xs font-bold text-gray-500">PADRE</span>
                            {allData.padre?.nombres ? (
                              <>
                                <div className="font-semibold">{allData.padre.nombres}</div>
                                <div className="text-xs text-gray-500">{allData.padre.fechaNacimiento} | {allData.padre.lugarNacimiento}</div>
                                {allData.padre.fallecido && <span className="text-xs text-red-500 font-bold">Fallecido</span>}
                              </>
                            ) : <span className="text-gray-400">No registrado</span>}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-gray-500">MADRE</span>
                            {allData.madre?.nombres ? (
                              <>
                                <div className="font-semibold">{allData.madre.nombres}</div>
                                <div className="text-xs text-gray-500">{allData.madre.fechaNacimiento} | {allData.madre.lugarNacimiento}</div>
                                {allData.madre.fallecido && <span className="text-xs text-red-500 font-bold">Fallecida</span>}
                              </>
                            ) : <span className="text-gray-400">No registrada</span>}
                          </div>
                        </div>
                      </div>

                      {/* Travel Summary */}
                      {allData.travelHistory?.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                          <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">Viajes Internacionales</h4>
                          <div className="space-y-3">
                            {allData.travelHistory.map((t, i) => (
                              <div key={i} className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                <div className="font-semibold text-ink-700">{t.pais} - {t.motivo}</div>
                                <div className="text-xs text-ink-500">{t.fechaEntrada} a {t.fechaSalida}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Relatives Summary */}
                      {allData.relativesHistory?.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                          <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">Familiares en Exterior</h4>
                          <div className="space-y-3">
                            {allData.relativesHistory.map((r, i) => (
                              <div key={i} className="text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                <div className="font-semibold text-ink-700">{r.nombre} ({r.parentesco})</div>
                                <div className="text-xs text-ink-500">{r.estatus || 'Estatus no especificado'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isFamily && allData.familyMembers && allData.familyMembers.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mt-4">
                          <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">
                            Miembros del Grupo
                          </h4>
                          <div className="space-y-2">
                            {allData.familyMembers.map((m, i) => (
                              <div key={i} className="text-sm text-ink-700">
                                <span className="font-semibold">{m.nombres} {m.apellidos}</span> ({m.parentesco})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-gray-50 border-t border-gray-100 p-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft size={20} />
                Atrás
              </button>

              <div className="text-sm text-ink-500">
                Paso {step + 1} de {steps.length}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                {step === steps.length - 1 ? (
                  <>
                    <CheckCircle2 size={20} />
                    Enviar Formulario
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </FormProvider>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-ink-500">
            ¿Necesita ayuda? Contacte a su asesor de visas o visite nuestra{' '}
            <a href="/recursos" className="text-xiomara-sky hover:text-xiomara-pink font-semibold underline">
              sección de recursos
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Field Component
function Field({ label, name, type = 'text', register, errors, placeholder, required, className = '', helpText }) {
  const hasError = errors[name]

  return (
    <div className={className}>
      <label className="block mb-2">
        <span className="text-sm font-semibold text-ink-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className={`
            mt-1.5 w-full px-4 py-3 rounded-xl border-2 transition-all
            focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20
            ${hasError
              ? 'border-red-300 bg-red-50 focus:border-red-400'
              : 'border-gray-200 bg-white focus:border-xiomara-sky hover:border-gray-300'
            }
          `}
          {...register(name)}
        />
      </label>
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {errors[name].message}
        </motion.p>
      )}
      {helpText && !hasError && (
        <p className="mt-1.5 text-xs text-ink-500">{helpText}</p>
      )}
    </div>
  )
}

// SelectField Component
function SelectField({ label, name, register, errors, options, required }) {
  const hasError = errors[name]

  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm font-semibold text-ink-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <select
          className={`
            mt-1.5 w-full px-4 py-3 rounded-xl border-2 transition-all
            focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20
            ${hasError
              ? 'border-red-300 bg-red-50 focus:border-red-400'
              : 'border-gray-200 bg-white focus:border-xiomara-sky hover:border-gray-300'
            }
          `}
          {...register(name)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {errors[name].message}
        </motion.p>
      )}
    </div>
  )
}

// TextAreaField Component
function TextAreaField({ label, name, register, errors, rows = 4, placeholder, helpText }) {
  const hasError = errors[name]

  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm font-semibold text-ink-700">{label}</span>
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`
            mt-1.5 w-full px-4 py-3 rounded-xl border-2 transition-all resize-none
            focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20
            ${hasError
              ? 'border-red-300 bg-red-50 focus:border-red-400'
              : 'border-gray-200 bg-white focus:border-xiomara-sky hover:border-gray-300'
            }
          `}
          {...register(name)}
        />
      </label>
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {errors[name].message}
        </motion.p>
      )}
      {helpText && !hasError && (
        <p className="mt-1.5 text-xs text-ink-500">{helpText}</p>
      )}
    </div>
  )
}

// Summary Section Component
function SummarySection({ title, data, fields }) {
  const hasData = fields.some(f => data[f.key])

  if (!hasData) return null

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h4 className="text-sm font-bold text-xiomara-navy mb-3 uppercase tracking-wide">
        {title}
      </h4>
      <dl className="grid md:grid-cols-2 gap-4">
        {fields.map(field => {
          if (!data[field.key]) return null
          return (
            <div key={field.key}>
              <dt className="text-xs text-ink-500 font-medium mb-1">{field.label}</dt>
              <dd className="text-sm text-ink-900 font-semibold">{data[field.key]}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
