import type { ReactNode } from "react";

interface FilterSectionProps {
  children: ReactNode;
  className?: string;
}

export default function FilterSection({
  children,
  className = "",
}: FilterSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-[0_3px_15px_rgba(45,62,28,0.03)] sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        {children}
      </div>
    </section>
  );
}