import React, { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload, CheckCircle2, XCircle, Clock, FileText, Trash2, Download, Loader2, Percent, ShieldCheck,
} from "lucide-react";

// IMPORTA TODO DESDE EL BARREL "src/components/ui/index.jsx"
import {
  Button,
  Card, CardContent, CardHeader, CardTitle,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  Progress, Separator, Skeleton,
} from "../../components/ui";

const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"]; // pdf, jpg, png

const UploadSchema = z.object({
  category: z.string().min(1, "Selecciona una categoría"),
  file: z
    .custom((v) => typeof File !== "undefined" && v instanceof File, { message: "Adjunta un archivo" })
    .refine((f) => !!f && ALLOWED.includes(f.type), {
      message: "Formato no permitido. Usa PDF, JPG o PNG",
    })
    .refine((f) => !!f && f.size <= MAX_BYTES, {
      message: `El archivo supera ${MAX_MB}MB`,
    }),
});

const badge = {
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border border-rose-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function ClientPortal() {
  const { user } = useAuth();

  // server data
  const [cats, setCats] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // UI state
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(UploadSchema), defaultValues: { category: "", file: undefined } });

  const selectedFile = watch("file");
  const selectedCategory = watch("category");

  // Derived: byCategory + progress
  const byCategory = useMemo(() => {
    const map = new Map();
    docs.forEach((d) => {
      if (!map.has(d.category)) map.set(d.category, []);
      map.get(d.category).push(d);
    });
    return map;
  }, [docs]);

  const uploadedCats = useMemo(() => new Set(docs.map((d) => d.category)), [docs]);
  const availableCats = useMemo(() => cats.filter((c) => !uploadedCats.has(c)), [cats, uploadedCats]);

  const completed = useMemo(() => {
    const uploaded = new Set(docs.map((d) => d.category));
    return cats.filter((c) => uploaded.has(c)).length;
  }, [cats, docs]);

  const progress = useMemo(() => {
    if (!cats.length) return 0;
    return Math.round((completed / cats.length) * 100);
  }, [completed, cats]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, d] = await Promise.all([
        api.get("/api/v1/categories"),
        api.get("/api/v1/documents"),
      ]);
      setCats(c || []);
      setDocs(d || []);
      setErr(null);
    } catch (e) {
      setErr(e?.message || "No se pudo cargar información");
      toast.error("No se pudo cargar información");
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleccionar por defecto la primera categoría disponible
  useEffect(() => {
    if (!selectedCategory || !availableCats.includes(selectedCategory)) {
      setValue("category", availableCats[0] || "");
    }
  }, [availableCats, selectedCategory, setValue]);

  useEffect(() => {
    loadAll();
    const i = setInterval(loadAll, 30000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dropzone
  const onDropFiles = useCallback((accepted, rejected) => {
    if (rejected?.length) {
      const r = rejected[0];
      const reason = r?.errors?.[0]?.message || "Archivo inválido";
      toast.error(reason);
      return;
    }
    if (!accepted?.length) return;
    const f = accepted[0];
    setValue("file", f, { shouldValidate: true });
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    onDrop: onDropFiles,
    maxSize: MAX_BYTES,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    noClick: true,
  });

  const statusPill = (s) => {
    const label = s === "approved" ? "Aprobado" : s === "rejected" ? "Rechazado" : "Enviado";
    const Icon = s === "approved" ? CheckCircle2 : s === "rejected" ? XCircle : Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${badge[s]}`}>
        <Icon size={14} /> {label}
      </span>
    );
  };

  const submitUpload = handleSubmit(async (values) => {
    if (!values.file || !values.category) return;
    setBusy(true);
    setErr(null);

    // Optimistic: local echo while uploading
    const tempId = `tmp_${Date.now()}`;
    const optimistic = {
      id: tempId,
      category: values.category,
      original_name: values.file.name,
      size_bytes: values.file.size,
      mime_type: values.file.type,
      status: "pending",
      admin_notes: "Subiendo…",
    };
    setDocs((prev) => [optimistic, ...prev]);

    try {
      const fd = new FormData();
      fd.append("category", values.category);
      fd.append("file", values.file);
      await api.upload("/api/v1/documents", fd);

      toast.success("Archivo subido con éxito");
      reset({ category: "", file: undefined });
      await loadAll();
    } catch (e) {
      setErr(e?.message || "Error subiendo archivo");
      toast.error(e?.message || "Error subiendo archivo");
      setDocs((prev) => prev.filter((d) => d.id !== tempId));
    } finally {
      setBusy(false);
    }
  });

  const onDelete = async (id) => {
    setConfirmId(null);
    const snapshot = docs;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    try {
      await api.json(`/api/v1/documents/${id}`, { method: "DELETE", headers: api.headers() });
      toast.success("Documento eliminado");
      await loadAll();
    } catch (e) {
      toast.error(e?.message || "No se pudo eliminar");
      setDocs(snapshot);
    }
  };

  // Animated variants
  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  const dzBorder = isDragReject
    ? "border-rose-300 bg-rose-50"
    : isDragAccept
    ? "border-emerald-300 bg-emerald-50"
    : isDragActive
    ? "border-xiomara-pink bg-xiomara-pink/10"
    : "border-dashed";

  const hint = isDragReject
    ? "Formato no aceptado"
    : isDragAccept
    ? "¡Suelta para adjuntar!"
    : "Arrastra y suelta aquí o haz clic en ‘Elegir archivo’";

  const noMoreCats = availableCats.length === 0;

  return (
    <section className="relative max-w-7xl mx-auto p-6">
      {/* Background gradient accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-xiomara-sky/10 via-white to-xiomara-pink/10" />

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <motion.div {...fadeUp}>
          <h1 className="text-3xl font-bold text-xiomara-navy">Portal del Cliente</h1>
          <p className="text-sm text-ink-600 mt-1">Sube tus documentos requeridos y monitorea su revisión.</p>
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck size={14} className="text-emerald-600" /> Cifrado en tránsito · Revisiones internas seguras
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="min-w-[260px]">
          <Card className="rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-xiomara-sky/10 grid place-items-center">
                <Percent size={18} className="text-xiomara-sky" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-600">Progreso</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="mt-2" />
                <div className="text-[11px] text-ink-500 mt-1">{completed}/{cats.length} categorías completadas</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {err && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">
            {err}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Left: Upload panel */}
        <motion.div {...fadeUp} className="lg:col-span-1">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Subir documento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-500">Formatos permitidos: PDF, JPG, PNG. Máx {MAX_MB}MB.</p>

              {/* Category select */}
              <div className="mt-4">
                <label className="block text-sm font-medium">Categoría</label>
                <Select value={selectedCategory} onValueChange={(v) => setValue("category", v, { shouldValidate: true })} disabled={noMoreCats}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={noMoreCats ? "Ya subiste todas las categorías" : "Selecciona una categoría"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCats.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-[11px] text-rose-600 mt-1">{errors.category.message}</p>}
                {noMoreCats && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 mt-2">
                    ¡Excelente! Ya cargaste todas las categorías requeridas.
                  </p>
                )}
              </div>

              {/* Dropzone */}
              <div {...getRootProps()} className={`mt-4 rounded-2xl border-2 p-6 text-center transition ${dzBorder}`}>
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-2 text-ink-400" />
                <p className="text-sm text-ink-600">
                  {hint} ·
                  <Button type="button" variant="link" className="px-1 text-xiomara-pink" onClick={open} disabled={noMoreCats}>
                    Elegir archivo
                  </Button>
                </p>
                <p className="text-[11px] text-ink-500 mt-1">Tamaño máximo: {MAX_MB}MB</p>

                <AnimatePresence>
                  {selectedFile && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 text-xs text-ink-700">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1.5 rounded-xl">
                        <FileText size={14} className="text-ink-500" />
                        <span className="truncate max-w-[220px]" title={selectedFile.name}>{selectedFile.name}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{(selectedFile.size / 1024).toFixed(0)} KB</span>
                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={() => setValue("file", undefined, { shouldValidate: true })}>Quitar</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.file && <p className="text-[11px] text-rose-600 mt-2">{String(errors.file.message)}</p>}
              </div>

              <Button onClick={submitUpload} disabled={busy || noMoreCats} className="w-full h-11 mt-4 rounded-xl inline-flex items-center gap-2">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {busy ? "Subiendo…" : "Subir"}
              </Button>

              <p className="text-[11px] text-ink-500 mt-3">Consejo: sube primero <b>PASAPORTE</b> y <b>DNI</b> para acelerar tu revisión.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Checklist + List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checklist */}
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Requisitos</CardTitle>
                <span className="text-xs text-ink-500">Tu asesor validará cada documento</span>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)
                    : cats.map((c) => {
                        const subidos = byCategory.get(c) || [];
                        const s = subidos.some((d) => d.status === "rejected")
                          ? "rejected"
                          : subidos.some((d) => d.status === "pending")
                          ? "pending"
                          : subidos.length
                          ? "approved"
                          : null;
                        return (
                          <motion.div layout key={c} className="flex items-center justify-between px-3 py-2 rounded-xl border bg-white">
                            <span className="text-sm">{c}</span>
                            {s ? (
                              statusPill(s)
                            ) : (
                              <span className="text-xs text-ink-400">Sin archivo</span>
                            )}
                          </motion.div>
                        );
                      })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents table/list */}
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl">
              <CardHeader className="flex items-center justify-between flex-row">
                <CardTitle className="text-base">Mis documentos</CardTitle>
                <span className="text-xs text-ink-500">{docs.length} archivo(s)</span>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}

                  {!loading && docs.length === 0 && (
                    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-ink-500">
                      <FileText className="mx-auto mb-2 text-ink-400" />
                      Aún no has subido documentos.
                    </div>
                  )}

                  {!loading && docs.map((d) => (
                    <motion.div layout key={d.id} className="rounded-xl border bg-white p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center shrink-0">
                          <FileText size={18} className="text-ink-400" />
                        </div>
                        <div className="text-sm min-w-0">
                          <div className="font-medium truncate" title={`${d.category} — ${d.original_name}`}>{d.category} — {d.original_name}</div>
                          <div className="text-xs text-ink-500">
                            {(d.size_bytes / 1024).toFixed(0)} KB · {d.mime_type}
                            {d.admin_notes ? ` · ${d.admin_notes}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusPill(d.status)}
                        <Button asChild variant="outline" className="h-9">
                          <a href={`${api.baseUrl}/api/v1/documents/${d.id}`} target="_blank" rel="noreferrer">
                            <Download size={16} />
                          </a>
                        </Button>
                        <Button variant="destructive" className="h-9" onClick={() => setConfirmId(d.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div {...fadeUp}>
            <div className="rounded-2xl border bg-gradient-to-r from-xiomara-sky/10 to-xiomara-pink/10 p-5">
              <h3 className="font-semibold">Consejos para acelerar tu caso</h3>
              <ul className="mt-2 text-sm text-ink-700 list-disc pl-5">
                <li>Sube imágenes nítidas (fotografías o escaneos a color).</li>
                <li>Evita sombras, reflejos o recortes de información.</li>
                <li>Si un documento fue <b>rechazado</b>, revisa las notas y vuelve a subirlo.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar este documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el archivo de manera permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmId && onDelete(confirmId)}>Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

// ===== Notas rápidas =====
// - JS puro (.jsx) sin TypeScript.
// - Deps: react-hook-form, zod, @hookform/resolvers, react-dropzone, framer-motion, sonner, lucide-react.
// - UI shadcn placeholder (o real si lo instalas) importado desde ../../components/ui.
// - La lista de categorías del selector excluye las que ya tienen documentos cargados.
// - Optimistic UI en upload/delete, auto-refresh 30s, animaciones, validaciones fuertes.
