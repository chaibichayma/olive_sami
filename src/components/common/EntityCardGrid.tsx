
import type { ReactNode } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntityCardGridProps<T> {
  items: T[];
  getKey: (item: T) => string | number;
  renderCard: (item: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export function EntityCardGrid<T>({
  items,
  getKey,
  renderCard,
  emptyTitle = "Aucun élément trouvé",
  emptyDescription = "Aucun élément ne correspond à votre recherche.",
  onReset,
}: EntityCardGridProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f1f5f9]">
          <span className="text-xl text-[#94a3b8]">—</span>
        </div>

        <h3 className="text-sm font-semibold text-[#334155]">
          {emptyTitle}
        </h3>

        <p className="mt-1 text-xs text-[#94a3b8]">
          {emptyDescription}
        </p>

        {onReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="mt-4 h-9 gap-2 rounded-lg text-xs"
          >
            <RefreshCcw className="size-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <div key={getKey(item)} className="min-w-0">
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
}
