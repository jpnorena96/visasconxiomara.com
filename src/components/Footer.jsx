import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const wrap = "mx-auto w-full max-w-7xl px-4";

export default function Footer() {
  return (
    <footer className="bg-xiomara-navy text-white">
      {/* Top */}
      <div className={`${wrap} py-12 lg:py-14 grid gap-10 md:grid-cols-3 lg:grid-cols-5`}>
        {/* Brand */}
        <div className="md:col-span-2 lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-xiomara-sky font-bold">VcX</span>
            <span className="text-xl font-extrabold tracking-tight">Visas Con Xiomara</span>
          </Link>
          <p className="mt-4 text-white/80 max-w-md">
            Acompañamiento experto para tus trámites de visa: claridad, agilidad y resultados.
          </p>

          {/* Social */}
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition">
              <Linkedin size={18} />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white/90">Navegación</h4>
          <ul className="mt-3 space-y-2 text-white/80">
            <li><Link to="/servicios" className="hover:text-xiomara-pink transition">Servicios</Link></li>
            <li><Link to="/paquetes" className="hover:text-xiomara-pink transition">Paquetes</Link></li>
            <li><Link to="/recursos" className="hover:text-xiomara-pink transition">Recursos</Link></li>
            <li><Link to="/login" className="hover:text-xiomara-pink transition">Iniciar sesión</Link></li>
          </ul>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white/90">Países</h4>
          <ul className="mt-3 space-y-2 text-white/80">
            <li><Link to="/servicios/usa" className="hover:text-xiomara-pink transition">Estados Unidos</Link></li>
            <li><Link to="/servicios/canada" className="hover:text-xiomara-pink transition">Canadá</Link></li>
            <li><Link to="/servicios/espana" className="hover:text-xiomara-pink transition">España</Link></li>
            <li><Link to="/servicios/otros" className="hover:text-xiomara-pink transition">Otros</Link></li>
          </ul>
        </div>

        {/* Contacto + newsletter */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white/90">Contacto</h4>
          <ul className="mt-3 space-y-2 text-white/80">
            <li className="flex items-center gap-2"><Mail size={16}/> contacto@xiomaravisas.com</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +57 300 000 0000</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> Bogotá, Colombia</li>
          </ul>

          <form
            onSubmit={(e)=>{e.preventDefault()}}
            className="mt-4 flex items-center gap-2"
            aria-label="Suscripción a novedades"
          >
            <input
              type="email"
              placeholder="Tu correo"
              required
              className="w-full h-10 rounded-lg border border-white/15 bg-white/10 placeholder-white/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-10 rounded-lg px-3 bg-xiomara-pink hover:bg-xiomara-sky transition text-sm font-semibold"
              aria-label="Suscribirme"
            >
              Enviar <ArrowRight size={16}/>
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Bottom bar */}
      <div className={`${wrap} py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70`}>
        <p>© {new Date().getFullYear()} Visas Con Xiomara. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <Link to="/legal/privacidad" className="hover:text-white transition">Privacidad</Link>
          <span className="opacity-40">•</span>
          <Link to="/legal/terminos" className="hover:text-white transition">Términos</Link>
          <span className="opacity-40">•</span>
          <Link to="/legal/cookies" className="hover:text-white transition">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
