
import { Pencil, Trash2 } from "lucide-react";

interface TableActionsProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function TableActions<T>({
  item,
  onEdit,
  onDelete,
  editLabel = "Modifier",
  deleteLabel = "Supprimer",
}: TableActionsProps<T>) {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      {onEdit && (
        <button
          type="button"
          title={editLabel}
          aria-label={editLabel}
          onClick={() => onEdit(item)}
          className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2]"
        >
          <Pencil className="size-4" />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          title={deleteLabel}
          aria-label={deleteLabel}
          onClick={() => onDelete(item)}
          className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd]"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
