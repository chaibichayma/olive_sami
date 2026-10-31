import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  description: string;
  icon: ReactNode;
  banner?: string;
  accentColor?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export function PageHero({
  title,
  description,
  icon,
  banner,
  children,
  footer,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#e7ebdf] bg-gradient-to-r from-[#fbfcf7] via-[#f5f7ed] to-[#edf2df] shadow-sm">
      {banner && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-90 sm:w-[58%]"
          aria-hidden="true"
        >
          <img
            src={banner}
            alt=""
            className="h-full w-full object-cover object-center"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcf7] via-[#f7f8f0]/85 to-transparent" />
        </div>
      )}

      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:min-h-[190px] lg:flex-row lg:items-center lg:justify-between lg:px-7">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#e1e9d3] bg-[#edf3e3]/95 text-[#556B2F] shadow-sm sm:size-16">
            {icon}
          </div>

          <div className="min-w-0 pt-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#25351e] sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 max-w-[480px] text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>

            {footer && <div className="mt-3">{footer}</div>}
          </div>
        </div>

        {children && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:max-w-[260px] lg:flex-col">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

interface HeroInfoProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function HeroInfo({
  icon,
  title,
  description,
}: HeroInfoProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/85 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3e3] text-[#556B2F]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 sm:text-sm">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>

      <ChevronRight className="ml-auto size-4 shrink-0 text-slate-400" />
    </div>
  );
}