import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FormModalProps {
  open: boolean;
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}

export function FormModal({
  open,
  title,
  description,
  children,
  onClose,
}: FormModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18251a]/40 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf0e9] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#26364a]">{title}</h2>
            <p className="mt-1 text-xs text-[#839080]">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-[#68766b] hover:bg-[#f1f5ed]"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}