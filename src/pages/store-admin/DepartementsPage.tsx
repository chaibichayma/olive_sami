
import { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  UserRound,
  Download,
  RefreshCw,
  Plus,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

import SearchInput from '@/components/common/SearchInput';
import SortControls from '@/components/common/SortControls';
import TableRowActions from '@/components/common/TableRowActions';
import { EmptyState } from '@/components/common/EmptyState';

import DepartementFormModal, {
  type Departement,
} from '@/components/departements/DepartementFormModal';
import TableActionColumns, { TableActionHeaders } from '@/components/common/TableActionColumns';

type SortField = 'code' | 'libelle' | 'effectif';
type SortDirection = 'asc' | 'desc';

const initialDepartements: Departement[] = [
  { id: 1, code: 'DEP001', libelle: 'Ressources humaines', nombrePersonnels: 12 },
  { id: 2, code: 'DEP002', libelle: 'Informatique', nombrePersonnels: 18 },
  { id: 3, code: 'DEP003', libelle: 'Comptabilité', nombrePersonnels: 9 },
  { id: 4, code: 'DEP004', libelle: 'Production', nombrePersonnels: 25 },
  { id: 5, code: 'DEP005', libelle: 'Logistique', nombrePersonnels: 15 },
  { id: 6, code: 'DEP006', libelle: 'Commercial', nombrePersonnels: 11 },
  { id: 7, code: 'DEP007', libelle: 'Marketing', nombrePersonnels: 8 },
  { id: 8, code: 'DEP008', libelle: 'Finance', nombrePersonnels: 7 },
  { id: 9, code: 'DEP009', libelle: 'Maintenance', nombrePersonnels: 14 },
  { id: 10, code: 'DEP010', libelle: 'Qualité', nombrePersonnels: 6 },
  { id: 11, code: 'DEP011', libelle: 'Achats', nombrePersonnels: 10 },
  { id: 12, code: 'DEP012', libelle: 'Direction générale', nombrePersonnels: 5 },
];

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function DepartementsPage() {
  const [departements, setDepartements] =
    useState<Departement[]>(initialDepartements);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartement, setSelectedDepartement] =
    useState<Departement | null>(null);

  const [departementToDelete, setDepartementToDelete] =
    useState<Departement | null>(null);

  // Recherche et tri
  const filteredDepartements = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    const result = departements.filter((departement) => {
      return (
        normalizeText(departement.code).includes(normalizedSearch) ||
        normalizeText(departement.libelle).includes(normalizedSearch)
      );
    });

    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'code') {
        comparison = a.code.localeCompare(b.code, 'fr');
      } else if (sortField === 'libelle') {
        comparison = a.libelle.localeCompare(b.libelle, 'fr');
      } else {
        comparison =
          a.nombrePersonnels - b.nombrePersonnels;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [departements, search, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDepartements.length / pageSize),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDepartements = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;

    return filteredDepartements.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [filteredDepartements, safeCurrentPage, pageSize]);

  // Statistiques
  const totalPersonnels = useMemo(
    () =>
      departements.reduce(
        (total, departement) =>
          total + departement.nombrePersonnels,
        0,
      ),
    [departements],
  );

  const averagePersonnels =
    departements.length > 0
      ? Math.round(totalPersonnels / departements.length)
      : 0;

  // Ouvrir le formulaire d'ajout
  const handleAdd = () => {
    setSelectedDepartement(null);
    setIsFormOpen(true);
  };

  // Ouvrir le formulaire de modification
  const handleEdit = (departement: Departement) => {
    setSelectedDepartement(departement);
    setIsFormOpen(true);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDepartement(null);
  };

  // Ajouter ou modifier
  const handleSave = (data: Omit<Departement, 'id'>) => {
    const codePropre = data.code.trim();
    const libellePropre = data.libelle.trim();

    if (!codePropre || !libellePropre) {
      window.alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const duplicateCode = departements.some(
      (departement) =>
        normalizeText(departement.code) === normalizeText(codePropre) &&
        departement.id !== selectedDepartement?.id,
    );

    if (duplicateCode) {
      window.alert('Ce code de département existe déjà.');
      return;
    }

    const duplicateLibelle = departements.some(
      (departement) =>
        normalizeText(departement.libelle) === normalizeText(libellePropre) &&
        departement.id !== selectedDepartement?.id,
    );

    if (duplicateLibelle) {
      window.alert('Ce libellé de département existe déjà.');
      return;
    }

    if (selectedDepartement) {
      setDepartements((previous) =>
        previous.map((departement) =>
          departement.id === selectedDepartement.id
            ? {
                ...departement,
                code: codePropre,
                libelle: libellePropre,
              }
            : departement,
        ),
      );
    } else {
      const newDepartement: Departement = {
        id: Math.max(0, ...departements.map((d) => d.id)) + 1,
        ...data,
        code: codePropre,
        libelle: libellePropre,
      };

      setDepartements((previous) => [
        ...previous,
        newDepartement,
      ]);

      setSearch('');
      setSortField('code');
      setSortDirection('asc');
    }

    setCurrentPage(1);
    handleCloseForm();
  };

  // Suppression
  const handleDelete = () => {
    if (!departementToDelete) return;

    const idToDelete = departementToDelete.id;

    const remainingCount = filteredDepartements.filter(
      (departement) => departement.id !== idToDelete,
    ).length;

    const newTotalPages = Math.max(
      1,
      Math.ceil(remainingCount / pageSize),
    );

    setDepartements((previous) =>
      previous.filter(
        (departement) => departement.id !== idToDelete,
      ),
    );

    setCurrentPage((previous) =>
      Math.min(previous, newTotalPages),
    );

    setDepartementToDelete(null);
  };

  // Export CSV
  const handleExport = () => {
    const headers = [
      'Code',
      'Libellé',
      'Nombre de personnels',
    ];

    const rows = filteredDepartements.map((departement) => [
      departement.code,
      departement.libelle,
      departement.nombrePersonnels,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(';'),
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'departements.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Réinitialiser les filtres
  const handleRefresh = () => {
    setSearch('');
    setSortField('code');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Changement du tri
  const handleSortFieldChange = (value: string) => {
    setSortField(value as SortField);
    setCurrentPage(1);
  };

  const handleSortDirectionChange = (value: SortDirection) => {
    setSortDirection(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* En-tête */}
        <PageHeader
          title="Départements"
          description="Gérez les départements et leurs effectifs."
          icon={<Building2 size={24} />}
          actions={
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#526B2F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#405322]"
            >
              <Plus size={18} />
              Nouveau département
            </button>
          }
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total des départements"
            value={departements.length}
            icon={<Building2 size={22} />}
          />

          <StatCard
            title="Total des personnels"
            value={totalPersonnels}
            icon={<Users size={22} />}
            iconClassName="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Effectif moyen par département"
            value={averagePersonnels}
            icon={<UserRound size={22} />}
            iconClassName="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Tableau */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {/* Recherche, tri et actions */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher par code ou libellé..."
              className="lg:max-w-sm"
            />

            <div className="flex flex-wrap items-center gap-2">
              <SortControls
                field={sortField}
                direction={sortDirection}
                onFieldChange={handleSortFieldChange}
                onDirectionChange={handleSortDirectionChange}
                options={[
                  { label: 'Code', value: 'code' },
                  { label: 'Libellé', value: 'libelle' },
                  { label: 'Effectif', value: 'effectif' },
                ]}
              />

              <button
                type="button"
                onClick={handleRefresh}
                title="Réinitialiser"
                aria-label="Réinitialiser les filtres"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[#556B2F]"
              >
                <RefreshCw size={16} />
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>

          {/* Tableau des départements */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Code
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Libellé du département
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Nombre de personnels
                  </th>

                  <TableActionHeaders />
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedDepartements.map((departement) => (
                  <tr
                    key={departement.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#556B2F]/10 px-2.5 py-1 text-xs font-semibold text-[#556B2F]">
                        {departement.code}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-800">
                        {departement.libelle}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {departement.nombrePersonnels}
                        </span>
                      </div>
                    </td>

                    <TableActionColumns
  onEdit={() => handleEdit(departement)}
  onDelete={() => setDepartementToDelete(departement)}
/>
                  </tr>
                ))}

                {paginatedDepartements.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4">
                      <EmptyState
                        icon={Building2}
                        title="Aucun département trouvé"
                        description="Modifiez votre recherche ou ajoutez un département."
                        actionLabel="Ajouter un département"
                        onAction={handleAdd}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredDepartements.length}
            itemLabel="départements"
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Modal ajout / modification */}
      <DepartementFormModal
        open={isFormOpen}
        departement={selectedDepartement}
        onClose={handleCloseForm}
        onSubmit={handleSave}
      />

      {/* Confirmation suppression */}
      <ConfirmDialog
        open={Boolean(departementToDelete)}
        title="Supprimer le département"
        message="Êtes-vous sûre de vouloir supprimer ce département ? Cette action est irréversible."
        itemName={
          departementToDelete
            ? `${departementToDelete.libelle} (${departementToDelete.code})`
            : undefined
        }
        onCancel={() => setDepartementToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
