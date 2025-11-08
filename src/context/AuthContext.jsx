import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../utils/api' // asegúrate de tener el helper api.js

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔐 Iniciar sesión
  const login = async ({ email, password }) => {
    try {
      const { access_token } = await api.post('/api/v1/login', { email, password })
      api.setToken(access_token)
      const me = await api.get('/api/v1/me')
      setUser(me)
      return { ok: true, user: me }
    } catch (err) {
      console.error('Login error:', err)
      return { ok: false, message: err.message || 'Error de inicio de sesión' }
    }
  }

  // 🧾 Registro
  const register = async ({ email, password }) => {
    try {
      const { access_token } = await api.post('/api/v1/register', { email, password })
      api.setToken(access_token)
      const me = await api.get('/api/v1/me')
      setUser(me)
      return { ok: true, user: me }
    } catch (err) {
      console.error('Register error:', err)
      return { ok: false, message: err.message || 'Error de registro' }
    }
  }

  // 🚪 Cerrar sesión
  const logout = () => {
    api.clearToken()
    setUser(null)
  }

  // 🔄 Verificar si hay token guardado
  useEffect(() => {
    const init = async () => {
      try {
        if (api.token) {
          const me = await api.get('/api/v1/me')
          setUser(me)
        }
      } catch {
        api.clearToken()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
