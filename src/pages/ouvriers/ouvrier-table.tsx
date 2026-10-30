
import { useMemo, useState } from 'react';

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Mail,
  Pencil,
  Phone,
  RefreshCcw,
  Trash2,
  UserRound,
  Users,
  XCircle,
  CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

/* ============================================================
   TYPE OUVRIER
============================================================ */

export interface Ouvrier {
  id: number;
  nom: string;
  telephone: string;
  cin: string;
  specialite: string;
  salaire: number;
  statut: string;
  dateAjout: string;
}

interface OuvrierTableProps {
  ouvriers?: Ouvrier[];
  onEdit?: (ouvrier: Ouvrier) => void;
  onDelete?: (ouvrier: Ouvrier) => void;
}

/* ============================================================
   IMAGES
============================================================ */

const workerImages: Record<number, string> = {
  1: 'https://i.pravatar.cc/100?img=12',
  2: 'https://i.pravatar.cc/100?img=13',
  3: 'https://i.pravatar.cc/100?img=14',
  4: 'https://i.pravatar.cc/100?img=15',
  5: 'https://i.pravatar.cc/100?img=16',
  6: 'https://i.pravatar.cc/100?img=17',
  7: 'https://i.pravatar.cc/100?img=18',
  8: 'https://i.pravatar.cc/100?img=19',
  9: 'https://i.pravatar.cc/100?img=20',
  10: 'https://i.pravatar.cc/100?img=21',
  11: 'https://i.pravatar.cc/100?img=22',
  12: 'https://i.pravatar.cc/100?img=23',
};

/* ============================================================
   COMPOSANT
============================================================ */

export function OuvrierTable({
  ouvriers = [],
  onEdit,
  onDelete,
}: OuvrierTableProps) {
  const [statusFilter, setStatusFilter] = useState('Tous');

  /* ==========================================================
     STATISTIQUES
  ========================================================== */

  const totalOuvriers = ouvriers.length;

  const ouvriersActifs = ouvriers.filter(
    (ouvrier) => ouvrier.statut === 'Actif',
  ).length;

  const ouvriersConge = ouvriers.filter(
    (ouvrier) => ouvrier.statut === 'En congé',
  ).length;

  const ouvriersInactifs = ouvriers.filter(
    (ouvrier) => ouvrier.statut === 'Inactif',
  ).length;

  /* ==========================================================
     FILTRAGE
  ========================================================== */

  const filteredOuvriers = useMemo(() => {
    if (statusFilter === 'Tous') return ouvriers;

    return ouvriers.filter(
      (ouvrier) => ouvrier.statut === statusFilter,
    );
  }, [ouvriers, statusFilter]);

  /* ==========================================================
     RÉINITIALISER
  ========================================================== */

  const handleReset = () => {
    setStatusFilter('Tous');
  };

  /* ==========================================================
     EXPORT CSV
  ========================================================== */

  const handleExport = () => {
    const headers = [
      'ID',
      'Nom complet',
      'Téléphone',
      'CIN',
      'Spécialité',
      'Salaire (DT)',
      'Statut',
      "Date d'ajout",
    ];

    const rows = filteredOuvriers.map((ouvrier) => [
      ouvrier.id,
      ouvrier.nom,
      ouvrier.telephone,
      ouvrier.cin,
      ouvrier.specialite,
      ouvrier.salaire,
      ouvrier.statut,
      ouvrier.dateAjout,
    ]);

    const escapeCsv = (value: string | number) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCsv).join(';'),
      ...rows.map((row) => row.map(escapeCsv).join(';')),
    ].join('\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ouvriers.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  /* ==========================================================
     FORMATAGE
  ========================================================== */

  const formatSalary = (salary: number) =>
    Number(salary || 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* STATISTIQUES */}

        

        {/* FILTRES + ACTIONS */}

        <div className="flex flex-col gap-4 border-b border-[#edf0f2] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex min-w-0 flex-wrap items-center gap-3">

            {/* TOUS */}

            <button
              type="button"
              onClick={() => setStatusFilter('Tous')}
              aria-pressed={statusFilter === 'Tous'}
              className={`flex h-11 min-w-[130px] items-center justify-center gap-3 rounded-lg border px-4 transition ${
                statusFilter === 'Tous'
                  ? 'border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]'
                  : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#c9d9b6]'
              }`}
            >
              <span className="size-2 rounded-full bg-[#94a3b8]" />
              <span className="text-xs font-semibold">Tous</span>
              <span className="rounded-md bg-[#e9eef3] px-2 py-1 text-[10px] font-bold">
                {totalOuvriers}
              </span>
            </button>

            {/* ACTIFS */}

            <button
              type="button"
              onClick={() => setStatusFilter('Actif')}
              aria-pressed={statusFilter === 'Actif'}
              className={`flex h-11 min-w-[130px] items-center justify-center gap-3 rounded-lg border px-4 transition ${
                statusFilter === 'Actif'
                  ? 'border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]'
                  : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#b8e3c7]'
              }`}
            >
              <span className="size-2 rounded-full bg-[#16a34a]" />
              <span className="text-xs font-semibold">Actifs</span>
              <span className="rounded-md bg-[#e3f5e9] px-2 py-1 text-[10px] font-bold text-[#16833b]">
                {ouvriersActifs}
              </span>
            </button>

            {/* EN CONGÉ */}

            <button
              type="button"
              onClick={() => setStatusFilter('En congé')}
              aria-pressed={statusFilter === 'En congé'}
              className={`flex h-11 min-w-[150px] items-center justify-center gap-3 rounded-lg border px-4 transition ${
                statusFilter === 'En congé'
                  ? 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]'
                  : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#fed7aa]'
              }`}
            >
              <Clock3 className="size-3.5 text-[#ea580c]" />
              <span className="text-xs font-semibold">En congé</span>
              <span className="rounded-md bg-[#fff1df] px-2 py-1 text-[10px] font-bold text-[#c2410c]">
                {ouvriersConge}
              </span>
            </button>

            {/* INACTIFS */}

            <button
              type="button"
              onClick={() => setStatusFilter('Inactif')}
              aria-pressed={statusFilter === 'Inactif'}
              className={`flex h-11 min-w-[130px] items-center justify-center gap-3 rounded-lg border px-4 transition ${
                statusFilter === 'Inactif'
                  ? 'border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]'
                  : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#f5c9cd]'
              }`}
            >
              <span className="size-2 rounded-full bg-[#ef4444]" />
              <span className="text-xs font-semibold">Inactifs</span>
              <span className="rounded-md bg-[#fdebed] px-2 py-1 text-[10px] font-bold text-[#dc2635]">
                {ouvriersInactifs}
              </span>
            </button>

          </div>

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
    className="h-10 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-xs font-semibold text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
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

              {filteredOuvriers.map((ouvrier) => {
                const imageUrl = workerImages[ouvrier.id];

                return (
                  <article
                    key={ouvrier.id}
                    className="group min-w-0 overflow-hidden rounded-xl border border-[#e1e8ee] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_5px_16px_rgba(15,23,42,0.08)]"
                  >

                    {/* EN-TÊTE */}

                    
{/* EN-TÊTE : PHOTO ET INFORMATIONS DE L'OUVRIER */}

<div className="flex items-center justify-between gap-3 border-b border-[#edf0f2] px-3 py-3">
  <div className="flex min-w-0 items-center gap-3">
    <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-[#DCE8CF] bg-[#F1F5E9] shadow-sm">
      <img
        src={workerImages[ouvrier.id] || `https://i.pravatar.cc/100?u=${ouvrier.id}`}
        alt={`Photo de ${ouvrier.nom}`}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ouvrier.nom)}&background=E8EEDC&color=556B2F&size=100`;
        }}
        className="size-full object-cover"
      />
    </div>

    <div className="min-w-0">
      <h3 className="truncate text-sm font-bold text-[#172033]">
        {ouvrier.nom}
      </h3>

      <p className="mt-1 text-[11px] text-[#94a3b8]">
        Ouvrier #{String(ouvrier.id).padStart(3, '0')}
      </p>
    </div>
  </div>

  <span className="shrink-0 rounded-md bg-[#F1F5F9] px-2 py-1 text-[10px] font-semibold text-[#64748B]">
    CIN {ouvrier.cin || '—'}
  </span>
</div>


                    {/* INFORMATIONS */}

                    <div className="space-y-3 px-3 py-3">

                      <div className="flex min-w-0 items-start gap-2">
                        <Phone className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />
                        <span className="min-w-0 break-words text-xs leading-5 text-[#64748b]">
                          {ouvrier.telephone || 'Aucun téléphone'}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <BriefcaseBusiness className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />
                        <span className="min-w-0 break-words text-xs leading-5 text-[#64748b]">
                          {ouvrier.specialite || 'Aucune spécialité'}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />
                        <span className="min-w-0 break-words text-xs leading-5 text-[#64748b]">
                          Ajouté le : {ouvrier.dateAjout || '—'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-[#94a3b8]">
                          Statut
                        </span>

                        {ouvrier.statut === 'Actif' ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#e3f5e9] px-2 py-1 text-[10px] font-semibold text-[#16833b]">
                            <span className="size-1.5 rounded-full bg-[#16a34a]" />
                            Actif
                          </span>
                        ) : ouvrier.statut === 'En congé' ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#fff1df] px-2 py-1 text-[10px] font-semibold text-[#c2410c]">
                            <Clock3 className="size-3" />
                            En congé
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#fdebed] px-2 py-1 text-[10px] font-semibold text-[#dc2635]">
                            <span className="size-1.5 rounded-full bg-[#ef3340]" />
                            {ouvrier.statut || 'Inactif'}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* PIED DE CARTE */}

                    <div className="flex items-center justify-between gap-2 border-t border-[#edf0f2] bg-[#fafcfb] px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94a3b8]">Salaire mensuel</p>
                        <p className="mt-0.5 truncate text-xs font-bold text-[#334155]">
                          {formatSalary(ouvrier.salaire)} DT
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          title={`Modifier ${ouvrier.nom}`}
                          aria-label={`Modifier ${ouvrier.nom}`}
                          onClick={() => onEdit?.(ouvrier)}
                          className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2] hover:text-[#3f5124]"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          title={`Supprimer ${ouvrier.nom}`}
                          aria-label={`Supprimer ${ouvrier.nom}`}
                          onClick={() => onDelete?.(ouvrier)}
                          className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd] hover:text-[#d92735]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                  </article>
                );
              })}

            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">
              <Users className="mb-3 size-8 text-[#cbd5e1]" />
              <p className="text-sm font-semibold text-[#334155]">
                Aucun ouvrier trouvé
              </p>
              <p className="mt-1 text-xs text-[#94a3b8]">
                Essayez un autre filtre ou réinitialisez les filtres.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 text-xs font-semibold text-[#556B2F] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
