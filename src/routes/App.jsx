import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";


// ✅ Páginas públicas
import Home from "../pages/public/Home";              // Nueva landing con Hero + WhyAdvisorSection
import Services from "../pages/public/Services";
import Packages from "../pages/public/Packages";
import Resources from "../pages/public/Resources";
import Login from "../pages/public/Login";
import ScrollLanding from "../pages/public/ScrollLanding";
// ✅ Admin
import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";

// ✅ Cliente
import ClientPortal from "../pages/client/ClientPortal";
import IntakeForm from "../pages/client/IntakeForm";

// ✅ Protección de rutas
import ProtectedRoute from "./ProtectedRoute";

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
            <Route path="/recursos" element={<Resources />} />
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

            {/* Cliente */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute allow={["client", "admin"]}>
                  <ClientPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formulario"
              element={
                <ProtectedRoute allow={["client", "admin"]}>
                  <IntakeForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer global */}
    
      </div>
    </AuthProvider>
  );
}
