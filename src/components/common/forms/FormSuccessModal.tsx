import type { ReactNode } from "react";
import { Check, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormSuccessModalProps {
  open: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}

export function FormSuccessModal({
  open,
  title,
  description,
  buttonLabel,
  onConfirm,
  onClose,
  children,
}: FormSuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-success-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/70 bg-white p-7 text-center shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100"
        >
          <X className="size-5" />
        </button>

        <div className="mx-auto flex size-[76px] items-center justify-center rounded-full bg-[#556B2F]/10">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#556B2F] text-white shadow-lg">
            <Check className="size-7" strokeWidth={3} />
          </div>
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="size-3.5" />
          Enregistrement réussi
        </span>

        <h2
          id="form-success-title"
          className="mt-4 text-xl font-bold text-[#202D43]"
        >
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-6 text-[#7D8A9E]">
          {description}
        </p>

        {children}

        <Button
          type="button"
          onClick={onConfirm}
          className="mt-7 h-11 w-full gap-2 rounded-xl bg-[#556B2F] text-xs font-bold text-white hover:bg-[#465A27]"
        >
          {buttonLabel}
        </Button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 py-2 text-xs font-medium text-[#7D8A9E] hover:text-[#263449]"
        >
          Rester sur cette page
        </button>
      </div>
    </div>
  );
}