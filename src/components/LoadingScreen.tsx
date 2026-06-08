import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-24 w-24"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-white/10"
                style={{ borderTopColor: "var(--lumina)", borderRightColor: "var(--psychic)" }}
              />
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-white/10"
                style={{ borderBottomColor: "var(--ember)" }}
              />
              <span className="absolute inset-[36%] rounded-full bg-lumina shadow-[0_0_24px_8px_var(--lumina)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="label-caps text-foreground/70"
            >
              Initializing Lumina Linkâ€¦
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
