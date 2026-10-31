import { ChevronsUpDown } from 'lucide-react';

type SortableTableHeaderProps = {
  label: string;
  field: string;
  currentSort: string;
  ascending: boolean;
  onSort: (field: string) => void;
  className?: string;
};

export default function SortableTableHeader({
  label,
  field,
  currentSort,
  ascending,
  onSort,
  className = '',
}: SortableTableHeaderProps) {
  const isActive = currentSort === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      aria-label={`Trier par ${label}`}
      aria-sort={
        isActive
          ? ascending
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className={`inline-flex items-center gap-2 transition hover:text-[#526b32] ${className}`}
    >
      {label}

      <ChevronsUpDown
        size={13}
        className={isActive ? 'text-[#526b32]' : 'text-[#8c9583]'}
      />

      {isActive && (
        <span className="text-[9px]">
          {ascending ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
}