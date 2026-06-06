import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-32 border-t border-white/5"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-4 md:px-16">
        <div>
          <div className="text-lg font-extrabold tracking-[0.18em]">AETHER·DEX</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">A cinematic encyclopedia of biological specimens. Built for explorers.</p>
        </div>
        {[
          { title: "Archive", items: ["Specimens", "Regions", "Evolutions", "Moves"] },
          { title: "Protocol", items: ["Privacy", "Terms", "Neural Link", "API Access"] },
          { title: "Frequency", items: ["Newsletter", "Discord", "X / Twitter", "GitHub"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="label-caps text-foreground/70">{col.title}</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-aether">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-3 border-t border-white/5 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-16">
        <span>© 2026 Aether Global Archive — All biological data encrypted.</span>
        <span className="label-caps">v1.0.0 · stable</span>
      </div>
    </motion.footer>
  );
}