import type { ReactNode } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  current?: boolean;
}

interface FormPageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  backLabel: string;
  onBack: () => void;
  disabled?: boolean;
}

export function FormPageHeader({
  title,
  description,
  icon,
  breadcrumbs,
  backLabel,
  onBack,
  disabled = false,
}: FormPageHeaderProps) {
  return (
    <header className="relative mb-5 overflow-hidden rounded-2xl border border-[#E6EBDD] bg-gradient-to-br from-[#F4F7EE] via-white to-[#F8FAF5] px-5 py-5 sm:px-7 sm:py-6">
      <div className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border border-[#DDE7D0]/70" />
      <div className="pointer-events-none absolute -right-2 -top-16 size-48 rounded-full border border-[#E5ECD9]/80" />

      <div className="relative z-10">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-5 flex flex-wrap items-center gap-2.5 text-xs"
        >
          {breadcrumbs.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2.5">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-[#C0C8B8]" />
              )}

              {item.current ? (
                <span className="rounded-md border border-[#E1E9D7] bg-[#F4F7EF] px-2.5 py-1 text-[11px] font-semibold text-[#4D6429]">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="font-medium text-[#7B8798] transition hover:text-[#556B2F]"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#E0E8D5] bg-white/90 text-[#556B2F] shadow-sm">
              {icon}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-[32px]">
                {title}
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-6 text-[#64748B] sm:text-sm">
                {description}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={disabled}
            className="h-10 shrink-0 gap-2 self-start rounded-xl border-[#DCE8CF] bg-white/85 px-4 text-xs font-semibold text-[#556B2F] shadow-sm hover:bg-[#F2F6EC] sm:self-center"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}