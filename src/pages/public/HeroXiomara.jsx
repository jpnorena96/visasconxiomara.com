import React from "react"
import { Link } from "react-router-dom"
import HeroBackground from "../../assets/machu.png"

export default function HeroXiomara() {
  return (
    <section className="relative h-screen overflow-hidden bg-white">
      {/* Fondo: imagen B/N + overlay magenta */}
      <div className="absolute inset-0 z-10" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat duotono-xiomara animate-fadeIn"
          style={{ backgroundImage: `url(${HeroBackground})` }}
        />
        <div className="absolute inset-0 duotono-layer opacity-80" />
      </div>

      {/* Contenido */}
      <div className="relative z-30 h-full flex">
        <div className="relative w-full max-w-[1200px] mx-auto h-full flex">
          {/* CÍRCULO ROSADO */}
          <div
            aria-hidden
            className="
              absolute
              left-1/2 -translate-x-1/2 md:left-[20%] md:translate-x-0
              top-24 md:top-28
              flex flex-col items-center justify-center
              p-3 sm:p-5 md:p-6
              w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] lg:w-[320px] lg:h-[320px]
              rounded-full bg-xiomara-pink shadow-xl transition-all duration-300 ease-out
              animate-slideInUp
            "
          >
            {/* Texto principal reducido */}
            <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase text-white tracking-tight leading-snug text-center px-2">
              Confianza que <br /> <span className="text-white">cruza fronteras.</span>
            </h1>

            {/* Subtítulo más compacto */}
            <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-white max-w-[200px] mx-auto leading-tight text-center">
              Asesoramos y guiamos tu proceso de visa con atención personalizada y soluciones efectivas.
            </p>

            {/* Botón proporcional */}
            <div className="mt-3 sm:mt-4 md:mt-5">
              <Link
                to="/servicios"
                className="inline-flex items-center justify-center h-7 sm:h-8 px-3 sm:px-4 rounded-full text-xiomara-pink font-semibold bg-white hover:bg-white/90 transition shadow-xl border-2 border-white text-[10px] sm:text-xs"
              >
                CONÓCENOS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior magenta */}
      <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-xiomara-pink z-40" />
    </section>
  )
}
