
import type { ReactNode } from "react";

type StatCardTone = "olive" | "blue" | "purple" | "green" | "amber";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  tone?: StatCardTone;
  iconClassName?: string;
  borderClassName?: string;
}

const toneStyles: Record<
  StatCardTone,
  { icon: string; border: string }
> = {
  olive: {
    icon: "bg-[#edf5e7] text-[#527b36]",
    border: "border-[#e8ede3]",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  green: {
    icon: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "olive",
  iconClassName,
  borderClassName,
}: StatCardProps) {
  const styles = toneStyles[tone];

  const finalIconClassName = iconClassName ?? styles.icon;
  const finalBorderClassName = borderClassName ?? styles.border;

  return (
    <div
      className={`group flex min-w-0 items-center gap-3 rounded-xl border bg-white/90 px-4 py-3 transition hover:shadow-sm ${finalBorderClassName}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${finalIconClassName}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-[#818a79] sm:text-[11px]">
          {title}
        </p>

        <p className="mt-1 truncate text-xl font-bold leading-tight tracking-tight text-[#273923] tabular-nums">
          {value}
        </p>

        {subtitle && (
          <p className="mt-1 text-[10px] text-[#92998c] sm:text-[11px]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
