
import { Trash2, X, AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  confirmLabel?: string;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  description,
  itemName,
  loading = false,
  confirmLabel = "Supprimer",
  error,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  const displayedMessage = description ?? message;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onClick={() => !loading && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-[500px] rounded-2xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fermer"
          disabled={loading}
          onClick={onCancel}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-800 disabled:opacity-50"
        >
          <X className="size-5" />
        </button>

        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="size-9 text-red-500" />
        </div>

        <h2
          id="confirm-dialog-title"
          className="text-center text-2xl font-bold text-slate-800"
        >
          {title}
        </h2>

        <p className="mt-3 text-center leading-6 text-slate-500">
          {displayedMessage}

          {itemName && (
            <span className="block font-semibold text-slate-800">
              {itemName}
            </span>
          )}
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-7 flex justify-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-lg bg-[#ff303d] px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            {loading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
