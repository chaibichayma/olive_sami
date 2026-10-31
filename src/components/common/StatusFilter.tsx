import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Factory,
  FileText,
  Scale,
  UserRound,
} from "lucide-react";

import type { StatusFilterItem } from "@/components/reception/bon-reception.types";

interface StatusFilterProps {
  items: StatusFilterItem[];
  value: string;
  onChange: (value: string) => void;
}

const icons = [
  FileText,
  UserRound,
  Scale,
  Clock3,
  Factory,
  CreditCard,
  CheckCircle2,
];

const styles = [
  "border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]",
  "border-[#e5e7eb] bg-[#f8fafc] text-[#64748b]",
  "border-[#fde68a] bg-[#fffbeb] text-[#b7791f]",
  "border-[#e9d5ff] bg-[#faf5ff] text-[#9333ea]",
  "border-[#bbf7d0] bg-[#ecfdf5] text-[#16833b]",
  "border-[#fecaca] bg-[#fff1f2] text-[#e11d48]",
  "border-[#a5f3fc] bg-[#ecfeff] text-[#0f9297]",
];

export function StatusFilter({
  items,
  value,
  onChange,
}: StatusFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-[#edf0f2] bg-white px-4 py-3 sm:grid-cols-4 xl:grid-cols-7">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        const active = value === item.label;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(item.label)}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold transition ${
              active
                ? "border-[#2878e8] bg-[#2878e8] text-white shadow-sm"
                : `${styles[index % styles.length]} hover:brightness-95`
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            <span className="shrink-0">({item.count})</span>
          </button>
        );
      })}
    </div>
  );
}