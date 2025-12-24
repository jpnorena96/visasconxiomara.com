import React from "react";
import { Link } from "react-router-dom";
import CanadaImg from "../assets/canada-toronto.png"; // imagen a color

export default function CanadaVisaSection() {
  return (
    <section
      className="
        relative bg-white overflow-hidden
        min-h-[calc(100vh-64px)]   /* 100vh - altura del navbar (h-16 = 64px) */
        flex flex-col
      "
    >
      {/* Contenido principal (ocupa el espacio disponible) */}
      <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center max-w-7xl w-full mx-auto px-4 py-6 lg:py-8">
        {/* === Texto === */}
        <div
          className="
            order-2 lg:order-1 text-center lg:text-left
            motion-safe:animate-slideInUp
          "
        >
          <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.95] text-ink-900">
            CANADÁ
          </h2>

          <p className="mt-3 text-sm sm:text-base font-semibold text-ink-900 motion-safe:animate-fadeIn [animation-delay:.1s]">
            Más que trámites, un acompañamiento real
          </p>

          <p className="mt-2 text-ink-600 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto lg:mx-0 motion-safe:animate-fadeIn [animation-delay:.2s]">
            Canadá es un destino lleno de oportunidades para estudiar, trabajar o empezar una nueva vida.
            Obtener tu visa puede ser complejo, pero con nuestra asesoría personalizada lo hacemos fácil
            y alcanzable. Te acompañamos en cada paso para que tu sueño de llegar a Canadá esté más cerca.
          </p>

          <div className="mt-5 motion-safe:animate-fadeIn [animation-delay:.3s]">
            <Link
              to="/paquetes"
              className="
                inline-flex items-center gap-2 rounded-full
                border-2 border-xiomara-navy text-xiomara-navy
                px-5 py-2 text-sm font-bold tracking-wide
                transition-all duration-300
                hover:bg-xiomara-navy hover:text-white hover:shadow-subtle
                focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60
              "
            >
              VER OPCIONES
            </Link>
          </div>
        </div>

        {/* === Círculo + Imagen a color === */}
        <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
          {/* Círculo magenta (decorativo) */}

          {/* Imagen a color (sin filtros) */}
          <img
            src={CanadaImg}
            alt="Skyline de Toronto, Canadá"
            className="
              relative z-10
              w-[200px] sm:w-[260px] lg:w-[320px]
              drop-shadow-xl select-none
              transition-transform duration-500 ease-out
              hover:-translate-y-1 hover:scale-[1.02]
              will-change-transform
            "
            draggable="false"
          />
        </div>
      </div>

      {/* Línea superior (opcional) */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-xiomara-navy/90" aria-hidden />
    </section>
  );
}
