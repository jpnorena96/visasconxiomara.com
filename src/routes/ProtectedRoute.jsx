import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute({ children, allow=['client','admin'] }){
  const { user } = useAuth()
  if(!user) return <Navigate to="/login" replace />
  if(!allow.includes(user.role)) return <Navigate to="/" replace />
  return children
}
