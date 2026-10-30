
import { useRef, useState } from "react";
import {
  Camera,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  CalendarDays,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

type Profile = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  photo: string;
};

const initialProfile: Profile = {
  nom: "Benali",
  prenom: "Ahmed",
  email: "ahmed.benali@example.com",
  telephone: "+216 25 123 456",
  photo: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/15";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [savedProfile, setSavedProfile] =
    useState<Profile>(initialProfile);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("photo", reader.result);
      }
    };

    reader.onerror = () => {
      setError("Impossible de lire cette image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !profile.nom.trim() ||
      !profile.prenom.trim() ||
      !profile.email.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (password && password.length < 8) {
      setError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    // Démonstration uniquement : connecter ici l'API backend.
    setSavedProfile({ ...profile });
    setPassword("");
    setConfirmPassword("");
    setMessage(
      "Modifications enregistrées dans cette page. Connectez le backend pour les conserver définitivement."
    );
  };

  const handleCancel = () => {
    setProfile({ ...savedProfile });
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
  };

  const initials =
    `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Titre */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Mon profil
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Consultez et modifiez vos informations personnelles.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          {/* Carte du profil */}
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-40 bg-gradient-to-br from-[#E7EFE2] via-[#F0F4EC] to-[#DCE8D6]" />

            <div className="px-6 pb-7">
              {/* Photo */}
              <div className="-mt-[76px] flex justify-center">
                <div className="relative">
                  <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E7EFE2] text-3xl font-semibold text-[#556B2F] shadow-sm">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Photo de profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials || <UserRound size={48} />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Modifier la photo de profil"
                    title="Modifier la photo"
                    className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#287A4B] text-white shadow-sm transition hover:bg-[#20653D]"
                  >
                    <Camera size={19} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.prenom} {profile.nom}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Mon compte
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-sm font-medium text-[#287A4B] hover:underline"
                >
                  Modifier la photo
                </button>
              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail
                    size={19}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="mt-1 break-all text-sm text-gray-800">
                      {profile.email || "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={19}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="mt-1 text-sm text-gray-800">
                      {profile.telephone || "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Compte</p>
                    <p className="mt-1 text-sm text-gray-800">
                      Informations personnelles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Formulaire */}
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Modifier mes informations
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Modifiez les champs ci-dessous puis enregistrez.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Nom et prénom */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="nom" className={labelClass}>
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="nom"
                      name="nom"
                      value={profile.nom}
                      onChange={(e) =>
                        updateField("nom", e.target.value)
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="Votre nom"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prenom" className={labelClass}>
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="prenom"
                      name="prenom"
                      value={profile.prenom}
                      onChange={(e) =>
                        updateField("prenom", e.target.value)
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="Votre prénom"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  E-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className={labelClass}>
                  Téléphone
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={profile.telephone}
                    onChange={(e) =>
                      updateField("telephone", e.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="+216 XX XXX XXX"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-1 font-semibold text-gray-800">
                  Sécurité du compte
                </h3>
                <p className="mb-5 text-sm text-gray-500">
                  Laissez ces champs vides si vous ne souhaitez pas
                  changer votre mot de passe.
                </p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className={`${inputClass} pl-10 pr-12`}
                        placeholder="8 caractères minimum"
                        autoComplete="new-password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className={labelClass}
                    >
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className={`${inputClass} pl-10 pr-12`}
                        placeholder="Confirmez le nouveau mot de passe"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Masquer la confirmation"
                            : "Afficher la confirmation"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <X size={17} />
                  Annuler
                </button>

                
<button
  type="submit"
  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465825] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/40 focus:ring-offset-2"
>
  <Save size={18} />
  Enregistrer les modifications
</button>

              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
