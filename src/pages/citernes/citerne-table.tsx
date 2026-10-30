
import { useMemo, useState } from "react";

import {
  type ColDef,
  type ICellRendererParams,
  themeQuartz,
} from "ag-grid-community";

import {
  CalendarDays,
  Database,
  Download,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/tables/GenericDataTable";
import { TableActions } from "@/components/tables/TableActions";
import { exportCsv } from "@/components/common/exportCsv";

export interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

interface CiterneTableProps {
  citernes: Citerne[];
  loading?: boolean;
  onEdit?: (citerne: Citerne) => void;
  onDelete?: (citerne: Citerne) => void;
  onRefresh?: () => void;
}

type CapacityFilter = "all" | "small" | "medium" | "large";

const citerneTheme = themeQuartz.withParams({
  accentColor: "#556B2F",
  backgroundColor: "#ffffff",
  foregroundColor: "#172033",
  headerBackgroundColor: "#f8fafc",
  headerTextColor: "#334155",
  headerFontWeight: 600,
  borderColor: "#e8edf2",
  fontSize: 13,
  spacing: 8,
});

const formatNumber = (value: number) =>
  value.toLocaleString("fr-FR");

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = value.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  const normalized = date.split("T")[0];
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return value;
};

const FILTER_OPTIONS: {
  value: CapacityFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Toutes les capacités",
    color: "#556B2F",
  },
  {
    value: "small",
    label: "Petites capacités",
    color: "#2680eb",
  },
  {
    value: "medium",
    label: "Capacités moyennes",
    color: "#d99022",
  },
  {
    value: "large",
    label: "Grandes capacités",
    color: "#9655d9",
  },
];

function getCapacityFilter(capacity: number): CapacityFilter {
  if (capacity > 0 && capacity < 3000) return "small";
  if (capacity >= 3000 && capacity < 5000) return "medium";
  if (capacity >= 5000) return "large";
  return "all";
}

export function CiterneTable({
  citernes,
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}: CiterneTableProps) {
  const [capacityFilter, setCapacityFilter] =
    useState<CapacityFilter>("all");

  const filteredCiternes = useMemo(() => {
    if (capacityFilter === "all") return citernes;

    return citernes.filter(
      (citerne) =>
        getCapacityFilter(Number(citerne.capacity) || 0) ===
        capacityFilter
    );
  }, [citernes, capacityFilter]);

  const counts = useMemo(
    () => ({
      all: citernes.length,
      small: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === "small"
      ).length,
      medium: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === "medium"
      ).length,
      large: citernes.filter(
        (item) => getCapacityFilter(item.capacity) === "large"
      ).length,
    }),
    [citernes]
  );

  const handleReset = () => {
    setCapacityFilter("all");
  };

  const handleExport = () => {
    exportCsv({
      data: filteredCiternes,
      headers: [
        "Référence",
        "Nom",
        "Capacité (L)",
        "Date de fabrication",
      ],
      mapRow: (citerne) => [
        citerne.reference,
        citerne.libelle,
        citerne.capacity,
        formatDate(citerne.dateFabrication),
      ],
      filename: "citernes.csv",
    });
  };

  const columnDefs = useMemo<ColDef<Citerne>[]>(
    () => [
      {
        field: "reference",
        headerName: "Référence",
        flex: 1,
        minWidth: 155,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Citerne>) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6]">
                <Database className="size-[17px] text-[#556B2F]" />
              </div>

              <span className="font-semibold text-[#172033]">
                {params.data.reference || "—"}
              </span>
            </div>
          );
        },
      },
      {
        field: "libelle",
        headerName: "Nom",
        flex: 1.2,
        minWidth: 165,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Citerne>) => (
          <span className="text-sm text-[#334155]">
            {params.data?.libelle || "—"}
          </span>
        ),
      },
      {
        field: "capacity",
        headerName: "Capacité (L)",
        flex: 1.5,
        minWidth: 235,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<Citerne>) => {
          const capacity = Number(params.data?.capacity) || 0;
          const category = getCapacityFilter(capacity);

          const styles: Record<CapacityFilter, string> = {
            all: "bg-slate-50 text-slate-600",
            small: "bg-blue-50 text-blue-700",
            medium: "bg-amber-50 text-amber-700",
            large: "bg-purple-50 text-purple-700",
          };

          const labels: Record<CapacityFilter, string> = {
            all: "Capacité nulle",
            small: "Petite capacité",
            medium: "Capacité moyenne",
            large: "Grande capacité",
          };

          return (
            <div className="flex h-full items-center gap-3">
              <span className="text-[13px] font-semibold text-slate-800">
                {formatNumber(capacity)} L
              </span>

              <span
                className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${styles[category]}`}
              >
                {labels[category]}
              </span>
            </div>
          );
        },
      },
      {
        field: "dateFabrication",
        headerName: "Date de fabrication",
        flex: 1,
        minWidth: 165,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Citerne>) => (
          <div className="flex h-full items-center gap-2 text-sm text-[#64748b]">
            <CalendarDays className="size-4 shrink-0" />
            {formatDate(params.data?.dateFabrication)}
          </div>
        ),
      },
      {
        colId: "actions",
        headerName: "Actions",
        width: 115,
        minWidth: 115,
        maxWidth: 115,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<Citerne>) =>
          params.data ? (
            <TableActions
              item={params.data}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : null,
      },
    ],
    [onEdit, onDelete]
  );

  const defaultColDef = useMemo<ColDef<Citerne>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: false,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    }),
    []
  );

  const toolbar = (
    <div className="mb-3 rounded-xl border border-[#edf0f2] bg-white p-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((filter) => {
          const active = capacityFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => setCapacityFilter(filter.value)}
              className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                active
                  ? "border-transparent text-white shadow-sm"
                  : "border-[#edf0f2] bg-white text-[#475569] hover:bg-[#f8fafc]"
              }`}
              style={
                active
                  ? { backgroundColor: filter.color }
                  : undefined
              }
            >
              <Database
                className="size-4 shrink-0"
                style={{
                  color: active ? "#ffffff" : filter.color,
                }}
              />

              <span>{filter.label}</span>

              <span
                className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[#f1f5f9] text-[#64748b]"
                }`}
              >
                {counts[filter.value]}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-10 rounded-lg border-orange-200 bg-orange-50 px-4 text-sm font-medium text-orange-700 hover:bg-orange-100"
          >
            <RefreshCcw className="mr-2 size-4" />
            Réinitialiser
          </Button>

          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="h-10 rounded-lg"
            >
              <RefreshCcw
                className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={!filteredCiternes.length}
            className="h-10 rounded-lg border-[#556B2F] bg-[#F5F8F1] px-4 text-sm font-semibold text-[#556B2F] hover:bg-[#EAF0E2]"
          >
            <Download className="mr-2 size-4" />
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <GenericDataTable<Citerne>
      rowData={filteredCiternes}
      columnDefs={columnDefs}
      getRowId={(item) => String(item.citerneId)}
      theme={citerneTheme}
      toolbar={toolbar}
      rowHeight={44}
      headerHeight={40}
      initialPageSize={5}
      minWidth={850}
      emptyMessage="Aucune citerne trouvée"
    />
  );
}

export default CiterneTable;
