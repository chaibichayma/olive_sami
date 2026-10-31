import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";

interface PageFeedbackProps {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
}

export function PageFeedback({
  loading = false,
  error = "",
  empty = false,
  emptyMessage = "Aucun résultat trouvé.",
}: PageFeedbackProps) {
  if (loading) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6">
        <LoaderCircle className="size-8 animate-spin text-[#556B2F]" />
        <p className="text-sm font-medium text-slate-500">
          Chargement des données...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[140px] items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
        <AlertCircle className="size-6 shrink-0 text-red-500" />

        <div>
          <p className="text-sm font-semibold text-red-700">
            Une erreur est survenue
          </p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6">
        <SearchX className="size-8 text-slate-400" />
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return null;
}