
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  message,
  onRetry,
  retryLabel = "Réessayer",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-red-800">
            {title}
          </h2>

          <p className="mt-1 break-words text-sm text-red-700">
            {message}
          </p>

          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              className="mt-4 h-9 rounded-lg bg-[#556B2F] text-white hover:bg-[#465A27]"
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
