import type { LucideIcon } from 'lucide-react';

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  icon: LucideIcon;
  onChange: (value: string) => void;
}

export function FilterSelect({
  id,
  label,
  value,
  options,
  placeholder,
  icon: Icon,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium text-[#526075]"
      >
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#526b32]" />

        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-[#dfe6dc] bg-white pl-11 pr-9 text-sm text-[#29364b] outline-none transition hover:border-[#b9c8a8] focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
        >
          <option value="tous">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#596778]">
          ▾
        </span>
      </div>
    </div>
  );
}