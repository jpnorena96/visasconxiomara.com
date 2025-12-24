import React from "react";
import PlaneIcon from "./icons/PlaneIcon";

export default function WhyAdvisorSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-white flex flex-col">
      {/* ======= BLOQUE SUPERIOR ======= */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl w-full">
          {/* Imagen (entrada + micro-interacción) */}
          <div className="flex justify-center">
            <PlaneIcon
              className="
                w-[160px] sm:w-[200px] lg:w-[240px] h-auto
                drop-shadow-xl select-none
                text-xiomara-navy
                motion-safe:animate-slideInUp [animation-delay:.1s]
                transition-transform duration-500 ease-out
                hover:scale-[1.03] hover:-translate-y-0.5 hover:text-xiomara-pink
                will-change-transform
              "
            />
          </div>

          {/* Texto (stagger suave respecto a la imagen) */}
          <div
            className="
              text-center lg:text-left
              motion-safe:animate-slideInUp [animation-delay:.2s]
            "
          >
            <h2
              className="
                text-lg sm:text-2xl lg:text-3xl font-extrabold text-ink-900 leading-snug
                motion-safe:animate-fadeIn [animation-delay:.25s]
              "
            >
              ¿Por qué contar con un{" "}
              <span
                className="
                  inline-block px-2 py-1 rounded-md bg-xiomara-navy text-white
                  transition-colors duration-300
                  hover:bg-xiomara-pink
                "
              >
                asesor en visados?
              </span>
            </h2>

            <p
              className="
                mt-3 text-[12px] sm:text-sm md:text-base text-ink-600 max-w-[520px]
                mx-auto lg:mx-0 leading-relaxed
                motion-safe:animate-fadeIn [animation-delay:.35s]
              "
            >
              Tener un asesor especializado marca la diferencia: te ayuda a evitar errores,
              optimiza tiempos y te brinda claridad en cada paso del proceso. Además,
              recibes orientación personalizada según tu perfil y destino, aumentando tus
              posibilidades de éxito. No se trata solo de tramitar, sino de hacerlo bien y
              con respaldo profesional.
            </p>

            {/* CTA sutil (hover elegante) */}
            <div className="mt-4 motion-safe:animate-fadeIn [animation-delay:.45s]">
              <a
                href="#contacto"
                className="
                  inline-flex items-center gap-2 rounded-full border border-xiomara-pink
                  px-4 py-2 text-sm font-semibold text-xiomara-pink
                  transition-all duration-300
                  hover:bg-xiomara-pink hover:text-white hover:shadow-glow
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60
                "
              >
                Agenda una asesoría
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======= FRANJA NAVY (entrada + brillo sutil) ======= */}
      <div
        className="
          bg-xiomara-navy text-white py-5 lg:py-6
          motion-safe:animate-fadeIn [animation-delay:.55s]
        "
      >
        <div className="mx-auto max-w-6xl w-full px-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Título grande (leve tracking al pasar) */}
          <div className="text-center lg:text-left">
            <h3
              className="
                font-serif text-[36px] sm:text-[48px] lg:text-[60px] tracking-wide leading-none
                transition-all duration-500
                hover:tracking-wider
              "
            >
              XIOMARA
            </h3>
          </div>

          {/* Descripción corta */}
          <div
            className="
              max-w-[500px] text-center lg:text-left text-xs sm:text-sm text-white/90 leading-snug
              motion-safe:animate-fadeIn [animation-delay:.65s]
            "
          >
            Xiomara estudió Economía en la Universidad HSE de Moscú y desde entonces ha asesorado
            a más de 300 personas en diferentes países. Su experiencia garantiza acompañamiento,
            hospitalidad y resultados para tus metas internacionales.
          </div>

          {/* KPIs (stagger final) */}
          <div className="flex gap-8 justify-center lg:justify-end">
            <div className="text-center motion-safe:animate-slideInUp [animation-delay:.7s]">
              <div className="text-2xl sm:text-3xl font-extrabold text-xiomara-pink">+5</div>
              <div className="text-xs sm:text-sm text-white/90 -mt-1">
                Años de <br /> experiencia
              </div>
            </div>
            <div className="text-center motion-safe:animate-slideInUp [animation-delay:.8s]">
              <div className="text-2xl sm:text-3xl font-extrabold text-xiomara-pink">+300</div>
              <div className="text-xs sm:text-sm text-white/90 -mt-1">
                Clientes <br /> satisfechos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow muy sutil arriba (decorativo) */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-x-0 top-0 h-24
          bg-[radial-gradient(80%_60%_at_50%_0%,rgba(45,121,255,0.20),rgba(255,255,255,0))]
        "
      />
    </section>
  );
}
