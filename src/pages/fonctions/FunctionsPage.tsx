
import { useMemo, useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';

import {
  Wrench,
  Plus,
  Download,
  RotateCcw,
  ChevronsUpDown,
  Users,
  Check,
} from 'lucide-react';

import {
  Modal,
  ConfirmDialog,
  Notification,
} from '../../components/common/ReusableComponents';

import { PageHeader } from '@/components/common/PageHeader';
import SortSelect from '@/components/common/SortSelect';
import TableActions from '@/components/common/TableActions';
import FormField from '@/components/common/FormField';

import FunctionTable from './FunctionTable';
import type { Fonction } from './FunctionTable';
import { Pagination } from '@/components/common/Pagination';

const FONCTIONS_INITIALES: Fonction[] = [
  { id: 1, code: 'FON-001', libelle: 'Administrateur', nombrePersonnels: 1 },
  { id: 2, code: 'FON-002', libelle: 'Responsable', nombrePersonnels: 3 },
  { id: 3, code: 'FON-003', libelle: 'Employé', nombrePersonnels: 8 },
  { id: 4, code: 'FON-004', libelle: 'Consultant', nombrePersonnels: 1 },
  { id: 5, code: 'FON-005', libelle: 'Gestionnaire', nombrePersonnels: 4 },
  { id: 6, code: 'FON-006', libelle: 'Technicien', nombrePersonnels: 5 },
  { id: 7, code: 'FON-007', libelle: 'Comptable', nombrePersonnels: 2 },
  { id: 8, code: 'FON-008', libelle: 'Secrétaire', nombrePersonnels: 2 },
  { id: 9, code: 'FON-009', libelle: 'Magasinier', nombrePersonnels: 3 },
  { id: 10, code: 'FON-010', libelle: 'Agent de production', nombrePersonnels: 6 },
  { id: 11, code: 'FON-011', libelle: 'Contrôleur qualité', nombrePersonnels: 2 },
  { id: 12, code: 'FON-012', libelle: 'Agent de maintenance', nombrePersonnels: 3 },
];

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export default function FunctionsPage() {
  const [fonctions, setFonctions] = useState<Fonction[]>(
    FONCTIONS_INITIALES,
  );

  // Pagination réutilisable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Tri
  const [tri, setTri] = useState('code');
  const [ordreCroissant, setOrdreCroissant] = useState(true);

  // Modales
  const [modalOuvert, setModalOuvert] = useState(false);
  const [fonctionEnEdition, setFonctionEnEdition] =
    useState<Fonction | null>(null);

  const [confirmationSuppression, setConfirmationSuppression] =
    useState<Fonction | null>(null);

  // Formulaire
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [erreur, setErreur] = useState('');

  // Notification
  const [notification, setNotification] = useState('');

  const notificationTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  const notifier = (message: string) => {
    setNotification(message);

    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    notificationTimer.current = setTimeout(() => {
      setNotification('');
      notificationTimer.current = null;
    }, 3000);
  };

  // Tri des fonctions
  const fonctionsTriees = useMemo(() => {
    const resultat = [...fonctions];

    resultat.sort((a, b) => {
      let comparaison = 0;

      if (tri === 'code') {
        comparaison = a.code.localeCompare(b.code, 'fr');
      } else if (tri === 'libelle') {
        comparaison = a.libelle.localeCompare(b.libelle, 'fr');
      } else {
        comparaison = a.nombrePersonnels - b.nombrePersonnels;
      }

      return ordreCroissant ? comparaison : -comparaison;
    });

    return resultat;
  }, [fonctions, tri, ordreCroissant]);

  // Calcul dynamique de la pagination
  const nombrePages = Math.max(
    1,
    Math.ceil(fonctionsTriees.length / pageSize),
  );

  const pageCourante = Math.min(page, nombrePages);

  const fonctionsAffichees = useMemo(() => {
    const debut = (pageCourante - 1) * pageSize;

    return fonctionsTriees.slice(debut, debut + pageSize);
  }, [fonctionsTriees, pageCourante, pageSize]);

  // Changer le nombre de lignes par page
  const changerPageSize = (nouvelleTaille: number) => {
    setPageSize(nouvelleTaille);
    setPage(1);
  };

  // Ouvrir le formulaire d'ajout
  const ouvrirAjout = () => {
    setFonctionEnEdition(null);
    setCode('');
    setLibelle('');
    setErreur('');
    setModalOuvert(true);
  };

  // Ouvrir le formulaire de modification
  const ouvrirEdition = (fonction: Fonction) => {
    setFonctionEnEdition(fonction);
    setCode(fonction.code);
    setLibelle(fonction.libelle);
    setErreur('');
    setModalOuvert(true);
  };

  // Fermer le formulaire
  const fermerModal = () => {
    setModalOuvert(false);
    setFonctionEnEdition(null);
    setCode('');
    setLibelle('');
    setErreur('');
  };

  // Ajouter ou modifier une fonction
  const enregistrerFonction = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const codePropre = code.trim();
    const libellePropre = libelle.trim();

    if (!codePropre || !libellePropre) {
      setErreur('Veuillez remplir le code et le libellé.');
      return;
    }

    const doublonCode = fonctions.some(
      (fonction) =>
        normalizeText(fonction.code) === normalizeText(codePropre) &&
        fonction.id !== fonctionEnEdition?.id,
    );

    if (doublonCode) {
      setErreur('Ce code est déjà utilisé.');
      return;
    }

    const doublonLibelle = fonctions.some(
      (fonction) =>
        normalizeText(fonction.libelle) === normalizeText(libellePropre) &&
        fonction.id !== fonctionEnEdition?.id,
    );

    if (doublonLibelle) {
      setErreur('Ce libellé existe déjà.');
      return;
    }

    if (fonctionEnEdition) {
      setFonctions((anciennes) =>
        anciennes.map((fonction) =>
          fonction.id === fonctionEnEdition.id
            ? {
                ...fonction,
                code: codePropre,
                libelle: libellePropre,
              }
            : fonction,
        ),
      );

      notifier('La fonction a été modifiée.');
    } else {
      const nouvelleFonction: Fonction = {
        id: Math.max(0, ...fonctions.map((f) => f.id)) + 1,
        code: codePropre,
        libelle: libellePropre,
        nombrePersonnels: 0,
      };

      const nouvellesFonctions = [
        ...fonctions,
        nouvelleFonction,
      ];

      setFonctions(nouvellesFonctions);

      // Aller à la dernière page après l'ajout
      setPage(
        Math.ceil(nouvellesFonctions.length / pageSize),
      );

      notifier('La fonction a été ajoutée.');
    }

    fermerModal();
  };

  // Supprimer une fonction
  const supprimerFonction = () => {
    if (!confirmationSuppression) return;

    const idASupprimer = confirmationSuppression.id;

    const nouvellesFonctions = fonctions.filter(
      (fonction) => fonction.id !== idASupprimer,
    );

    setFonctions(nouvellesFonctions);

    const nouveauNombrePages = Math.max(
      1,
      Math.ceil(nouvellesFonctions.length / pageSize),
    );

    setPage((anciennePage) =>
      Math.min(anciennePage, nouveauNombrePages),
    );

    setConfirmationSuppression(null);

    notifier('La fonction a été supprimée.');
  };

  // Tri depuis les sélecteurs
  const changerTri = (field: string, direction: string) => {
    setTri(field);
    setOrdreCroissant(direction === 'asc');
    setPage(1);
  };

  // Tri depuis les titres du tableau
  const basculerTriTableau = (field: string) => {
    if (tri === field) {
      setOrdreCroissant((precedent) => !precedent);
    } else {
      setTri(field);
      setOrdreCroissant(true);
    }

    setPage(1);
  };

  // Réinitialiser
  const reinitialiser = () => {
    setTri('code');
    setOrdreCroissant(true);
    setPage(1);
  };

  // Export CSV
  const exporterCSV = () => {
    const entetes = [
      'Code',
      'Libellé',
      'Nombre de personnels',
    ];

    const lignes = fonctionsTriees.map((fonction) => [
      fonction.code,
      fonction.libelle,
      fonction.nombrePersonnels,
    ]);

    const contenu = [entetes, ...lignes]
      .map((ligne) =>
        ligne
          .map(
            (valeur) =>
              `"${String(valeur).replace(/"/g, '""')}"`,
          )
          .join(';'),
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + contenu], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');

    lien.href = url;
    lien.download = 'fonctions.csv';

    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);

    URL.revokeObjectURL(url);

    notifier('Export CSV terminé.');
  };

  // Actualiser la liste locale
  const actualiser = () => {
    reinitialiser();
    notifier('La liste locale a été actualisée.');
  };

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1500px]">
        <section className="overflow-visible rounded-xl border border-[#e8ebe4] bg-white px-4 py-4 shadow-[0_4px_18px_rgba(35,48,25,0.035)] sm:px-5 sm:py-5">

          {/* En-tête */}
          <PageHeader
            icon={<Wrench size={22} strokeWidth={2} />}
            title="Fonctions"
            description="Gérez les fonctions de votre établissement et consultez le nombre de personnels associés à chacune d’elles."
            actions={
              <button
                type="button"
                onClick={ouvrirAjout}
                className="inline-flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#52692e] px-3.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#435724] focus:outline-none focus:ring-2 focus:ring-[#52692e]/25"
              >
                <Plus size={15} />
                Ajouter une fonction
              </button>
            }
          />

          {/* Tri et actions */}
          <div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:flex xl:flex-none xl:items-center xl:gap-2.5">

              <SortSelect
                label="Trié par code"
                value={
                  tri === 'code'
                    ? ordreCroissant ? 'asc' : 'desc'
                    : ''
                }
                onChange={(value) => changerTri('code', value)}
                icon={<ChevronsUpDown size={15} />}
                options={[
                  { label: 'Trié par code (A → Z)', value: 'asc' },
                  { label: 'Trié par code (Z → A)', value: 'desc' },
                ]}
                colors={{
                  container: 'border-[#cfe2fb] bg-gradient-to-r from-[#f2f8ff] to-[#fbfdff]',
                  icon: 'bg-gradient-to-br from-[#69adf5] to-[#347ee0]',
                  separator: 'bg-[#c6dcfa]',
                  text: 'text-[#18365d]',
                }}
              />

              <SortSelect
                label="Trié par libellé"
                value={
                  tri === 'libelle'
                    ? ordreCroissant ? 'asc' : 'desc'
                    : ''
                }
                onChange={(value) => changerTri('libelle', value)}
                icon={<ChevronsUpDown size={15} />}
                options={[
                  { label: 'Trié par libellé (A → Z)', value: 'asc' },
                  { label: 'Trié par libellé (Z → A)', value: 'desc' },
                ]}
                colors={{
                  container: 'border-[#ddcffb] bg-gradient-to-r from-[#f8f4ff] to-[#fdfbff]',
                  icon: 'bg-gradient-to-br from-[#a58af7] to-[#7148d9]',
                  separator: 'bg-[#d8c9fa]',
                  text: 'text-[#382568]',
                }}
              />

              <SortSelect
                label="Trié par effectif"
                value={
                  tri === 'effectif'
                    ? ordreCroissant ? 'asc' : 'desc'
                    : ''
                }
                onChange={(value) => changerTri('effectif', value)}
                icon={<Users size={15} />}
                options={[
                  { label: 'Effectif croissant', value: 'asc' },
                  { label: 'Effectif décroissant', value: 'desc' },
                ]}
                colors={{
                  container: 'border-[#d4e8ce] bg-gradient-to-r from-[#f3faef] to-[#fbfef9]',
                  icon: 'bg-gradient-to-br from-[#8fba7c] to-[#4d7e40]',
                  separator: 'bg-[#cce2c4]',
                  text: 'text-[#284b2d]',
                }}
              />
            </div>

            <TableActions
              actions={[
                {
                  label: 'Exporter',
                  icon: <Download size={15} />,
                  onClick: exporterCSV,
                  variant: 'orange',
                },
                {
                  label: 'Actualiser',
                  icon: <RotateCcw size={15} />,
                  onClick: actualiser,
                  variant: 'green',
                },
              ]}
            />
          </div>

          {/* Tableau */}
          <FunctionTable
            fonctions={fonctionsAffichees}
            page={pageCourante}
            pageSize={pageSize}
            tri={tri}
            ordreCroissant={ordreCroissant}
            onSort={basculerTriTableau}
            onEdit={ouvrirEdition}
            onDelete={setConfirmationSuppression}
          />

          {/* Pagination réutilisable */}
          <Pagination
            currentPage={pageCourante}
            totalPages={nombrePages}
            totalItems={fonctionsTriees.length}
            pageSize={pageSize}
            itemLabel="fonction(s)"
            onPageChange={setPage}
            onPageSizeChange={changerPageSize}
          />
        </section>
      </div>

      {/* Modal ajout / modification */}
      <Modal
        open={modalOuvert}
        title={
          fonctionEnEdition
            ? 'Modifier la fonction'
            : 'Ajouter une fonction'
        }
        description="Complétez les informations ci-dessous."
        onClose={fermerModal}
      >
        <form
          onSubmit={enregistrerFonction}
          className="space-y-4 p-5"
        >
          <FormField
            id="fonction-code"
            label="Code"
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Ex. FON-013"
            autoFocus
          />

          <FormField
            id="fonction-libelle"
            label="Libellé"
            required
            value={libelle}
            onChange={(event) => setLibelle(event.target.value)}
            placeholder="Ex. Gestionnaire"
          />

          {erreur && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700"
            >
              {erreur}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4">
            <button
              type="button"
              onClick={fermerModal}
              className="h-9 rounded-lg border border-[#e1e5dd] px-3.5 text-[11px] font-semibold text-[#58614f] transition hover:bg-[#f7f8f4]"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#52692e] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#435724]"
            >
              <Check size={14} />
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={Boolean(confirmationSuppression)}
        title="Supprimer cette fonction ?"
        message={
          confirmationSuppression
            ? `Voulez-vous supprimer « ${confirmationSuppression.libelle} » ? Cette action ne pourra pas être annulée.`
            : ''
        }
        onCancel={() => setConfirmationSuppression(null)}
        onConfirm={supprimerFonction}
      />

      {/* Notification */}
      <Notification
        message={notification}
        onClose={() => setNotification('')}
      />
    </div>
  );
}
