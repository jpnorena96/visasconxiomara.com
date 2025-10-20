import React, { createContext, useContext, useMemo, useState } from 'react'
import { loginApi } from '../utils/fakeApi'
const AuthContext = createContext(null)
export function AuthProvider({ children }){
  const [user,setUser]=useState(null)
  const login = async ({ email, password })=>{ const res = await loginApi(email,password); if(res.ok) setUser(res.user); return res }
  const logout = ()=> setUser(null)
  const value = useMemo(()=>({ user, login, logout }),[user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = ()=> useContext(AuthContext)
