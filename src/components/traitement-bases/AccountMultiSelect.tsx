import { useMemo, useState } from "react";
import {
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import FieldLabel from "../common/FieldLabel";

export interface Compte {
  id: number;
  nom: string;
  telephone: string;
  numero: string;
  type: "Client" | "Fournisseur";
}

interface AccountMultiSelectProps {
  comptes: Compte[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onSelectionChange?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-[#e0e5dc] bg-white px-3 py-2.5 text-xs text-[#344054] outline-none transition placeholder:text-[#98a2b3] hover:border-[#cbd5c0] focus:border-[#71843d] focus:ring-2 focus:ring-[#71843d]/10";

export default function AccountMultiSelect({
  comptes,
  selectedIds,
  onChange,
  onSelectionChange,
}: AccountMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return comptes.filter((compte) =>
      [
        compte.nom,
        compte.telephone,
        compte.numero,
        compte.type,
      ].some((value) => value.toLowerCase().includes(q))
    );
  }, [comptes, search]);

  const selectedAccounts = comptes.filter((compte) =>
    selectedIds.includes(compte.id)
  );

  const allFilteredSelected =
    filteredAccounts.length > 0 &&
    filteredAccounts.every((compte) =>
      selectedIds.includes(compte.id)
    );

  function toggleAccount(id: number) {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    onChange(nextIds);
    onSelectionChange?.();
  }

  function toggleAllFiltered() {
    const filteredIds = filteredAccounts.map((compte) => compte.id);

    const nextIds = allFilteredSelected
      ? selectedIds.filter((id) => !filteredIds.includes(id))
      : [...new Set([...selectedIds, ...filteredIds])];

    onChange(nextIds);
    onSelectionChange?.();
  }

  return (
    <div className="relative min-w-0">
      <FieldLabel required>Comptes</FieldLabel>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] px-3.5 text-left text-sm text-[#34412b] hover:border-[#b9c7a8] focus:outline-none focus:ring-4 focus:ring-[#586f32]/10"
      >
        <span className="min-w-0 truncate">
          {selectedIds.length === 0
            ? "Sélectionner des comptes"
            : `${selectedIds.length} compte(s) sélectionné(s)`}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedAccounts.slice(0, 3).map((compte) => (
            <span
              key={compte.id}
              className="inline-flex items-center gap-1 rounded-full bg-[#edf3e5] px-2 py-1 text-[10px] font-medium text-[#526b2c]"
            >
              {compte.numero}

              <button
                type="button"
                aria-label={`Retirer ${compte.numero}`}
                onClick={() => toggleAccount(compte.id)}
              >
                <X size={11} />
              </button>
            </span>
          ))}

          {selectedAccounts.length > 3 && (
            <span className="rounded-full bg-[#f1f3ee] px-2 py-1 text-[10px] text-[#667085]">
              +{selectedAccounts.length - 3}
            </span>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[min(680px,90vw)] overflow-hidden rounded-xl border border-[#dfe5d8] bg-white shadow-xl">
          <div className="border-b border-[#edf0e9] p-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87917c]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, numéro, téléphone ou type..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#344054]">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleAllFiltered}
                className="size-4 accent-[#586f32]"
              />

              Sélectionner tous les comptes affichés
            </label>
          </div>

          <div className="max-h-64 overflow-auto">
            <table className="w-full min-w-[590px] text-left text-xs">
              <thead className="sticky top-0 z-10 bg-[#f5f7f2] text-[#475467]">
                <tr>
                  <th className="w-10 px-3 py-3"></th>
                  <th className="px-3 py-3">Numéro</th>
                  <th className="px-3 py-3">Nom du compte</th>
                  <th className="px-3 py-3">Téléphone</th>
                  <th className="px-3 py-3">Type</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0e9]">
                {filteredAccounts.map((compte) => {
                  const checked = selectedIds.includes(compte.id);

                  return (
                    <tr
                      key={compte.id}
                      onClick={() => toggleAccount(compte.id)}
                      className={`cursor-pointer transition hover:bg-[#f3f6ed] ${
                        checked ? "bg-[#edf3e5]" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="size-4 accent-[#586f32]"
                        />
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 font-semibold">
                        {compte.numero}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">
                        {compte.nom}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">
                        {compte.telephone}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">
                        {compte.type}
                      </td>
                    </tr>
                  );
                })}

                {filteredAccounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      Aucun compte trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#edf0e9] p-3">
            <span className="text-xs text-[#667085]">
              {selectedIds.length} compte(s) sélectionné(s)
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#586f32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#465a27]"
            >
              Terminé
            </button>
          </div>
        </div>
      )}
    </div>
  );
}