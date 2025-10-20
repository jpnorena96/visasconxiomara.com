import React, { useEffect, useRef, useState } from "react";

export default function SnapSection({ children, id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const lastRatio = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const showThreshold = 0.45; // aparece
    const hideThreshold = 0.25; // se oculta (histeresis)
    const io = new IntersectionObserver(
      ([entry]) => {
        const r = entry.intersectionRatio;
        // Evita “flip-flop” cerca del umbral
        if (!visible && r >= showThreshold) setVisible(true);
        if (visible && r <= hideThreshold) setVisible(false);
        lastRatio.current = r;
      },
      { threshold: [0, 0.25, 0.45, 1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <section
      id={id}
      ref={ref}
      className={`
        relative min-h-[100vh] snap-center md:snap-start flex items-stretch
        motion-safe:transition-all motion-safe:duration-500
        motion-safe:ease-[cubic-bezier(.22,1,.36,1)]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <div className="flex-1">{children}</div>
    </section>
  );
}
