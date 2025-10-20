import React, { useState } from "react";
import { CheckCircle, Lock, ArrowRight } from "lucide-react";

export default function RegisterSection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return form.reportValidity();
    setLoading(true);
    setStatus({ type: "", message: "" });
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: "success", message: "¡Listo! Te contactaremos por WhatsApp." });
      form.reset();
    }, 900);
  }

  return (
    <section
      className="
        relative overflow-hidden bg-white
        min-h-[calc(100vh-64px)]  /* 100vh - navbar (h-16) */
      "
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8 grid lg:grid-cols-2 gap-8 items-stretch">
        {/* ===== LADO IZQUIERDO — BRANDING + VALOR ===== */}
        <div className="
          relative rounded-2xl overflow-hidden
          bg-xiomara-navy text-white
          flex flex-col justify-between
          p-6 sm:p-8
          motion-safe:animate-fadeIn
        ">
          {/* Deco magenta */}
          <div
            aria-hidden
            className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-xiomara-pink opacity-90"
          />
          <div className="relative z-10">
            <h2 className="font-serif text-[36px] sm:text-[48px] leading-[1.05]">
              Crea tu cuenta
            </h2>
            <p className="mt-3 text-white/90 max-w-[520px]">
              Ingresa al portal para cargar documentos, seguir tu caso en tiempo real
              y chatear con nuestro equipo experto.
            </p>

            {/* Beneficios clave */}
            <ul className="mt-6 space-y-3">
              {[
                "Checklist inteligente por país y tipo de visa",
                "Acompañamiento paso a paso",
                "Actualizaciones por WhatsApp y correo",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 shrink-0" size={18} />
                  <span className="text-white/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confianza */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <span className="font-semibold">+300</span> clientes satisfechos
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <span className="font-semibold">+5</span> años de experiencia
            </div>
          </div>
        </div>

        {/* ===== LADO DERECHO — FORM CARD ===== */}
        <div className="
          flex items-center justify-center
          motion-safe:animate-slideInUp
        ">
          <div className="
            w-full max-w-[560px]
            rounded-2xl border border-gray-100 bg-white shadow-xlsoft
            p-6 sm:p-8
          ">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink-900">Regístrate gratis</h3>
                <p className="text-sm text-ink-500 mt-1">Te tomará menos de 1 minuto.</p>
              </div>
              <div className="hidden sm:flex items-center text-ink-500 text-xs">
                <Lock size={16} className="mr-1" /> Datos protegidos
              </div>
            </div>

            {status.message && (
              <div
                role="status" aria-live="polite"
                className={`mt-4 rounded-lg px-3 py-2 text-sm border
                ${status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"}`}
              >
                {status.message}
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700">Nombre completo</label>
                  <input
                    type="text" required minLength={3} placeholder="Tu nombre y apellido"
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700">WhatsApp</label>
                  <input
                    type="tel" required pattern="^[0-9\\s()+-]{7,}$" placeholder="+57 300 123 4567"
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700">Correo</label>
                  <input
                    type="email" required placeholder="tu@email.com"
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700">País de interés</label>
                  <select
                    required defaultValue=""
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  >
                    <option value="" disabled>Selecciona</option>
                    <option value="usa">Estados Unidos</option>
                    <option value="canada">Canadá</option>
                    <option value="espana">España</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700">Tipo de visa</label>
                  <select
                    required defaultValue=""
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  >
                    <option value="" disabled>Selecciona</option>
                    <option value="turismo">Turismo</option>
                    <option value="estudio">Estudio</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="inversion">Inversión</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700">Contraseña</label>
                  <input
                    type="password" required minLength={6} placeholder="Mínimo 6 caracteres"
                    className="mt-1 w-full h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-ink-700">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-xiomara-pink focus:ring-xiomara-pink" />
                Acepto la política de privacidad y autorizo el tratamiento de mis datos.
              </label>

              <button
                type="submit" disabled={loading}
                className="
                  w-full inline-flex items-center justify-center gap-2 h-11 rounded-full
                  bg-xiomara-sky text-white font-semibold
                  transition-all duration-300
                  hover:bg-xiomara-pink hover:shadow-glow
                  disabled:opacity-60
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-xiomara-pink/60
                "
              >
                {loading ? "Enviando..." : <>Crear cuenta <ArrowRight size={16} /></>}
              </button>

              <p className="text-xs text-ink-500 text-center">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="font-semibold text-xiomara-navy hover:text-xiomara-pink">Inicia sesión</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
