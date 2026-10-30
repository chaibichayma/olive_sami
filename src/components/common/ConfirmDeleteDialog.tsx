
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName: string;
  itemDetails?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  itemName,
  itemDetails,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[480px] rounded-2xl bg-white p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="size-5" />
        </button>

        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50">
            <Trash2 className="size-8 text-rose-500" />
          </div>
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="font-semibold text-slate-800">
              {itemName}
            </p>

            {itemDetails && (
              <p className="mt-1 text-xs text-slate-500">
                {itemDetails}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-11 rounded-lg px-5"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-11 rounded-lg bg-rose-500 px-5 text-white hover:bg-rose-600"
          >
            <Trash2 className="mr-2 size-4" />
            {loading ? "Suppression..." : "Confirmer la suppression"}
          </Button>
        </div>
      </div>
    </div>
  );
}
