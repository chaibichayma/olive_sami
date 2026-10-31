import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">
      <Icon className="mb-3 size-8 text-[#cbd5e1]" />

      <p className="text-sm font-semibold text-[#334155]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#94a3b8]">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 text-xs font-semibold text-[#556B2F] hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}