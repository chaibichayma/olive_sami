import { TrendingUp, type LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

interface StatsGridProps {
  items: StatItem[];
  columns?: number;
}

export function StatsGrid({
  items,
  columns = 7,
}: StatsGridProps) {
  const columnClasses: Record<number, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
  };

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div
        className={`grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 ${
          columnClasses[columns] ?? "lg:grid-cols-7"
        } lg:divide-y-0`}
      >
        {items.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-2.5 px-3 py-3 transition-colors hover:bg-slate-50/80 sm:px-4"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon className="size-5" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold leading-none tracking-tight text-slate-800">
                    {stat.value}
                  </span>

                  {stat.trend && (
                    <TrendingUp className="size-3.5 text-green-500" />
                  )}
                </div>

                <p className="mt-1 truncate text-[10px] font-medium leading-tight text-slate-500 sm:text-[11px]">
                  {stat.label}
                </p>

                {stat.trend && (
                  <p className="mt-0.5 text-[9px] font-semibold text-green-600">
                    {stat.trend}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}