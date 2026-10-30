
import { RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Chargement...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <RefreshCw className="size-6 animate-spin text-[#526B2F]" />
      {message}
    </div>
  );
}
