import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allow = ['customer', 'admin'] }) {
  const { user, loading } = useAuth()

  // Mientras se verifica el token o se obtiene el usuario
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Cargando sesión...
      </div>
    )
  }

  // No hay sesión activa → redirige al login
  if (!user) return <Navigate to="/login" replace />

  // Usuario autenticado pero sin permiso → redirige al inicio
  if (!allow.includes(user.role)) return <Navigate to="/" replace />

  // Todo OK → muestra el contenido protegido
  return children
}
