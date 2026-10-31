
export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count: number;
  color?: "default" | "green" | "red" | "blue";
}

interface FilterTabsProps<T extends string> {
  options: FilterOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
}

const colorClasses = {
  default: {
    active: "border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]",
    dot: "bg-[#94a3b8]",
    badge: "bg-[#e9eef3] text-[#475569]",
    hover: "hover:border-[#c9d9b6]",
  },
  green: {
    active: "border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]",
    dot: "bg-[#16a34a]",
    badge: "bg-[#e3f5e9] text-[#16833b]",
    hover: "hover:border-[#b8e3c7]",
  },
  red: {
    active: "border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]",
    dot: "bg-[#ef4444]",
    badge: "bg-[#fdebed] text-[#dc2635]",
    hover: "hover:border-[#f5c9cd]",
  },
  blue: {
    active: "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
    dot: "bg-[#0ea5e9]",
    badge: "bg-[#e5f4fc] text-[#0369a1]",
    hover: "hover:border-[#bae6fd]",
  },
};

export function FilterTabs<T extends string>({
  options,
  activeValue,
  onChange,
}: FilterTabsProps<T>) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      {options.map((option) => {
        const colors = colorClasses[option.color ?? "default"];
        const active = activeValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex h-10 items-center gap-2 rounded-md border px-3 transition sm:px-4 ${
              active
                ? colors.active
                : `border-[#e5e7eb] bg-white text-[#334155] ${colors.hover}`
            }`}
          >
            <span className={`size-2 shrink-0 rounded-full ${colors.dot}`} />

            <span className="text-xs font-semibold whitespace-nowrap">
              {option.label}
            </span>

            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${colors.badge}`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
