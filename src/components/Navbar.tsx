import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";

const NAV = [
  { to: "/", label: "Evolution" },
  { to: "/browse", label: "Archive" },
  { to: "/types", label: "Types" },
  { to: "/compare", label: "Compare" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-16">
        <Link to="/" className="group flex items-center gap-3">
          <motion.span
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-aether/40 to-psychic/40"
          >
            <span className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_12px_2px_var(--aether)]" />
          </motion.span>
          <span className="text-sm font-extrabold tracking-[0.18em] text-foreground/95">AETHER<span className="text-aether">·</span>DEX</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            return (
              <li key={n.to} className="relative">
                <Link
                  to={n.to}
                  className="relative block px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-1/2 h-px w-6 -translate-x-1/2 bg-aether shadow-[0_0_8px_var(--aether)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            aria-label="Profile"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 transition hover:border-aether/50 hover:text-aether"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
          </button>
          <button
            aria-label="Settings"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 transition hover:border-aether/50 hover:text-aether"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2L5 5.8 3 9.3l2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}