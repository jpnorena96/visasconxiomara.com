import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if(!email || !password){
      setError('Por favor completa correo y contraseña.')
      return
    }
    try {
      setLoading(true)
      // Pasamos el flag remember para que el helper guarde token en storage persistente
      const res = await login({ email, password, remember })
      if(res?.ok){
        const role = res.user?.role
        if (role === 'admin') navigate('/admin')
        else navigate('/portal')
      } else {
        setError(res?.message || 'No se pudo iniciar sesión')
      }
    } catch (err){
      setError('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-[80vh] grid place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-xiomara-sky/20 via-white to-xiomara-pink/10"/>
      <div className="absolute -z-10 inset-0 opacity-20"
           style={{backgroundImage:'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize:'16px 16px'}}/>

      <div className="w-full max-w-md p-1 rounded-2xl bg-gradient-to-r from-xiomara-pink/50 to-xiomara-sky/50 shadow-glow">
        <div className="surface p-8 rounded-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-xiomara-pink text-white shadow-soft">
              <LogIn size={22} />
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-xiomara-navy">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-ink-600">Accede como cliente o administrador</p>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3" role="alert">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <label className="block text-sm">
              Correo
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 focus-within:border-xiomara-pink">
                <Mail size={18} className="text-ink-500"/>
                <input
                  className="w-full outline-none placeholder:text-slate-400"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block text-sm">
              Contraseña
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 focus-within:border-xiomara-pink">
                <Lock size={18} className="text-ink-500"/>
                <input
                  type={showPwd? 'text':'password'}
                  className="w-full outline-none placeholder:text-slate-400"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={()=>setShowPwd(s=>!s)} className="p-1 rounded-md hover:bg-slate-100">
                  {showPwd? <EyeOff size={18}/> : <Eye size={18}/> }
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox rounded"
                  checked={remember}
                  onChange={e=>setRemember(e.target.checked)}
                />
                <span className="text-ink-600">Recordarme</span>
              </label>
              <a href="#" className="link">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              className="btn-primary w-full h-12 rounded-2xl disabled:opacity-60"
              disabled={loading}
            >{loading? 'Entrando…' : 'Entrar'}</button>

            <p className="text-xs text-ink-500 text-center">Admin demo: admin@xiomara.com / admin123</p>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-500">
            <div className="flex-1 h-px bg-slate-200"/><span>o continúa con</span><div className="flex-1 h-px bg-slate-200"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="surface py-2 rounded-xl text-sm hover:shadow-glow" type="button">Google</button>
            <button className="surface py-2 rounded-xl text-sm hover:shadow-glow" type="button">Microsoft</button>
          </div>
        </div>
      </div>
    </section>
  )
}
