import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// ✅ Páginas públicas
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import Packages from "../pages/public/Packages";
import Resources from "../pages/public/Resources";
import Login from "../pages/public/Login";
import ScrollLanding from "../pages/public/ScrollLanding";

// ✅ Admin
import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import ReviewDocs from "../pages/admin/ReviewDocs";
import Reports from "../pages/admin/Reports";

// ✅ Cliente
import ClientPortal from "../pages/client/ClientPortal";
import IntakeForm from "../pages/client/IntakeForm";

// ✅ Protección de rutas
// ✅ Protección de rutas
import ProtectedRoute from "./ProtectedRoute";
import WhatsAppButton from "../components/WhatsAppButton";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* Navbar global */}
        <Navbar />

        {/* Contenido principal */}
        <main className="flex-1">
          <Routes>
            {/* Landing principal */}
            <Route path="/" element={<ScrollLanding />} />

            {/* Páginas públicas */}
            <Route path="/servicios" element={<Services />} />
            <Route path="/paquetes" element={<Packages />} />
            <Route
              path="/recursos"
              element={
                <ProtectedRoute allow={["customer", "admin"]}>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allow={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <ProtectedRoute allow={["admin"]}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documentos"
              element={
                <ProtectedRoute allow={["admin"]}>
                  <ReviewDocs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <ProtectedRoute allow={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Cliente (usa rol 'customer' del backend) */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute allow={["customer", "admin"]}>
                  <ClientPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formulario"
              element={
                <ProtectedRoute allow={["customer", "admin"]}>
                  <IntakeForm />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}
