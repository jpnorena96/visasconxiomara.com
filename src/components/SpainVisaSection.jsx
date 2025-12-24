import React from "react";
import { Link } from "react-router-dom";
import SpainImg from "../assets/spain-sevilla.png"; // Imagen a color original

export default function SpainVisaSection() {
  return (
    <section
      className="
        relative bg-white overflow-hidden
        min-h-[calc(100vh-64px)]  /* altura ajustada al viewport menos navbar */
        flex flex-col
      "
    >
      {/* Contenedor principal */}
      <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center max-w-7xl w-full mx-auto px-4 py-6 lg:py-8">
        {/* ==== LADO IZQUIERDO: CÍRCULO + IMAGEN (A COLOR ORIGINAL) ==== */}
        <div className="relative flex justify-center lg:justify-start">

          {/* Imagen sin filtros, fiel al original */}
          <img
            src={SpainImg}
            alt="Plaza de España en Sevilla"
            className="
              relative z-10
              w-[220px] sm:w-[280px] lg:w-[340px]
              drop-shadow-xl select-none
              transition-transform duration-500 ease-out
              hover:-translate-y-1 hover:scale-[1.02]
              motion-safe:animate-slideInUp [animation-delay:.1s]
              will-change-transform
            "
            draggable="false"
          />
        </div>

        {/* ==== LADO DERECHO: TEXTO ==== */}
        <div className="text-center lg:text-left">
          <h2
            className="
              font-serif text-[40px] sm:text-[56px] lg:text-[72px]
              leading-[0.95] text-ink-900
              motion-safe:animate-slideInUp
            "
          >
            ESPAÑA
          </h2>

          <p
            className="
              mt-4 text-sm sm:text-base font-semibold text-ink-900
              motion-safe:animate-fadeIn [animation-delay:.15s]
            "
          >
            Tu viaje comienza aquí
          </p>

          <p
            className="
              mt-2 text-ink-600 text-sm sm:text-base leading-relaxed
              max-w-[560px] mx-auto lg:mx-0
              motion-safe:animate-fadeIn [animation-delay:.25s]
            "
          >
            España es un destino lleno de cultura y oportunidades. Iniciar tu trámite de visa ahora
            te acerca a estudiar, trabajar o vivir nuevas experiencias en uno de los países más
            atractivos de Europa.
          </p>

          <div className="mt-6 motion-safe:animate-fadeIn [animation-delay:.35s]">
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
      </div>

      {/* Línea superior (consistencia visual) */}
      <div
        className="absolute top-0 left-0 right-0 h-[6px] bg-xiomara-navy/90"
        aria-hidden
      />
    </section>
  );
}
