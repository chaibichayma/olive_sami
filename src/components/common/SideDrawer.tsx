import { X } from "lucide-react";
import type { ReactNode } from "react";

interface SideDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export function SideDrawer({
  open,
  title,
  subtitle,
  icon,
  children,
  onClose,
  footer,
}: SideDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/30"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef4e6]">
                {icon}
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-[#172033]">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-0.5 text-xs text-[#94a3b8]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="border-t border-[#e5e7eb] bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}