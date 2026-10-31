
import { Pencil, Trash2 } from 'lucide-react';

type TableActionColumnsProps = {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export function TableActionHeaders() {
  return (
    <>
      <th className="border-l border-gray-100 px-3 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#39743a]">
        Modifier
      </th>

      <th className="border-l border-gray-100 px-3 py-4 text-center text-xs font-semibold uppercase tracking-wide text-red-600">
        Supprimer
      </th>
    </>
  );
}

export default function TableActionColumns({
  onEdit,
  onDelete,
  editLabel = 'Modifier',
  deleteLabel = 'Supprimer',
}: TableActionColumnsProps) {
  return (
    <>
      <td className="border-l border-gray-100 px-3 py-4 text-center">
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#d8ead1] bg-[#f0f8eb] px-3 text-xs font-semibold text-[#39743a] transition hover:bg-[#e3f2dc]"
        >
          <Pencil size={14} />
          {editLabel}
        </button>
      </td>

      <td className="border-l border-gray-100 px-3 py-4 text-center">
        <button
          type="button"
          onClick={onDelete}
          aria-label={deleteLabel}
          title={deleteLabel}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={14} />
          {deleteLabel}
        </button>
      </td>
    </>
  );
}
