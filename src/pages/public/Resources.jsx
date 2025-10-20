import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Globe2,
  Building,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Plus,
} from "lucide-react";

/** Data base */
const RAW_RESOURCES = [
  {
    country: "Perú",
    type: "Migratorio",
    label: "Certificado de Movimiento Migratorio (Perú)",
    url: "https://www.gob.pe/12633-solicitar-el-certificado-de-movimiento-migratorio",
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    country: "Perú",
    type: "Laboral",
    label: "Certificado Único Laboral (Perú)",
    url: "https://www.gob.pe/47089-obtener-tu-certificado-unico-laboral-cul",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    country: "Colombia",
    type: "Educativo",
    label: "Apostilla de títulos universitarios (Colombia)",
    url: "https://www.cancilleria.gov.co/tramites_servicios/apostilla",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    country: "México",
    type: "Residencia",
    label: "Trámite de constancia de antecedentes migratorios (México)",
    url: "https://www.gob.mx/tramites/ficha/constancia-de-antecedentes-migratorios/INM203",
    icon: <Building className="w-5 h-5" />,
  },
];

/** Pill filters */
function FilterPills({ active, onChange, countries }) {
  const pills = useMemo(
    () => [{ name: "Todos" }, ...countries.map((c) => ({ name: c }))],
    [countries]
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((p) => (
        <button
          key={p.name}
          onClick={() => onChange(p.name)}
          className={[
            "inline-flex items-center gap-2 px-4 h-9 rounded-full text-sm font-semibold transition",
            active === p.name
              ? "bg-xiomara-navy text-white"
              : "bg-white border border-gray-200 hover:border-xiomara-pink text-ink-700",
          ].join(" ")}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

/** Card for each resource */
function ResourceCard({ r }) {
  return (
    <motion.a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative block rounded-2xl border border-gray-100 bg-white shadow-subtle hover:shadow-xl transition p-5"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-xiomara-pink/10 text-xiomara-pink">
          {r.icon || <FileText className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-ink-900">{r.label}</h3>
          <div className="mt-1 text-xs text-ink-500">
            {r.country} — {r.type}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-xiomara-pink mt-1 shrink-0" />
      </div>
      <div className="mt-3 text-xs text-ink-400 break-all line-clamp-1">
        {r.url}
      </div>
    </motion.a>
  );
}

export default function Resources() {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const countries = useMemo(
    () => [...new Set(RAW_RESOURCES.map((r) => r.country))],
    []
  );

  const visible = useMemo(() => {
    let arr =
      filter === "Todos"
        ? RAW_RESOURCES
        : RAW_RESOURCES.filter((r) => r.country === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((r) =>
        [r.label, r.country, r.type].join(" ").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [filter, query]);

  return (
    <section className="relative bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900">
              Recursos adicionales
            </h1>
            <p className="mt-1 text-ink-600 max-w-[580px]">
              Accede a documentos oficiales, certificados y enlaces útiles
              según tu país y tipo de visa.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="search"
              placeholder="Buscar recurso..."
              className="w-full sm:w-64 h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-xiomara-pink/60"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FilterPills
              active={filter}
              onChange={setFilter}
              countries={countries}
            />
          </div>
        </header>

        {/* Cards */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {visible.length > 0 ? (
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {visible.map((r, i) => (
                  <ResourceCard key={r.url + i} r={r} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-ink-500"
              >
                No se encontraron recursos que coincidan con{" "}
                <strong className="text-ink-700">“{query}”</strong>.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA: sugerir recurso */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-ink-50 p-5">
          <div className="text-ink-800">
            <p className="font-semibold">¿Tienes un recurso que recomendar?</p>
            <p className="text-sm text-ink-600">
              Ayuda a otros usuarios compartiendo enlaces oficiales o documentos
              útiles.
            </p>
          </div>
          <Link
            to="/#contacto"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full text-sm font-semibold border-2 border-xiomara-navy text-xiomara-navy hover:bg-xiomara-navy hover:text-white transition"
          >
            <Plus size={16} /> Enviar recurso
          </Link>
        </div>
      </div>
    </section>
  );
}
