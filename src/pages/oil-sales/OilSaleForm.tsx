import type { FormEvent } from "react";
import { Plus } from "lucide-react";

import { FormModal } from "@/components/common/FormModal";
import type { VenteFormData } from "./oil-sales.types";

interface OilSaleFormProps {
  open: boolean;
  isEditing: boolean;
  form: VenteFormData;
  onChange: (form: VenteFormData) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const formatNombre = (valeur: number) =>
  valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function OilSaleForm({
  open,
  isEditing,
  form,
  onChange,
  onClose,
  onSubmit,
}: OilSaleFormProps) {
  const total =
    (Number(form.quantite) || 0) * (Number(form.prixLitre) || 0);

  function updateField(field: keyof VenteFormData, value: string) {
    onChange({ ...form, [field]: value });
  }

  return (
    <FormModal
      open={open}
      title={isEditing ? "Modifier la vente" : "Ajouter une vente"}
      description="Renseignez les informations de la vente d'huile."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5 p-6">
        <div>
          <label
            htmlFor="vente-compte"
            className="mb-2 block text-sm font-semibold text-[#344054]"
          >
            Numéro de compte
          </label>
          <input
            id="vente-compte"
            required
            maxLength={30}
            value={form.compte}
            onChange={(event) => updateField("compte", event.target.value)}
            placeholder="Ex. CPT009"
            className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
          />
        </div>

        <div>
          <label
            htmlFor="vente-telephone"
            className="mb-2 block text-sm font-semibold text-[#344054]"
          >
            Téléphone
          </label>
          <input
            id="vente-telephone"
            required
            value={form.telephone}
            onChange={(event) => updateField("telephone", event.target.value)}
            placeholder="Ex. 06 12 34 56 78"
            className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="vente-quantite"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Quantité d'huile (L)
            </label>
            <input
              id="vente-quantite"
              required
              type="number"
              min="0.01"
              step="any"
              value={form.quantite}
              onChange={(event) => updateField("quantite", event.target.value)}
              placeholder="120"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>

          <div>
            <label
              htmlFor="vente-prix"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Prix par litre (DT)
            </label>
            <input
              id="vente-prix"
              required
              type="number"
              min="0.01"
              step="any"
              value={form.prixLitre}
              onChange={(event) => updateField("prixLitre", event.target.value)}
              placeholder="35"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#f3f7ed] p-4">
          <p className="text-xs font-medium text-[#68766b]">
            Total calculé automatiquement
          </p>
          <p className="mt-1 text-xl font-bold text-[#456020]">
            {formatNombre(total)} DT
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#edf0e9] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#dfe6dc] px-4 py-2.5 text-sm font-semibold text-[#526075] hover:bg-[#f7f9f4]"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#586f2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#455a24]"
          >
            <Plus size={17} />
            {isEditing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}