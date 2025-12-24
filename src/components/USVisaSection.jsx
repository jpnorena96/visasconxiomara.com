import React from "react";
import { Link } from "react-router-dom";
import UsImg from "../assets/usa-ny.png"; // Usa una imagen vertical o tipo recorte alto

export default function USVisaSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center justify-center gap-10">

        {/* === IMAGEN IZQUIERDA (más grande, centrada verticalmente) === */}
        <div className="relative flex justify-center lg:justify-start w-full lg:w-1/2 motion-safe:animate-fadeIn [animation-delay:.1s]">
          {/* Círculo magenta decorativo detrás */}


          {/* Imagen principal */}
          <img
            src={UsImg}
            alt="Edificios de Nueva York"
            className="
              relative z-10
              w-[300px] sm:w-[380px] lg:w-[480px]
              drop-shadow-2xl select-none
              transition-transform duration-500 ease-out
              hover:-translate-y-1 hover:scale-[1.03]
              will-change-transform
            "
            draggable="false"
          />
        </div>

        {/* === TEXTO DERECHO === */}
        <div className="text-center lg:text-left w-full lg:w-1/2 motion-safe:animate-slideInUp [animation-delay:.2s]">
          <h2 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] leading-[0.95] text-ink-900">
            <span className="block">ESTADOS</span>
            <span className="block">UNIDOS</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base font-semibold text-ink-900">
            Asesoría experta, destino seguro
          </p>

          <p className="mt-3 text-ink-600 text-sm sm:text-base leading-relaxed max-w-[540px] mx-auto lg:mx-0">
            Contar con una visa a Estados Unidos es la clave para abrir puertas a nuevas
            oportunidades académicas, laborales y de viaje. Más que un documento, es el primer
            paso hacia experiencias que transforman tu futuro.
          </p>

          {/* CTA */}
          <div className="mt-6">
            <Link
              to="/paquetes"
              className="
                inline-flex items-center gap-2 rounded-full
                border-2 border-xiomara-navy text-xiomara-navy
                px-6 py-2 text-sm sm:text-base font-bold tracking-wide
                transition-all duration-300
                hover:bg-xiomara-navy hover:text-white hover:shadow-xl
                focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60
              "
            >
              VER OPCIONES
            </Link>
          </div>
        </div>
      </div>

      {/* Línea superior decorativa */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-xiomara-navy/90" aria-hidden />
    </section>
  );
}
