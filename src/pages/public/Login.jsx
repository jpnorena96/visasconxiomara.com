import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock } from 'lucide-react'
export default function Login(){
  const { login } = useAuth()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const navigate=useNavigate()
  const onSubmit=async(e)=>{
    e.preventDefault()
    const res=await login({ email,password })
    if(res.ok) navigate('/portal'); else setError(res.message||'No se pudo iniciar sesión')
  }
  return (
    <section className="section max-w-lg">
      <div className="surface p-8">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mt-2 muted">Accede como cliente o administrador.</p>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">Correo
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Mail size={18}/><input className="w-full outline-none" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com"/>
            </div>
          </label>
          <label className="block text-sm">Contraseña
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Lock size={18}/><input type="password" className="w-full outline-none" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
            </div>
          </label>
          <button className="btn-xiomara w-full h-12 rounded-xl">Entrar</button>
          <div className="text-xs text-ink-500 mt-2">Admin demo: admin@xiomara.com / admin123</div>
        </form>
      </div>
    </section>
  )
}
