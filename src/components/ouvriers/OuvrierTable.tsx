import { useMemo, useState } from 'react';

import {
  Clock3,
  Download,
  RefreshCcw,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { StatusFilterTabs } from '@/components/common/StatusFilterTabs';
import type { StatusFilterOption } from '@/components/common/StatusFilterTabs';

import { EmptyState } from '@/components/common/EmptyState';

import { OuvrierCard } from './OuvrierCard';

import type {
  Ouvrier,
  OuvrierTableProps,
} from './ouvrier.types';

import { exportCsv } from '@/utils/exportCsv';

/* ============================================================
   TYPES
============================================================ */

type OuvrierFilter = 'Tous' | 'Actif' | 'En congé' | 'Inactif';

/* ============================================================
   FILTRES
============================================================ */

export function OuvrierTable({
  ouvriers = [],
  onEdit,
  onDelete,
}: OuvrierTableProps) {
  const [statusFilter, setStatusFilter] =
    useState<OuvrierFilter>('Tous');

  /* ==========================================================
     STATISTIQUES
  ========================================================== */

  const statusCounts = useMemo(() => {
    return {
      Tous: ouvriers.length,

      Actif: ouvriers.filter(
        (ouvrier) => ouvrier.statut === 'Actif',
      ).length,

      'En congé': ouvriers.filter(
        (ouvrier) => ouvrier.statut === 'En congé',
      ).length,

      Inactif: ouvriers.filter(
        (ouvrier) => ouvrier.statut === 'Inactif',
      ).length,
    };
  }, [ouvriers]);

  /* ==========================================================
     CONFIGURATION DES FILTRES
  ========================================================== */

  const filterOptions: StatusFilterOption<OuvrierFilter>[] = [
    {
      value: 'Tous',
      label: 'Tous',
      count: statusCounts.Tous,
      color: 'bg-[#94a3b8]',
      activeColor:
        'border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]',
      badgeColor: 'bg-[#e9eef3]',
      activeBadgeColor: 'bg-[#e9eef3]',
    },
    {
      value: 'Actif',
      label: 'Actifs',
      count: statusCounts.Actif,
      color: 'bg-[#16a34a]',
      activeColor:
        'border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]',
      badgeColor: 'bg-[#e3f5e9] text-[#16833b]',
      activeBadgeColor: 'bg-[#e3f5e9] text-[#16833b]',
    },
    {
      value: 'En congé',
      label: 'En congé',
      count: statusCounts['En congé'],
      icon: Clock3,
      color: 'text-[#ea580c]',
      activeColor:
        'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]',
      badgeColor: 'bg-[#fff1df] text-[#c2410c]',
      activeBadgeColor: 'bg-[#fff1df] text-[#c2410c]',
    },
    {
      value: 'Inactif',
      label: 'Inactifs',
      count: statusCounts.Inactif,
      color: 'bg-[#ef4444]',
      activeColor:
        'border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]',
      badgeColor: 'bg-[#fdebed] text-[#dc2635]',
      activeBadgeColor: 'bg-[#fdebed] text-[#dc2635]',
    },
  ];

  /* ==========================================================
     FILTRAGE
  ========================================================== */

  const filteredOuvriers = useMemo(() => {
    if (statusFilter === 'Tous') {
      return ouvriers;
    }

    return ouvriers.filter(
      (ouvrier) => ouvrier.statut === statusFilter,
    );
  }, [ouvriers, statusFilter]);

  /* ==========================================================
     RÉINITIALISATION
  ========================================================== */

  const handleReset = () => {
    setStatusFilter('Tous');
  };

  /* ==========================================================
     EXPORT CSV
  ========================================================== */

  const handleExport = () => {
    const columns = [
      {
        header: 'ID',
        accessor: (ouvrier: Ouvrier) => ouvrier.id,
      },
      {
        header: 'Nom complet',
        accessor: (ouvrier: Ouvrier) => ouvrier.nom,
      },
      {
        header: 'Téléphone',
        accessor: (ouvrier: Ouvrier) => ouvrier.telephone,
      },
      {
        header: 'CIN',
        accessor: (ouvrier: Ouvrier) => ouvrier.cin,
      },
      {
        header: 'Spécialité',
        accessor: (ouvrier: Ouvrier) => ouvrier.specialite,
      },
      {
        header: 'Salaire (DT)',
        accessor: (ouvrier: Ouvrier) => ouvrier.salaire,
      },
      {
        header: 'Statut',
        accessor: (ouvrier: Ouvrier) => ouvrier.statut,
      },
      {
        header: "Date d'ajout",
        accessor: (ouvrier: Ouvrier) => ouvrier.dateAjout,
      },
    ];

    exportCsv({
      data: filteredOuvriers,
      columns,
      filename: 'ouvriers.csv',
    });
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* FILTRES + ACTIONS */}

        <div className="flex flex-col gap-4 border-b border-[#edf0f2] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">

          <StatusFilterTabs
            options={filterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-10 rounded-lg border border-[#F3D2B3] bg-[#FFF7ED] px-5 text-xs font-semibold text-[#C2672B] transition hover:border-[#E9B98F] hover:bg-[#FFEDD8] hover:text-[#A94F1D]"
            >
              <RefreshCcw className="mr-1.5 size-4" />
              Réinitialiser
            </Button>

            <Button
              type="button"
              onClick={handleExport}
              disabled={filteredOuvriers.length === 0}
              className="h-10 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-xs font-semibold text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="mr-1.5 size-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* CARTES OUVRIERS */}

        <div className="bg-white p-4 sm:p-5">
          {filteredOuvriers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredOuvriers.map((ouvrier) => (
                <OuvrierCard
                  key={ouvrier.id}
                  ouvrier={ouvrier}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Aucun ouvrier trouvé"
              description="Essayez un autre filtre ou réinitialisez les filtres."
              actionLabel="Réinitialiser les filtres"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}