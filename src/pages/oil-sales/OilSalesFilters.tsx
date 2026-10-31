import { FileText, Phone, RefreshCw } from "lucide-react";
import { FilterSelect } from "@/components/common/FilterSelect";

interface OilSalesFiltersProps {
  comptes: string[];
  telephones: string[];
  filtreCompte: string;
  filtreTelephone: string;
  onCompteChange: (value: string) => void;
  onTelephoneChange: (value: string) => void;
  onReset: () => void;
}

export function OilSalesFilters({
  comptes,
  telephones,
  filtreCompte,
  filtreTelephone,
  onCompteChange,
  onTelephoneChange,
  onReset,
}: OilSalesFiltersProps) {
  return (
    <section className="rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#526b32]">
          <RefreshCw size={19} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#26364a]">
            Filtres des ventes
          </h2>
          <p className="text-xs text-[#839080]">
            Filtrez les ventes selon le compte et le téléphone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <FilterSelect
  id="filtre-vente-compte"
  label="Compte"
  value={filtreCompte}
  options={comptes}
  placeholder="Tous les comptes"
  icon={FileText}
  onChange={onCompteChange}
/>

<FilterSelect
  id="filtre-vente-telephone"
  label="Téléphone"
  value={filtreTelephone}
  options={telephones}
  placeholder="Tous les numéros"
  icon={Phone}
  onChange={onTelephoneChange}
/>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[54px] items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f4f7ef] px-5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
        >
          <RefreshCw size={18} />
          Réinitialiser
        </button>
      </div>
    </section>
  );
}