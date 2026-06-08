import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.3 });
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklab,var(--lumina)_22%,transparent)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,_color-mix(in_oklab,var(--psychic)_18%,transparent)_0%,transparent_60%)]" />
      <motion.div
        style={{ y: y1 }}
        className="lumina-orb left-[10%] top-[20%] h-[420px] w-[420px] bg-lumina"
      />
      <motion.div
        style={{ y: y2 }}
        className="lumina-orb right-[5%] top-[40%] h-[520px] w-[520px] bg-psychic"
      />
      <motion.div
        style={{ y: y1 }}
        className="lumina-orb left-[40%] top-[80%] h-[380px] w-[380px] bg-ember"
      />
      <div
        className="absolute inset-0 transition-[background] duration-300"
        style={{
          background: `radial-gradient(600px circle at ${pos.x * 100}% ${pos.y * 100}%, color-mix(in oklab, var(--lumina) 14%, transparent), transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 grid-noise opacity-[0.18]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_var(--background)_95%)]" />
    </div>
  );
}
