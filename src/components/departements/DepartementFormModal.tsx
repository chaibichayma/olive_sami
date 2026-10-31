import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export interface Departement {
  id: number;
  code: string;
  libelle: string;
  nombrePersonnels: number;
}

interface DepartementFormModalProps {
  open: boolean;
  departement: Departement | null;
  onClose: () => void;
  onSubmit: (data: Omit<Departement, "id">) => void;
}

export default function DepartementFormModal({
  open,
  departement,
  onClose,
  onSubmit,
}: DepartementFormModalProps) {
  const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  const [nombrePersonnels, setNombrePersonnels] = useState("0");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setCode(departement?.code ?? "");
      setLibelle(departement?.libelle ?? "");
      setNombrePersonnels(
        String(departement?.nombrePersonnels ?? 0)
      );
      setErrors({});
    }
  }, [open, departement]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = "Le code est obligatoire.";
    }

    if (!libelle.trim()) {
      newErrors.libelle = "Le libellé est obligatoire.";
    }

    const effectif = Number(nombrePersonnels);

    if (
      nombrePersonnels.trim() === "" ||
      !Number.isInteger(effectif) ||
      effectif < 0
    ) {
      newErrors.nombrePersonnels =
        "Veuillez saisir un nombre entier positif.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      libelle: libelle.trim(),
      nombrePersonnels: effectif,
    });
  };

  const inputClass = (hasError: boolean) =>
    `mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#556B2F]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {departement ? "Modifier le département" : "Nouveau département"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations du département.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Code du département *
            </label>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex : DEP001"
              className={inputClass(!!errors.code)}
            />

            {errors.code && (
              <p className="mt-1 text-xs text-red-500">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Libellé *
            </label>

            <input
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Ex : Ressources humaines"
              className={inputClass(!!errors.libelle)}
            />

            {errors.libelle && (
              <p className="mt-1 text-xs text-red-500">
                {errors.libelle}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nombre de personnels *
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={nombrePersonnels}
              onChange={(e) => setNombrePersonnels(e.target.value)}
              placeholder="Ex : 12"
              className={inputClass(!!errors.nombrePersonnels)}
            />

            {errors.nombrePersonnels && (
              <p className="mt-1 text-xs text-red-500">
                {errors.nombrePersonnels}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#556B2F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#405322]"
            >
              {departement ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}