
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";

import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  CircleDollarSign,
  ClipboardList,
  Hash,
  LoaderCircle,
  Package,
  Save,
  Sprout,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { FormPageHeader } from "@/components/common/forms/FormPageHeader";
import { FormStepIndicator } from "@/components/common/forms/FormStepIndicator";
import { FormSection } from "@/components/common/forms/FormSection";
import { FormField } from "@/components/common/forms/FormField";
import { FormError } from "@/components/common/forms/FormError";
import { FormSuccessModal } from "@/components/common/forms/FormSuccessModal";

import { saveSeason, updateSeason } from "@/api/season.api";

/* =========================================================
   TYPES
========================================================= */

interface Saison {
  id?: number | string;
  beginDate?: string;
  endDate?: string;
  statusId?: number;
  year?: number;
  priceKilo?: number;
  priceAchat?: number;
  priceVente?: number;
  nbreCaisses?: number;
  createdUser?: string;
  createdDate?: string;
  createdTime?: {
    hour?: number;
    minute?: number;
    second?: number;
    nano?: number;
  };
  [key: string]: unknown;
}

interface SaisonFormData {
  beginDate: string;
  endDate: string;
  statusId: string;
  year: string;
  priceKilo: string;
  priceAchat: string;
  priceVente: string;
  nbreCaisses: string;
}

/* =========================================================
   CONFIGURATION
========================================================= */

const SEASON_LIST_URL = "/store-admin/saison";

const EMPTY_FORM: SaisonFormData = {
  beginDate: "",
  endDate: "",
  statusId: "1",
  year: "",
  priceKilo: "",
  priceAchat: "",
  priceVente: "",
  nbreCaisses: "",
};

const INPUT_BASE =
  "h-[46px] w-full rounded-[10px] border border-[#DCE4EE] bg-white text-[13px] text-[#263449] outline-none transition-all placeholder:text-[#9AA9BD] hover:border-[#C4CFDC] focus:border-[#71864E] focus:ring-[3px] focus:ring-[#556B2F]/10";

const ICON_INPUT = `${INPUT_BASE} pl-10 pr-4`;
const UNIT_INPUT = `${INPUT_BASE} pl-10 pr-[78px]`;

const SELECT_INPUT =
  "h-[46px] w-full appearance-none rounded-[10px] border border-[#DCE4EE] bg-white pl-10 pr-10 text-[13px] font-medium text-[#263449] outline-none transition-all hover:border-[#C4CFDC] focus:border-[#71864E] focus:ring-[3px] focus:ring-[#556B2F]/10";

/* =========================================================
   CONVERSION DES DONNÉES
========================================================= */

function toFormData(saison?: Saison): SaisonFormData {
  if (!saison) {
    return { ...EMPTY_FORM };
  }

  return {
    beginDate: saison.beginDate?.slice(0, 10) ?? "",
    endDate: saison.endDate?.slice(0, 10) ?? "",
    statusId: String(saison.statusId ?? 1),
    year: String(saison.year ?? ""),
    priceKilo: String(saison.priceKilo ?? ""),
    priceAchat: String(saison.priceAchat ?? ""),
    priceVente: String(saison.priceVente ?? ""),
    nbreCaisses: String(saison.nbreCaisses ?? ""),
  };
}

/* =========================================================
   PAGE : AJOUT / MODIFICATION D'UNE SAISON
========================================================= */

export function AjouterSaisonPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const saison = (
    location.state as { saison?: Saison } | null
  )?.saison;

  const isEdit = saison !== undefined && saison !== null;

  const [formData, setFormData] = useState<SaisonFormData>(
    () => toFormData(saison),
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /* Actualisation du formulaire */

  useEffect(() => {
    setFormData(toFormData(saison));
    setErrorMessage("");
    setShowSuccessModal(false);
  }, [saison]);

  /* =========================================================
     MODIFICATION DES CHAMPS
  ========================================================= */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage("");
  };

  /* =========================================================
     ANNULATION
  ========================================================= */

  const handleCancel = () => {
    if (!isSubmitting) {
      navigate(SEASON_LIST_URL);
    }
  };

  /* =========================================================
     ENREGISTREMENT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");

    /*
      1. Vérification de l'identifiant.
      On crée une constante typée uniquement après validation.
    */

    let seasonId: string | number | undefined;

    if (isEdit) {
      seasonId = saison?.id;

      if (
        seasonId === undefined ||
        seasonId === null ||
        String(seasonId).trim() === ""
      ) {
        setErrorMessage(
          "L'identifiant de la saison est manquant. Impossible de la modifier.",
        );
        return;
      }
    }

    /*
      2. Vérification des champs obligatoires.
    */

    const requiredFields = [
      formData.beginDate,
      formData.endDate,
      formData.statusId,
      formData.year,
      formData.priceKilo,
      formData.priceAchat,
      formData.priceVente,
      formData.nbreCaisses,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      setErrorMessage(
        "Veuillez remplir tous les champs obligatoires.",
      );
      return;
    }

    /*
      3. Vérification des dates.
    */

    if (formData.endDate < formData.beginDate) {
      setErrorMessage(
        "La date de fin doit être postérieure ou égale à la date de début.",
      );
      return;
    }

    /*
      4. Conversion des valeurs numériques.
    */

    const year = Number(formData.year);
    const statusId = Number(formData.statusId);
    const priceKilo = Number(formData.priceKilo);
    const priceAchat = Number(formData.priceAchat);
    const priceVente = Number(formData.priceVente);
    const nbreCaisses = Number(formData.nbreCaisses);

    /*
      5. Vérification des types numériques.
    */

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(statusId) ||
      !Number.isFinite(priceKilo) ||
      !Number.isFinite(priceAchat) ||
      !Number.isFinite(priceVente) ||
      !Number.isInteger(nbreCaisses)
    ) {
      setErrorMessage(
        "Vérifiez l'année, le statut, les prix et le nombre de caisses.",
      );
      return;
    }

    /*
      6. Vérification des limites.
    */

    if (
      year < 1900 ||
      year > 2100 ||
      statusId < 0 ||
      priceKilo < 0 ||
      priceAchat < 0 ||
      priceVente < 0 ||
      nbreCaisses < 0
    ) {
      setErrorMessage(
        "Les valeurs saisies doivent respecter les limites autorisées.",
      );
      return;
    }

    /*
      7. Préparation du payload.
    */

    const createdTime = saison?.createdTime;

    const payload = {
      createdUser:
        typeof saison?.createdUser === "string"
          ? saison.createdUser
          : "",

      createdDate:
        typeof saison?.createdDate === "string"
          ? saison.createdDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),

      createdTime: {
        hour:
          typeof createdTime?.hour === "number"
            ? createdTime.hour
            : 0,

        minute:
          typeof createdTime?.minute === "number"
            ? createdTime.minute
            : 0,

        second:
          typeof createdTime?.second === "number"
            ? createdTime.second
            : 0,

        nano:
          typeof createdTime?.nano === "number"
            ? createdTime.nano
            : 0,
      },

      searche: "",
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      statusId,
      year,
      priceKilo,
      priceAchat,
      priceVente,
      nbreCaisses,
    };

    /*
      8. Appel API.
    */

    setIsSubmitting(true);

    try {
      if (isEdit) {
        // À ce stade, seasonId est obligatoirement défini.
        if (seasonId === undefined) {
          throw new Error(
            "L'identifiant de la saison est manquant.",
          );
        }

        await updateSeason({
          ...payload,
          id: seasonId,
        });
      } else {
        await saveSeason({
          ...payload,
          id: {},
        });
      }

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error(
        "Erreur d'enregistrement de la saison :",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     AFFICHAGE
  ========================================================= */

  return (
    <>
      <Container>
        <div className="pb-8 pt-5 sm:pt-6">

          {/* EN-TÊTE */}

          <FormPageHeader
            title={
              isEdit
                ? "Modifier la saison"
                : "Ajouter une saison"
            }
            description={
              isEdit
                ? "Modifiez les informations et les paramètres de votre saison oléicole."
                : "Configurez les informations de votre nouvelle saison oléicole."
            }
            icon={
              <Sprout
                className="size-7"
                strokeWidth={1.8}
              />
            }
            breadcrumbs={[
              {
                label: "Accueil",
                onClick: () => navigate("/store-admin"),
              },
              {
                label: "Paramétrage",
                onClick: () => navigate("/store-admin"),
              },
              {
                label: "Saisons",
                onClick: handleCancel,
              },
              {
                label: isEdit
                  ? "Modifier une saison"
                  : "Ajouter une saison",
                current: true,
              },
            ]}
            backLabel="Retour aux saisons"
            onBack={handleCancel}
            disabled={isSubmitting}
          />

          {/* ÉTAPES */}

          <FormStepIndicator
            activeStep={1}
            steps={[
              {
                title: "Informations générales",
                description: "Période et statut",
              },
              {
                title: "Tarification",
                description: "Prix de production et d'achat",
              },
              {
                title: "Capacité de stockage",
                description: "Nombre de caisses",
              },
            ]}
          />

          {/* FORMULAIRE */}

          <form onSubmit={handleSubmit} noValidate>

            <FormError
              message={errorMessage}
              title={
                isEdit
                  ? "Impossible de modifier la saison"
                  : "Impossible d'ajouter la saison"
              }
              onClose={() => setErrorMessage("")}
            />

            <div className="overflow-hidden rounded-2xl border border-[#E4E9EF] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.035)]">

              {/* EN-TÊTE DE LA CARTE */}

              <div className="relative border-b border-[#EDF0F4] bg-gradient-to-r from-[#F6F8F2] via-white to-white px-5 py-5 sm:px-7 sm:py-6">
                <div className="absolute right-0 top-0 h-full w-1 bg-[#556B2F]" />

                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E5EBDD] bg-white text-[#556B2F] shadow-sm">
                    <ClipboardList className="size-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#202D43] sm:text-lg">
                      Informations de la saison
                    </h2>

                    <p className="mt-1 text-xs text-[#8190A5]">
                      Renseignez les dates, le statut, les tarifs et la capacité de stockage.
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTENU */}

              <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-7">

                {/* SECTION 1 */}

                <FormSection
                  icon={<CalendarRange className="size-[19px]" />}
                  title="Informations générales"
                  description="Identifiez la saison et définissez sa période."
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Année de la saison"
                      htmlFor="year"
                      icon={<Hash className="size-[17px]" />}
                      hint="Exemple : 2026"
                    >
                      <input
                        id="year"
                        name="year"
                        type="number"
                        min="1900"
                        max="2100"
                        step="1"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="Ex. 2026"
                        required
                        className={ICON_INPUT}
                      />
                    </FormField>

                    <FormField
                      label="Statut"
                      htmlFor="statusId"
                      icon={
                        <span
                          className={`size-2.5 rounded-full ${
                            formData.statusId === "1"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                      }
                      hint="Détermine l'état actuel de la saison."
                    >
                      <select
                        id="statusId"
                        name="statusId"
                        value={formData.statusId}
                        onChange={handleChange}
                        required
                        className={SELECT_INPUT}
                      >
                        <option value="1">En cours</option>
                        <option value="2">Clôturée</option>
                      </select>
                    </FormField>

                    <FormField
                      label="Date de début"
                      htmlFor="beginDate"
                      icon={<CalendarDays className="size-[17px]" />}
                      hint="Date de début de la saison."
                    >
                      <input
                        id="beginDate"
                        name="beginDate"
                        type="date"
                        value={formData.beginDate}
                        max={formData.endDate || undefined}
                        onChange={handleChange}
                        required
                        className={ICON_INPUT}
                      />
                    </FormField>

                    <FormField
                      label="Date de fin"
                      htmlFor="endDate"
                      icon={<CalendarDays className="size-[17px]" />}
                      hint="Doit être égale ou postérieure à la date de début."
                    >
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        min={formData.beginDate || undefined}
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className={ICON_INPUT}
                      />
                    </FormField>

                  </div>
                </FormSection>

                <div className="border-t border-dashed border-[#E1E7EE]" />

                {/* SECTION 2 */}

                <FormSection
                  icon={<CircleDollarSign className="size-[19px]" />}
                  title="Tarification"
                  description="Définissez les prix de production, d'achat et de vente."
                  color="amber"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Prix de production d'un kilo d'olives"
                      htmlFor="priceKilo"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/kg"
                      hint="Coût de production pour un kilo d'olives."
                    >
                      <input
                        id="priceKilo"
                        name="priceKilo"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceKilo}
                        onChange={handleChange}
                        placeholder="Ex. 0.80"
                        required
                        className={UNIT_INPUT}
                      />
                    </FormField>

                    <FormField
                      label="Prix d'achat d'un litre d'huile"
                      htmlFor="priceAchat"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/L"
                      hint="Prix d'achat pour un litre d'huile."
                    >
                      <input
                        id="priceAchat"
                        name="priceAchat"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceAchat}
                        onChange={handleChange}
                        placeholder="Ex. 18.00"
                        required
                        className={UNIT_INPUT}
                      />
                    </FormField>

                    <FormField
                      label="Prix de vente d'un litre d'huile"
                      htmlFor="priceVente"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/L"
                      hint="Prix de vente pour un litre d'huile."
                    >
                      <input
                        id="priceVente"
                        name="priceVente"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceVente}
                        onChange={handleChange}
                        placeholder="Ex. 20.00"
                        required
                        className={UNIT_INPUT}
                      />
                    </FormField>

                  </div>
                </FormSection>

                <div className="border-t border-dashed border-[#E1E7EE]" />

                {/* SECTION 3 */}

                <FormSection
                  icon={<Package className="size-[19px]" />}
                  title="Capacité de stockage"
                  description="Indiquez le nombre de caisses disponibles pour la saison."
                  color="blue"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Nombre de caisses"
                      htmlFor="nbreCaisses"
                      icon={<Package className="size-[17px]" />}
                      hint="Saisissez un nombre entier positif ou nul."
                    >
                      <input
                        id="nbreCaisses"
                        name="nbreCaisses"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.nbreCaisses}
                        onChange={handleChange}
                        placeholder="Ex. 500"
                        required
                        className={ICON_INPUT}
                      />
                    </FormField>

                  </div>
                </FormSection>

              </div>

              {/* PIED DU FORMULAIRE */}

              <footer className="flex flex-col gap-4 border-t border-[#E8EDF2] bg-[#F9FAFC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="text-[11px] leading-5 text-[#8795A9]">
                  <span className="font-bold text-red-500">*</span>{" "}
                  Tous les champs sont obligatoires.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-11 min-w-[120px] gap-2 rounded-xl border-[#DCE4ED] bg-white px-5 text-xs font-semibold text-[#59677D]"
                  >
                    <X className="size-4" />
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 min-w-[190px] gap-2 rounded-xl border border-[#465A27] bg-[#556B2F] px-5 text-xs font-bold text-white hover:bg-[#465A27] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        {isEdit
                          ? "Enregistrer les modifications"
                          : "Enregistrer la saison"}
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </footer>
            </div>
          </form>
        </div>
      </Container>

      {/* MODALE DE SUCCÈS */}

      <FormSuccessModal
        open={showSuccessModal}
        title={isEdit ? "Saison modifiée !" : "Saison ajoutée !"}
        description={
          isEdit
            ? "Les modifications ont été enregistrées avec succès. Vous pouvez maintenant consulter la liste des saisons."
            : "La nouvelle saison a été enregistrée avec succès. Vous pouvez maintenant consulter la liste des saisons."
        }
        buttonLabel="Voir les saisons"
        onConfirm={() => navigate(SEASON_LIST_URL)}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}

export default AjouterSaisonPage;
