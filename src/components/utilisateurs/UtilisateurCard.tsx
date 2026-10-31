
import { Mail, Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { userImages } from "./utilisateur.data";
import type { Utilisateur } from "./utilisateur.types";

interface UtilisateurCardProps {
  utilisateur: Utilisateur;
  onEdit?: (utilisateur: Utilisateur) => void;
  onDelete?: (utilisateur: Utilisateur) => void;
}

export function UtilisateurCard({
  utilisateur,
  onEdit,
  onDelete,
}: UtilisateurCardProps) {
  const imageUrl =
    userImages[utilisateur.id] ??
    "https://i.pravatar.cc/100?img=1";

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-[#e1e8ee] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_5px_16px_rgba(15,23,42,0.08)]">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-2 border-b border-[#edf0f2] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f1f5f9]">
            <img
              src={imageUrl}
              alt={utilisateur.displayName}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#172033]">
              {utilisateur.displayName}
            </h3>

            <p className="mt-1 truncate text-[11px] text-[#94a3b8]">
              @{utilisateur.userName}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
          {utilisateur.userCode}
        </span>
      </div>

      {/* INFORMATIONS */}
      <div className="space-y-3 px-3 py-3">
        <div className="flex min-w-0 items-start gap-2">
          <Mail className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />

          <span
            className="min-w-0 break-all text-xs leading-5 text-[#64748b]"
            title={utilisateur.mail}
          >
            {utilisateur.mail || "Aucun email"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-[#94a3b8]">
            Statut du compte
          </span>

          <StatusBadge active={utilisateur.isActive} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between border-t border-[#edf0f2] bg-[#fafcfb] px-3 py-2.5">
        <span className="text-[10px] text-[#94a3b8]">
          Code : {utilisateur.userCode}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title={`Modifier ${utilisateur.displayName}`}
            aria-label={`Modifier ${utilisateur.displayName}`}
            onClick={() => onEdit?.(utilisateur)}
            className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2] hover:text-[#3f5124]"
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            title={`Supprimer ${utilisateur.displayName}`}
            aria-label={`Supprimer ${utilisateur.displayName}`}
            onClick={() => onDelete?.(utilisateur)}
            className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd] hover:text-[#d92735]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
