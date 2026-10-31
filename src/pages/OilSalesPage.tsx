
import { useMemo, useState, type FormEvent } from "react";
import { ShoppingCart, Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import type {
  VenteFormData,
  VenteHuile,
} from "./oil-sales/oil-sales.types";

import { OilSaleForm } from "./oil-sales/OilSaleForm";
import { OilSalesTable } from "./oil-sales/OilSalesTable";
import { OilSalesFilters } from "./oil-sales/OilSalesFilters";
import { Button } from "@/components/ui/button";

/* ============================================================
   DONNÉES INITIALES
============================================================ */

const VENTES_INITIALES: VenteHuile[] = [
  { id: 1, compte: "CPT001", telephone: "06 12 34 56 78", quantite: 120, prixLitre: 35 },
  { id: 2, compte: "CPT002", telephone: "06 98 76 54 32", quantite: 50, prixLitre: 36 },
  { id: 3, compte: "CPT003", telephone: "06 55 66 77 88", quantite: 200, prixLitre: 34.5 },
  { id: 4, compte: "CPT004", telephone: "06 11 22 33 44", quantite: 75, prixLitre: 35.5 },
  { id: 5, compte: "CPT005", telephone: "06 44 55 66 77", quantite: 100, prixLitre: 36 },
  { id: 6, compte: "CPT006", telephone: "06 88 77 66 55", quantite: 30, prixLitre: 37 },
  { id: 7, compte: "CPT007", telephone: "06 21 43 65 87", quantite: 150, prixLitre: 34 },
  { id: 8, compte: "CPT008", telephone: "06 19 28 37 46", quantite: 60, prixLitre: 35 },
];

/* ============================================================
   FORMULAIRE INITIAL
============================================================ */

const FORMULAIRE_INITIAL: VenteFormData = {
  compte: "",
  telephone: "",
  quantite: "",
  prixLitre: "",
};

/* ============================================================
   PAGE VENTE HUILE
============================================================ */

export default function OilSalesPage() {
  /* ==========================================================
     ÉTATS
  ========================================================== */

  const [ventes, setVentes] = useState<VenteHuile[]>(VENTES_INITIALES);

  const [filtreCompte, setFiltreCompte] = useState("tous");
  const [filtreTelephone, setFiltreTelephone] = useState("tous");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [modalOuverte, setModalOuverte] = useState(false);

  const [venteEnEdition, setVenteEnEdition] =
    useState<VenteHuile | null>(null);

  const [venteASupprimer, setVenteASupprimer] =
    useState<VenteHuile | null>(null);

  const [formulaire, setFormulaire] =
    useState<VenteFormData>(FORMULAIRE_INITIAL);

  /* ============================================================
     OPTIONS DES FILTRES
  ============================================================ */

  const comptes = useMemo(
    () => [...new Set(ventes.map((vente) => vente.compte))].sort(),
    [ventes]
  );

  const telephones = useMemo(
    () => [...new Set(ventes.map((vente) => vente.telephone))].sort(),
    [ventes]
  );

  /* ============================================================
     FILTRAGE
  ============================================================ */

  const ventesFiltrees = useMemo(
    () =>
      ventes.filter(
        (vente) =>
          (filtreCompte === "tous" || vente.compte === filtreCompte) &&
          (filtreTelephone === "tous" ||
            vente.telephone === filtreTelephone)
      ),
    [ventes, filtreCompte, filtreTelephone]
  );

  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalItems = ventesFiltrees.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const pageCourante = Math.min(page, totalPages);

  const ventesAffichees = useMemo(
    () =>
      ventesFiltrees.slice(
        (pageCourante - 1) * pageSize,
        pageCourante * pageSize
      ),
    [ventesFiltrees, pageCourante, pageSize]
  );

  function changerTaillePage(size: number) {
    setPageSize(size);
    setPage(1);
  }

  /* ============================================================
     OUVRIR LE FORMULAIRE
  ============================================================ */

  function ouvrirAjout() {
    setVenteEnEdition(null);
    setFormulaire(FORMULAIRE_INITIAL);
    setModalOuverte(true);
  }

  function ouvrirModification(vente: VenteHuile) {
    setVenteEnEdition(vente);

    setFormulaire({
      compte: vente.compte,
      telephone: vente.telephone,
      quantite: String(vente.quantite),
      prixLitre: String(vente.prixLitre),
    });

    setModalOuverte(true);
  }

  function fermerFormulaire() {
    setModalOuverte(false);
    setVenteEnEdition(null);
    setFormulaire(FORMULAIRE_INITIAL);
  }

  /* ============================================================
     ENREGISTRER UNE VENTE
  ============================================================ */

  function enregistrerVente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const compte = formulaire.compte.trim();
    const telephone = formulaire.telephone.trim();
    const quantite = Number(formulaire.quantite);
    const prixLitre = Number(formulaire.prixLitre);

    if (
      !compte ||
      !telephone ||
      !Number.isFinite(quantite) ||
      !Number.isFinite(prixLitre) ||
      quantite <= 0 ||
      prixLitre <= 0
    ) {
      window.alert("Veuillez saisir des informations valides.");
      return;
    }

    if (venteEnEdition) {
      setVentes((previous) =>
        previous.map((vente) =>
          vente.id === venteEnEdition.id
            ? { ...vente, compte, telephone, quantite, prixLitre }
            : vente
        )
      );
    } else {
      setVentes((previous) => {
        const nouvelId =
          Math.max(0, ...previous.map((vente) => vente.id)) + 1;

        const nouvelleVente: VenteHuile = {
          id: nouvelId,
          compte,
          telephone,
          quantite,
          prixLitre,
        };

        return [...previous, nouvelleVente];
      });
    }

    setPage(1);
    fermerFormulaire();
  }

  /* ============================================================
     SUPPRESSION
  ============================================================ */

  function demanderSuppression(vente: VenteHuile) {
    setVenteASupprimer(vente);
  }

  function confirmerSuppression() {
    if (!venteASupprimer) return;

    setVentes((previous) =>
      previous.filter((vente) => vente.id !== venteASupprimer.id)
    );

    setVenteASupprimer(null);
    setPage(1);
  }

  /* ============================================================
     RÉINITIALISER LES FILTRES
  ============================================================ */

  function reinitialiserFiltres() {
    setFiltreCompte("tous");
    setFiltreTelephone("tous");
    setPage(1);
  }

  /* ============================================================
     EXPORT CSV
  ============================================================ */

  function exporterCSV() {
    const lignes = [
      [
        "N° compte",
        "Téléphone",
        "Quantité huile (L)",
        "Prix litre (DT)",
        "Total (DT)",
      ],
      ...ventesFiltrees.map((vente) => [
        vente.compte,
        vente.telephone,
        String(vente.quantite),
        String(vente.prixLitre),
        String(vente.quantite * vente.prixLitre),
      ]),
    ];

    const contenu =
      "\uFEFF" +
      lignes
        .map((ligne) =>
          ligne
            .map((cellule) => `"${cellule.replace(/"/g, '""')}"`)
            .join(";")
        )
        .join("\r\n");

    const blob = new Blob([contenu], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = "ventes-huile.csv";
    lien.click();

    URL.revokeObjectURL(url);
  }

  /* ============================================================
     AFFICHAGE
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#f5f7f2] p-4 text-[#243047] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* EN-TÊTE */}

        <PageHeader
  title="Vente huile"
  description="Gérez les ventes d'huile et consultez vos enregistrements."
  icon={<ShoppingCart size={30} />}
  actions={
    <Button
      type="button"
      onClick={ouvrirAjout}
      className="h-11 shrink-0 gap-2 rounded-xl bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27]"
    >
      <Plus className="size-4" />
      Ajouter une vente
    </Button>
  }
/>
        {/* FILTRES */}

        <OilSalesFilters
          comptes={comptes}
          telephones={telephones}
          filtreCompte={filtreCompte}
          filtreTelephone={filtreTelephone}
          onCompteChange={(value) => {
            setFiltreCompte(value);
            setPage(1);
          }}
          onTelephoneChange={(value) => {
            setFiltreTelephone(value);
            setPage(1);
          }}
          onReset={reinitialiserFiltres}
        />

        {/* TABLEAU */}

        <OilSalesTable
          ventes={ventesAffichees}
          currentPage={pageCourante}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={changerTaillePage}
          onEdit={ouvrirModification}
          onDelete={demanderSuppression}
          onExport={exporterCSV}
        />

        {/* FORMULAIRE */}

        <OilSaleForm
          open={modalOuverte}
          isEditing={Boolean(venteEnEdition)}
          form={formulaire}
          onChange={setFormulaire}
          onClose={fermerFormulaire}
          onSubmit={enregistrerVente}
        />

        {/* CONFIRMATION DE SUPPRESSION */}

        <ConfirmDialog
          open={Boolean(venteASupprimer)}
          title="Supprimer cette vente ?"
          message="Voulez-vous vraiment supprimer la vente du compte suivant ?"
          itemName={venteASupprimer?.compte}
          onConfirm={confirmerSuppression}
          onCancel={() => setVenteASupprimer(null)}
        />
      </div>
    </div>
  );
}
