import React from "react";

/** ---------- Button ---------- */
export function Button({ children, variant, size, className = "", asChild, ...props }) {
  const Comp = asChild ? "span" : "button";
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-xiomara-sky text-white hover:bg-xiomara-sky/90",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    link: "text-xiomara-pink underline hover:text-xiomara-pink/80",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  return (
    <Comp className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {children}
    </Comp>
  );
}

/** ---------- Card ---------- */
export function Card({ children, className = "", ...props }) {
  return <div className={`bg-white shadow-sm border rounded-xl ${className}`} {...props}>{children}</div>;
}
export function CardHeader({ children, className = "", ...props }) {
  return <div className={`border-b p-3 ${className}`} {...props}>{children}</div>;
}
export function CardTitle({ children, className = "", ...props }) {
  return <h2 className={`font-semibold text-lg ${className}`} {...props}>{children}</h2>;
}
export function CardContent({ children, className = "", ...props }) {
  return <div className={`p-3 ${className}`} {...props}>{children}</div>;
}

/** ---------- Select (simplificado) ---------- */
export function Select({ value, onValueChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full border rounded-lg p-2 mt-1 focus:ring-xiomara-sky"
    >
      {children}
    </select>
  );
}
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
export function SelectTrigger({ children }) { return <>{children}</>; }
export function SelectValue({ placeholder }) { return <option disabled>{placeholder}</option>; }

/** ---------- Progress ---------- */
export function Progress({ value, className = "" }) {
  return (
    <div className={`w-full h-2 bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-xiomara-sky to-xiomara-pink h-full transition-all" style={{ width: `${value || 0}%` }} />
    </div>
  );
}

/** ---------- Separator ---------- */
export function Separator({ orientation = "horizontal", className = "" }) {
  return orientation === "vertical" ? (
    <div className={`w-px bg-slate-300 ${className}`} />
  ) : (
    <div className={`h-px bg-slate-300 ${className}`} />
  );
}

/** ---------- Skeleton ---------- */
export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 ${className}`} />;
}

/** ---------- AlertDialog (simple) ---------- */
export function AlertDialog({ open, onOpenChange, children }) {
  return open ? <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">{children}</div> : null;
}
export function AlertDialogContent({ children }) {
  return <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">{children}</div>;
}
export function AlertDialogHeader({ children }) { return <div className="mb-3">{children}</div>; }
export function AlertDialogTitle({ children }) { return <h3 className="text-lg font-semibold mb-1">{children}</h3>; }
export function AlertDialogDescription({ children }) { return <p className="text-sm text-slate-600">{children}</p>; }
export function AlertDialogFooter({ children }) { return <div className="mt-4 flex justify-end gap-2">{children}</div>; }
export function AlertDialogCancel({ children, ...props }) {
  return <Button variant="outline" {...props}>{children || "Cancelar"}</Button>;
}
export function AlertDialogAction({ children, ...props }) {
  return <Button variant="destructive" {...props}>{children || "Aceptar"}</Button>;
}
