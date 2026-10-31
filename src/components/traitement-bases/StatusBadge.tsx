export type BonStatus = "Traité" | "En cours" | "En attente";

interface StatusBadgeProps {
  status: BonStatus;
}

const styles: Record<BonStatus, string> = {
  Traité: "bg-[#dff1df] text-[#28723a]",
  "En cours": "bg-[#dcecff] text-[#1764bd]",
  "En attente": "bg-[#fff0cc] text-[#a86b08]",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}