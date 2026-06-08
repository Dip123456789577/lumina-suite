import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mx-auto w-full max-w-2xl"
    >
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        <div className="absolute left-4 text-white/50">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number..."
          className="h-14 w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-14 text-lg text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-lumina/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-lumina/20"
        />
        <button
          type="button"
          className="absolute right-2 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Filter size={18} />
        </button>
      </form>
    </motion.div>
  );
}
