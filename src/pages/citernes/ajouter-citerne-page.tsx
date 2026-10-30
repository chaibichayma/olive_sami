import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { citerneApi } from "@/services/citerne-api";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { FormPageHeader } from "@/components/common/forms/FormPageHeader";
import { FormStepIndicator } from "@/components/common/forms/FormStepIndicator";
import { FormSection } from "@/components/common/forms/FormSection";
import { FormField } from "@/components/common/forms/FormField";
import { FormError } from "@/components/common/forms/FormError";
import { FormSuccessModal } from "@/components/common/forms/FormSuccessModal";

import {
  Database,
  Droplets,
  Hash,
  CalendarDays,
  Save,
  ArrowRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

interface CiterneFormData {
  reference: string;
  name: string;
  capacite: string;
  dateFabrication: string;
}

const EMPTY_FORM: CiterneFormData = {
  reference: "",
  name: "",
  capacite: "",
  dateFabrication: "",
};

const INPUT_CLASS =
  "h-[46px] w-full rounded-[10px] border border-[#DCE4EE] bg-white pl-10 pr-4 text-[13px] text-[#263449] outline-none transition placeholder:text-[#9AA9BD] hover:border-[#C4CFDC] focus:border-[#71864E] focus:ring-[3px] focus:ring-[#556B2F]/10";

export function AjouterCiternePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const citerne = (
    location.state as { citerne?: Citerne } | null
  )?.citerne;

  const isEdit = Boolean(citerne);

  const [formData, setFormData] = useState<CiterneFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (citerne) {
      setFormData({
        reference: citerne.reference ?? "",
        name: citerne.libelle ?? "",
        capacite: String(citerne.capacity ?? ""),
        dateFabrication: citerne.dateFabrication?.slice(0, 10) ?? "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }

    setErrorMessage("");
    setShowSuccessModal(false);
  }, [citerne]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleCancel = () => {
    if (!loading) navigate("/store-admin/tanks");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const reference = formData.reference.trim();
    const name = formData.name.trim();
    const capacity = Number(formData.capacite);

    if (!reference || !name || !formData.dateFabrication) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      setErrorMessage("La capacité doit être supérieure à zéro.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...(isEdit && citerne ? { citerneId: citerne.citerneId } : {}),
        reference,
        libelle: name,
        capacity,
        createdDate: formData.dateFabrication,
        searche: "",
      };

      if (isEdit) {
        await citerneApi.modifier(payload);
      } else {
        await citerneApi.ajouter(payload);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur API citerne :", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la citerne.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formattedCapacity =
    formData.capacite &&
    Number.isFinite(Number(formData.capacite)) &&
    Number(formData.capacite) > 0
      ? Number(formData.capacite).toLocaleString("fr-FR")
      : "";

  const inputWithIcon = `${INPUT_CLASS} pl-10`;

  return (
    <>
      <Container>
        <div className="w-full py-4 sm:py-5">
          <FormPageHeader
            title={isEdit ? "Modifier une citerne" : "Ajouter une citerne"}
            description={
              isEdit
                ? "Modifiez les informations de la citerne sélectionnée."
                : "Renseignez les informations de votre nouvelle citerne pour l'intégrer à votre espace de stockage."
            }
            icon={<Database className="size-7" strokeWidth={1.8} />}
            breadcrumbs={[
              { label: "Accueil", onClick: () => navigate("/store-admin") },
              { label: "Citernes", onClick: handleCancel },
              {
                label: isEdit ? "Modifier une citerne" : "Ajouter une citerne",
                current: true,
              },
            ]}
            backLabel="Retour aux citernes"
            onBack={handleCancel}
            disabled={loading}
          />

          <FormStepIndicator
            activeStep={1}
            steps={[
              {
                title: "Informations générales",
                description: "Données de la citerne",
              },
              {
                title: "Vérification",
                description: "Contrôle des informations",
              },
              {
                title: "Enregistrement",
                description: "Ajout de la citerne",
              },
            ]}
          />

          <form onSubmit={handleSubmit} noValidate>
            <div className="overflow-hidden rounded-2xl border border-[#E4E9EF] bg-white shadow-sm">
              <div className="border-b border-[#EDF0F4] bg-gradient-to-r from-[#F6F8F2] via-white to-white px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[#E5EBDD] bg-white text-[#556B2F] shadow-sm">
                    <Database className="size-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#202D43] sm:text-lg">
                      Informations générales
                    </h2>
                    <p className="mt-1 text-xs text-[#8190A5]">
                      Saisissez les informations de base de la citerne.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-7">
                <FormError
                  message={errorMessage}
                  title="Impossible d'enregistrer la citerne"
                  onClose={() => setErrorMessage("")}
                />

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <FormField
                    label="Référence"
                    htmlFor="reference"
                    icon={<Hash className="size-[17px]" />}
                    hint="Identifiant unique de la citerne."
                  >
                    <input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="Ex. CIT-001"
                      autoComplete="off"
                      required
                      className={inputWithIcon}
                    />
                  </FormField>

                  <FormField
                    label="Nom de la citerne"
                    htmlFor="name"
                    icon={<Database className="size-[17px]" />}
                    hint="Nom permettant de reconnaître la citerne."
                  >
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex. Citerne principale"
                      autoComplete="off"
                      required
                      className={inputWithIcon}
                    />
                  </FormField>

                  <FormField
                    label="Capacité"
                    htmlFor="capacite"
                    icon={<Droplets className="size-[17px]" />}
                    unit="L"
                    hint="Capacité de stockage en litres."
                  >
                    <input
                      id="capacite"
                      name="capacite"
                      type="number"
                      min="0.01"
                      step="any"
                      value={formData.capacite}
                      onChange={handleChange}
                      placeholder="Ex. 3000"
                      required
                      className={`${INPUT_CLASS} pl-10 pr-16`}
                    />
                  </FormField>

                  <FormField
                    label="Date de fabrication"
                    htmlFor="dateFabrication"
                    icon={<CalendarDays className="size-[17px]" />}
                    hint="Date de fabrication de la citerne."
                  >
                    <input
                      id="dateFabrication"
                      name="dateFabrication"
                      type="date"
                      value={formData.dateFabrication}
                      onChange={handleChange}
                      required
                      className={inputWithIcon}
                    />
                  </FormField>
                </div>

                {formattedCapacity && (
                  <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#e6ebde] bg-[#f8faf5] px-3.5 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#edf2e4] text-[#556B2F]">
                      <Droplets size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] text-[#87917b]">
                        Capacité renseignée
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#344126]">
                        {formattedCapacity} L
                      </p>
                    </div>

                    <CheckCircle2 className="ml-auto size-[17px] text-[#718747]" />
                  </div>
                )}
              </div>

              <footer className="flex flex-col gap-3 border-t border-[#E8EDF2] bg-[#F9FAFC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="text-[11px] text-[#8795A9]">
                  <span className="text-red-500">*</span> Tous les champs sont obligatoires.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="h-11 rounded-xl px-5 text-xs"
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 gap-2 rounded-xl bg-[#556B2F] px-5 text-xs font-bold text-white hover:bg-[#465A27]"
                  >
                    {loading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}

                    {loading
                      ? "Enregistrement..."
                      : isEdit
                        ? "Enregistrer les modifications"
                        : "Ajouter la citerne"}

                    {!loading && <ArrowRight className="size-4" />}
                  </Button>
                </div>
              </footer>
            </div>
          </form>
        </div>
      </Container>

      <FormSuccessModal
        open={showSuccessModal}
        title={isEdit ? "Citerne modifiée !" : "Citerne ajoutée !"}
        description={
          isEdit
            ? "Les modifications ont été enregistrées avec succès."
            : "La nouvelle citerne a été enregistrée avec succès."
        }
        buttonLabel="Voir les citernes"
        onConfirm={() => navigate("/store-admin/tanks")}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="mt-5 space-y-3 rounded-xl border border-[#e9ede4] bg-[#fafbf8] p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[#8790a0]">Référence</span>
            <span className="break-all text-right text-xs font-semibold text-[#29351f]">
              {formData.reference}
            </span>
          </div>

          <div className="h-px bg-[#e9ede4]" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[#8790a0]">Capacité</span>
            <span className="text-sm font-bold text-[#556B2F]">
              {formattedCapacity || "0"} L
            </span>
          </div>
        </div>
      </FormSuccessModal>
    </>
  );
}

export default AjouterCiternePage;