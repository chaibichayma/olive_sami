import type { LucideIcon } from 'lucide-react';

export interface StatusFilterOption<T extends string> {
  value: T;
  label: string;
  count: number;
  icon?: LucideIcon;
  color: string;
  activeColor: string;
  badgeColor: string;
  activeBadgeColor: string;
}

interface StatusFilterTabsProps<T extends string> {
  options: StatusFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function StatusFilterTabs<T extends string>({
  options,
  value,
  onChange,
}: StatusFilterTabsProps<T>) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`flex h-11 min-w-[130px] items-center justify-center gap-3 rounded-lg border px-4 transition ${
              isActive
                ? option.activeColor
                : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#c9d9b6]'
            }`}
          >
            {Icon ? (
              <Icon className={`size-3.5 ${option.color}`} />
            ) : (
              <span className={`size-2 rounded-full ${option.color}`} />
            )}

            <span className="text-xs font-semibold">
              {option.label}
            </span>

            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                isActive
                  ? option.activeBadgeColor
                  : option.badgeColor
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}