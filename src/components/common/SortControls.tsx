import { ArrowUpDown } from 'lucide-react';

export type SortOption = {
  label: string;
  value: string;
};

type SortControlsProps = {
  field: string;
  direction: 'asc' | 'desc';
  onFieldChange: (value: string) => void;
  onDirectionChange: (value: 'asc' | 'desc') => void;
  options: SortOption[];
  fieldLabel?: string;
  className?: string;
};

export default function SortControls({
  field,
  direction,
  onFieldChange,
  onDirectionChange,
  options,
  fieldLabel = 'Trier par :',
  className = '',
}: SortControlsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <ArrowUpDown size={16} />
        <span className="hidden sm:inline">{fieldLabel}</span>
      </div>

      <select
        value={field}
        onChange={(event) => onFieldChange(event.target.value)}
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={direction}
        onChange={(event) =>
          onDirectionChange(event.target.value as 'asc' | 'desc')
        }
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
      >
        <option value="asc">Croissant</option>
        <option value="desc">Décroissant</option>
      </select>
    </div>
  );
}