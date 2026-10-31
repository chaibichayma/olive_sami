import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardCheck,
  FileText,
  UserRound,
  Phone,
  Hash,
  CalendarDays,
  Scale,
  BadgeDollarSign,
  CircleCheck,
  Droplets,
  FlaskConical,
  GitBranch,
  Package,
  RotateCcw,
  Save,
  X,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { FormField } from "@/components/common/forms/FormField";
import { FormSection } from "@/components/common/forms/FormSection";
import { FormPageHeader } from "@/components/common/forms/FormPageHeader";
import { FormSuccessModal } from "@/components/common/forms/FormSuccessModal";

/* ============================================================
   TYPES
============================================================ */

export interface ReceptionForm {
  reference: string;
  compteId: string;
  name: string;
  mobile: string;
  quantityOlive: string;
  quantityOil: string;
  priceKg: string;
  price: string;
  payement: string;
  acompte: string;
  statusId: string;
  caisse: number[];
  natureId: string;
  priceOil: string;
  observation: string;
  typeHuile: string;
  isBaseCompte: boolean;
  dateCreation: string;
  dateDebProduction: string;
  dateFinProduction: string;
}

export interface AccountLookupResult {
  id: string | number;
  name: string;
  mobile?: string;
}

interface BonReceptionFormPageProps {
  mode: "add" | "edit";

  initialData?: Partial<ReceptionForm>;

  onSubmit: (
    data: ReceptionForm,
    mode: "add" | "edit"
  ) => Promise<void>;

  onLookupAccount?: (
    phone: string
  ) => Promise<AccountLookupResult | null>;
}

/* ============================================================
   FORMULAIRE INITIAL
============================================================ */

const createEmptyForm = (): ReceptionForm => ({
  reference: "",
  compteId: "",
  name: "",
  mobile: "",
  quantityOlive: "",
  quantityOil: "",
  priceKg: "",
  price: "",
  payement: "",
  acompte: "",
  statusId: "1",
  caisse: [],
  natureId: "1",
  priceOil: "",
  observation: "",
  typeHuile: "1",
  isBaseCompte: false,
  dateCreation: new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16),
  dateDebProduction: "",
  dateFinProduction: "",
});

/* ============================================================
   UTILITAIRES
============================================================ */

function toNumber(value: string | number | undefined): number {
  if (value === undefined || value === "") return 0;

  const result = Number(String(value).replace(",", "."));

  return Number.isFinite(result) ? result : 0;
}

const inputClass =
  "h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10";

/* ============================================================
   COMPOSANT CHAMP RÉUTILISABLE LOCAL
============================================================ */

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
  disabled?: boolean;
  unit?: string;
  hint?: string;
}

function InputField({
  id,
  label,
  value,
  onChange,
  icon,
  type = "text",
  placeholder,
  required = false,
  min,
  step,
  disabled = false,
  unit,
  hint,
}: InputFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      icon={icon}
      required={required}
      unit={unit}
      hint={hint}
    >
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        disabled={disabled}
        className={inputClass}
      />
    </FormField>
  );
}

/* ============================================================
   PAGE BON DE RÉCEPTION
============================================================ */

export default function BonReceptionFormPage({
  mode,
  initialData,
  onSubmit,
  onLookupAccount,
}: BonReceptionFormPageProps) {
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [form, setForm] = useState<ReceptionForm>(() => ({
    ...createEmptyForm(),
    ...initialData,
  }));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [accountSearchLoading, setAccountSearchLoading] = useState(false);
  const [accountSearchMessage, setAccountSearchMessage] = useState("");
  const [accountFound, setAccountFound] = useState(
    Boolean(initialData?.compteId)
  );

  /* ==========================================================
     MISE À JOUR DES DONNÉES EN MODE ÉDITION
  ========================================================== */

  useEffect(() => {
    setForm({
      ...createEmptyForm(),
      ...initialData,
    });

    setAccountFound(Boolean(initialData?.compteId));
  }, [initialData]);

  /* ==========================================================
     MODIFICATION DES CHAMPS
  ========================================================== */

  const updateField = <K extends keyof ReceptionForm>(
    field: K,
    value: ReceptionForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==========================================================
     RECHERCHE DU COMPTE PAR TÉLÉPHONE
  ========================================================== */

  useEffect(() => {
    if (!onLookupAccount) return;

    const phone = form.mobile.trim();

    if (!phone) {
      setAccountFound(false);
      setAccountSearchMessage("");
      setAccountSearchLoading(false);

      setForm((current) => ({
        ...current,
        compteId: "",
        name: "",
      }));

      return;
    }

    // En édition, le compte initial est déjà renseigné.
    if (
      isEdit &&
      phone === (initialData?.mobile ?? "") &&
      initialData?.compteId
    ) {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setAccountSearchLoading(true);
      setAccountSearchMessage("");

      try {
        const account = await onLookupAccount(phone);

        if (cancelled) return;

        if (!account) {
          setAccountFound(false);
          setAccountSearchMessage(
            "Aucun compte trouvé pour ce numéro."
          );

          setForm((current) => ({
            ...current,
            compteId: "",
            name: "",
          }));

          return;
        }

        setForm((current) => ({
          ...current,
          compteId: String(account.id),
          name: account.name,
          mobile: account.mobile ?? phone,
        }));

        setAccountFound(true);
        setAccountSearchMessage(
          "Compte vérifié avec succès."
        );
      } catch (err) {
        if (cancelled) return;

        setAccountFound(false);

        setAccountSearchMessage(
          err instanceof Error
            ? `Vérification impossible : ${err.message}`
            : "Erreur lors de la vérification du compte."
        );
      } finally {
        if (!cancelled) {
          setAccountSearchLoading(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    form.mobile,
    isEdit,
    initialData,
    onLookupAccount,
  ]);

  /* ==========================================================
     CAISSES
  ========================================================== */

  const toggleCrate = (crateNumber: number) => {
    setForm((current) => ({
      ...current,
      caisse: current.caisse.includes(crateNumber)
        ? current.caisse.filter(
            (number) => number !== crateNumber
          )
        : [...current.caisse, crateNumber].sort(
            (a, b) => a - b
          ),
    }));
  };

  /* ==========================================================
     CALCULS
  ========================================================== */

  const totalPaid =
    toNumber(form.payement) + toNumber(form.acompte);

  const remainingBalance =
    toNumber(form.price) - totalPaid;

  const yieldPercentage =
    toNumber(form.quantityOlive) > 0
      ? (toNumber(form.quantityOil) /
          toNumber(form.quantityOlive)) *
        100
      : 0;

  /* ==========================================================
     VALIDATION ET ENREGISTREMENT
  ========================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.reference.trim()) {
      setError("Veuillez saisir la référence du bon.");
      return;
    }

    if (!form.mobile.trim()) {
      setError("Veuillez saisir le téléphone du compte.");
      return;
    }

    if (!form.compteId.trim() || !accountFound) {
      setError(
        "Veuillez sélectionner un compte valide."
      );
      return;
    }

    if (toNumber(form.quantityOlive) < 0) {
      setError("La quantité d'olives est invalide.");
      return;
    }

    if (toNumber(form.price) < 0) {
      setError("Le prix total est invalide.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(
        {
          ...form,
          reference: form.reference.trim(),
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          observation: form.observation.trim(),
        },
        mode
      );

      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================================
     RÉINITIALISATION
  ========================================================== */

  const resetForm = () => {
    if (isEdit) return;

    setForm(createEmptyForm());
    setError("");
    setAccountFound(false);
    setAccountSearchMessage("");
    setAccountSearchLoading(false);
  };

  /* ==========================================================
     RETOUR
  ========================================================== */

  const handleBack = () => {
    navigate("/store-admin/reception-vouchers");
  };

  /* ==========================================================
     SUCCÈS
  ========================================================== */

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);

    navigate("/store-admin/reception-vouchers", {
      state: {
        refreshReception: true,
      },
    });
  };

  /* ==========================================================
     RENDU
  ========================================================== */

  return (
    <>
      <Container>
        <FormPageHeader
          title={
            isEdit
              ? "Modifier un bon de réception"
              : "Ajouter un bon de réception"
          }
          description={
            isEdit
              ? "Modifiez les informations et les détails du bon de réception."
              : "Enregistrez un bon de réception et renseignez les informations relatives aux produits réceptionnés."
          }
          icon={<ClipboardCheck className="size-7" />}
          breadcrumbs={[
            {
              label: "Accueil",
              onClick: () => navigate("/store-admin"),
            },
            {
              label: "Bons de réception",
              onClick: handleBack,
            },
            {
              label: isEdit
                ? "Modifier un bon"
                : "Ajouter un bon",
              current: true,
            },
          ]}
          backLabel="Retour à la liste"
          onBack={handleBack}
          disabled={submitting}
        />
      </Container>

      <Container>
        <form
          onSubmit={handleSubmit}
          className="w-full pb-8"
        >
          <div className="overflow-hidden rounded-2xl border border-[#E5E9E1] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">

            {/* INFORMATIONS DU BON */}

            <div className="border-b border-[#EDF0E9] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0F4E9] text-[#556B2F]">
                  <FileText className="size-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#202D43]">
                    Informations du bon
                  </h2>

                  <p className="mt-1 text-xs text-[#8A98AD]">
                    Les champs marqués d'un astérisque sont obligatoires.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-5 py-7 sm:px-7">

              {/* SECTION 1 : IDENTIFICATION */}

              <FormSection
                icon={<UserRound className="size-5" />}
                title="Identification"
                description="Référence du bon et informations du compte associé."
                color="green"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                  <InputField
                    id="reference"
                    label="Référence"
                    value={form.reference}
                    onChange={(value) =>
                      updateField("reference", value)
                    }
                    icon={<Hash className="size-4" />}
                    placeholder="Ex. BR-2026-001"
                    required
                  />

                  <div>
                    <InputField
                      id="mobile"
                      label="Téléphone du compte"
                      value={form.mobile}
                      onChange={(value) => {
                        setAccountFound(false);
                        setAccountSearchMessage("");

                        setForm((current) => ({
                          ...current,
                          mobile: value,
                          compteId: "",
                          name: "",
                        }));
                      }}
                      icon={<Phone className="size-4" />}
                      placeholder="Saisissez le numéro de téléphone"
                      required
                    />

                    {accountSearchLoading && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <LoaderCircle className="size-4 animate-spin" />
                        Vérification du compte...
                      </p>
                    )}

                    {!accountSearchLoading &&
                      accountSearchMessage && (
                        <p
                          className={`mt-2 flex items-center gap-1.5 text-xs ${
                            accountFound
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {accountFound ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <AlertCircle className="size-4" />
                          )}
                          {accountSearchMessage}
                        </p>
                      )}
                  </div>

                  <InputField
                    id="compteId"
                    label="ID du compte"
                    value={form.compteId}
                    onChange={(value) =>
                      updateField("compteId", value)
                    }
                    icon={<Hash className="size-4" />}
                    placeholder="Identifiant du compte"
                    required
                  />

                  <InputField
                    id="name"
                    label="Nom du compte"
                    value={form.name}
                    onChange={(value) =>
                      updateField("name", value)
                    }
                    icon={<UserRound className="size-4" />}
                    placeholder="Nom du compte"
                    required
                  />

                  <div className="flex items-center">
                    <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E9E1] px-4 py-3 text-sm font-medium text-[#334155] transition hover:bg-[#FBFCF9]">
                      <input
                        type="checkbox"
                        checked={form.isBaseCompte}
                        onChange={(event) =>
                          updateField(
                            "isBaseCompte",
                            event.target.checked
                          )
                        }
                        className="size-4 accent-[#556B2F]"
                      />
                      Compte de base
                    </label>
                  </div>

                </div>
              </FormSection>

              <div className="border-t border-[#EDF0E9]" />

              {/* SECTION 2 : QUANTITÉS */}

              <FormSection
                icon={<Scale className="size-5" />}
                title="Quantités réceptionnées"
                description="Renseignez les quantités et les informations relatives à la production."
                color="green"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                  <InputField
                    id="quantityOlive"
                    label="Quantité d'olives"
                    value={form.quantityOlive}
                    onChange={(value) =>
                      updateField("quantityOlive", value)
                    }
                    icon={<Scale className="size-4" />}
                    type="number"
                    min="0"
                    step="0.01"
                    unit="KG"
                    required
                  />

                  <InputField
                    id="quantityOil"
                    label="Quantité d'huile"
                    value={form.quantityOil}
                    onChange={(value) =>
                      updateField("quantityOil", value)
                    }
                    icon={<Droplets className="size-4" />}
                    type="number"
                    min="0"
                    step="0.01"
                    unit="L"
                  />

                  <InputField
                    id="dateCreation"
                    label="Date de création"
                    value={form.dateCreation}
                    onChange={(value) =>
                      updateField("dateCreation", value)
                    }
                    icon={<CalendarDays className="size-4" />}
                    type="datetime-local"
                    required
                  />

                  <FormField
                    label="Statut"
                    htmlFor="statusId"
                    icon={<CircleCheck className="size-4" />}
                  >
                    <select
                      id="statusId"
                      value={form.statusId}
                      onChange={(event) =>
                        updateField("statusId", event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="1">En cours</option>
                      <option value="2">Terminé</option>
                      <option value="3">Annulé</option>
                    </select>
                  </FormField>

                  <InputField
                    id="priceKg"
                    label="Prix par kg d'olives"
                    value={form.priceKg}
                    onChange={(value) =>
                      updateField("priceKg", value)
                    }
                    icon={<BadgeDollarSign className="size-4" />}
                    type="number"
                    min="0"
                    step="0.001"
                    unit="DT"
                  />

                  <InputField
                    id="price"
                    label="Prix total"
                    value={form.price}
                    onChange={(value) =>
                      updateField("price", value)
                    }
                    icon={<BadgeDollarSign className="size-4" />}
                    type="number"
                    min="0"
                    step="0.001"
                    unit="DT"
                  />

                  <InputField
                    id="priceOil"
                    label="Prix de l'huile"
                    value={form.priceOil}
                    onChange={(value) =>
                      updateField("priceOil", value)
                    }
                    icon={<Droplets className="size-4" />}
                    type="number"
                    min="0"
                    step="0.001"
                    unit="DT"
                  />

                  <FormField
                    label="Nature de la réception"
                    htmlFor="natureId"
                    icon={<Package className="size-4" />}
                  >
                    <select
                      id="natureId"
                      value={form.natureId}
                      onChange={(event) =>
                        updateField("natureId", event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="1">Olives</option>
                      <option value="2">Huile</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Type d'huile"
                    htmlFor="typeHuile"
                    icon={<FlaskConical className="size-4" />}
                  >
                    <select
                      id="typeHuile"
                      value={form.typeHuile}
                      onChange={(event) =>
                        updateField("typeHuile", event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="1">Huile d'olive</option>
                      <option value="2">Huile biologique</option>
                    </select>
                  </FormField>

                  <InputField
                    id="dateDebProduction"
                    label="Début de production"
                    value={form.dateDebProduction}
                    onChange={(value) =>
                      updateField("dateDebProduction", value)
                    }
                    icon={<CalendarDays className="size-4" />}
                    type="datetime-local"
                  />

                  <InputField
                    id="dateFinProduction"
                    label="Fin de production"
                    value={form.dateFinProduction}
                    onChange={(value) =>
                      updateField("dateFinProduction", value)
                    }
                    icon={<CalendarDays className="size-4" />}
                    type="datetime-local"
                  />

                </div>
              </FormSection>

              <div className="border-t border-[#EDF0E9]" />

              {/* SECTION 3 : CAISSES */}

              <FormSection
                icon={<Package className="size-5" />}
                title="Caisses associées"
                description="Sélectionnez les caisses liées à ce bon de réception."
                color="blue"
              >
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 md:grid-cols-10 xl:grid-cols-13">
                  {Array.from({ length: 91 }, (_, index) => {
                    const number = index + 1;
                    const checked = form.caisse.includes(number);

                    return (
                      <button
                        key={number}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggleCrate(number)}
                        className={`rounded-lg border px-2 py-3 text-sm font-semibold transition ${
                          checked
                            ? "border-[#556B2F] bg-[#556B2F] text-white shadow-sm"
                            : "border-[#E1E6DC] bg-white text-slate-600 hover:border-[#9BA97A] hover:bg-[#F5F7EF]"
                        }`}
                      >
                        {number}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F7F9F4] px-4 py-3">
                  <span className="text-xs font-medium text-[#64748B]">
                    Caisses sélectionnées
                  </span>

                  <span className="rounded-full bg-[#E9F0DF] px-3 py-1 text-xs font-bold text-[#556B2F]">
                    {form.caisse.length}
                  </span>
                </div>
              </FormSection>

              <div className="border-t border-[#EDF0E9]" />

              {/* SECTION 4 : OBSERVATIONS */}

              <FormSection
                icon={<FileText className="size-5" />}
                title="Observations"
                description="Ajoutez des informations complémentaires concernant la réception."
                color="amber"
              >
                <textarea
                  id="observation"
                  value={form.observation}
                  onChange={(event) =>
                    updateField("observation", event.target.value)
                  }
                  rows={4}
                  placeholder="Ajouter une observation..."
                  className="w-full resize-y rounded-lg border border-[#dfe4e9] bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                />
              </FormSection>

              {/* CALCULS INFORMATIFS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E5EBDD] bg-[#F7F9F4] p-4">
                  <p className="text-xs font-medium text-[#7D8A9E]">
                    Solde restant estimé
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#556B2F]">
                    {remainingBalance.toFixed(3)} DT
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5EBDD] bg-[#F7F9F4] p-4">
                  <p className="text-xs font-medium text-[#7D8A9E]">
                    Rendement estimé
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#556B2F]">
                    {yieldPercentage.toFixed(2)} %
                  </p>
                </div>
              </div>

            </div>

            {/* ERREUR */}

            {error && (
              <div
                role="alert"
                className="mx-5 mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#E9EDE4] bg-[#FCFDFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">

              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                  className="h-10 gap-2 rounded-xl border-[#DFE4E9] px-5 text-slate-600"
                >
                  <RotateCcw className="size-4" />
                  Réinitialiser
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={submitting}
                className="h-10 gap-2 rounded-xl border-[#DFE4E9] px-5 text-slate-600"
              >
                <X className="size-4" />
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={submitting || accountSearchLoading}
                className="h-10 gap-2 rounded-xl bg-[#556B2F] px-6 font-semibold text-white hover:bg-[#465A27] disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {submitting
                  ? "Enregistrement..."
                  : isEdit
                    ? "Enregistrer les modifications"
                    : "Créer le bon"}
              </Button>

            </div>
          </div>
        </form>
      </Container>

      {/* MODALE SUCCÈS */}

      <FormSuccessModal
        open={showSuccessModal}
        title={isEdit ? "Bon de réception modifié" : "Bon de réception créé"}
        description={
          isEdit
            ? "Les informations du bon de réception ont été mises à jour avec succès."
            : "Le nouveau bon de réception a été créé avec succès."
        }
        buttonLabel="Retour à la liste"
        onConfirm={handleSuccessConfirm}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}