import type { ReactNode } from "react";

interface SectionTitleProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function SectionTitle({
  icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e3ead9] bg-[#edf3e5] text-[#556b2f]">
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#172b3d]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-[#778397]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}