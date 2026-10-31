import type { DateRange } from "@/components/reception/bon-reception.types";
import { RefreshCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  onReset: () => void;
  onExport: () => void;
}

export function DateRangeFilter({
  value,
  onChange,
  onReset,
  onExport,
}: DateRangeFilterProps) {
  return (
    <div className="grid grid-cols-1 items-end gap-3 border-b border-[#edf0f2] p-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_auto_auto]">
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor="dateDebut"
          className="text-xs font-semibold text-[#64748b]"
        >
          Date de début
        </label>

        <input
          id="dateDebut"
          type="date"
          value={value.start}
          max={value.end || undefined}
          onChange={(e) =>
            onChange({ ...value, start: e.target.value })
          }
          className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor="dateFin"
          className="text-xs font-semibold text-[#64748b]"
        >
          Date de fin
        </label>

        <input
          id="dateFin"
          type="date"
          value={value.end}
          min={value.start || undefined}
          onChange={(e) =>
            onChange({ ...value, end: e.target.value })
          }
          className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="h-11 gap-2 whitespace-nowrap rounded-lg border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
      >
        <RefreshCcw className="size-[17px]" />
        Réinitialiser
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onExport}
        className="h-11 gap-2 whitespace-nowrap rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] hover:bg-[#EAF2E0]"
      >
        <Download className="size-[17px]" />
        Exporter
      </Button>
    </div>
  );
}