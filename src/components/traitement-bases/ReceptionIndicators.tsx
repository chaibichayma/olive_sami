import {
  Check,
  CircleDollarSign,
  Droplets,
  HandCoins,
  Leaf,
  WalletCards,
} from "lucide-react";

import SectionTitle from "../common/SectionTitle";
import StatCard from "../common/StatCard";
export interface ReceptionTotals {
  quantiteOlives: number;
  quantiteHuile: number;
  montantTotal: number;
  montantPaye: number;
  resteAPayer: number;
}

interface ReceptionIndicatorsProps {
  totals: ReceptionTotals;
  formatNumber: (value: number) => string;
  formatMoney: (value: number) => string;
  searchLaunched: boolean;
  resultCount: number;
}

export default function ReceptionIndicators({
  totals,
  formatNumber,
  formatMoney,
  searchLaunched,
  resultCount,
}: ReceptionIndicatorsProps) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SectionTitle
          icon={<CircleDollarSign size={19} />}
          title="Indicateurs de réception"
          description={
            searchLaunched
              ? "Totaux calculés sur les résultats filtrés."
              : "Lancez une recherche pour calculer les totaux."
          }
        />

        {searchLaunched && (
          <span className="rounded-full border border-[#dce6d1] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#586f32]">
            {resultCount} bon(s)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Quantité d’olives"
          value={`${formatNumber(totals.quantiteOlives)} kg`}
          subtitle="Total des olives réceptionnées"
          icon={<Leaf size={20} />}
          tone="olive"
        />

        <StatCard
          title="Quantité d’huile"
          value={`${formatNumber(totals.quantiteHuile)} kg`}
          subtitle="Total d’huile produite"
          icon={<Droplets size={20} />}
          tone="blue"
        />

        <StatCard
          title="Montant total"
          value={`${formatMoney(totals.montantTotal)} DT`}
          subtitle="Valeur totale des bons"
          icon={<WalletCards size={20} />}
          tone="purple"
        />

        <StatCard
          title="Montant payé"
          value={`${formatMoney(totals.montantPaye)} DT`}
          subtitle="Somme déjà réglée"
          icon={<Check size={20} />}
          tone="green"
        />

        <StatCard
          title="Reste à payer"
          value={`${formatMoney(totals.resteAPayer)} DT`}
          subtitle="Solde restant à régler"
          icon={<HandCoins size={20} />}
          tone="amber"
        />
      </div>
    </section>
  );
}