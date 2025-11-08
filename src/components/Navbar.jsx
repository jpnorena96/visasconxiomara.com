import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, X, ChevronDown, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/** Utilidades de estilo */
const wrap        = "mx-auto w-full max-w-7xl px-4";
const linkBase    = "relative inline-flex items-center gap-1 py-2 text-sm transition";
const linkDefault = "text-ink-700 hover:text-xiomara-pink";
const linkActive  = "text-xiomara-pink";
const underline   = "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-xiomara-pink after:transition-all group-hover:after:w-full";
const chip        = "inline-flex w-9 h-9 items-center justify-center rounded-lg bg-xiomara-sky text-white";
const btnPrimary  = "inline-flex items-center justify-center h-10 px-4 text-sm font-semibold text-white bg-xiomara-sky hover:bg-xiomara-pink transition rounded-lg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const serviciosRef = useRef(null);
  const userMenuRef  = useRef(null);
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();

  /** Efecto de scroll para fondo/sombra */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Cerrar dropdowns al click fuera */
  useEffect(() => {
    const onClickOutside = (e) => {
      if (serviciosRef.current && !serviciosRef.current.contains(e.target)) setIsServiciosOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /** Cerrar menús al cambiar de ruta */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsServiciosOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname, hash]);

  /** Helper para estilos de NavLink */
  const navClass = ({ isActive }) =>
    `group ${linkBase} ${isActive ? linkActive : linkDefault} ${underline}`;

  const closeMobile = () => setIsMenuOpen(false);

  /** Marcar activo cuando estás en landing con #anclas */
  const isHashActive = (id) => pathname === "/" && hash === id;

  /** Logout handler */
  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate("/");
  };

  /** Ocultar navbar en rutas de auth (después de montar hooks) */
  const hide = ["/login"].includes(pathname);
  if (hide) return null;

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-transparent transition",
        scrolled ? "bg-white/95 backdrop-blur shadow-sm border-gray-100" : "bg-white/60 backdrop-blur"
      ].join(" ")}
      role="banner"
    >
      <div className={`${wrap} h-16 flex items-center justify-between`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-xiomara-navy">
          <span className={chip}>VX</span>
          <span>Visas Con Xiomara</span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <Link
            to="/#s1"
            className={`group ${linkBase} ${linkDefault} ${underline} ${isHashActive("#s1") ? linkActive : ""}`}
          >
            Inicio
          </Link>

          {/* Dropdown: Servicios */}
          <div
            className="relative"
            ref={serviciosRef}
            onMouseEnter={() => setIsServiciosOpen(true)}
            onMouseLeave={() => setIsServiciosOpen(false)}
          >
            <button
              className={`group ${linkBase} ${linkDefault} ${underline} rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60 px-1`}
              onClick={() => setIsServiciosOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={isServiciosOpen}
            >
              Servicios <ChevronDown size={16} className={`transition ${isServiciosOpen ? "rotate-180" : ""}`} />
            </button>

            {isServiciosOpen && (
              <div role="menu" className="absolute left-0 mt-2 w-56 rounded-lg border border-gray-100 bg-white shadow-lg p-1">
                <Link to="/servicios/usa" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50">Visa EE. UU.</Link>
                <Link to="/servicios/canada" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50">Visa Canadá</Link>
                <Link to="/servicios/espana" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50">España (Nómada/Residencia)</Link>
                <Link to="/servicios/otros" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50">Otros países</Link>
              </div>
            )}
          </div>

          <NavLink to="/paquetes" className={navClass}>Paquetes</NavLink>
          <NavLink to="/recursos" className={navClass}>Recursos</NavLink>

          {/* Atajos a screens de la landing */}
          <Link
            to="/#s4"
            className={`group ${linkBase} ${linkDefault} ${underline} ${isHashActive("#s4") ? linkActive : ""}`}
            title="Canadá"
          >
            Canadá
          </Link>
          <Link
            to="/#s5"
            className={`group ${linkBase} ${linkDefault} ${underline} ${isHashActive("#s5") ? linkActive : ""}`}
            title="España"
          >
            España
          </Link>
        </nav>

        {/* Acciones / CTA + Auth */}
        <div className="flex items-center gap-3">
          <Link
            to="/#contacto"
            className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full border-2 border-xiomara-navy text-xiomara-navy hover:bg-xiomara-navy hover:text-white transition text-sm font-semibold"
          >
            <Calendar size={16} /> Agenda tu asesoría
          </Link>

          {!user ? (
            <Link to="/login" className={btnPrimary} aria-label="Iniciar sesión">
              <LogIn size={18} className="mr-2" /> Iniciar sesión
            </Link>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((s) => !s)}
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <span className="hidden sm:inline text-ink-700">{user?.email ?? "Usuario"}</span>
                <ChevronDown size={16} />
              </button>
              {isUserMenuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-100 bg-white shadow-lg p-1">
                  <Link to="/portal" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                    Portal
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50 text-red-600 inline-flex items-center gap-2"
                  >
                    <LogOut size={16} /> Salir
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Menú móvil */}
          <button
            className="md:hidden inline-flex p-2 rounded-lg text-xiomara-navy hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60"
            onClick={() => setIsMenuOpen((s) => !s)}
            aria-label="Abrir menú"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white shadow-sm" role="dialog" aria-modal="true">
          <div className={`${wrap} py-3 flex flex-col gap-1`}>
            <Link to="/#s1" className={`group ${linkBase} ${linkDefault} ${underline}`} onClick={closeMobile}>Inicio</Link>

            {/* Servicios (acordeón) */}
            <details className="group rounded-md">
              <summary className="flex items-center justify-between py-2 cursor-pointer text-ink-700 hover:text-xiomara-pink px-1">
                <span className="text-sm font-medium">Servicios</span>
                <ChevronDown size={18} className="transition group-open:rotate-180" />
              </summary>
        
            </details>

            <NavLink to="/paquetes" className={navClass} onClick={closeMobile}>Paquetes</NavLink>
            <NavLink to="/recursos" className={navClass} onClick={closeMobile}>Recursos</NavLink>
            <Link to="/#s4" className={`group ${linkBase} ${linkDefault} ${underline}`} onClick={closeMobile}>Canadá</Link>
            <Link to="/#s5" className={`group ${linkBase} ${linkDefault} ${underline}`} onClick={closeMobile}>España</Link>

            <div className="pt-2">
              <Link to="/#contacto" className="inline-flex items-center justify-center h-10 px-4 w-full text-sm gap-2 border-2 border-xiomara-navy text-xiomara-navy rounded-full hover:bg-xiomara-navy hover:text-white transition">
                <Calendar size={16}/> Agenda tu asesoría
              </Link>
            </div>

            <div className="pt-2">
              {!user ? (
                <Link to="/login" className={`${btnPrimary} w-full`} onClick={closeMobile}>
                  <LogIn size={18} className="mr-2" /> Iniciar sesión
                </Link>
              ) : (
                <button
                  onClick={() => { closeMobile(); handleLogout(); }}
                  className="inline-flex items-center justify-center h-10 px-4 w-full text-sm gap-2 bg-gray-900 text-white hover:bg-black transition rounded-lg font-semibold"
                >
                  <LogOut size={18} /> Salir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
