import type { ReactNode } from 'react';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

type PageHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PageHeader({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#879b58] to-[#536b30] text-white shadow-[0_3px_8px_rgba(74,95,42,0.18)]">
          {icon}
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[#17251b] sm:text-[22px]">
            {title}
          </h1>
          <p className="mt-1 text-[11px] leading-4 text-[#7d8577] sm:text-xs">
            {description}
          </p>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#52692e] px-3.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#435724] focus:outline-none focus:ring-2 focus:ring-[#52692e]/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  maxWidth = 'max-w-[400px]',
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172012]/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generic-modal-title"
        className={`w-full ${maxWidth} overflow-hidden rounded-2xl border border-[#e7ebe2] bg-white shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4">
          <div>
            <h2
              id="generic-modal-title"
              className="text-base font-bold text-[#26351e]"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[11px] text-[#899181]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7d8674] hover:bg-[#f2f4ee]"
          >
            <X size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = 'Supprimer',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172012]/40 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[360px] rounded-2xl border border-[#e7ebe2] bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <X size={19} />
        </div>

        <h2 className="text-sm font-bold text-[#26351e]">{title}</h2>

        <p className="mt-2 text-xs leading-5 text-[#7b8474]">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-lg border border-[#e1e5dd] px-3 text-[11px] font-semibold text-[#58614f] hover:bg-[#f7f8f4]"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-lg bg-red-600 px-3 text-[11px] font-semibold text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = 'élément(s)',
  onPageChange,
}: PaginationProps) {
  const debut = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const fin = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - currentPage) <= 1,
  );

  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-[#e8ecdf] bg-[#f8faf5] px-3 py-2 text-[11px] font-medium text-[#78816e]">
        Affichage de
        <span className="font-bold tabular-nums text-[#526b32]">{debut}</span>
        <span>à</span>
        <span className="font-bold tabular-nums text-[#526b32]">{fin}</span>
        <span>sur</span>
        <span className="rounded-md bg-[#e8f0df] px-2 py-0.5 font-bold tabular-nums text-[#435a29]">
          {totalItems}
        </span>
        <span>{itemLabel}</span>
      </p>

      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Page précédente"
          className="flex h-[29px] w-[29px] items-center justify-center rounded-lg border border-[#e2e6de] bg-white text-[#59644f] transition hover:bg-[#f4f6f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((number, index) => (
          <span key={number} className="contents">
            {index > 0 && number - pages[index - 1] > 1 && (
              <span className="px-0.5 text-[10px] text-[#92998b]">…</span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(number)}
              aria-current={number === currentPage ? 'page' : undefined}
              className={`flex h-[29px] min-w-[29px] items-center justify-center rounded-lg border px-2 text-[10px] font-semibold transition ${
                number === currentPage
                  ? 'border-[#52692e] bg-[#52692e] text-white shadow-sm'
                  : 'border-[#e2e6de] bg-white text-[#56614c] hover:bg-[#f3f6ed]'
              }`}
            >
              {number}
            </button>
          </span>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Page suivante"
          className="flex h-[29px] w-[29px] items-center justify-center rounded-lg border border-[#e2e6de] bg-white text-[#59644f] transition hover:bg-[#f4f6f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

type NotificationProps = {
  message: string;
  onClose: () => void;
};

export function Notification({ message, onClose }: NotificationProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-xl border border-[#dfe7d5] bg-white px-4 py-3 text-xs font-semibold text-[#3f552b] shadow-lg"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf4e2]">
        <Check size={14} />
      </span>

      {message}

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la notification"
        className="ml-1 text-[#8a9380] hover:text-[#435724]"
      >
        <X size={13} />
      </button>
    </div>
  );
}