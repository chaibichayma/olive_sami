import { Info, X } from "lucide-react";

interface FormErrorProps {
  message: string;
  title?: string;
  onClose: () => void;
}

export function FormError({
  message,
  title = "Une erreur est survenue",
  onClose,
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
    >
      <Info className="mt-0.5 size-5 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 break-words text-xs leading-5">{message}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le message d'erreur"
        className="rounded-lg p-1 text-red-400 transition hover:bg-red-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}