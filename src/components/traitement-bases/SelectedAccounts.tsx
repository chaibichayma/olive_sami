import { UserRound } from "lucide-react";

import type { Compte } from "./AccountMultiSelect";

interface SelectedAccountsProps {
  comptes: Compte[];
}

export default function SelectedAccounts({
  comptes,
}: SelectedAccountsProps) {
  return (
    <section className="rounded-xl border border-[#e6eae3] bg-white p-3 shadow-sm sm:p-4">
      <div className="rounded-lg border border-[#edf1e7] bg-gradient-to-r from-[#f3f7ed] to-[#f8faf5] p-3.5 sm:p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#e0ebd1] text-[#526b2c]">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#172b3d]">
              Comptes sélectionnés
            </h2>

            <p className="mt-1 text-xs text-[#7b8795]">
              {comptes.length
                ? "Informations des comptes retenus pour la recherche."
                : "Sélectionnez un ou plusieurs comptes."}
            </p>
          </div>
        </div>

        {comptes.length === 0 ? (
          <p className="text-xs text-[#7b8795]">
            Aucun compte sélectionné.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {comptes.map((compte) => (
              <div
                key={compte.id}
                className="rounded-lg border border-[#dce4d5] bg-white p-3"
              >
                <p className="text-xs font-bold text-[#344054]">
                  {compte.nom}
                </p>

                <p className="mt-1 text-[11px] text-[#667085]">
                  {compte.numero} · {compte.type}
                </p>

                <p className="mt-1 text-[11px] text-[#667085]">
                  {compte.telephone}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}