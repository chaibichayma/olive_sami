
import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  Phone,
  Save,
  UserRound,
  HardHat,
  Hash,
  BadgeCheck,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { FormField } from "@/components/common/forms/FormField";
import { FormSection } from "@/components/common/forms/FormSection";
import { FormPageHeader } from "@/components/common/forms/FormPageHeader";
import { FormSuccessModal } from "@/components/common/forms/FormSuccessModal";

import type { Ouvrier } from "./ouvrier-table";

/* =====================================================
   TYPES
===================================================== */

export type OuvrierFormData = {
  id: string;
  nom: string;
  telephone: string;
  cin: string;
  specialite: string;
  salaire: string;
  statut: string;
  dateAjout: string;
};

type OuvrierInitialData = {
  id?: string | number;
  nom?: string;
  telephone?: string;
  cin?: string;
  specialite?: string;
  salaire?: string | number;
  statut?: string;
  dateAjout?: string;
};

interface AjouterOuvrierPageProps {
  initialData?: Partial<OuvrierFormData> | Ouvrier;

  onSubmit: (
    data: OuvrierFormData,
    mode: "add" | "edit",
  ) => Promise<void> | void;

  onCancel?: () => void;
}

/* =====================================================
   CONSTANTES
===================================================== */

const WORKERS_ROUTE = "/store-admin/workers";

const inputClass =
  "h-11 w-full rounded-xl border border-[#DCE3D7] bg-white px-3.5 text-sm text-[#344054] outline-none transition placeholder:text-[#A0AABC] focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const inputWithIconClass =
  "h-11 w-full rounded-xl border border-[#DCE3D7] bg-white pl-10 pr-3.5 text-sm text-[#344054] outline-none transition placeholder:text-[#A0AABC] focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

/* =====================================================
   HELPERS
===================================================== */

function toInputDate(value: string): string {
  if (!value) return "";

  // JJ/MM/AAAA vers AAAA-MM-JJ
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  // Format ISO avec heure
  if (value.includes("T")) {
    return value.slice(0, 10);
  }

  return value;
}

function toDisplayDate(value: string): string {
  if (!value) return "";

  // AAAA-MM-JJ vers JJ/MM/AAAA
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return value;
}

function createEmptyForm(): OuvrierFormData {
  return {
    id: "",
    nom: "",
    telephone: "",
    cin: "",
    specialite: "",
    salaire: "",
    statut: "Actif",
    dateAjout: new Date().toISOString().slice(0, 10),
  };
}

/*
 * Accepte les deux formats :
 * - Ouvrier : id et salaire peuvent être numériques.
 * - OuvrierFormData : id et salaire sont des chaînes.
 */

function mapOuvrierToForm(
  ouvrier?: OuvrierInitialData,
): OuvrierFormData {
  if (!ouvrier) {
    return createEmptyForm();
  }

  return {
    id: ouvrier.id != null ? String(ouvrier.id) : "",
    nom: ouvrier.nom ?? "",
    telephone: ouvrier.telephone ?? "",
    cin: ouvrier.cin ?? "",
    specialite: ouvrier.specialite ?? "",
    salaire: ouvrier.salaire != null ? String(ouvrier.salaire) : "",
    statut: ouvrier.statut ?? "Actif",
    dateAjout: toInputDate(ouvrier.dateAjout ?? ""),
  };
}

/* =====================================================
   COMPONENT
===================================================== */

export function AjouterOuvrierPage({
  initialData,
  onSubmit,
  onCancel,
}: AjouterOuvrierPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération éventuelle des données depuis location.state.
  const locationOuvrier = (
    location.state as { ouvrier?: Ouvrier } | null
  )?.ouvrier;

  // Les données peuvent venir des props ou de la navigation.
  const existingOuvrier = initialData ?? locationOuvrier;

  const isEdit = Boolean(existingOuvrier);

  const [formData, setFormData] = useState<OuvrierFormData>(() =>
    mapOuvrierToForm(existingOuvrier),
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Synchronisation lorsque les données de modification
   * arrivent après le premier affichage.
   */

  useEffect(() => {
    if (existingOuvrier) {
      setFormData(mapOuvrierToForm(existingOuvrier));
    }
  }, [initialData, location.state]);

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    navigate(WORKERS_ROUTE);
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = (): boolean => {
    const nomComplet = formData.nom.trim().split(/\s+/);

    const firstName = nomComplet.shift() ?? "";
    const lastName = nomComplet.join(" ");

    if (!firstName || !lastName) {
      setError("Veuillez saisir le prénom et le nom de l’ouvrier.");
      return false;
    }

    if (
      !formData.id.trim() ||
      !formData.cin.trim() ||
      !formData.telephone.trim() ||
      !formData.specialite.trim() ||
      !formData.salaire.trim() ||
      !formData.dateAjout
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (!/^\d{8}$/.test(formData.telephone)) {
      setError("Le numéro de téléphone doit contenir 8 chiffres.");
      return false;
    }

    if (!/^\d{8}$/.test(formData.cin)) {
      setError("Le numéro CIN doit contenir 8 chiffres.");
      return false;
    }

    const salaire = Number(formData.salaire);

    if (!Number.isFinite(salaire) || salaire < 0) {
      setError("Veuillez saisir un salaire valide.");
      return false;
    }

    if (!Number.isInteger(Number(formData.id)) || Number(formData.id) <= 0) {
      setError("Veuillez saisir un identifiant valide.");
      return false;
    }

    return true;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Frontend uniquement : aucune requête API dans cette page.
      await onSubmit(
        {
          ...formData,
          nom: formData.nom.trim(),
          telephone: formData.telephone.trim(),
          cin: formData.cin.trim(),
          salaire: formData.salaire.trim(),
          dateAjout: toDisplayDate(formData.dateAjout),
        },
        isEdit ? "edit" : "add",
      );

      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);

    navigate(WORKERS_ROUTE, {
      state: { refreshOuvriers: true },
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <Container>
        <FormPageHeader
          title={isEdit ? "Modifier un ouvrier" : "Ajouter un ouvrier"}
          description={
            isEdit
              ? "Modifiez les informations de cet ouvrier."
              : "Renseignez les informations nécessaires pour ajouter un nouvel ouvrier."
          }
          icon={<HardHat className="size-7" />}
          breadcrumbs={[
            {
              label: "Accueil",
              onClick: () => navigate("/store-admin"),
            },
            {
              label: "Gestion des ouvriers",
              onClick: handleCancel,
            },
            {
              label: isEdit ? "Modifier un ouvrier" : "Ajouter un ouvrier",
              current: true,
            },
          ]}
          backLabel="Retour à la liste"
          onBack={handleCancel}
          disabled={saving}
        />
      </Container>

      <Container>
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl border border-[#E6EBDD] bg-white shadow-sm">

            {/* ERREUR */}

            {error && (
              <div
                role="alert"
                className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* EN-TÊTE */}

            <div className="flex flex-col gap-3 border-b border-[#E9EDE4] bg-[#FCFDFB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#202D43]">
                  Informations de l'ouvrier
                </h2>

                <p className="mt-1 text-xs text-[#8A98AD]">
                  {isEdit
                    ? "Modifiez les informations nécessaires puis enregistrez."
                    : "Complétez les informations personnelles et professionnelles de l'ouvrier."}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#F5F7F2] px-3 py-2">
                <span className="text-sm font-bold text-red-500">*</span>
                <span className="text-xs font-medium text-[#64748B]">
                  Champs obligatoires
                </span>
              </div>
            </div>

            <div className="space-y-8 px-6 py-7">

              {/* SECTION 1 : INFORMATIONS PERSONNELLES */}

              <FormSection
                icon={<UserRound className="size-5" />}
                title="Informations personnelles"
                description="Identité et coordonnées de l'ouvrier."
                color="green"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                  <FormField
                    label="ID de l'ouvrier"
                    htmlFor="id"
                    icon={<Hash className="size-[18px]" />}
                  >
                    <input
                      id="id"
                      name="id"
                      type="number"
                      min="1"
                      step="1"
                      required
                      disabled={isEdit || saving}
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Ex. : 101"
                      className={inputWithIconClass}
                    />
                  </FormField>

                  <FormField
                    label="Nom complet"
                    htmlFor="nom"
                    icon={<UserRound className="size-[18px]" />}
                    hint="Saisissez le prénom et le nom."
                  >
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      disabled={saving}
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex. : Mohamed Ali"
                      className={inputWithIconClass}
                    />
                  </FormField>

                  <FormField
                    label="Téléphone"
                    htmlFor="telephone"
                    icon={<Phone className="size-[18px]" />}
                    hint="Le numéro doit contenir 8 chiffres."
                  >
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      required
                      maxLength={8}
                      pattern="[0-9]{8}"
                      disabled={saving}
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex. : 22123456"
                      className={inputWithIconClass}
                    />
                  </FormField>

                  <FormField
                    label="CIN"
                    htmlFor="cin"
                    icon={<CreditCard className="size-[18px]" />}
                    hint="Numéro de carte d'identité nationale."
                  >
                    <input
                      id="cin"
                      name="cin"
                      type="text"
                      required
                      maxLength={8}
                      pattern="[0-9]{8}"
                      disabled={saving}
                      value={formData.cin}
                      onChange={handleChange}
                      placeholder="Ex. : 12345678"
                      className={inputWithIconClass}
                    />
                  </FormField>

                </div>
              </FormSection>

              <div className="border-t border-dashed border-[#E6EBDD]" />

              {/* SECTION 2 : INFORMATIONS PROFESSIONNELLES */}

              <FormSection
                icon={<BriefcaseBusiness className="size-5" />}
                title="Informations professionnelles"
                description="Spécialité, rémunération et statut de l'ouvrier."
                color="blue"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                  <FormField
                    label="Spécialité"
                    htmlFor="specialite"
                    icon={<BriefcaseBusiness className="size-[18px]" />}
                  >
                    <select
                      id="specialite"
                      name="specialite"
                      required
                      disabled={saving}
                      value={formData.specialite}
                      onChange={handleChange}
                      className={`${inputWithIconClass} appearance-none`}
                    >
                      <option value="">Sélectionnez une spécialité</option>
                      <option value="Manutention">Manutention</option>
                      <option value="Pressage">Pressage</option>
                      <option value="Entretien">Entretien</option>
                      <option value="Contrôle qualité">Contrôle qualité</option>
                      <option value="Réception">Réception</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Salaire"
                    htmlFor="salaire"
                    unit="DT"
                  >
                    <input
                      id="salaire"
                      name="salaire"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      disabled={saving}
                      value={formData.salaire}
                      onChange={handleChange}
                      placeholder="Ex. : 50.00"
                      className={`${inputClass} pr-16`}
                    />
                  </FormField>

                  <FormField
                    label="Statut"
                    htmlFor="statut"
                    icon={<BadgeCheck className="size-[18px]" />}
                  >
                    <select
                      id="statut"
                      name="statut"
                      required
                      disabled={saving}
                      value={formData.statut}
                      onChange={handleChange}
                      className={`${inputWithIconClass} appearance-none`}
                    >
                      <option value="Actif">Actif</option>
                      <option value="En congé">En congé</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Date d'ajout"
                    htmlFor="dateAjout"
                    icon={<CalendarDays className="size-[18px]" />}
                  >
                    <input
                      id="dateAjout"
                      name="dateAjout"
                      type="date"
                      required
                      disabled={saving}
                      value={formData.dateAjout}
                      onChange={handleChange}
                      className={inputWithIconClass}
                    />
                  </FormField>

                </div>
              </FormSection>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#E9EDE4] bg-[#FCFDFB] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-[11px] text-[#8A98AD]">
                Vérifiez les informations avant de confirmer.
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="h-10 min-w-[110px] rounded-xl border-[#DCE3D7] text-xs font-semibold text-[#64748B] hover:bg-[#F5F7F2]"
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 min-w-[160px] gap-2 rounded-xl bg-[#556B2F] text-xs font-bold text-white hover:bg-[#465A27] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      {isEdit
                        ? "Enregistrer les modifications"
                        : "Ajouter l'ouvrier"}
                    </>
                  )}
                </Button>

              </div>
            </div>

          </div>
        </form>
      </Container>

      {/* MODALE SUCCÈS */}

      <FormSuccessModal
        open={showSuccessModal}
        title={isEdit ? "Ouvrier modifié" : "Ouvrier ajouté"}
        description={
          isEdit
            ? "Les informations de l'ouvrier ont été mises à jour avec succès."
            : "L'ouvrier a été ajouté avec succès."
        }
        buttonLabel="Retour à la liste"
        onConfirm={handleSuccessConfirm}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
