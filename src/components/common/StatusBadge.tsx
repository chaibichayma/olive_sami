
import { Clock3 } from "lucide-react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface StatusBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  active?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-[#e3f5e9] text-[#16833b]",
  warning: "bg-[#fff1df] text-[#c2410c]",
  danger: "bg-[#fdebed] text-[#dc2635]",
  neutral: "bg-[#f1f5f9] text-[#64748b]",
};

export function StatusBadge({
  label,
  variant,
  active,
}: StatusBadgeProps) {
  // Si active est fourni, déterminer automatiquement le statut.
  const resolvedVariant: BadgeVariant =
    active !== undefined
      ? active
        ? "success"
        : "danger"
      : variant ?? "neutral";

  const resolvedLabel =
    label ??
    (active !== undefined
      ? active
        ? "Actif"
        : "Inactif"
      : "Statut");

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${variants[resolvedVariant]}`}
    >
      {resolvedVariant === "warning" ? (
        <Clock3 className="size-3" />
      ) : (
        <span
          className={`size-1.5 rounded-full ${
            resolvedVariant === "success"
              ? "bg-[#16a34a]"
              : resolvedVariant === "danger"
                ? "bg-[#ef3340]"
                : "bg-[#94a3b8]"
          }`}
        />
      )}

      {resolvedLabel}
    </span>
  );
}
