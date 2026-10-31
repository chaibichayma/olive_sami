
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Hash,
  Home,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import {
  utilisateurCrudApi,
  type UtilisateurApiPayload,
} from "@/services/api";

// ======================================================
// TYPES
// ======================================================

interface Utilisateur {
  id?: number;
  userId?: number;
  displayName: string;
  userName: string;
  mail: string;
  password?: string;
  userCode: string;
  isActive: boolean;
  roles?: Array<{
    id: number;
    name: string;
  }>;
}

interface FormDataUtilisateur {
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: boolean;
}

// ======================================================
// COMPOSANT
// ======================================================

export function AjouterUtilisateurPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const utilisateur = (
    location.state as { utilisateur?: Utilisateur } | null
  )?.utilisateur;

  const isEdit = Boolean(utilisateur);

  // ------------------------------------------------------
  // STATES
  // ------------------------------------------------------

  const [formData, setFormData] =
    useState<FormDataUtilisateur>({
      displayName: utilisateur?.displayName ?? "",
      userName: utilisateur?.userName ?? "",
      mail: utilisateur?.mail ?? "",
      password: "",
      userCode: utilisateur?.userCode ?? "",
      isActive: utilisateur?.isActive ?? true,
    });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // ------------------------------------------------------
  // STYLES
  // ------------------------------------------------------

  const inputClassName =
    "h-[46px] w-full rounded-lg border border-[#dfe6ef] bg-white pl-11 pr-3 text-sm font-medium text-[#172033] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#98a5b8] hover:border-[#c5d2e0] focus:border-[#718747] focus:ring-4 focus:ring-[#556B2F]/[0.08]";

  const labelClassName =
    "mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#25334a]";

  const requiredMark = (
    <span className="text-[#e5484d]">*</span>
  );

  // ------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleToggleStatus = () => {
    setFormData((current) => ({
      ...current,
      isActive: !current.isActive,
    }));
  };

  const handleCancel = () => {
    navigate("/store-admin/users");
  };

  // ------------------------------------------------------
  // VALIDATION ET ENREGISTREMENT
  // ------------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (saving) return;

    setErrorMessage("");

    const displayName = formData.displayName.trim();
    const userName = formData.userName.trim();
    const mail = formData.mail.trim();
    const userCode = formData.userCode.trim();
    const password = formData.password;

    // Vérification des champs obligatoires
    if (!displayName || !userName || !mail || !userCode) {
      setErrorMessage(
        "Veuillez remplir tous les champs obligatoires.",
      );
      return;
    }

    // Mot de passe obligatoire uniquement en création
    if (!isEdit && !password.trim()) {
      setErrorMessage("Veuillez saisir un mot de passe.");
      return;
    }

    // Validation de l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(mail)) {
      setErrorMessage(
        "Veuillez saisir une adresse e-mail valide.",
      );
      return;
    }

    // Vérification de l'identifiant en modification
    if (
      isEdit &&
      utilisateur?.id == null &&
      utilisateur?.userId == null
    ) {
      setErrorMessage(
        "L'identifiant de l'utilisateur est introuvable. Retournez à la liste et réessayez.",
      );
      return;
    }

    // Préparation du payload API
    const payload: UtilisateurApiPayload = {
      ...(isEdit
        ? {
            ...(utilisateur?.id != null
              ? { id: utilisateur.id }
              : {}),
            ...(utilisateur?.userId != null
              ? { userId: utilisateur.userId }
              : {}),
          }
        : {}),

      displayName,
      userName,
      mail,

      ...(password.trim() ? { password } : {}),

      userCode,
      isActive: formData.isActive,
      roles: utilisateur?.roles ?? [],
    };

    setSaving(true);

    try {
      if (isEdit) {
        await utilisateurCrudApi.modifier(payload);
      } else {
        await utilisateurCrudApi.ajouter(payload);
      }

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error(
        "Erreur lors de l'enregistrement de l'utilisateur :",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------
  // SUCCÈS
  // ------------------------------------------------------

  const handleSuccessOk = () => {
    setShowSuccessModal(false);

    navigate("/store-admin/users", {
      state: { refreshUsers: true },
    });
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      <Container>
        <div className="min-h-full w-full px-1 py-5 sm:px-2 sm:py-7">
          <div className="mx-auto max-w-[1440px]">

            {/* EN-TÊTE */}

            <header className="relative mb-5 overflow-hidden rounded-2xl border border-[#e8ecdf] bg-gradient-to-br from-white via-white to-[#f1f5e9] px-5 py-5 sm:px-7 sm:py-6">

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border border-[#e3ead8] opacity-60"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-12 size-48 rounded-full border border-[#e3ead8] opacity-60"
              />

              <div className="relative">

                {/* Fil d'Ariane */}

                <nav
                  aria-label="Fil d'Ariane"
                  className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#87927c]"
                >
                  <button
                    type="button"
                    onClick={() => navigate("/store-admin")}
                    aria-label="Accueil"
                    className="transition hover:text-[#556B2F]"
                  >
                    <Home className="size-3.5" />
                  </button>

                  <ChevronRight className="size-3" />

                  <button
                    type="button"
                    onClick={() => navigate("/store-admin/users")}
                    className="transition hover:text-[#556B2F]"
                  >
                    Sécurité
                  </button>

                  <ChevronRight className="size-3" />

                  <span className="font-semibold text-[#33412b]">
                    {isEdit
                      ? "Modifier un utilisateur"
                      : "Ajouter un utilisateur"}
                  </span>
                </nav>

                {/* Titre */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">

                    <div className="flex size-[58px] shrink-0 items-center justify-center rounded-2xl border border-[#dfe8d3] bg-gradient-to-br from-[#f5f8ef] to-[#eaf0df] text-[#556B2F] shadow-[0_3px_10px_rgba(85,107,47,0.07)]">
                      <UserRound
                        className="size-7"
                        strokeWidth={1.9}
                      />
                    </div>

                    <div className="min-w-0">

                      <h1 className="text-[25px] font-bold leading-tight tracking-[-0.035em] text-[#172033] sm:text-[32px]">
                        {isEdit
                          ? "Modifier un utilisateur"
                          : "Ajouter un utilisateur"}
                      </h1>

                      <p className="mt-2.5 max-w-2xl text-[14px] leading-[1.8] text-[#64748b] sm:text-[15px]">
                        {isEdit
                          ? "Modifiez les informations et les paramètres du compte utilisateur."
                          : "Créez un compte utilisateur et configurez ses informations de connexion."}
                      </p>

                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-10 shrink-0 gap-2 rounded-lg border-[#dce7d0] bg-white/90 px-4 text-[13px] font-semibold text-[#556B2F] shadow-sm transition hover:border-[#c8d8b6] hover:bg-[#f1f5e9]"
                  >
                    <ArrowLeft className="size-4" />
                    Retour à la liste
                  </Button>

                </div>
              </div>
            </header>

            {/* INDICATEUR DES ÉTAPES */}

            <section
              aria-label="Étapes de création du compte"
              className="mb-5 rounded-xl border border-[#e9ede5] bg-white px-4 py-4 shadow-[0_2px_10px_rgba(24,39,25,0.025)] sm:px-8"
            >
              <div className="mx-auto flex max-w-[850px] items-center">

                {/* Étape 1 */}

                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#556B2F] text-xs font-bold text-white shadow-[0_3px_8px_rgba(85,107,47,0.20)]">
                    1
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-[#26344a] sm:text-xs">
                      Informations générales
                    </p>
                    <p className="mt-1 hidden text-[10px] text-[#8792a5] sm:block">
                      Données de l'utilisateur
                    </p>
                  </div>
                </div>

                <div className="mx-3 h-px min-w-3 flex-1 border-t border-dashed border-[#d7decd] sm:mx-5" />

                {/* Étape 2 */}

                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e4e8ed] bg-[#f5f6f8] text-xs font-bold text-[#7b8799]">
                    2
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-[#59667a] sm:text-xs">
                      Vérification
                    </p>
                    <p className="mt-1 hidden text-[10px] text-[#9aa4b3] sm:block">
                      Contrôle des informations
                    </p>
                  </div>
                </div>

                <div className="mx-3 h-px min-w-3 flex-1 border-t border-dashed border-[#d7decd] sm:mx-5" />

                {/* Étape 3 */}

                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e4e8ed] bg-[#f5f6f8] text-xs font-bold text-[#7b8799]">
                    3
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-[#59667a] sm:text-xs">
                      Enregistrement
                    </p>
                    <p className="mt-1 hidden text-[10px] text-[#9aa4b3] sm:block">
                      Ajout de l'utilisateur
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* FORMULAIRE */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="pb-6"
            >
              <div className="overflow-hidden rounded-xl border border-[#e3e9df] bg-white shadow-[0_4px_18px_rgba(25,39,25,0.035)]">

                {/* EN-TÊTE DU FORMULAIRE */}

                <div className="flex items-center gap-3.5 border-b border-[#edf0ea] px-5 py-4 sm:px-7 sm:py-5">

                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#e3ead9] bg-[#f1f5e9] text-[#556B2F]">
                    <UserRound
                      className="size-5"
                      strokeWidth={1.9}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-bold tracking-tight text-[#172033] sm:text-base">
                      Informations générales
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#7a879b]">
                      Saisissez les informations du compte utilisateur.
                    </p>
                  </div>

                  <span className="hidden shrink-0 items-center gap-1 rounded-md border border-[#f9e4e4] bg-[#fff5f4] px-2.5 py-1.5 text-[10px] font-medium text-[#bd4242] sm:inline-flex">
                    <span className="font-bold">*</span>
                    Champs obligatoires
                  </span>

                </div>

                <div className="px-5 py-5 sm:px-7 sm:py-6">

                  {/* IDENTITÉ */}

                  <section>
                    <div className="mb-4 flex items-center gap-2.5">
                      <UserRound className="size-[17px] text-[#617b3d]" />

                      <h3 className="text-[13px] font-bold text-[#25334a]">
                        Identité
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

                      {/* Nom complet */}

                      <div className="min-w-0">
                        <label
                          htmlFor="displayName"
                          className={labelClassName}
                        >
                          Nom complet {requiredMark}
                        </label>

                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b9bb1]" />

                          <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Ex. Ayah Ben Ali"
                            autoComplete="name"
                            required
                            className={inputClassName}
                          />
                        </div>
                      </div>

                      {/* Nom utilisateur */}

                      <div className="min-w-0">
                        <label
                          htmlFor="userName"
                          className={labelClassName}
                        >
                          Nom d'utilisateur {requiredMark}
                        </label>

                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b9bb1]" />

                          <input
                            id="userName"
                            name="userName"
                            type="text"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Ex. ayah"
                            autoComplete="username"
                            required
                            className={inputClassName}
                          />
                        </div>
                      </div>

                    </div>
                  </section>

                  <div className="my-6 border-t border-[#edf0ea]" />

                  {/* COORDONNÉES */}

                  <section>
                    <div className="mb-4 flex items-center gap-2.5">
                      <Mail className="size-[17px] text-[#617b3d]" />

                      <h3 className="text-[13px] font-bold text-[#25334a]">
                        Coordonnées
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

                      {/* Email */}

                      <div className="min-w-0">
                        <label
                          htmlFor="mail"
                          className={labelClassName}
                        >
                          Adresse e-mail {requiredMark}
                        </label>

                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b9bb1]" />

                          <input
                            id="mail"
                            name="mail"
                            type="email"
                            value={formData.mail}
                            onChange={handleChange}
                            placeholder="nom@exemple.com"
                            autoComplete="email"
                            required
                            className={inputClassName}
                          />
                        </div>
                      </div>

                      {/* Code utilisateur */}

                      <div className="min-w-0">
                        <label
                          htmlFor="userCode"
                          className={labelClassName}
                        >
                          Code utilisateur {requiredMark}
                        </label>

                        <div className="relative">
                          <Hash className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b9bb1]" />

                          <input
                            id="userCode"
                            name="userCode"
                            type="text"
                            value={formData.userCode}
                            onChange={handleChange}
                            placeholder="Ex. U013"
                            required
                            className={inputClassName}
                          />
                        </div>
                      </div>

                    </div>
                  </section>

                  <div className="my-6 border-t border-[#edf0ea]" />

                  {/* SÉCURITÉ ET STATUT */}

                  <section>
                    <div className="mb-4 flex items-center gap-2.5">
                      <ShieldCheck className="size-[17px] text-[#617b3d]" />

                      <h3 className="text-[13px] font-bold text-[#25334a]">
                        Sécurité et statut
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

                      {/* Mot de passe */}

                      <div className="min-w-0">
                        <label
                          htmlFor="password"
                          className={labelClassName}
                        >
                          Mot de passe {!isEdit && requiredMark}
                        </label>

                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b9bb1]" />

                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                              isEdit
                                ? "Conserver le mot de passe actuel"
                                : "Saisissez un mot de passe"
                            }
                            autoComplete="new-password"
                            required={!isEdit}
                            className={`${inputClassName} pr-11`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((value) => !value)
                            }
                            aria-label={
                              showPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                            }
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8b9bb1] transition hover:bg-[#f3f5ef] hover:text-[#556B2F]"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-[#8b96a7]">
                          {isEdit
                            ? "Laissez vide pour conserver le mot de passe actuel."
                            : "Choisissez un mot de passe sécurisé."}
                        </p>
                      </div>

                      {/* Statut */}

                      <div className="min-w-0">
                        <label className={labelClassName}>
                          Statut du compte
                        </label>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.isActive}
                          onClick={handleToggleStatus}
                          className={`flex min-h-[46px] w-full items-center justify-between rounded-lg border px-3.5 transition-all duration-200 ${
                            formData.isActive
                              ? "border-[#dce7d0] bg-[#f8faf5]"
                              : "border-[#e2e6eb] bg-[#f8f9fb]"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`size-2 rounded-full ${
                                formData.isActive
                                  ? "bg-[#668443]"
                                  : "bg-slate-400"
                              }`}
                            />

                            <span className="text-[12px] font-semibold text-[#344155]">
                              {formData.isActive
                                ? "Compte actif"
                                : "Compte inactif"}
                            </span>
                          </span>

                          <span
                            className={`relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full transition-colors duration-200 ${
                              formData.isActive
                                ? "bg-[#556B2F]"
                                : "bg-[#cbd2dc]"
                            }`}
                          >
                            <span
                              className={`size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                formData.isActive
                                  ? "translate-x-[19px]"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </span>
                        </button>

                        <p className="mt-2 text-[11px] leading-5 text-[#8b96a7]">
                          {formData.isActive
                            ? "L'utilisateur pourra accéder à son compte."
                            : "L'accès au compte sera désactivé."}
                        </p>
                      </div>

                    </div>
                  </section>

                  {/* MESSAGE D'ERREUR */}

                  {errorMessage && (
                    <div
                      role="alert"
                      className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      <ShieldCheck className="mt-0.5 size-4 shrink-0" />

                      <p className="min-w-0 flex-1 break-words leading-5">
                        {errorMessage}
                      </p>

                      <button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        aria-label="Fermer le message d'erreur"
                        className="rounded-md p-1 transition hover:bg-red-100"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                </div>

                {/* BARRE D'ACTIONS */}

                <footer className="flex flex-col-reverse gap-3 border-t border-[#edf0ea] bg-[#fbfcf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="h-10 gap-2 rounded-lg border-[#dce3eb] bg-white px-5 text-[12px] font-semibold text-[#566378] transition hover:border-[#c8d1dd] hover:bg-[#f6f8fa]"
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-10 gap-2 rounded-lg border border-[#4c6128] bg-[#556B2F] px-5 text-[12px] font-semibold text-white shadow-[0_3px_8px_rgba(85,107,47,0.15)] transition hover:bg-[#465a27] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}

                    <span className="text-[13px] font-semibold tracking-[0.01em] sm:text-sm">
                      {saving
                        ? "Enregistrement en cours..."
                        : isEdit
                          ? "Enregistrer les modifications"
                          : "Ajouter l'utilisateur"}
                    </span>

                    {!saving && (
                      <ArrowRight className="ml-1 size-4" />
                    )}
                  </Button>

                </footer>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* MODALE DE SUCCÈS */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#142019]/40 px-4 py-6 backdrop-blur-[3px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-[#e5eadf] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.20)]"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#81965a] via-[#556B2F] to-[#394b21]" />

            <div className="px-6 pb-6 pt-7 text-center sm:px-8">

              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#e0e9d5] bg-[#f0f5e9] text-[#556B2F]">
                <CheckCircle2
                  className="size-7"
                  strokeWidth={1.8}
                />
              </div>

              <h2
                id="success-title"
                className="mt-4 text-xl font-bold tracking-tight text-[#172033]"
              >
                {isEdit
                  ? "Utilisateur modifié"
                  : "Utilisateur ajouté"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#778397]">
                {isEdit
                  ? "Les modifications ont été enregistrées avec succès."
                  : "Le compte utilisateur a été créé avec succès."}
              </p>

              <div className="mt-5 space-y-3 rounded-xl border border-[#e9ede5] bg-[#fafbf8] p-4 text-left">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8490a0]">
                    Nom complet
                  </span>

                  <span className="max-w-[60%] truncate text-right text-xs font-semibold text-[#26344a]">
                    {formData.displayName}
                  </span>
                </div>

                <div className="border-t border-[#e9ede5]" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8490a0]">
                    Code utilisateur
                  </span>

                  <span className="text-xs font-semibold text-[#26344a]">
                    {formData.userCode}
                  </span>
                </div>

                <div className="border-t border-[#e9ede5]" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8490a0]">
                    Statut
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      formData.isActive
                        ? "bg-[#eef5e7] text-[#4e6a2d]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        formData.isActive
                          ? "bg-[#668443]"
                          : "bg-slate-400"
                      }`}
                    />

                    {formData.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>

              </div>

              <Button
                type="button"
                onClick={handleSuccessOk}
                className="mt-6 h-11 w-full gap-2 rounded-lg bg-[#556B2F] text-sm font-semibold text-white shadow-sm transition hover:bg-[#465a27]"
              >
                Voir les utilisateurs
                <ChevronRight className="size-4" />
              </Button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AjouterUtilisateurPage;
