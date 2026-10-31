import {
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react';

import { StatusBadge } from '@/components/common/StatusBadge';
import type { Ouvrier } from './ouvrier.types';

interface OuvrierCardProps {
  ouvrier: Ouvrier;
  onEdit?: (ouvrier: Ouvrier) => void;
  onDelete?: (ouvrier: Ouvrier) => void;
}

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

function getStatusVariant(
  statut: string,
): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (statut) {
    case 'Actif':
      return 'success';

    case 'En congé':
      return 'warning';

    case 'Inactif':
      return 'danger';

    default:
      return 'neutral';
  }
}

function formatSalary(salary: number) {
  return Number(salary || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function OuvrierCard({
  ouvrier,
  onEdit,
  onDelete,
}: OuvrierCardProps) {
  const imageUrl =
    workerImages[ouvrier.id] ||
    `https://i.pravatar.cc/100?u=${ouvrier.id}`;

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-[#e1e8ee] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_5px_16px_rgba(15,23,42,0.08)]">

      {/* EN-TÊTE */}

      <div className="flex items-center justify-between gap-3 border-b border-[#edf0f2] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-[#DCE8CF] bg-[#F1F5E9] shadow-sm">
            <img
              src={imageUrl}
              alt={`Photo de ${ouvrier.nom}`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(ouvrier.nom)}&background=E8EEDC&color=556B2F&size=100`;
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

          <StatusBadge
            label={ouvrier.statut || 'Non défini'}
            variant={getStatusVariant(ouvrier.statut)}
          />
        </div>
      </div>

      {/* PIED DE CARTE */}

      <div className="flex items-center justify-between gap-2 border-t border-[#edf0f2] bg-[#fafcfb] px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] text-[#94a3b8]">
            Salaire mensuel
          </p>

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
}