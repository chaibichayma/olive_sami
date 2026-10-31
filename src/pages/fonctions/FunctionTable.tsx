
import {
  Users,
  Crown,
  Settings,
  UserRound,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
  Shield,
  Search,
} from 'lucide-react';

import SortableTableHeader from '@/components/common/SortableTableHeader';
import { EmptyState } from '@/components/common/EmptyState';

import TableActionColumns, {
  TableActionHeaders,
} from '@/components/common/TableActionColumns';

export type Fonction = {
  id: number;
  code: string;
  libelle: string;
  nombrePersonnels: number;
};

type FunctionTableProps = {
  fonctions: Fonction[];
  page: number;
  pageSize: number;
  tri: string;
  ordreCroissant: boolean;
  onSort: (field: string) => void;
  onEdit: (fonction: Fonction) => void;
  onDelete: (fonction: Fonction) => void;
};

const ICONES_FONCTION = [
  Crown,
  Settings,
  UserRound,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
  Shield,
];

const COULEURS_ICONES = [
  'bg-[#fff5d9] text-[#b58a08]',
  'bg-[#eaf6e7] text-[#47843c]',
  'bg-[#e8f2ff] text-[#3784e8]',
  'bg-[#fff5dd] text-[#a88110]',
  'bg-[#e8f3ff] text-[#3282e6]',
  'bg-[#e9f6e6] text-[#398342]',
];

const COULEURS_EFFECTIFS = [
  'bg-[#eaf7e7] text-[#39833a]',
  'bg-[#e9f3ff] text-[#287de0]',
  'bg-[#f2e8ff] text-[#8546d6]',
  'bg-[#fff5df] text-[#a77b0a]',
];

export default function FunctionTable({
  fonctions,
  page,
  pageSize,
  tri,
  ordreCroissant,
  onSort,
  onEdit,
  onDelete,
}: FunctionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e7ebe3] bg-white">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-left">

        {/* Largeur des colonnes */}
        <colgroup>
          <col className="w-[6%]" />
          <col className="w-[23%]" />
          <col className="w-[27%]" />
          <col className="w-[20%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
        </colgroup>

        {/* En-tête */}
        <thead>
          <tr className="h-[44px] border-b border-[#e7ebe3] bg-gradient-to-r from-[#f5f7f1] to-[#fafbf8]">

            <th className="px-2 text-center text-[11px] font-bold uppercase tracking-wide text-[#65715b]">
              #
            </th>

            <th className="border-l border-[#e9ede5] px-4 text-[11px] font-bold uppercase tracking-wide text-[#485342]">
              <SortableTableHeader
                label="Code"
                field="code"
                currentSort={tri}
                ascending={ordreCroissant}
                onSort={onSort}
              />
            </th>

            <th className="border-l border-[#e9ede5] px-4 text-[11px] font-bold uppercase tracking-wide text-[#485342]">
              <SortableTableHeader
                label="Libellé"
                field="libelle"
                currentSort={tri}
                ascending={ordreCroissant}
                onSort={onSort}
              />
            </th>

            <th className="border-l border-[#e9ede5] px-3 text-center text-[11px] font-bold uppercase tracking-wide text-[#485342]">
              <SortableTableHeader
                label="Nbre personnels"
                field="effectif"
                currentSort={tri}
                ascending={ordreCroissant}
                onSort={onSort}
              />
            </th>

            {/* Colonnes Modifier et Supprimer */}
            <TableActionHeaders />

          </tr>
        </thead>

        {/* Corps du tableau */}
        <tbody>
          {fonctions.map((fonction, index) => {
            const indexCouleur =
              (fonction.id - 1) % ICONES_FONCTION.length;

            const Icone = ICONES_FONCTION[indexCouleur];

            const couleurIcone =
              COULEURS_ICONES[
                (fonction.id - 1) % COULEURS_ICONES.length
              ];

            const couleurEffectif =
              COULEURS_EFFECTIFS[
                (fonction.id - 1) % COULEURS_EFFECTIFS.length
              ];

            return (
              <tr
                key={fonction.id}
                className="group h-[54px] border-b border-[#edf0e9] transition-colors last:border-b-0 hover:bg-[#fafcf7]"
              >

                {/* Numéro */}
                <td className="px-2 text-center text-[11px] font-medium tabular-nums text-[#899182]">
                  {(page - 1) * pageSize + index + 1}
                </td>

                {/* Code */}
                <td className="border-l border-[#f0f2ed] px-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${couleurIcone}`}
                    >
                      <Icone size={15} strokeWidth={2} />
                    </div>

                    <span className="truncate text-[12px] font-bold tracking-wide text-[#34412e]">
                      {fonction.code}
                    </span>
                  </div>
                </td>

                {/* Libellé */}
                <td className="border-l border-[#f0f2ed] px-4">
                  <span className="block truncate text-[12px] font-medium text-[#475343]">
                    {fonction.libelle}
                  </span>
                </td>

                {/* Effectif */}
                <td className="border-l border-[#f0f2ed] px-3 text-center">
                  <span
                    className={`inline-flex min-w-[62px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 ${couleurEffectif}`}
                  >
                    <Users size={13} strokeWidth={2} />

                    <span className="text-[11px] font-bold tabular-nums">
                      {fonction.nombrePersonnels}
                    </span>
                  </span>
                </td>

                {/* Actions : deux colonnes séparées */}
                <TableActionColumns
                  onEdit={() => onEdit(fonction)}
                  onDelete={() => onDelete(fonction)}
                  editLabel={`Modifier`}
                  deleteLabel={`Supprimer`}
                />

              </tr>
            );
          })}

          {/* Aucun résultat */}
          {fonctions.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4">
                <EmptyState
                  icon={Search}
                  title="Aucune fonction trouvée"
                  description="Essayez un autre code ou libellé."
                />
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}
