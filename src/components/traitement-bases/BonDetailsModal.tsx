import { X } from "lucide-react";

import DetailItem from "../common/DetailItem";
import type { BonReception } from "./ReceptionTable";
import type { Compte } from "./AccountMultiSelect";
import StatusBadge from "./StatusBadge";

interface BonDetailsModalProps {
  bon: BonReception | null;
  comptes: Compte[];
  onClose: () => void;
  formatDate: (date: string) => string;
  formatNumber: (value: number) => string;
  formatMoney: (value: number) => string;
}

export default function BonDetailsModal({
  bon,
  comptes,
  onClose,
  formatDate,
  formatNumber,
  formatMoney,
}: BonDetailsModalProps) {
  if (!bon) return null;

  const compte = comptes.find((item) => item.id === bon.compteId);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#172b3d]/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-bon-title"
        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#e2e8dc] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#edf0e9] bg-gradient-to-r from-[#f3f7ed] to-white px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71843d]">
              Détail du bon de réception
            </p>

            <h2
              id="detail-bon-title"
              className="mt-1 text-lg font-bold text-[#172b3d]"
            >
              {bon.reference}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les détails"
            className="rounded-lg p-2 text-[#667085] hover:bg-[#edf1e7]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
          <DetailItem
            label="Compte"
            value={compte?.nom ?? "—"}
          />

          <DetailItem
            label="Numéro de compte"
            value={compte?.numero ?? "—"}
          />

          <DetailItem
            label="Téléphone"
            value={compte?.telephone ?? "—"}
          />

          <DetailItem
            label="Date de réception"
            value={formatDate(bon.date)}
          />

          <DetailItem
            label="Type d’huile"
            value={bon.typeHuile}
          />

          <div className="rounded-lg border border-[#e8ede3] bg-[#fbfcfa] p-3">
            <p className="text-[10px] font-medium text-[#7b8795]">
              Statut
            </p>
            <div className="mt-2">
              <StatusBadge status={bon.statut} />
            </div>
          </div>

          <DetailItem
            label="Quantité d’olives"
            value={`${formatNumber(bon.quantiteOlives)} kg`}
          />

          <DetailItem
            label="Quantité d’huile"
            value={`${formatNumber(bon.quantiteHuile)} kg`}
          />

          <DetailItem
            label="Montant total"
            value={`${formatMoney(bon.montant)} DT`}
          />

          <DetailItem
            label="Montant payé"
            value={`${formatMoney(bon.montantPaye)} DT`}
          />

          <DetailItem
            label="Reste à payer"
            value={`${formatMoney(bon.resteAPayer)} DT`}
          />
        </div>

        <div className="flex justify-end border-t border-[#edf0e9] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#586f32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#465a27]"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}