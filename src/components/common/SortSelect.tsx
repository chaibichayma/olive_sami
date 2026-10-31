import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export type SortOption = {
  label: string;
  value: string;
};

export type SortSelectColors = {
  container: string;
  icon: string;
  separator: string;
  text: string;
};

type SortSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
  options: SortOption[];
  colors: SortSelectColors;
  className?: string;
};

export default function SortSelect({
  label,
  value,
  onChange,
  icon,
  options,
  colors,
  className = '',
}: SortSelectProps) {
  return (
    <div className={`relative min-w-0 xl:w-[230px] xl:flex-none ${className}`}>
      <div
        className={`pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white shadow-sm ${colors.icon}`}
      >
        {icon}
      </div>

      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-[44px] w-full cursor-pointer appearance-none rounded-[13px] border-2 pl-[58px] pr-10 text-[13px] font-semibold outline-none transition-all duration-200 focus:ring-2 ${colors.container} ${colors.text}`}
      >
        <option value="" disabled>
          {label}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span
        className={`pointer-events-none absolute bottom-2 left-[47px] top-2 z-10 w-[2px] rounded-full ${colors.separator}`}
      />

      <ChevronDown
        size={16}
        strokeWidth={2.5}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}