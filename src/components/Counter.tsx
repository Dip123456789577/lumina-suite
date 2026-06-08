import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({
  to,
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());
  const [text, setText] = useState("0");
  useMotionValueEvent(rounded, "change", (v) => setText(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, duration, mv]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <span>{text}</span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}
