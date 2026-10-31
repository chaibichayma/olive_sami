
import { useMemo, useState, useEffect } from 'react';
import {
  CalendarDays,
  Database,
  Download,
  RefreshCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/common/Pagination';
import TableActionColumns, {
  TableActionHeaders,
} from '@/components/common/TableActionColumns';
import { EmptyState } from '@/components/common/EmptyState';
import { exportCsv } from '@/components/common/exportCsv';

export interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

interface CiterneTableProps {
  citernes: Citerne[];
  loading?: boolean;
  onEdit?: (citerne: Citerne) => void;
  onDelete?: (citerne: Citerne) => void;
  onRefresh?: () => void;
}

type CapacityFilter = 'all' | 'small' | 'medium' | 'large';

const FILTER_OPTIONS: {
  value: CapacityFilter;
  label: string;
  color: string;
}[] = [
  {
    value: 'all',
    label: 'Toutes les capacités',
    color: '#556B2F',
  },
  {
    value: 'small',
    label: 'Petites capacités',
    color: '#2680eb',
  },
  {
    value: 'medium',
    label: 'Capacités moyennes',
    color: '#d99022',
  },
  {
    value: 'large',
    label: 'Grandes capacités',
    color: '#9655d9',
  },
];

function getCapacityFilter(capacity: number): CapacityFilter {
  if (capacity > 0 && capacity < 3000) return 'small';
  if (capacity >= 3000 && capacity < 5000) return 'medium';
  if (capacity >= 5000) return 'large';
  return 'all';
}

const formatNumber = (value: number) =>
  value.toLocaleString('fr-FR');

const formatDate = (value?: string) => {
  if (!value) return '—';

  const date = value.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  const normalized = date.split('T')[0];
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return value;
};

export function CiterneTable({
  citernes,
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}: CiterneTableProps) {
  const [capacityFilter, setCapacityFilter] =
    useState<CapacityFilter>('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtrage des citernes
  const filteredCiternes = useMemo(() => {
    if (capacityFilter === 'all') {
      return citernes;
    }

    return citernes.filter(
      (citerne) =>
        getCapacityFilter(Number(citerne.capacity) || 0) ===
        capacityFilter,
    );
  }, [citernes, capacityFilter]);

  // Nombre de citernes par catégorie
  const counts = useMemo(
    () => ({
      all: citernes.length,
      small: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === 'small',
      ).length,
      medium: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === 'medium',
      ).length,
      large: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === 'large',
      ).length,
    }),
    [citernes],
  );

  // Calcul dynamique des pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCiternes.length / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  // Citernes affichées sur la page courante
  const citernesAffichees = useMemo(() => {
    const debut = (currentPage - 1) * pageSize;

    return filteredCiternes.slice(debut, debut + pageSize);
  }, [filteredCiternes, currentPage, pageSize]);

  // Revenir à la première page si le filtre change
  useEffect(() => {
    setPage(1);
  }, [capacityFilter]);

  // Corriger la page après une suppression ou un filtrage
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Changement du nombre de lignes par page
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    setCapacityFilter('all');
    setPage(1);
  };

  // Export CSV
  const handleExport = () => {
    exportCsv({
      data: filteredCiternes,
      headers: [
        'Référence',
        'Nom',
        'Capacité (L)',
        'Date de fabrication',
      ],
      mapRow: (citerne) => [
        citerne.reference,
        citerne.libelle,
        citerne.capacity,
        formatDate(citerne.dateFabrication),
      ],
      filename: 'citernes.csv',
    });
  };

  return (
    <div className="w-full space-y-3">

      {/* Barre de filtres et actions */}
      <div className="rounded-xl border border-[#edf0f2] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">

          {FILTER_OPTIONS.map((filter) => {
            const active = capacityFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => setCapacityFilter(filter.value)}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                  active
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-[#edf0f2] bg-white text-[#475569] hover:bg-[#f8fafc]'
                }`}
                style={
                  active
                    ? { backgroundColor: filter.color }
                    : undefined
                }
              >
                <Database
                  className="size-4 shrink-0"
                  style={{
                    color: active ? '#ffffff' : filter.color,
                  }}
                />

                <span>{filter.label}</span>

                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f1f5f9] text-[#64748b]'
                  }`}
                >
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-9 rounded-lg border-orange-200 bg-orange-50 px-3 text-xs font-medium text-orange-700 hover:bg-orange-100"
            >
              <RefreshCcw className="mr-2 size-4" />
              Réinitialiser
            </Button>

            {onRefresh && (
              <Button
                type="button"
                variant="outline"
                onClick={onRefresh}
                disabled={loading}
                className="h-9 rounded-lg px-3 text-xs"
              >
                <RefreshCcw
                  className={`mr-2 size-4 ${
                    loading ? 'animate-spin' : ''
                  }`}
                />
                Actualiser
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={!filteredCiternes.length}
              className="h-9 rounded-lg border-[#556B2F] bg-[#F5F8F1] px-3 text-xs font-semibold text-[#556B2F] hover:bg-[#EAF0E2]"
            >
              <Download className="mr-2 size-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#e7ebe3] bg-white">
        <table className="w-full min-w-[950px] border-collapse text-left">

          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[19%]" />
            <col className="w-[23%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead>
            <tr className="h-[44px] border-b border-[#e7ebe3] bg-[#f8fafc]">
              <th className="px-4 text-xs font-semibold text-[#475569]">
                Référence
              </th>

              <th className="border-l border-[#e9ede5] px-4 text-xs font-semibold text-[#475569]">
                Nom
              </th>

              <th className="border-l border-[#e9ede5] px-4 text-xs font-semibold text-[#475569]">
                Capacité (L)
              </th>

              <th className="border-l border-[#e9ede5] px-4 text-xs font-semibold text-[#475569]">
                Date de fabrication
              </th>

              <TableActionHeaders />
            </tr>
          </thead>

          <tbody>
            {citernesAffichees.map((citerne) => {
              const category = getCapacityFilter(citerne.capacity);

              const styles: Record<CapacityFilter, string> = {
                all: 'bg-slate-50 text-slate-600',
                small: 'bg-blue-50 text-blue-700',
                medium: 'bg-amber-50 text-amber-700',
                large: 'bg-purple-50 text-purple-700',
              };

              const labels: Record<CapacityFilter, string> = {
                all: 'Capacité nulle',
                small: 'Petite capacité',
                medium: 'Capacité moyenne',
                large: 'Grande capacité',
              };

              return (
                <tr
                  key={citerne.citerneId}
                  className="h-[54px] border-b border-[#edf0e9] transition-colors last:border-b-0 hover:bg-[#fafcf7]"
                >
                  {/* Référence */}
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">
                        <Database className="size-4 text-[#556B2F]" />
                      </div>

                      <span className="text-xs font-bold text-[#34412e]">
                        {citerne.reference}
                      </span>
                    </div>
                  </td>

                  {/* Nom */}
                  <td className="border-l border-[#f0f2ed] px-4">
                    <span className="text-xs font-medium text-[#475343]">
                      {citerne.libelle}
                    </span>
                  </td>

                  {/* Capacité */}
                  <td className="border-l border-[#f0f2ed] px-4">
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap text-xs font-semibold text-slate-800">
                        {formatNumber(citerne.capacity)} L
                      </span>

                      <span
                        className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-semibold ${styles[category]}`}
                      >
                        {labels[category]}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="border-l border-[#f0f2ed] px-4">
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <CalendarDays className="size-4 shrink-0" />
                      {formatDate(citerne.dateFabrication)}
                    </div>
                  </td>

                  {/* Actions : deux colonnes séparées */}
                  <TableActionColumns
                    onEdit={() => onEdit?.(citerne)}
                    onDelete={() => onDelete?.(citerne)}
                    editLabel="Modifier"
                    deleteLabel="Supprimer"
                  />
                </tr>
              );
            })}

            {citernesAffichees.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6">
                  <EmptyState
                    icon={Database}
                    title="Aucune citerne trouvée"
                    description="Aucune citerne ne correspond à cette catégorie."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination réutilisable */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCiternes.length}
        pageSize={pageSize}
        itemLabel="citerne(s)"
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default CiterneTable;
