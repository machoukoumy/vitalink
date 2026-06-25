"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Building2, Hospital, Droplets, X } from "lucide-react";

interface SearchResult {
  type: string;
  id: string;
  label: string;
  sub: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  donor: <Droplets size={16} className="text-[#E30613]" />,
  user: <Users size={16} className="text-[#003DA5]" />,
  hospital: <Hospital size={16} className="text-purple-600" />,
  center: <Building2 size={16} className="text-green-600" />,
};

const typeRoutes: Record<string, (id: string) => string> = {
  donor: (id) => `/admin/donneurs/${id}`,
  user: () => `/superadmin/utilisateurs`,
  hospital: () => `/admin/hopitaux`,
  center: () => `/admin/centres`,
};

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (result: SearchResult) => {
    const routeFn = typeRoutes[result.type];
    if (routeFn) {
      router.push(routeFn(result.id));
    }
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Rechercher..."
          className="w-full pl-9 pr-8 py-2 bg-[#F5F7FA] border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-72 overflow-y-auto z-50">
          {loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">Recherche...</div>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-gray-400">Aucun résultat</div>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.id}-${i}`}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F7FA] transition-colors text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                {typeIcons[r.type] || <Search size={16} className="text-gray-400" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{r.label}</p>
                <p className="text-xs text-gray-500 truncate">{r.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
