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
              left-1/2 -translate-x-1/2 md:translate-x-0
              md:left-16 lg:left-32
              top-[15%] md:top-1/2 md:-translate-y-1/2
              flex flex-col items-center justify-center
              p-6 sm:p-10
              w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[550px] lg:h-[550px]
              rounded-full bg-xiomara-pink shadow-2xl transition-all duration-500 ease-out
              animate-slideInUp z-40
            "
          >
            {/* Texto principal aumentado */}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold uppercase text-white tracking-tight leading-none text-center px-4">
              Confianza que <br /> <span className="text-white">cruza fronteras.</span>
            </h1>

            {/* Subtítulo más legible */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white max-w-[260px] sm:max-w-[340px] mx-auto leading-tight text-center font-medium opacity-90">
              Asesoramos y guiamos tu proceso de visa con atención personalizada y soluciones efectivas.
            </p>

            {/* Botón proporcional */}
            <div className="mt-6 sm:mt-8">
              <Link
                to="/servicios"
                className="
                  inline-flex items-center justify-center 
                  h-10 sm:h-12 px-6 sm:px-8 
                  rounded-full bg-white text-xiomara-pink 
                  font-bold text-sm sm:text-base tracking-wide
                  hover:bg-gray-50 hover:scale-105 hover:shadow-lg
                  transition-all duration-300 border-2 border-transparent
                "
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
