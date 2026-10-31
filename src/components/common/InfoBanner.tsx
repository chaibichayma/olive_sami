
import type { ReactNode } from "react";

interface InfoBannerProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function InfoBanner({
  icon,
  title,
  description,
}: InfoBannerProps) {
  return (
    <section className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 sm:px-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F4E9] text-[#556B2F]">
        {icon}
      </div>

      <div className="h-11 w-px shrink-0 bg-[#C9D6B5]" />

      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight text-[#172033] sm:text-lg">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </section>
  );
}
