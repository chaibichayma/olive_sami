import type { ReactNode } from "react";

interface ActionIconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger";
}

export default function ActionIconButton({
  icon,
  label,
  onClick,
  variant = "primary",
}: ActionIconButtonProps) {
  const styles =
    variant === "danger"
      ? "bg-[#fdebed] text-[#ef3340] hover:bg-[#fbdadd]"
      : "bg-[#eef4e6] text-[#556B2F] hover:bg-[#e1ebd6]";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-lg transition ${styles}`}
    >
      {icon}
    </button>
  );
}