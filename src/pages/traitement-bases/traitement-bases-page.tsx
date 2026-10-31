import { useMemo, useState } from "react";
import {
  Building2,
  Filter,
} from "lucide-react";



import OilReceptionFilters from "@/components/traitement-bases/OilReceptionFilters";
import { Compte } from "@/components/traitement-bases/AccountMultiSelect";
import ReceptionTable, { BonReception } from "@/components/traitement-bases/ReceptionTable";
import ReceptionIndicators from "@/components/traitement-bases/ReceptionIndicators";
import SelectedAccounts from "@/components/traitement-bases/SelectedAccounts";
import BonDetailsModal from "@/components/traitement-bases/BonDetailsModal";

// --------------------------------------------------
// DONNÉES INITIALES
// --------------------------------------------------

const COMPTES: Compte[] = [
  {
    id: 1,
    nom: "Coopérative de Sousse",
    telephone: "+216 73 210 456",
    numero: "CPT-001",
    type: "Fournisseur",
  },
  {
    id: 2,
    nom: "Société El Oliva",
    telephone: "+216 98 123 456",
    numero: "CPT-002",
    type: "Client",
  },
  {
    id: 3,
    nom: "Agriplus",
    telephone: "+216 55 678 912",
    numero: "CPT-003",
    type: "Fournisseur",
  },
  {
    id: 4,
    nom: "Mohamed Ben Salem",
    telephone: "+216 22 345 678",
    numero: "CPT-004",
    type: "Client",
  },
  {
    id: 5,
    nom: "Med Oil",
    telephone: "+216 71 987 654",
    numero: "CPT-005",
    type: "Client",
  },
  {
    id: 6,
    nom: "Coopérative Mahdia",
    telephone: "+216 29 111 222",
    numero: "CPT-006",
    type: "Fournisseur",
  },
  {
    id: 7,
    nom: "Karim Trabelsi",
    telephone: "+216 50 333 444",
    numero: "CPT-007",
    type: "Client",
  },
  {
    id: 8,
    nom: "Export Olive SARL",
    telephone: "+216 28 765 432",
    numero: "CPT-008",
    type: "Fournisseur",
  },
];

const BONS_INITIAUX: BonReception[] = [
  {
    id: 1,
    reference: "BR-001",
    compteId: 1,
    date: "2024-10-12",
    typeHuile: "Huile d'olive",
    quantiteOlives: 1250,
    quantiteHuile: 250,
    montant: 1500,
    montantPaye: 1200,
    resteAPayer: 300,
    statut: "Traité",
  },
  {
    id: 2,
    reference: "BR-002",
    compteId: 2,
    date: "2024-10-15",
    typeHuile: "Huile vierge extra",
    quantiteOlives: 980,
    quantiteHuile: 210,
    montant: 1230,
    montantPaye: 800,
    resteAPayer: 430,
    statut: "En cours",
  },
  {
    id: 3,
    reference: "BR-003",
    compteId: 3,
    date: "2024-10-18",
    typeHuile: "Huile d'olive",
    quantiteOlives: 1500,
    quantiteHuile: 310,
    montant: 1860,
    montantPaye: 1000,
    resteAPayer: 860,
    statut: "En attente",
  },
  {
    id: 4,
    reference: "BR-004",
    compteId: 4,
    date: "2024-10-20",
    typeHuile: "Huile vierge",
    quantiteOlives: 850,
    quantiteHuile: 170,
    montant: 1020,
    montantPaye: 1020,
    resteAPayer: 0,
    statut: "Traité",
  },
  {
    id: 5,
    reference: "BR-005",
    compteId: 6,
    date: "2024-10-22",
    typeHuile: "Huile d'olive",
    quantiteOlives: 1100,
    quantiteHuile: 225,
    montant: 1350,
    montantPaye: 700,
    resteAPayer: 650,
    statut: "En cours",
  },
];

// --------------------------------------------------
// FONCTIONS DE FORMATAGE
// --------------------------------------------------

function formatNumber(value: number) {
  return value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  });
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR");
}

function formatMoney(value: number) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// --------------------------------------------------
// COMPOSANT PRINCIPAL
// --------------------------------------------------

export default function TraitementBasesPage() {
  // Données
  const [bons] = useState<BonReception[]>(BONS_INITIAUX);

  // Filtres
  const [typeHuile, setTypeHuile] = useState("");
  const [comptesSelectionnes, setComptesSelectionnes] = useState<number[]>([]);

  // Recherche
  const [rechercheLancee, setRechercheLancee] = useState(false);
  const [messageErreur, setMessageErreur] = useState("");

  // Tableau
  const [rechercheTableau, setRechercheTableau] = useState("");
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(5);

  // Détails
  const [detailsBon, setDetailsBon] = useState<BonReception | null>(null);

  // --------------------------------------------------
  // COMPTES SÉLECTIONNÉS
  // --------------------------------------------------

  const comptesChoisis = useMemo(
    () =>
      COMPTES.filter((compte) =>
        comptesSelectionnes.includes(compte.id)
      ),
    [comptesSelectionnes]
  );

  // --------------------------------------------------
  // FILTRAGE DES BONS
  // --------------------------------------------------

  const bonsFiltres = useMemo(() => {
    if (
      !rechercheLancee ||
      !typeHuile ||
      comptesSelectionnes.length === 0
    ) {
      return [];
    }

    const q = rechercheTableau.trim().toLowerCase();

    return bons.filter((bon) => {
      const compte = COMPTES.find(
        (item) => item.id === bon.compteId
      );

      const texte = [
        bon.reference,
        bon.typeHuile,
        bon.statut,
        bon.date,
        compte?.nom ?? "",
        compte?.numero ?? "",
        compte?.telephone ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        bon.typeHuile === typeHuile &&
        comptesSelectionnes.includes(bon.compteId) &&
        (!q || texte.includes(q))
      );
    });
  }, [
    bons,
    rechercheLancee,
    typeHuile,
    comptesSelectionnes,
    rechercheTableau,
  ]);

  // --------------------------------------------------
  // INDICATEURS
  // --------------------------------------------------

  const indicateurs = useMemo(
    () =>
      bonsFiltres.reduce(
        (acc, bon) => ({
          quantiteOlives:
            acc.quantiteOlives + bon.quantiteOlives,
          quantiteHuile:
            acc.quantiteHuile + bon.quantiteHuile,
          montantTotal: acc.montantTotal + bon.montant,
          montantPaye: acc.montantPaye + bon.montantPaye,
          resteAPayer: acc.resteAPayer + bon.resteAPayer,
        }),
        {
          quantiteOlives: 0,
          quantiteHuile: 0,
          montantTotal: 0,
          montantPaye: 0,
          resteAPayer: 0,
        }
      ),
    [bonsFiltres]
  );

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const nombrePages = Math.max(
    1,
    Math.ceil(bonsFiltres.length / taillePage)
  );

  const pageActuelle = Math.min(page, nombrePages);

  const bonsAffiches = useMemo(() => {
    const debut = (pageActuelle - 1) * taillePage;

    return bonsFiltres.slice(debut, debut + taillePage);
  }, [bonsFiltres, pageActuelle, taillePage]);

  // --------------------------------------------------
  // MODIFICATION DES FILTRES
  // --------------------------------------------------

  function modifierCritere() {
    setRechercheLancee(false);
    setMessageErreur("");
    setPage(1);
  }

  // --------------------------------------------------
  // LANCER LA RECHERCHE
  // --------------------------------------------------

  function appliquerRecherche() {
    if (!typeHuile) {
      setRechercheLancee(false);
      setMessageErreur(
        "Veuillez sélectionner un type d’huile."
      );
      return;
    }

    if (comptesSelectionnes.length === 0) {
      setRechercheLancee(false);
      setMessageErreur(
        "Veuillez sélectionner au moins un compte."
      );
      return;
    }

    setMessageErreur("");
    setRechercheLancee(true);
    setPage(1);
  }

  // --------------------------------------------------
  // RÉINITIALISER LES FILTRES
  // --------------------------------------------------

  function reinitialiser() {
    setTypeHuile("");
    setComptesSelectionnes([]);
    setRechercheTableau("");
    setRechercheLancee(false);
    setMessageErreur("");
    setPage(1);
    setTaillePage(5);
  }

  // --------------------------------------------------
  // EXPORT CSV
  // --------------------------------------------------

  function exporterCSV() {
    if (!bonsFiltres.length) return;

    const entetes = [
      "Référence",
      "Nom du compte",
      "Téléphone",
      "Numéro de compte",
      "Date de réception",
      "Type d'huile",
      "Quantité d'olives (kg)",
      "Quantité d'huile (kg)",
      "Montant (DT)",
      "Montant payé (DT)",
      "Reste à payer (DT)",
      "Statut",
    ];

    const lignes = bonsFiltres.map((bon) => {
      const compte = COMPTES.find(
        (item) => item.id === bon.compteId
      );

      return [
        bon.reference,
        compte?.nom ?? "",
        compte?.telephone ?? "",
        compte?.numero ?? "",
        formatDate(bon.date),
        bon.typeHuile,
        bon.quantiteOlives,
        bon.quantiteHuile,
        bon.montant.toFixed(2),
        bon.montantPaye.toFixed(2),
        bon.resteAPayer.toFixed(2),
        bon.statut,
      ];
    });

    const contenu = [entetes, ...lignes]
      .map((ligne) =>
        ligne
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(";")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + contenu], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = "bons-reception-traitement.csv";

    document.body.appendChild(lien);
    lien.click();
    lien.remove();

    URL.revokeObjectURL(url);
  }

  // --------------------------------------------------
  // ACTUALISER LE TABLEAU
  // --------------------------------------------------

  function actualiser() {
    setPage(1);
  }

  // --------------------------------------------------
  // RÉINITIALISER LE TABLEAU
  // --------------------------------------------------

  function reinitialiserTableau() {
    setRechercheTableau("");
    setTaillePage(5);
    setPage(1);
  }

  // --------------------------------------------------
  // RENDU
  // --------------------------------------------------

  return (
    <div className="min-h-full p-3 text-[#243247] sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">

        {/* EN-TÊTE */}
        <header className="relative overflow-hidden rounded-xl border border-[#e4e9dd] bg-gradient-to-r from-white via-[#fbfcf8] to-[#eff4e6] px-5 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="pointer-events-none absolute -right-5 -top-10 size-40 rounded-full border border-[#e3ead8]" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#839a4b] to-[#536b2d] text-white shadow-md">
                <Building2 size={25} strokeWidth={1.8} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#142e43] sm:text-2xl">
                  Traitement de base
                </h1>

                <p className="mt-1 text-xs leading-5 text-[#687b90] sm:text-sm">
                  Sélectionnez un type d’huile et un ou plusieurs comptes
                  pour consulter les bons de réception.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce6d1] bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#33452a]">
              <span className="size-1.5 rounded-full bg-[#63823d]" />
              Gestion de production
            </span>
          </div>
        </header>

        {/* FILTRES */}
        <OilReceptionFilters
          comptes={COMPTES}
          typeHuile={typeHuile}
          selectedAccountIds={comptesSelectionnes}
          error={messageErreur}
          onTypeChange={setTypeHuile}
          onAccountsChange={setComptesSelectionnes}
          onSearch={appliquerRecherche}
          onReset={reinitialiser}
          onCriteriaChange={modifierCritere}
        />

        {/* INDICATEURS */}
        <ReceptionIndicators
          totals={indicateurs}
          formatNumber={formatNumber}
          formatMoney={formatMoney}
          searchLaunched={rechercheLancee}
          resultCount={bonsFiltres.length}
        />

        {/* COMPTES SÉLECTIONNÉS */}
        <SelectedAccounts comptes={comptesChoisis} />

        {/* TABLEAU DES BONS */}
        <ReceptionTable
          bons={bonsAffiches}
          comptes={COMPTES}
          searchLaunched={rechercheLancee}
          searchTable={rechercheTableau}
          page={pageActuelle}
          pageSize={taillePage}
          totalPages={nombrePages}
          totalItems={bonsFiltres.length}
          onSearchTableChange={(value) => {
            setRechercheTableau(value);
            setPage(1);
          }}
          onExport={exporterCSV}
          onRefresh={actualiser}
          onResetTable={reinitialiserTableau}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setTaillePage(size);
            setPage(1);
          }}
          onDetails={setDetailsBon}
          formatNumber={formatNumber}
          formatMoney={formatMoney}
          formatDate={formatDate}
        />

        {/* DÉTAILS DU BON */}
        <BonDetailsModal
          bon={detailsBon}
          comptes={COMPTES}
          onClose={() => setDetailsBon(null)}
          formatDate={formatDate}
          formatNumber={formatNumber}
          formatMoney={formatMoney}
        />
      </div>
    </div>
  );
}