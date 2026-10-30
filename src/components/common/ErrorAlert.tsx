
import { X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <p>{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le message"
        className="shrink-0 rounded-md p-1 hover:bg-red-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
