
import { useMemo, useState, type FormEvent } from "react";

import {
  Tags,
  Plus,
  Download,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
} from "lucide-react";

// Composants réutilisables
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { FormModal } from "@/components/common/FormModal";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";

import TableActionColumns, {
  TableActionHeaders,
} from "@/components/common/TableActionColumns";

import { exportCsv } from "@/utils/exportCsv";

// ============================================================
// TYPES
// ============================================================

type SensMouvement = "+" | "-";

interface Rubrique {
  id: number;
  code: string;
  libelle: string;
  sensMouvement: SensMouvement;
}

interface FormulaireRubrique {
  code: string;
  libelle: string;
  sensMouvement: SensMouvement;
}

// ============================================================
// DONNÉES INITIALES
// ============================================================

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

const FORMULAIRE_INITIAL: FormulaireRubrique = {
  code: "",
  libelle: "",
  sensMouvement: "+",
};

// ============================================================
// PAGE PRINCIPALE
// ============================================================

export default function RubriquesPage() {
  // Données
  const [rubriques, setRubriques] =
    useState<Rubrique[]>(DONNEES_INITIALES);

  // Filtres
  const [filtreCode, setFiltreCode] = useState("tous");
  const [filtreSens, setFiltreSens] = useState<
    "tous" | SensMouvement
  >("tous");

  // Pagination
  const [taillePage, setTaillePage] = useState(10);
  const [page, setPage] = useState(1);

  // Modal
  const [modalOuverte, setModalOuverte] = useState(false);
  const [rubriqueEnEdition, setRubriqueEnEdition] =
    useState<Rubrique | null>(null);

  // Suppression
  const [rubriqueASupprimer, setRubriqueASupprimer] =
    useState<Rubrique | null>(null);

  // Formulaire
  const [formulaire, setFormulaire] =
    useState<FormulaireRubrique>(FORMULAIRE_INITIAL);

  // ==========================================================
  // FILTRAGE
  // ==========================================================

  const rubriquesFiltrees = useMemo(() => {
    return rubriques.filter((rubrique) => {
      const correspondCode =
        filtreCode === "tous" || rubrique.code === filtreCode;

      const correspondSens =
        filtreSens === "tous" ||
        rubrique.sensMouvement === filtreSens;

      return correspondCode && correspondSens;
    });
  }, [rubriques, filtreCode, filtreSens]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(rubriquesFiltrees.length / taillePage)
  );

  const pageCourante = Math.min(page, totalPages);

  const rubriquesAffichees = rubriquesFiltrees.slice(
    (pageCourante - 1) * taillePage,
    pageCourante * taillePage
  );

  // ==========================================================
  // OUVERTURE DU FORMULAIRE
  // ==========================================================

  function ouvrirAjout() {
    setRubriqueEnEdition(null);
    setFormulaire(FORMULAIRE_INITIAL);
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

  function fermerModal() {
    setModalOuverte(false);
    setRubriqueEnEdition(null);
    setFormulaire(FORMULAIRE_INITIAL);
  }

  // ==========================================================
  // ENREGISTREMENT
  // ==========================================================

  function enregistrerRubrique(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const code = formulaire.code.trim().toUpperCase();
    const libelle = formulaire.libelle.trim();

    if (!code || !libelle) return;

    // Vérification de l'unicité du code
    const codeExiste = rubriques.some(
      (rubrique) =>
        rubrique.code.toLowerCase() === code.toLowerCase() &&
        rubrique.id !== rubriqueEnEdition?.id
    );

    if (codeExiste) {
      window.alert("Ce code existe déjà.");
      return;
    }

    if (rubriqueEnEdition) {
      // Modification
      setRubriques((prev) =>
        prev.map((rubrique) =>
          rubrique.id === rubriqueEnEdition.id
            ? {
                ...rubrique,
                code,
                libelle,
                sensMouvement: formulaire.sensMouvement,
              }
            : rubrique
        )
      );
    } else {
      // Ajout
      const nouvelleRubrique: Rubrique = {
        id: Math.max(0, ...rubriques.map((r) => r.id)) + 1,
        code,
        libelle,
        sensMouvement: formulaire.sensMouvement,
      };

      setRubriques((prev) => [...prev, nouvelleRubrique]);
    }

    setPage(1);
    fermerModal();
  }

  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  function supprimerRubrique() {
    if (!rubriqueASupprimer) return;

    setRubriques((prev) =>
      prev.filter((r) => r.id !== rubriqueASupprimer.id)
    );

    setRubriqueASupprimer(null);
    setPage(1);
  }

  // ==========================================================
  // RÉINITIALISATION DES FILTRES
  // ==========================================================

  function actualiser() {
    setFiltreCode("tous");
    setFiltreSens("tous");
    setPage(1);
  }

  // ==========================================================
  // EXPORT CSV
  // ==========================================================

  function exporterCSV() {
    exportCsv({
      data: rubriquesFiltrees,
      columns: [
        {
          header: "Code",
          accessor: (rubrique) => rubrique.code,
        },
        {
          header: "Libellé",
          accessor: (rubrique) => rubrique.libelle,
        },
        {
          header: "Sens de mouvement",
          accessor: (rubrique) => rubrique.sensMouvement,
        },
      ],
      filename: "rubriques.csv",
    });
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <div className="min-h-screen p-4 text-[#243047] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* HEADER */}
        <PageHeader
          title="Rubriques"
          description="Organisez et gérez les rubriques de votre application."
          icon={<Tags size={30} />}
          actions={
            <button
              type="button"
              onClick={ouvrirAjout}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#586f2e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#455a24] active:scale-[0.98]"
            >
              <Plus size={19} />
              Ajouter une rubrique
            </button>
          }
        />

        {/* FILTRES */}
        <section className="rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-[0_3px_15px_rgba(45,62,28,0.03)] sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">

            {/* Filtre par code */}
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
                className="h-[50px] w-full rounded-xl border border-[#dfe6dc] bg-white px-4 text-sm text-[#29364b] outline-none transition hover:border-[#b9c8a8] focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
              >
                <option value="tous">Tous les codes</option>

                {rubriques.map((rubrique) => (
                  <option key={rubrique.id} value={rubrique.code}>
                    {rubrique.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre entrées */}
            <button
              type="button"
              onClick={() => {
                setFiltreSens(filtreSens === "+" ? "tous" : "+");
                setPage(1);
              }}
              aria-pressed={filtreSens === "+"}
              className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                filtreSens === "+"
                  ? "border-[#8dc78b] bg-[#e8f7e8] text-[#218333] ring-2 ring-[#8dc78b]/20"
                  : "border-[#dfe6dc] bg-white text-[#526b32] hover:border-[#a8c39a] hover:bg-[#f4f8ef]"
              }`}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
              Entrées (+)
            </button>

            {/* Filtre sorties */}
            <button
              type="button"
              onClick={() => {
                setFiltreSens(filtreSens === "-" ? "tous" : "-");
                setPage(1);
              }}
              aria-pressed={filtreSens === "-"}
              className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                filtreSens === "-"
                  ? "border-[#f0a3a0] bg-[#ffebeb] text-[#d92d20] ring-2 ring-[#f0a3a0]/20"
                  : "border-[#dfe6dc] bg-white text-[#d92d20] hover:border-[#f0b8b5] hover:bg-[#fff5f4]"
              }`}
            >
              <ArrowDown size={18} strokeWidth={2.5} />
              Sorties (-)
            </button>

            {/* Réinitialiser */}
            <button
              type="button"
              onClick={actualiser}
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f4f7ef] px-5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
            >
              <RefreshCw size={17} />
              Réinitialiser
            </button>
          </div>
        </section>

        {/* TABLEAU */}
        <section className="overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-[0_5px_22px_rgba(45,62,28,0.045)]">

          {/* EN-TÊTE DU TABLEAU */}
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

          {/* CONTENU DU TABLEAU */}
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

                  <TableActionHeaders />
                </tr>
              </thead>

              <tbody>
                {rubriquesAffichees.map((rubrique, index) => (
                  <tr
                    key={rubrique.id}
                    className="group transition-colors hover:bg-[#f7f9f4]"
                  >
                    <td className="border-b border-[#edf0e9] px-4 py-4 text-sm text-[#526075]">
                      {(pageCourante - 1) * taillePage + index + 1}
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
                      <MovementBadge sens={rubrique.sensMouvement} />
                    </td>

                    {/* ACTIONS RÉUTILISABLES */}
                    <TableActionColumns
                      onEdit={() => ouvrirEdition(rubrique)}
                      onDelete={() => setRubriqueASupprimer(rubrique)}
                      editLabel={`Modifier}`}
                      deleteLabel={`Supprimer`}
                    />
                  </tr>
                ))}

                {/* ÉTAT VIDE */}
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
                        Essayez de modifier vos filtres.
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

          {/* PAGINATION */}
          <div className="border-t border-[#edf0e9] px-5 py-4 sm:px-6">
            <Pagination
              currentPage={pageCourante}
              totalPages={totalPages}
              totalItems={rubriquesFiltrees.length}
              pageSize={taillePage}
              itemLabel="rubrique(s)"
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setTaillePage(newSize);
                setPage(1);
              }}
            />
          </div>
        </section>
      </div>

      {/* MODAL AJOUT / MODIFICATION */}
      <FormModal
        open={modalOuverte}
        title={
          rubriqueEnEdition
            ? "Modifier la rubrique"
            : "Ajouter une rubrique"
        }
        description="Complétez les informations ci-dessous."
        onClose={fermerModal}
      >
        <form
          onSubmit={enregistrerRubrique}
          className="space-y-5 p-6"
        >
          {/* CODE */}
          <div>
            <label
              htmlFor="rubrique-code"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Code
            </label>

            <input
              id="rubrique-code"
              required
              maxLength={30}
              value={formulaire.code}
              onChange={(e) =>
                setFormulaire((f) => ({
                  ...f,
                  code: e.target.value,
                }))
              }
              placeholder="Ex. RUB009"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>

          {/* LIBELLÉ */}
          <div>
            <label
              htmlFor="rubrique-libelle"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Libellé
            </label>

            <input
              id="rubrique-libelle"
              required
              maxLength={120}
              value={formulaire.libelle}
              onChange={(e) =>
                setFormulaire((f) => ({
                  ...f,
                  libelle: e.target.value,
                }))
              }
              placeholder="Nom de la rubrique"
              className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
            />
          </div>

          {/* SENS DE MOUVEMENT */}
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
                  setFormulaire((f) => ({
                    ...f,
                    sensMouvement: "+",
                  }))
                }
              />

              <SensOption
                actif={formulaire.sensMouvement === "-"}
                sens="-"
                libelle="Sortie"
                onClick={() =>
                  setFormulaire((f) => ({
                    ...f,
                    sensMouvement: "-",
                  }))
                }
              />
            </div>
          </div>

          {/* ACTIONS DU FORMULAIRE */}
          <div className="flex justify-end gap-3 border-t border-[#edf0e9] pt-5">
            <button
              type="button"
              onClick={fermerModal}
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
      </FormModal>

      {/* CONFIRMATION DE SUPPRESSION */}
      <ConfirmDeleteDialog
        open={!!rubriqueASupprimer}
        title="Supprimer la rubrique ?"
        itemName={rubriqueASupprimer?.libelle ?? ""}
        description="Cette action est irréversible."
        onCancel={() => setRubriqueASupprimer(null)}
        onConfirm={supprimerRubrique}
      />
    </div>
  );
}

// ============================================================
// COMPOSANT SPÉCIFIQUE : BADGE DU SENS DE MOUVEMENT
// ============================================================

interface MovementBadgeProps {
  sens: SensMouvement;
}

function MovementBadge({ sens }: MovementBadgeProps) {
  const entree = sens === "+";

  return (
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

      {entree ? "Entrée (+)" : "Sortie (-)"}
    </span>
  );
}

// ============================================================
// COMPOSANT SPÉCIFIQUE : OPTION DU SENS DE MOUVEMENT
// ============================================================

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
        {libelle} ({entree ? "+" : "-"})
      </span>
    </button>
  );
}
