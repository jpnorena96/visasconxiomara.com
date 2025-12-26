import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-xiomara-navy text-white font-sans border-t border-white/5">
      {/* === TOP SECTION: Main Content === */}
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* 1. Brand & Info (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-6">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-xiomara-pink to-pink-600 text-white shadow-lg transition-transform group-hover:scale-105">
                <span className="font-serif text-xl font-bold">V</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-xiomara-pink transition-colors">
                  Visas Con Xiomara
                </span>
                <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                  Travel & Immigration
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              Transformamos el complejo proceso de visado en una experiencia clara y segura.
              Tu puerta de entrada a nuevas oportunidades globales.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-2">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/visasconxiomara?igsh=eXJnMXBnNXhyenU4&utm_source=qr"
                },
                {
                  icon: Youtube,
                  label: "TikTok",
                  href: "https://www.tiktok.com/@inkalandsimmigration?_r=1&_t=ZS-92TmR26bmu0"
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-full bg-white/5 text-white/70 hover:bg-xiomara-pink hover:text-white transition-all duration-300"
                >
                  <social.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Links Columns (lg:col-span-2 each) */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Destinos</h4>
            <ul className="space-y-4">
              {[
                { name: "Estados Unidos", to: "/paquetes" },
                { name: "Canadá", to: "/paquetes" },
                { name: "España", to: "/paquetes" },
                { name: "Otros Servicios", to: "/servicios" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-xiomara-pink transition-colors"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Empresa</h4>
            <ul className="space-y-4">
              {[
                { name: "Nuestros Paquetes", to: "/paquetes" },
                { name: "Recursos Gratuitos", to: "/recursos" },
                { name: "Iniciar Sesión", to: "/login" },
                { name: "Contacto", to: "/#contacto" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-xiomara-pink transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact & Newsletter (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 bg-white/5 rounded-2xl p-6 border border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Información de Contacto</h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <div className="mt-0.5 p-1.5 rounded-md bg-xiomara-pink/10 text-xiomara-pink">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/50 uppercase font-semibold">Llámanos o WhatsApp</span>
                  <a href="https://wa.me/51977600626" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                    +51 977 600 626
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 text-sm text-white/80">
                <div className="mt-0.5 p-1.5 rounded-md bg-xiomara-pink/10 text-xiomara-pink">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/50 uppercase font-semibold">Escríbenos</span>
                  <a href="mailto:info@visasconxiomara.com" className="hover:text-white transition-colors font-medium">
                    info@visasconxiomara.com
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/50 mb-3">Suscríbete para recibir tips de viaje y visas.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="
                    w-full h-10 rounded-lg bg-black/20 border border-white/10 
                    px-3 text-sm text-white placeholder-white/40
                    focus:outline-none focus:ring-2 focus:ring-xiomara-pink focus:border-transparent
                    transition-all
                  "
                />
                <button
                  type="submit"
                  className="
                    h-10 w-10 flex items-center justify-center rounded-lg 
                    bg-xiomara-pink text-white shadow-lg
                    hover:bg-white hover:text-xiomara-pink 
                    transition-all duration-300
                  "
                  aria-label="Suscribirse"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* === BOTTOM SECTION: Copyright & Legal === */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-medium text-center md:text-left">
            © {currentYear} Visas Con Xiomara. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-white/50">
            <Link to="/legal/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/legal/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
