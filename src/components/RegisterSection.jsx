import React, { useState } from "react";
import { CheckCircle, Mail, ArrowRight, Send } from "lucide-react";

export default function RegisterSection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return form.reportValidity();

    setLoading(true);
    setStatus({ type: "", message: "" }); // Reset status

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Construct mailto link
    const subject = `Nuevo Contacto Web: ${data.name}`;
    const body = `Hola, soy ${data.name}.\n\nMis datos:\nTeléfono: ${data.phone}\nEmail: ${data.email}\nInterés: ${data.country} - ${data.visatype}\n\nMensaje:\n${data.message}`;

    // Simulate slight delay for UX
    setTimeout(() => {
      window.location.href = `mailto:info@visasconxiomara.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      setStatus({ type: "success", message: "Abriendo tu correo para enviar..." });
      form.reset();
    }, 800);
  }

  return (
    <section
      id="contacto"
      className="
        relative overflow-hidden bg-white
        py-16 lg:py-24
      "
    >
      <div className="mx-auto w-full max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* ===== LADO IZQUIERDO — VALOR ===== */}
        <div className="
          relative rounded-3xl overflow-hidden
          bg-xiomara-navy text-white
          flex flex-col justify-between
          p-8 lg:p-12
          shadow-2xl
        ">
          {/* Deco circles */}
          <div aria-hidden className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-3xl opacity-50 pointer-events-none" />
          <div aria-hidden className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-xiomara-pink blur-3xl opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Hablemos de tu futuro internacional
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-md">
              ¿Listo para dar el siguiente paso? Completa el formulario y nuestro equipo te contactará para evaluar tu perfil sin costo inicial.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                "Respuesta en menos de 24 horas",
                "Evaluación inicial gratuita",
                "Asesoría 100% personalizada",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-xiomara-pink/20 flex items-center justify-center">
                    <CheckCircle className="text-xiomara-pink" size={14} />
                  </div>
                  <span className="text-white/90 font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== LADO DERECHO — FORMULARIO ===== */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink-900">Déjanos un mensaje</h3>
            <p className="text-ink-500 mt-2">Envíanos tus datos y te escribiremos a la brevedad.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {status.message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.message}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-ink-700">Nombre completo</label>
                <input
                  name="name"
                  type="text" required minLength={3}
                  placeholder="Ej: Ana Pérez"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-ink-700">WhatsApp</label>
                <input
                  name="phone"
                  type="tel" required
                  placeholder="+51 900 000 000"
                  className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-ink-700">Correo electrónico</label>
              <input
                name="email"
                type="email" required
                placeholder="ejemplo@correo.com"
                className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-ink-700">País de interés</label>
                <div className="relative">
                  <select
                    name="country"
                    required defaultValue=""
                    className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none appearance-none"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="España">España</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-ink-700">Tipo de trámite</label>
                <div className="relative">
                  <select
                    name="visatype"
                    required defaultValue=""
                    className="w-full px-4 h-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none appearance-none"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Turismo">Turismo / B1/B2</option>
                    <option value="Estudios">Estudios</option>
                    <option value="Residencia">Residencia</option>
                    <option value="No sé aún">No estoy seguro</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-ink-700">¿Cómo podemos ayudarte?</label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Cuéntanos un poco sobre tu caso..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-xiomara-pink/50 focus:ring-4 focus:ring-xiomara-pink/10 transition outline-none resize-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="
                group w-full inline-flex items-center justify-center gap-3 h-14 rounded-xl
                bg-xiomara-navy text-white font-bold text-lg
                transform transition-all duration-300
                hover:bg-xiomara-pink hover:shadow-lg hover:-translate-y-1
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                "Procesando..."
              ) : (
                <>
                  Enviar Mensaje <Send size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Al enviar este formulario aceptas nuestra política de privacidad.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
