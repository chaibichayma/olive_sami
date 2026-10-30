
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  onAction: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <header className="py-4 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#e2ead7] bg-[#f1f6eb] text-[#526B2F]">
            {icon}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAction}
          className="h-11 shrink-0 gap-2 rounded-xl bg-[#526B2F] px-5 text-sm font-semibold text-white hover:bg-[#435725]"
        >
          {actionLabel}
        </Button>
      </div>

      {children}
    </header>
  );
}
