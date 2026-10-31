
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <header className="py-4 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          {icon && (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#e2ead7] bg-[#f1f6eb] text-[#526B2F]">
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-[28px]">
              {title}
            </h1>

            {description && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>

      {children}
    </header>
  );
}