import { useEffect, useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';

import type {
  AchatHuile,
  AchatHuileForm,
} from './oil-purchase.types';

import { FORMULAIRE_INITIAL } from './oil-purchase.types';

interface OilPurchaseFormModalProps {
  open: boolean;
  achat?: AchatHuile | null;
  onClose: () => void;
  onSubmit: (data: AchatHuileForm) => void;
}

const formatNombre = (value: number) =>
  value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function OilPurchaseFormModal({
  open,
  achat,
  onClose,
  onSubmit,
}: OilPurchaseFormModalProps) {
  const [formulaire, setFormulaire] =
    useState<AchatHuileForm>(FORMULAIRE_INITIAL);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setError('');

    if (achat) {
      setFormulaire({
        compte: achat.compte,
        telephone: achat.telephone,
        quantite: String(achat.quantite),
        prixLitre: String(achat.prixLitre),
      });
    } else {
      setFormulaire({ ...FORMULAIRE_INITIAL });
    }
  }, [open, achat]);

  if (!open) return null;

  const total =
    (Number(formulaire.quantite) || 0) *
    (Number(formulaire.prixLitre) || 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const compte = formulaire.compte.trim();
    const telephone = formulaire.telephone.trim();
    const quantite = Number(formulaire.quantite);
    const prixLitre = Number(formulaire.prixLitre);

    if (
      !compte ||
      !telephone ||
      !Number.isFinite(quantite) ||
      !Number.isFinite(prixLitre) ||
      quantite <= 0 ||
      prixLitre <= 0
    ) {
      setError('Veuillez saisir des informations valides.');
      return;
    }

    onSubmit({
      compte,
      telephone,
      quantite: String(quantite),
      prixLitre: String(prixLitre),
    });
  };

  const updateField = (
    field: keyof AchatHuileForm,
    value: string,
  ) => {
    setFormulaire((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18251a]/40 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf0e9] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#26364a]">
              {achat ? "Modifier l'achat" : 'Ajouter un achat'}
            </h2>

            <p className="mt-1 text-xs text-[#839080]">
              Renseignez les informations de l'achat d'huile.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-[#68766b] hover:bg-[#f1f5ed]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="achat-compte"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Numéro de compte
            </label>

            <input
              id="achat-compte"
              required
              maxLength={30}
              value={formulaire.compte}
              onChange={(event) =>
                updateField('compte', event.target.value)
              }
              placeholder="Ex. CPT009"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>

          <div>
            <label
              htmlFor="achat-telephone"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Téléphone
            </label>

            <input
              id="achat-telephone"
              required
              value={formulaire.telephone}
              onChange={(event) =>
                updateField('telephone', event.target.value)
              }
              placeholder="Ex. 06 12 34 56 78"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="achat-quantite"
                className="mb-2 block text-sm font-semibold text-[#344054]"
              >
                Quantité huile (L)
              </label>

              <input
                id="achat-quantite"
                required
                type="number"
                min="0.01"
                step="any"
                value={formulaire.quantite}
                onChange={(event) =>
                  updateField('quantite', event.target.value)
                }
                placeholder="120"
                className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
              />
            </div>

            <div>
              <label
                htmlFor="achat-prix"
                className="mb-2 block text-sm font-semibold text-[#344054]"
              >
                Prix par litre (DT)
              </label>

              <input
                id="achat-prix"
                required
                type="number"
                min="0.01"
                step="any"
                value={formulaire.prixLitre}
                onChange={(event) =>
                  updateField('prixLitre', event.target.value)
                }
                placeholder="34"
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

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

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
              {achat ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}