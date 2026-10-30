
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Tags,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
} from "lucide-react";

type SensMouvement = "+" | "-";

interface Rubrique {
  id: number;
  code: string;
  libelle: string;
  sensMouvement: SensMouvement;
}

const DONNEES_INITIALES: Rubrique[] = [
  { id: 1, code: "RUB001", libelle: "Entrée d'huile", sensMouvement: "+" },
  { id: 2, code: "RUB002", libelle: "Sortie d'huile", sensMouvement: "-" },
  { id: 3, code: "RUB003", libelle: "Réception des olives", sensMouvement: "+" },
  { id: 4, code: "RUB004", libelle: "Expédition", sensMouvement: "-" },
  { id: 5, code: "RUB005", libelle: "Transfert entrant", sensMouvement: "+" },
  { id: 6, code: "RUB006", libelle: "Transfert sortant", sensMouvement: "-" },
  { id: 7, code: "RUB007", libelle: "Ajustement positif", sensMouvement: "+" },
  { id: 8, code: "RUB008", libelle: "Ajustement négatif", sensMouvement: "-" },
];

const TAILLE_PAGE = 8;

export default function RubriquesPage() {
  const [rubriques, setRubriques] = useState<Rubrique[]>(DONNEES_INITIALES);
  const [recherche, setRecherche] = useState("");
  const [filtreSens, setFiltreSens] = useState("tous");
  const [page, setPage] = useState(1);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [filtreCode, setFiltreCode] = useState("tous");
  const [rubriqueEnEdition, setRubriqueEnEdition] =
    useState<Rubrique | null>(null);

  const [formulaire, setFormulaire] = useState({
    code: "",
    libelle: "",
    sensMouvement: "+" as SensMouvement,
  });

  const rubriquesFiltrees = useMemo(() => {
  return rubriques.filter((r) => {
    const correspondCode =
      filtreCode === "tous" || r.code === filtreCode;

    const correspondSens =
      filtreSens === "tous" || r.sensMouvement === filtreSens;

    return correspondCode && correspondSens;
  });
}, [rubriques, filtreCode, filtreSens]);

  const totalPages = Math.max(
    1,
    Math.ceil(rubriquesFiltrees.length / TAILLE_PAGE)
  );

  const pageCourante = Math.min(page, totalPages);
  const debut =
    rubriquesFiltrees.length === 0
      ? 0
      : (pageCourante - 1) * TAILLE_PAGE + 1;

  const fin = Math.min(
    pageCourante * TAILLE_PAGE,
    rubriquesFiltrees.length
  );

  const rubriquesAffichees = rubriquesFiltrees.slice(
    (pageCourante - 1) * TAILLE_PAGE,
    pageCourante * TAILLE_PAGE
  );

  function ouvrirAjout() {
    setRubriqueEnEdition(null);
    setFormulaire({
      code: "",
      libelle: "",
      sensMouvement: "+",
    });
    setModalOuverte(true);
  }

  function ouvrirEdition(rubrique: Rubrique) {
    setRubriqueEnEdition(rubrique);
    setFormulaire({
      code: rubrique.code,
      libelle: rubrique.libelle,
      sensMouvement: rubrique.sensMouvement,
    });
    setModalOuverte(true);
  }

  function enregistrerRubrique(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const code = formulaire.code.trim().toUpperCase();
    const libelle = formulaire.libelle.trim();

    if (!code || !libelle) return;

    const codeExiste = rubriques.some(
      (r) =>
        r.code.toLowerCase() === code.toLowerCase() &&
        r.id !== rubriqueEnEdition?.id
    );

    if (codeExiste) {
      window.alert("Ce code existe déjà.");
      return;
    }

    if (rubriqueEnEdition) {
      setRubriques((prev) =>
        prev.map((r) =>
          r.id === rubriqueEnEdition.id
            ? { ...r, code, libelle, sensMouvement: formulaire.sensMouvement }
            : r
        )
      );
    } else {
      const nouvelleRubrique: Rubrique = {
        id: Math.max(0, ...rubriques.map((r) => r.id)) + 1,
        code,
        libelle,
        sensMouvement: formulaire.sensMouvement,
      };

      setRubriques((prev) => [...prev, nouvelleRubrique]);
    }

    setPage(1);
    setModalOuverte(false);
    setRubriqueEnEdition(null);
  }

  function supprimerRubrique(rubrique: Rubrique) {
    const confirmer = window.confirm(
      `Voulez-vous supprimer la rubrique "${rubrique.libelle}" ?`
    );

    if (!confirmer) return;

    setRubriques((prev) => prev.filter((r) => r.id !== rubrique.id));
    setPage(1);
  }

  function actualiser() {
    setRecherche("");
    setFiltreSens("tous");
    setPage(1);
  }

  function exporterCSV() {
    const lignes = [
      ["Code", "Libellé", "Sens de mouvement"],
      ...rubriquesFiltrees.map((r) => [
        r.code,
        r.libelle,
        r.sensMouvement,
      ]),
    ];

    const contenu =
      "\uFEFF" +
      lignes
        .map((ligne) =>
          ligne
            .map((valeur) => `"${valeur.replace(/"/g, '""')}"`)
            .join(";")
        )
        .join("\r\n");

    const fichier = new Blob([contenu], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(fichier);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = "rubriques.csv";
    lien.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen  p-4 text-[#243047] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* En-tête */}
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e8ede1] bg-white p-5 shadow-[0_3px_15px_rgba(45,62,28,0.04)] sm:flex-row sm:items-center sm:px-7">
          <div className="flex items-center gap-5">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#78934a] to-[#526b2e] text-white shadow-md">
              <Tags size={31} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#18351b]">
                Rubriques
              </h1>
              <p className="mt-1 text-sm text-[#68766b]">
                Organisez et gérez les rubriques de votre application.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={ouvrirAjout}
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#586f2e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#455a24] active:scale-[0.98]"
          >
            <Plus size={19} />
            Ajouter une rubrique
          </button>
        </header>

        
{/* Filtres des rubriques */}
<section className="rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-[0_3px_15px_rgba(45,62,28,0.03)] sm:p-5">
  <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

    {/* Combo box : Code */}
    <div className="min-w-0 flex-1">
      <label
        htmlFor="filtre-code"
        className="mb-2 block text-xs font-semibold text-[#526b32]"
      >
        Code de rubrique
      </label>

      <select
        id="filtre-code"
        value={filtreCode}
        onChange={(e) => {
          setFiltreCode(e.target.value);
          setPage(1);
        }}
        className="h-[50px] w-full appearance-none rounded-xl border border-[#dfe6dc] bg-white px-4 text-sm text-[#29364b] outline-none transition hover:border-[#b9c8a8] focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
      >
        <option value="tous">Tous les codes</option>
        {rubriques.map((rubrique) => (
          <option key={rubrique.id} value={rubrique.code}>
            {rubrique.code}
          </option>
        ))}
      </select>
    </div>

    {/* Filtre Entrées (+) */}
    <button
      type="button"
      onClick={() => {
        setFiltreSens(filtreSens === "+" ? "tous" : "+");
        setPage(1);
      }}
      aria-pressed={filtreSens === "+"}
      className={`mt-0 inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition xl:mt-6 ${
        filtreSens === "+"
          ? "border-[#8dc78b] bg-[#e8f7e8] text-[#218333] ring-2 ring-[#8dc78b]/20"
          : "border-[#dfe6dc] bg-white text-[#526b32] hover:border-[#a8c39a] hover:bg-[#f4f8ef]"
      }`}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
      Entrées (+)
    </button>

    {/* Filtre Sorties (-) */}
    <button
      type="button"
      onClick={() => {
        setFiltreSens(filtreSens === "-" ? "tous" : "-");
        setPage(1);
      }}
      aria-pressed={filtreSens === "-"}
      className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition xl:mt-6 ${
        filtreSens === "-"
          ? "border-[#f0a3a0] bg-[#ffebeb] text-[#d92d20] ring-2 ring-[#f0a3a0]/20"
          : "border-[#dfe6dc] bg-white text-[#d92d20] hover:border-[#f0b8b5] hover:bg-[#fff5f4]"
      }`}
    >
      <ArrowDown size={18} strokeWidth={2.5} />
      Entrées (−)
    </button>

    {/* Réinitialiser */}
    <button
      type="button"
      onClick={() => {
        setFiltreCode("tous");
        setFiltreSens("tous");
        setPage(1);
      }}
      className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f4f7ef] px-5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1] xl:mt-6"
    >
      <RefreshCw size={17} />
      Réinitialiser
    </button>

  </div>
</section>


        {/* Tableau des rubriques */}
        <section className="overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-[0_5px_22px_rgba(45,62,28,0.045)]">

          <div className="flex flex-col justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-base font-bold text-[#26364a]">
                Liste des rubriques
              </h2>
              <p className="mt-1 text-xs text-[#839080]">
                Consultez et gérez les mouvements associés à chaque rubrique.
              </p>
            </div>

            <button
              type="button"
              onClick={exporterCSV}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#dfe6d9] px-3.5 py-2.5 text-xs font-semibold text-[#526b32] transition hover:bg-[#f4f7ef] sm:self-auto"
            >
              <Download size={15} />
              Exporter
            </button>
          </div>

          <div className="overflow-x-auto px-4 pt-3 sm:px-6">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f1f5ed]">
                  <th className="w-[70px] rounded-l-xl px-4 py-4 text-left text-xs font-bold text-[#334155]">
                    #
                  </th>
                  <th className="w-[190px] px-4 py-4 text-left text-xs font-bold text-[#334155]">
                    Code
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-[#334155]">
                    Libellé
                  </th>
                  <th className="w-[245px] px-4 py-4 text-left text-xs font-bold text-[#334155]">
                    Sens de mouvement
                  </th>
                  <th className="w-[125px] px-3 py-4 text-center text-xs font-bold text-[#334155]">
                    Modifier
                  </th>
                  <th className="w-[125px] rounded-r-xl px-3 py-4 text-center text-xs font-bold text-[#334155]">
                    Supprimer
                  </th>
                </tr>
              </thead>

              <tbody>
                {rubriquesAffichees.map((rubrique, index) => {
                  const entree = rubrique.sensMouvement === "+";

                  return (
                    <tr
                      key={rubrique.id}
                      className="group transition-colors hover:bg-[#f7f9f4]"
                    >
                      <td className="border-b border-[#edf0e9] px-4 py-4 text-sm text-[#526075]">
                        {(pageCourante - 1) * TAILLE_PAGE + index + 1}
                      </td>

                      <td className="border-b border-[#edf0e9] px-4 py-4">
                        <span className="inline-flex rounded-xl bg-[#eaf0e3] px-3.5 py-2 font-mono text-xs font-bold tracking-wide text-[#3c571f]">
                          {rubrique.code}
                        </span>
                      </td>

                      <td className="border-b border-[#edf0e9] px-4 py-4 text-sm font-medium text-[#39465b]">
                        {rubrique.libelle}
                      </td>

                      <td className="border-b border-[#edf0e9] px-4 py-4">
                        <span
                          className={`inline-flex min-w-[155px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                            entree
                              ? "bg-[#e8f7e8] text-[#218333]"
                              : "bg-[#ffebeb] text-[#d92d20]"
                          }`}
                        >
                          {entree ? (
                            <ArrowUp size={19} strokeWidth={3} />
                          ) : (
                            <ArrowDown size={19} strokeWidth={3} />
                          )}
                          {entree ? "Entrée (+)" : "Sortie (−)"}
                        </span>
                      </td>

                      <td className="border-b border-[#edf0e9] px-3 py-3 text-center">
                        <button
                          type="button"
                          title={`Modifier ${rubrique.libelle}`}
                          aria-label={`Modifier ${rubrique.libelle}`}
                          onClick={() => ouvrirEdition(rubrique)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce4f0] bg-[#f0f4fa] text-[#34465f] transition hover:border-[#aabbd5] hover:bg-[#e2eaf6] active:scale-95"
                        >
                          <Pencil size={18} />
                        </button>
                      </td>

                      <td className="border-b border-[#edf0e9] px-3 py-3 text-center">
                        <button
                          type="button"
                          title={`Supprimer ${rubrique.libelle}`}
                          aria-label={`Supprimer ${rubrique.libelle}`}
                          onClick={() => supprimerRubrique(rubrique)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd8d8] bg-[#fff0f0] text-[#e32626] transition hover:border-[#ffaaaa] hover:bg-[#ffe1e1] active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {rubriquesAffichees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f4e9] text-[#637a42]">
                        <Search size={24} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-[#344054]">
                        Aucune rubrique trouvée
                      </p>
                      <p className="mt-1 text-xs text-[#899184]">
                        Essayez de modifier votre recherche ou votre filtre.
                      </p>
                      <button
                        type="button"
                        onClick={actualiser}
                        className="mt-4 text-sm font-semibold text-[#526b32] hover:underline"
                      >
                        Réinitialiser les filtres
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pied du tableau et pagination */}
          <div className="flex flex-col justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <p className="rounded-lg bg-[#f7f9f4] px-3.5 py-2.5 text-sm text-[#526075]">
              Affichage de{" "}
              <span className="font-bold tabular-nums text-[#456020]">
                {debut}
              </span>
              {" à "}
              <span className="font-bold tabular-nums text-[#456020]">
                {fin}
              </span>
              {" sur "}
              <span className="font-bold tabular-nums text-[#456020]">
                {rubriquesFiltrees.length}
              </span>{" "}
              rubrique(s)
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={pageCourante <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Page précédente"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7df] bg-white text-[#68766b] transition hover:bg-[#f1f5ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={19} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  aria-current={pageCourante === p ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                    pageCourante === p
                      ? "bg-[#586f2e] text-white shadow-sm"
                      : "border border-[#e1e7df] bg-white text-[#526b32] hover:bg-[#f1f5ed]"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={pageCourante >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Page suivante"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7df] bg-white text-[#68766b] transition hover:bg-[#f1f5ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Fenêtre d'ajout / modification */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18251a]/40 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOuverte(false);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf0e9] px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#26364a]">
                  {rubriqueEnEdition ? "Modifier la rubrique" : "Ajouter une rubrique"}
                </h2>
                <p className="mt-1 text-xs text-[#839080]">
                  Complétez les informations ci-dessous.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOuverte(false)}
                aria-label="Fermer"
                className="rounded-xl p-2 text-[#68766b] transition hover:bg-[#f1f5ed]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={enregistrerRubrique} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Code
                </label>
                <input
                  required
                  maxLength={30}
                  value={formulaire.code}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, code: e.target.value }))
                  }
                  placeholder="Ex. RUB009"
                  className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Libellé
                </label>
                <input
                  required
                  maxLength={120}
                  value={formulaire.libelle}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, libelle: e.target.value }))
                  }
                  placeholder="Nom de la rubrique"
                  className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#344054]">
                  Sens de mouvement
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <SensOption
                    actif={formulaire.sensMouvement === "+"}
                    sens="+"
                    libelle="Entrée"
                    onClick={() =>
                      setFormulaire((f) => ({ ...f, sensMouvement: "+" }))
                    }
                  />

                  <SensOption
                    actif={formulaire.sensMouvement === "-"}
                    sens="-"
                    libelle="Sortie"
                    onClick={() =>
                      setFormulaire((f) => ({ ...f, sensMouvement: "-" }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#edf0e9] pt-5">
                <button
                  type="button"
                  onClick={() => setModalOuverte(false)}
                  className="rounded-xl border border-[#dfe6dc] px-4 py-2.5 text-sm font-semibold text-[#526075] transition hover:bg-[#f7f9f4]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#586f2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#455a24]"
                >
                  <Plus size={17} />
                  {rubriqueEnEdition ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface SensOptionProps {
  actif: boolean;
  sens: SensMouvement;
  libelle: string;
  onClick: () => void;
}

function SensOption({
  actif,
  sens,
  libelle,
  onClick,
}: SensOptionProps) {
  const entree = sens === "+";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`flex items-center justify-center gap-3 rounded-xl border px-4 py-4 transition ${
        actif
          ? entree
            ? "border-[#8dc78b] bg-[#eaf7e8] text-[#218333] ring-2 ring-[#8dc78b]/20"
            : "border-[#f0a3a0] bg-[#fff0ef] text-[#d92d20] ring-2 ring-[#f0a3a0]/20"
          : "border-[#e1e7df] bg-white text-[#667085] hover:bg-[#f8faf6]"
      }`}
    >
      {entree ? (
        <ArrowUp size={21} strokeWidth={2.7} />
      ) : (
        <ArrowDown size={21} strokeWidth={2.7} />
      )}
      <span className="text-sm font-semibold">
        {libelle} ({entree ? "+" : "−"})
      </span>
    </button>
  );
}
