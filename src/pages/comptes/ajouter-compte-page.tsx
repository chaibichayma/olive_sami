
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  MapPin,
  Phone,
  Wallet,
  Building2,
  BadgeDollarSign,
  CircleCheck,
  GitBranch,
  Hash,
  Save,
  X,
  Check,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { FormField } from "@/components/common/forms/FormField";
import { FormSection } from "@/components/common/forms/FormSection";
import { FormPageHeader } from "@/components/common/forms/FormPageHeader";
import { FormSuccessModal } from "@/components/common/forms/FormSuccessModal";

/* ============================================================
   TYPES FRONTEND
============================================================ */

interface Compte {
  id?: number;
  compteId?: number;
  reference?: string;
  name?: string;
  adresse?: string;
  mobile?: string;
  mail?: string;
  statusId?: number;
  priceConv?: number;
  isBaseCompte?: boolean;
  baseCompteId?: number | null;
}

interface CompteFormData {
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: string;
  priceConv: string;
  isBaseCompte: boolean;
  baseCompteId: string;
}

interface FormErrors {
  name?: string;
  adresse?: string;
  mobile?: string;
  mail?: string;
  priceConv?: string;
  baseCompteId?: string;
}

/* ============================================================
   PAGE AJOUTER UN COMPTE
============================================================ */

export function AjouterComptePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération des données pour le mode modification
  const compte = (
    location.state as { compte?: Compte } | null
  )?.compte;

  const isEdit = Boolean(compte);

  /* ==========================================================
     ÉTATS
  ========================================================== */

  const [formData, setFormData] = useState<CompteFormData>(() => ({
    name: compte?.name ?? "",
    adresse: compte?.adresse ?? "",
    mobile: compte?.mobile ?? "",
    mail: compte?.mail ?? "",
    statusId: String(compte?.statusId ?? 1),
    priceConv: String(compte?.priceConv ?? 0),
    isBaseCompte: compte?.isBaseCompte ?? false,
    baseCompteId:
      compte?.baseCompteId == null
        ? ""
        : String(compte.baseCompteId),
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ==========================================================
     MODIFICATION DES CHAMPS
  ========================================================== */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  /* ==========================================================
     COMPTE PRINCIPAL / COMPTE RATTACHÉ
  ========================================================== */

  const handleToggleBaseCompte = () => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: !current.isBaseCompte,
      baseCompteId: !current.isBaseCompte
        ? ""
        : current.baseCompteId,
    }));

    setErrors((current) => ({
      ...current,
      baseCompteId: undefined,
    }));
  };

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleCancel = () => {
    navigate("/store-admin/accounts");
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);

    navigate("/store-admin/accounts", {
      state: { refreshComptes: true },
    });
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Veuillez saisir le nom du compte.";
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = "Veuillez saisir l'adresse du compte.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Veuillez saisir le numéro de téléphone.";
    }

    if (formData.mail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.mail.trim())) {
        newErrors.mail = "Veuillez saisir une adresse e-mail valide.";
      }
    }

    const priceConv = Number(formData.priceConv);

    if (
      formData.priceConv.trim() === "" ||
      !Number.isFinite(priceConv) ||
      priceConv < 0
    ) {
      newErrors.priceConv = "Veuillez saisir un prix de conversion valide.";
    }

    if (
      !formData.isBaseCompte &&
      formData.baseCompteId.trim() &&
      (
        !Number.isInteger(Number(formData.baseCompteId)) ||
        Number(formData.baseCompteId) <= 0
      )
    ) {
      newErrors.baseCompteId =
        "L'identifiant du compte principal doit être un entier positif.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ==========================================================
     ENREGISTREMENT FRONTEND UNIQUEMENT
  ========================================================== */

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    if (!validateForm()) return;

    setIsSaving(true);

    // Simulation de l'enregistrement.
    // Aucun appel API ou backend n'est effectué.
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessModal(true);
    }, 500);
  };

  /* ==========================================================
     STYLES DES CHAMPS
  ========================================================== */

  const inputClass = (hasError: boolean, disabled = false) =>
    `h-11 w-full rounded-xl border ${
      hasError
        ? "border-red-400 focus-visible:ring-red-300"
        : "border-[#E4E9E0] focus-visible:border-[#8A9D6B] focus-visible:ring-[#556B2F]/15"
    } ${
      disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : "bg-white text-[#263449]"
    } pl-10 pr-3 text-[13px] shadow-sm outline-none transition placeholder:text-[#A5AFBD] focus-visible:ring-2`;

  return (
    <>
      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <Container>
        <FormPageHeader
          title={isEdit ? "Modifier un compte" : "Ajouter un compte"}
          description={
            isEdit
              ? "Modifiez les coordonnées, le statut et les paramètres de conversion du compte."
              : "Créez un compte et configurez ses coordonnées, son statut et ses paramètres de conversion."
          }
          icon={<Wallet className="size-7" />}
          breadcrumbs={[
            {
              label: "Accueil",
              onClick: () => navigate("/store-admin"),
            },
            {
              label: "Comptes",
              onClick: handleCancel,
            },
            {
              label: isEdit ? "Modification" : "Nouveau compte",
              current: true,
            },
          ]}
          backLabel="Retour à la liste"
          onBack={handleCancel}
          disabled={isSaving}
        />
      </Container>

      {/* ======================================================
          FORMULAIRE
      ====================================================== */}

      <Container>
        <form onSubmit={handleSubmit} noValidate className="w-full pb-8">
          <div className="overflow-hidden rounded-2xl border border-[#E8ECE5] bg-white shadow-sm">

            <div className="space-y-8 p-5 sm:p-7 lg:p-8">

              {/* ==============================================
                  SECTION 1 : INFORMATIONS GÉNÉRALES
              ============================================== */}

              <FormSection
                icon={<Building2 className="size-5" />}
                title="Informations générales"
                description="Coordonnées et informations principales du compte."
                color="green"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* NOM */}
                  <div>
                    <FormField
                      label="Nom du compte"
                      htmlFor="name"
                      icon={<UserRound className="size-4" />}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex. : Ahmed Ben Ali"
                        autoComplete="organization"
                        className={inputClass(!!errors.name)}
                      />
                    </FormField>

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* ADRESSE */}
                  <div>
                    <FormField
                      label="Adresse"
                      htmlFor="adresse"
                      icon={<MapPin className="size-4" />}
                    >
                      <input
                        id="adresse"
                        name="adresse"
                        type="text"
                        value={formData.adresse}
                        onChange={handleChange}
                        placeholder="Ex. : Sousse"
                        autoComplete="street-address"
                        className={inputClass(!!errors.adresse)}
                      />
                    </FormField>

                    {errors.adresse && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.adresse}
                      </p>
                    )}
                  </div>

                  {/* TÉLÉPHONE */}
                  <div>
                    <FormField
                      label="Téléphone mobile"
                      htmlFor="mobile"
                      icon={<Phone className="size-4" />}
                    >
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Ex. : 12345678"
                        autoComplete="tel"
                        className={inputClass(!!errors.mobile)}
                      />
                    </FormField>

                    {errors.mobile && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <FormField
                      label="Adresse e-mail"
                      htmlFor="mail"
                      icon={<Mail className="size-4" />}
                      hint="Ce champ est facultatif."
                    >
                      <input
                        id="mail"
                        name="mail"
                        type="email"
                        value={formData.mail}
                        onChange={handleChange}
                        placeholder="Ex. : contact@example.com"
                        autoComplete="email"
                        className={inputClass(!!errors.mail)}
                      />
                    </FormField>

                    {errors.mail && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.mail}
                      </p>
                    )}
                  </div>

                </div>
              </FormSection>

              <div className="border-t border-dashed border-[#E8ECE5]" />

              {/* ==============================================
                  SECTION 2 : STATUT ET CONVERSION
              ============================================== */}

              <FormSection
                icon={<BadgeDollarSign className="size-5" />}
                title="Statut et conversion"
                description="Définissez l'état du compte et son prix de conversion."
                color="amber"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* STATUT */}
                  <div>
                    <FormField
                      label="Statut du compte"
                      htmlFor="statusId"
                      icon={<CircleCheck className="size-4" />}
                    >
                      <select
                        id="statusId"
                        name="statusId"
                        value={formData.statusId}
                        onChange={handleChange}
                        className={inputClass(false)}
                      >
                        <option value="1">Actif</option>
                        <option value="2">Inactif</option>
                      </select>
                    </FormField>
                  </div>

                  {/* PRIX CONVERSION */}
                  <div>
                    <FormField
                      label="Prix de conversion"
                      htmlFor="priceConv"
                      icon={<BadgeDollarSign className="size-4" />}
                      unit="DT"
                    >
                      <input
                        id="priceConv"
                        name="priceConv"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceConv}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`${inputClass(!!errors.priceConv)} pr-16`}
                      />
                    </FormField>

                    {errors.priceConv && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.priceConv}
                      </p>
                    )}
                  </div>

                </div>
              </FormSection>

              <div className="border-t border-dashed border-[#E8ECE5]" />

              {/* ==============================================
                  SECTION 3 : RATTACHEMENT
              ============================================== */}

              <FormSection
                icon={<GitBranch className="size-5" />}
                title="Rattachement du compte"
                description="Choisissez si le compte est principal ou rattaché à un autre compte."
                color="blue"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* COMPTE PRINCIPAL */}
                  <div>
                    <span className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#243047]">
                      Compte de base
                      <span className="text-red-500">*</span>
                    </span>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.isBaseCompte}
                      onClick={handleToggleBaseCompte}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-[#E4E9E0] bg-white px-3.5 py-2.5 text-left transition hover:border-[#C8D8B6] hover:bg-[#FBFCF9]"
                    >
                      <span
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          formData.isBaseCompte
                            ? "bg-[#556B2F]"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                            formData.isBaseCompte
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </span>

                      <span className="text-[13px] font-medium text-[#334155]">
                        {formData.isBaseCompte
                          ? "Oui, compte principal"
                          : "Non, compte rattaché"}
                      </span>
                    </button>

                    <p className="mt-1.5 text-[11px] leading-5 text-[#8998AD]">
                      Activez cette option si ce compte est un compte principal.
                    </p>
                  </div>

                  {/* ID COMPTE PRINCIPAL */}
                  <div>
                    <FormField
                      label="ID du compte de base"
                      htmlFor="baseCompteId"
                      icon={<Hash className="size-4" />}
                      hint={
                        formData.isBaseCompte
                          ? "Un compte principal ne dépend d'aucun autre compte."
                          : "Identifiant du compte principal auquel ce compte est rattaché."
                      }
                    >
                      <input
                        id="baseCompteId"
                        name="baseCompteId"
                        type="number"
                        min="1"
                        step="1"
                        value={formData.baseCompteId}
                        onChange={handleChange}
                        placeholder="Ex. : 1"
                        disabled={formData.isBaseCompte}
                        className={inputClass(
                          !!errors.baseCompteId,
                          formData.isBaseCompte
                        )}
                      />
                    </FormField>

                    {errors.baseCompteId && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.baseCompteId}
                      </p>
                    )}
                  </div>

                </div>
              </FormSection>

            </div>

            {/* ==============================================
                ERREUR GÉNÉRALE
            ============================================== */}

            {/* ==============================================
                FOOTER ET BOUTONS
            ============================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#E9EDE4] bg-[#FCFDFB] px-5 py-4 sm:flex-row sm:justify-end sm:px-7 lg:px-8">

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-11 gap-2 rounded-xl border-[#DCE8CF] bg-white px-5 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAF6]"
              >
                <X className="size-4" />
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 gap-2 rounded-xl bg-[#556B2F] px-6 text-xs font-bold text-white shadow-sm transition hover:bg-[#465A27] disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    {isEdit
                      ? "Enregistrer les modifications"
                      : "Enregistrer le compte"}
                  </>
                )}
              </Button>

            </div>

          </div>
        </form>
      </Container>

      {/* ======================================================
          MODAL DE SUCCÈS
      ====================================================== */}

      <FormSuccessModal
        open={showSuccessModal}
        title={
          isEdit
            ? "Compte modifié avec succès !"
            : "Compte ajouté avec succès !"
        }
        description={
          isEdit
            ? "Les modifications ont été prises en compte dans cette démonstration frontend."
            : "Le compte a été créé dans cette démonstration frontend."
        }
        buttonLabel="Retour à la liste"
        onConfirm={handleSuccessConfirm}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="mt-5 rounded-xl border border-[#E8ECE5] bg-[#FAFBF9] p-3 text-left">
          <p className="text-[11px] text-[#8998AD]">
            Nom du compte
          </p>

          <p className="mt-1 text-sm font-semibold text-[#263449]">
            {formData.name}
          </p>

          <p className="mt-1 text-xs text-[#7D8A9E]">
            {formData.mobile}
          </p>

          {formData.mail && (
            <p className="mt-1 text-xs text-[#7D8A9E]">
              {formData.mail}
            </p>
          )}
        </div>
      </FormSuccessModal>
    </>
  );
}
