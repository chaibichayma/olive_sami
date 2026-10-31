import { Search, X, RefreshCcw } from "lucide-react";
import type { FormEvent } from "react";

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  placeholder?: string;
  loading?: boolean;
}

export function SearchToolbar({
  value,
  onChange,
  onSubmit,
  onReset,
  placeholder = "Rechercher...",
  loading = false,
}: SearchToolbarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white transition hover:bg-[#465A27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search className="size-4" />
          {loading ? "Recherche..." : "Rechercher"}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          title="Réinitialiser la recherche"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCcw className="size-4" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </button>
      </div>
    </form>
  );
}