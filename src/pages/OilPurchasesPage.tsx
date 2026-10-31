
import { useMemo, useState } from 'react';

import {
  Droplet,
  FileText,
  Phone,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { FilterSelect } from '@/components/common/FilterSelect';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { exportToCsv } from '@/components/common/exportToCsv';

import { OilPurchaseTable } from '@/components/oil-purchases/OilPurchaseTable';
import { OilPurchaseFormModal } from '@/components/oil-purchases/OilPurchaseFormModal';

import type {
  AchatHuile,
  AchatHuileForm,
} from '@/components/oil-purchases/oil-purchase.types';

/* ============================================================
   DONNÉES INITIALES DE TEST
============================================================ */

const ACHATS_INITIAUX: AchatHuile[] = [
  { id: 1, compte: 'CPT001', telephone: '06 12 34 56 78', quantite: 120, prixLitre: 34 },
  { id: 2, compte: 'CPT002', telephone: '06 98 76 54 32', quantite: 50, prixLitre: 35.5 },
  { id: 3, compte: 'CPT003', telephone: '06 55 66 77 88', quantite: 200, prixLitre: 33 },
  { id: 4, compte: 'CPT004', telephone: '06 11 22 33 44', quantite: 75, prixLitre: 34.5 },
  { id: 5, compte: 'CPT005', telephone: '06 44 55 66 77', quantite: 100, prixLitre: 35 },
  { id: 6, compte: 'CPT006', telephone: '06 88 77 66 55', quantite: 30, prixLitre: 36.5 },
  { id: 7, compte: 'CPT007', telephone: '06 21 43 65 87', quantite: 150, prixLitre: 34 },
  { id: 8, compte: 'CPT008', telephone: '06 19 28 37 46', quantite: 60, prixLitre: 35.5 },
];

/* ============================================================
   PAGE ACHATS D'HUILE
============================================================ */

export default function OilPurchasesPage() {
  /* ==========================================================
     ÉTATS
  ========================================================== */

  const [achats, setAchats] = useState<AchatHuile[]>(ACHATS_INITIAUX);

  const [filtreCompte, setFiltreCompte] = useState('tous');
  const [filtreTelephone, setFiltreTelephone] = useState('tous');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [modalOuverte, setModalOuverte] = useState(false);
  const [achatEnEdition, setAchatEnEdition] = useState<AchatHuile | null>(null);
  const [achatASupprimer, setAchatASupprimer] = useState<AchatHuile | null>(null);

  /* ==========================================================
     OPTIONS DES FILTRES
  ========================================================== */

  const comptes = useMemo(
    () => [...new Set(achats.map((achat) => achat.compte))].sort(),
    [achats],
  );

  const telephones = useMemo(
    () => [...new Set(achats.map((achat) => achat.telephone))].sort(),
    [achats],
  );

  /* ==========================================================
     FILTRAGE
  ========================================================== */

  const achatsFiltres = useMemo(
    () =>
      achats.filter(
        (achat) =>
          (filtreCompte === 'tous' || achat.compte === filtreCompte) &&
          (filtreTelephone === 'tous' || achat.telephone === filtreTelephone),
      ),
    [achats, filtreCompte, filtreTelephone],
  );

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalItems = achatsFiltres.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  );

  const pageCourante = Math.min(page, totalPages);

  const achatsAffiches = useMemo(
    () =>
      achatsFiltres.slice(
        (pageCourante - 1) * pageSize,
        pageCourante * pageSize,
      ),
    [achatsFiltres, pageCourante, pageSize],
  );

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  /* ==========================================================
     OUVRIR LE FORMULAIRE
  ========================================================== */

  const ouvrirAjout = () => {
    setAchatEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModification = (achat: AchatHuile) => {
    setAchatEnEdition(achat);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setAchatEnEdition(null);
  };

  /* ==========================================================
     AJOUTER / MODIFIER
  ========================================================== */

  const enregistrerAchat = (data: AchatHuileForm) => {
    const nouvelAchatData = {
      compte: data.compte.trim(),
      telephone: data.telephone.trim(),
      quantite: Number(data.quantite),
      prixLitre: Number(data.prixLitre),
    };

    if (achatEnEdition) {
      setAchats((previous) =>
        previous.map((achat) =>
          achat.id === achatEnEdition.id
            ? { ...achat, ...nouvelAchatData }
            : achat,
        ),
      );
    } else {
      setAchats((previous) => {
        const nouvelId =
          Math.max(0, ...previous.map((achat) => achat.id)) + 1;

        return [
          ...previous,
          {
            id: nouvelId,
            ...nouvelAchatData,
          },
        ];
      });
    }

    setPage(1);
    fermerModal();
  };

  /* ==========================================================
     SUPPRIMER
  ========================================================== */

  const ouvrirConfirmationSuppression = (achat: AchatHuile) => {
    setAchatASupprimer(achat);
  };

  const confirmerSuppression = () => {
    if (!achatASupprimer) return;

    setAchats((previous) =>
      previous.filter((achat) => achat.id !== achatASupprimer.id),
    );

    setAchatASupprimer(null);
    setPage(1);
  };

  /* ==========================================================
     RÉINITIALISER LES FILTRES
  ========================================================== */

  const reinitialiserFiltres = () => {
    setFiltreCompte('tous');
    setFiltreTelephone('tous');
    setPage(1);
  };

  /* ==========================================================
     EXPORT CSV
  ========================================================== */

  const exporterCSV = () => {
    exportToCsv({
      filename: 'achats-huile.csv',
      data: achatsFiltres,
      columns: [
        {
          label: 'N° compte',
          value: (achat) => achat.compte,
        },
        {
          label: 'Téléphone',
          value: (achat) => achat.telephone,
        },
        {
          label: 'Quantité huile (L)',
          value: (achat) => achat.quantite,
        },
        {
          label: 'Prix litre (DT)',
          value: (achat) => achat.prixLitre,
        },
        {
          label: 'Total (DT)',
          value: (achat) => achat.quantite * achat.prixLitre,
        },
      ],
    });
  };

  /* ============================================================
     AFFICHAGE
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#f5f7f2] p-4 text-[#243047] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">

        {/* EN-TÊTE */}

        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e8ede1] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-7">
          <div className="flex items-center gap-5">
            <div className="flex size-[60px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#78934a] to-[#526b2e] text-white shadow-md">
              <Droplet size={29} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#18351b]">
                Achat d'huile
              </h1>

              <p className="mt-1 text-sm text-[#68766b]">
                Gérez les achats d'huile et consultez vos enregistrements.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={ouvrirAjout}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#586f2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#455a24]"
          >
            <Plus size={18} />
            Ajouter un achat
          </button>
        </header>

        {/* FILTRES */}

        <section className="rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#526b32]">
              <RefreshCw size={19} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#26364a]">
                Filtres des achats
              </h2>

              <p className="text-xs text-[#839080]">
                Filtrez la liste selon le compte et le téléphone.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[1fr_1fr_auto]">
            <FilterSelect
              id="achat-filtre-compte"
              label="Compte"
              value={filtreCompte}
              options={comptes}
              placeholder="Tous les comptes"
              icon={FileText}
              onChange={(value) => {
                setFiltreCompte(value);
                setPage(1);
              }}
            />

            <FilterSelect
              id="achat-filtre-telephone"
              label="Téléphone"
              value={filtreTelephone}
              options={telephones}
              placeholder="Tous les numéros"
              icon={Phone}
              onChange={(value) => {
                setFiltreTelephone(value);
                setPage(1);
              }}
            />

            <button
              type="button"
              onClick={reinitialiserFiltres}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f4f7ef] px-5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
            >
              <RefreshCw size={16} />
              Réinitialiser
            </button>
          </div>
        </section>

        {/* TABLEAU */}

        <OilPurchaseTable
          achats={achatsAffiches}
          currentPage={pageCourante}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          onEdit={ouvrirModification}
          onDelete={ouvrirConfirmationSuppression}
          onExport={exporterCSV}
        />
      </div>

      {/* MODALE AJOUT / MODIFICATION */}

      <OilPurchaseFormModal
        open={modalOuverte}
        achat={achatEnEdition}
        onClose={fermerModal}
        onSubmit={enregistrerAchat}
      />

      {/* CONFIRMATION DE SUPPRESSION */}

      <ConfirmDialog
        open={Boolean(achatASupprimer)}
        title="Supprimer cet achat ?"
        message="Voulez-vous vraiment supprimer l'achat du compte suivant ?"
        itemName={achatASupprimer?.compte}
        onConfirm={confirmerSuppression}
        onCancel={() => setAchatASupprimer(null)}
      />
    </div>
  );
}
