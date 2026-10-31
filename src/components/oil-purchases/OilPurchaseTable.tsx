
import {
  Download,
  Droplet,
  Pencil,
  Phone,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";

import type { AchatHuile } from "./oil-purchase.types";

interface OilPurchaseTableProps {
  achats: AchatHuile[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (achat: AchatHuile) => void;
  onDelete: (achat: AchatHuile) => void;
  onExport: () => void;
}

const formatNombre = (value: number) =>
  Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function OilPurchaseTable({
  achats,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onExport,
}: OilPurchaseTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-sm">

      {/* EN-TÊTE DU TABLEAU */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#526b32]">
            <ShoppingCart size={21} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#26364a]">
              Liste des achats d'huile
            </h2>

            <p className="mt-1 text-xs text-[#839080]">
              Consultez et gérez tous les achats enregistrés.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f7f9f4] px-4 py-2.5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
        >
          <Download size={17} />
          Exporter
        </button>
      </div>

      {/* CONTENU DU TABLEAU */}
      <div className="overflow-x-auto px-3 pt-3 sm:px-5">
        {achats.length > 0 ? (
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f1f5ed] text-left">
                <th className="w-12 rounded-l-lg px-3 py-3 text-xs font-bold">
                  #
                </th>

                <th className="px-3 py-3 text-xs font-bold">
                  N° compte
                </th>

                <th className="px-3 py-3 text-xs font-bold">
                  Téléphone
                </th>

                <th className="px-3 py-3 text-center text-xs font-bold">
                  Quantité huile (L)
                </th>

                <th className="px-3 py-3 text-center text-xs font-bold">
                  Prix litre (DT)
                </th>

                <th className="px-3 py-3 text-center text-xs font-bold">
                  Total (DT)
                </th>

                <th className="w-20 px-3 py-3 text-center text-xs font-bold">
                  Modifier
                </th>

                <th className="w-20 rounded-r-lg px-3 py-3 text-center text-xs font-bold">
                  Supprimer
                </th>
              </tr>
            </thead>

            <tbody>
              {achats.map((achat, index) => (
                <tr
                  key={achat.id}
                  className="transition hover:bg-[#f7f9f4]"
                >
                  {/* NUMÉRO */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5 text-xs text-[#526075]">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* COMPTE */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5">
                    <span className="inline-flex min-w-[84px] justify-center rounded-lg bg-[#eaf0e3] px-3 py-1.5 font-mono text-xs font-bold text-[#3c571f]">
                      {achat.compte}
                    </span>
                  </td>

                  {/* TÉLÉPHONE */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5">
                    <span className="inline-flex items-center gap-2 text-xs text-[#39465b]">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#edf3e5] text-[#526b32]">
                        <Phone size={13} />
                      </span>
                      {achat.telephone}
                    </span>
                  </td>

                  {/* QUANTITÉ */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5 text-center">
                    <span className="inline-flex min-w-[82px] justify-center rounded-full bg-[#e8f7e8] px-3 py-1.5 text-xs font-bold text-[#218333]">
                      {formatNombre(achat.quantite)}
                    </span>
                  </td>

                  {/* PRIX LITRE */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5 text-center">
                    <span className="inline-flex min-w-[78px] justify-center rounded-full bg-[#f0f2f6] px-3 py-1.5 text-xs font-semibold text-[#344054]">
                      {formatNombre(achat.prixLitre)}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="border-b border-[#edf0e9] px-3 py-2.5 text-center">
                    <span className="inline-flex min-w-[90px] justify-center rounded-full bg-[#e8f7e8] px-3 py-1.5 text-xs font-bold text-[#218333]">
                      {formatNombre(
                        achat.quantite * achat.prixLitre
                      )}
                    </span>
                  </td>

                  {/* MODIFIER */}
                  <td className="border-b border-[#edf0e9] px-3 py-2 text-center">
                    <button
                      type="button"
                      title="Modifier"
                      aria-label={`Modifier l'achat ${achat.compte}`}
                      onClick={() => onEdit(achat)}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-[#dce4f0] bg-[#f0f4fa] text-[#34465f] transition hover:bg-[#e2eaf6]"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>

                  {/* SUPPRIMER */}
                  <td className="border-b border-[#edf0e9] px-3 py-2 text-center">
                    <button
                      type="button"
                      title="Supprimer"
                      aria-label={`Supprimer l'achat ${achat.compte}`}
                      onClick={() => onDelete(achat)}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-[#ffd8d8] bg-[#fff0f0] text-[#e32626] transition hover:bg-[#ffe1e1]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={Droplet}
            title="Aucun achat trouvé"
            description="Modifiez les filtres ou réinitialisez-les pour afficher les achats."
          />
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="achat(s)"
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
