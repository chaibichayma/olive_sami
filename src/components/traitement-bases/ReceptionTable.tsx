import {
  ClipboardList,
  Download,
  FileText,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

import SectionTitle from "../common/SectionTitle";

import type { Compte } from "./AccountMultiSelect";
import StatusBadge from "./StatusBadge";
import { Pagination } from "../common/Pagination";

export interface BonReception {
  id: number;
  reference: string;
  compteId: number;
  date: string;
  typeHuile: string;
  quantiteOlives: number;
  quantiteHuile: number;
  montant: number;
  montantPaye: number;
  resteAPayer: number;
  statut: "Traité" | "En cours" | "En attente";
}

interface ReceptionTableProps {
  bons: BonReception[];
  comptes: Compte[];
  searchLaunched: boolean;
  searchTable: string;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onSearchTableChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  onResetTable: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDetails: (bon: BonReception) => void;
  formatNumber: (value: number) => string;
  formatMoney: (value: number) => string;
  formatDate: (value: string) => string;
}

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe5da] bg-white px-3 py-2 text-xs font-semibold text-[#34452a] transition hover:bg-[#f4f7ef] disabled:cursor-not-allowed disabled:opacity-40";

export default function ReceptionTable({
  bons,
  comptes,
  searchLaunched,
  page,
  pageSize,
  totalPages,
  totalItems,
  onExport,
  onRefresh,
  onResetTable,
  onPageChange,
  onPageSizeChange,
  onDetails,
  formatNumber,
  formatMoney,
  formatDate,
}: ReceptionTableProps) {

  return (
    <section className="overflow-hidden rounded-xl border border-[#e6eae3] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <SectionTitle
          icon={<ClipboardList size={19} />}
          title="Bons de réception"
          description={
            !searchLaunched
              ? "Choisissez un type d’huile et des comptes, puis lancez la recherche."
              : `Résultats : ${totalItems} bon(s) de réception.`
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            disabled={!totalItems}
            className={buttonClass}
          >
            <Download size={14} />
            Exporter CSV
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className={buttonClass}
          >
            <RefreshCw size={14} />
            Actualiser
          </button>

          <button
            type="button"
            onClick={onResetTable}
            aria-label="Réinitialiser le tableau"
            title="Réinitialiser le tableau"
            className="flex size-9 items-center justify-center rounded-lg border border-[#dfe5da] bg-white text-[#556b2f] hover:bg-[#f4f7ef]"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
      </div>

      {!searchLaunched ? (
        <div className="border-t border-[#edf0e9] px-4 py-14 text-center sm:px-5">
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]">
              <ClipboardList size={22} />
            </div>

            <p className="text-sm font-semibold text-[#344054]">
              Aucun bon affiché
            </p>

            <p className="mt-1 text-xs leading-5 text-[#7b8795]">
              Sélectionnez un type d’huile et un ou plusieurs comptes,
              puis cliquez sur « Rechercher ».
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#e7ebe3] bg-[#f5f7f2] text-[#475467]">
                  {[
                    "Référence",
                    "Compte",
                    "Date",
                    "Statut",
                    "Olives (kg)",
                    "Huile (kg)",
                    "Prix/kg (DT)",
                    "Prix total (DT)",
                    "Détails",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0e9]">
                {bons.map((bon) => {
                  const compte = comptes.find(
                    (item) => item.id === bon.compteId
                  );

                  const prixKg =
                    bon.quantiteHuile > 0
                      ? bon.montant / bon.quantiteHuile
                      : null;

                  return (
                    <tr
                      key={bon.id}
                      className="bg-white transition hover:bg-[#f7f9f4]"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#344054]">
                        {bon.reference}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#526174]">
                        {compte?.nom ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#526174]">
                        {formatDate(bon.date)}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={bon.statut} />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#526174]">
                        {formatNumber(bon.quantiteOlives)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#526174]">
                        {formatNumber(bon.quantiteHuile)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-[#526174]">
                        {prixKg === null ? "—" : formatMoney(prixKg)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#344054]">
                        {formatMoney(bon.montant)}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onDetails(bon)}
                          className="rounded-lg border border-[#dfe5da] p-2 text-[#556b2f] hover:bg-[#f0f4e9]"
                          title="Voir les détails"
                        >
                          <FileText size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {bons.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]">
                          <FileText size={21} />
                        </div>

                        <p className="text-sm font-semibold text-[#344054]">
                          Aucun bon de réception trouvé
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7b8795]">
                          Aucun bon ne correspond à ces critères.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#edf0e9] px-4 py-3.5 sm:px-5">
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    pageSize={pageSize}
    totalItems={totalItems}
    itemLabel="bons de réception"
    onPageChange={onPageChange}
    onPageSizeChange={onPageSizeChange}
  />
</div>
        </>
      )}
    </section>
  );
}