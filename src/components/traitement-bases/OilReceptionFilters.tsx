import {
  ChevronDown,
  Leaf,
  RotateCcw,
  Search,
} from "lucide-react";

import FieldLabel from "../common/FieldLabel";
import SectionTitle from "../common/SectionTitle";
import AccountMultiSelect, {
  type Compte,
} from "./AccountMultiSelect";

interface OilReceptionFiltersProps {
  comptes: Compte[];
  typeHuile: string;
  selectedAccountIds: number[];
  error: string;
  onTypeChange: (value: string) => void;
  onAccountsChange: (ids: number[]) => void;
  onSearch: () => void;
  onReset: () => void;
  onCriteriaChange: () => void;
}

const TYPES_HUILE = [
  "Huile d'olive",
  "Huile vierge extra",
  "Huile vierge",
  "Lampante",
];

export default function OilReceptionFilters({
  comptes,
  typeHuile,
  selectedAccountIds,
  error,
  onTypeChange,
  onAccountsChange,
  onSearch,
  onReset,
  onCriteriaChange,
}: OilReceptionFiltersProps) {
  return (
    <section className="overflow-visible rounded-2xl border border-[#e5e9df] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#edf0e8] bg-gradient-to-r from-[#f8faf5] to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          icon={<Search size={19} />}
          title="Critères de recherche"
          description="Filtrez les bons par type d’huile et par plusieurs comptes."
        />

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e3e9d9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#586f32]">
          <span className="size-1.5 rounded-full bg-[#718b48]" />
          Recherche par critères
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.6fr_auto]">
          <div className="min-w-0">
            <FieldLabel required>Type d’huile</FieldLabel>

            <div className="relative">
              <Leaf
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#647b40]"
              />

              <select
                value={typeHuile}
                onChange={(e) => {
                  onTypeChange(e.target.value);
                  onCriteriaChange();
                }}
                className="h-12 w-full appearance-none rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] pl-10 pr-10 text-sm font-medium text-[#34412b] outline-none hover:border-[#b9c7a8] focus:border-[#718746] focus:ring-4 focus:ring-[#586f32]/10"
              >
                <option value="">Sélectionner un type</option>

                {TYPES_HUILE.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8572]"
              />
            </div>
          </div>

          <AccountMultiSelect
            comptes={comptes}
            selectedIds={selectedAccountIds}
            onChange={onAccountsChange}
            onSelectionChange={onCriteriaChange}
          />

          <div className="flex items-center gap-2 md:col-span-2 xl:col-span-1">
            <button
              type="button"
              onClick={onSearch}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#586f32] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465a27]"
            >
              <Search size={17} />
              Rechercher
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Réinitialiser les critères"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dfe5d8] bg-white px-3.5 text-sm font-semibold text-[#53604a] hover:bg-[#f7f9f3]"
            >
              <RotateCcw size={16} />
              <span className="hidden 2xl:inline">
                Réinitialiser
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p className="font-medium">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}