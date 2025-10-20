import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ShieldCheck, Clock, GraduationCap, Plane, MapPinned, Building2 } from "lucide-react";

/** DATA: define países y planes */
const RAW_GROUPS = [
  {
    country: "Estados Unidos",
    code: "usa",
    icon: <Building2 className="w-4 h-4" />,
    items: [
      {
        name: "Puerta Abierta",
        tagline: "DS-160 + citas + coaching",
        detail: [
          "DS-160 completo y validado",
          "Agenda de citas y soporte",
          "Coaching de entrevista",
          "Checklist de arraigo personalizado",
        ],
        level: "Essential",
        price: "Desde $149",
        highlight: false,
      },
      {
        name: "Campus Global (F-1)",
        tagline: "Admisión & solvencia",
        detail: [
          "I-20 / SEVIS guidance",
          "Estrategia de solvencia",
          "Preparación de entrevista",
          "Documentación académica",
        ],
        level: "Pro",
        price: "Desde $249",
        highlight: true,
      },
    ],
  },
  {
    country: "Canadá",
    code: "canada",
    icon: <MapPinned className="w-4 h-4" />,
    items: [
      {
        name: "Impulso",
        tagline: "Checklist + plantillas",
        detail: [
          "Checklist según perfil",
          "Plantillas y ejemplos",
          "Revisión final de dossier",
          "Guía de pagos",
        ],
        level: "Starter",
        price: "Desde $129",
        highlight: false,
      },
      {
        name: "Conquista",
        tagline: "SOP & monitoreo",
        detail: [
          "SOP / Carta de intención",
          "Pagos & formularios",
          "Monitoreo de estatus",
          "Ajustes hasta la radicación",
        ],
        level: "Pro",
        price: "Desde $229",
        highlight: true,
      },
    ],
  },
  {
    country: "España",
    code: "espana",
    icon: <Plane className="w-4 h-4" />,
    items: [
      {
        name: "Gran Vía (Estudio)",
        tagline: "LOA, IPREM y seguros",
        detail: [
          "Asesoría LOA / admisión",
          "IPREM y solvencia",
          "Seguros médicos",
          "Alojamiento & empadronamiento",
        ],
        level: "Pro",
        price: "Desde €199",
        highlight: true,
      },
      {
        name: "Vida Plena (No lucrativa)",
        tagline: "Solvencia robusta",
        detail: [
          "Evaluación de solvencia",
          "Documentación consular",
          "Citas y preparación",
          "Acompañamiento completo",
        ],
        level: "Premium",
        price: "Desde €349",
        highlight: false,
      },
      {
        name: "Conexión (Nómada digital)",
        tagline: "Ingresos & relación remota",
        detail: [
          "Evidencias de ingresos",
          "Contrato remoto & legal",
          "Seguro médico y NIE",
          "Checklist por comunidad",
        ],
        level: "Pro",
        price: "Desde €249",
        highlight: false,
      },
    ],
  },
];

/** Píldoras de filtro (Tabs) */
function FilterPills({ active, onChange, groups }) {
  const pills = useMemo(
    () => [{ code: "all", country: "Todos" }, ...groups.map(g => ({ code: g.code, country: g.country }))],
    [groups]
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map(p => (
        <button
          key={p.code}
          onClick={() => onChange(p.code)}
          className={[
            "inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold transition",
            active === p.code
              ? "bg-xiomara-navy text-white"
              : "bg-white border border-gray-200 hover:border-xiomara-pink text-ink-700"
          ].join(" ")}
          aria-pressed={active === p.code}
        >
          {p.country}
        </button>
      ))}
    </div>
  );
}

/** Card de plan */
function PlanCard({ plan, country }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "relative rounded-2xl border bg-white p-6 shadow-subtle",
        plan.highlight ? "border-xiomara-pink shadow-glow" : "border-gray-100"
      ].join(" ")}
    >
      {plan.highlight && (
        <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-xiomara-pink text-white text-[11px] font-bold px-2 py-1 shadow">
          <Sparkles size={14} /> Mejor opción
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-ink-900">{plan.name}</h4>
          <p className="text-sm text-ink-500">{plan.tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-base font-extrabold text-xiomara-navy">{plan.price}</div>
          <div className="text-[11px] text-ink-500">{country}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {plan.detail.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
            <Check className="mt-0.5 w-4 h-4 text-xiomara-pink" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs text-ink-500">
          <ShieldCheck className="w-4 h-4" /> {plan.level}
        </div>
        <Link
          to="/login"
          className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-semibold bg-xiomara-sky text-white hover:bg-xiomara-pink transition"
        >
          Quiero este plan
        </Link>
      </div>
    </motion.div>
  );
}

/** Barra de info superior (disclaimer y tiempo promedio) */
function InfoBar() {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-ink-50 border border-gray-100 rounded-xl p-3">
      <div className="inline-flex items-center gap-2 text-ink-700 text-sm">
        <Clock className="w-4 h-4" /> Tiempo promedio de preparación: <strong className="ml-1">3–7 días hábiles</strong>
      </div>
      <div className="inline-flex items-center gap-2 text-ink-700 text-sm">
        <GraduationCap className="w-4 h-4" /> Coaching de entrevista incluido en planes Pro/Premium
      </div>
    </div>
  );
}

export default function Packages() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const groups = RAW_GROUPS;

  const visiblePlans = useMemo(() => {
    // Flatten
    const flat = groups.flatMap(g =>
      g.items.map(p => ({
        ...p,
        _country: g.country,
        _code: g.code,
      }))
    );
    // Filter by country
    const byCountry = filter === "all" ? flat : flat.filter(p => p._code === filter);
    // Search
    const q = query.trim().toLowerCase();
    const bySearch = q
      ? byCountry.filter(p =>
          [p.name, p.tagline, p._country, ...(p.detail || [])].join(" ").toLowerCase().includes(q)
        )
      : byCountry;
    // Sort: highlight first
    const sorted = bySearch.sort((a, b) => Number(b.highlight) - Number(a.highlight));
    return sorted;
  }, [filter, query, groups]);

  return (
    <section className="relative bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        {/* Header */}
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900">Paquetes</h1>
            <p className="mt-1 text-ink-600">Elige el plan ideal para tu objetivo y destino.</p>
          </div>

          {/* Búsqueda + Filtros */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 sm:w-64">
              <input
                type="search"
                placeholder="Buscar paquete o beneficio…"
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <FilterPills active={filter} onChange={setFilter} groups={groups} />
          </div>
        </header>

        {/* Barra informativa */}
        <div className="mt-6">
          <InfoBar />
        </div>

        {/* Grid de planes */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {visiblePlans.length > 0 ? (
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {visiblePlans.map((p, idx) => (
                  <PlanCard key={`${p._code}-${p.name}-${idx}`} plan={p} country={p._country} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-ink-500"
              >
                No encontramos resultados para <strong className="text-ink-700">“{query}”</strong>. Ajusta el filtro o busca otra palabra.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA inferior */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-ink-50 p-5">
          <div className="text-ink-800">
            <p className="font-semibold">¿Necesitas ayuda para elegir?</p>
            <p className="text-sm text-ink-600">Agenda una mini-llamada y te recomendamos el plan ideal.</p>
          </div>
          <Link
            to="/#contacto"
            className="inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-semibold border-2 border-xiomara-navy text-xiomara-navy hover:bg-xiomara-navy hover:text-white transition"
          >
            Agenda asesoría gratuita
          </Link>
        </div>
      </div>
    </section>
  );
}
