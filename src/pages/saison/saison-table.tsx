
import { useMemo, useState } from "react";

import {
  type ColDef,
  type ICellRendererParams,
  themeQuartz,
} from "ag-grid-community";

import {
  CalendarDays,
  ChevronDown,
  Circle,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { GenericDataTable } from "@/components/tables/GenericDataTable";
import { TableActions } from "@/components/tables/TableActions";
import { exportCsv } from "@/components/common/exportCsv";

export interface Saison {
  id: string;
  beginDate: string;
  endDate: string;
  statusId: number;
  year: number;
  priceKilo: number;
  priceAchat: number;
  priceVente: number;
  nbreCaisses: number;
}

interface SaisonTableProps {
  saisons: Saison[];
  onEdit?: (saison: Saison) => void;
  onDelete?: (saison: Saison) => void;
}

type SaisonStatus = "all" | "active" | "closed";

const saisonTheme = themeQuartz.withParams({
  accentColor: "#556B2F",
  backgroundColor: "#ffffff",
  foregroundColor: "#172033",
  headerBackgroundColor: "#f8fafc",
  headerTextColor: "#172033",
  borderColor: "#e5e7eb",
  rowBorder: {
    style: "solid",
    width: 1,
    color: "#edf0f2",
  },
  headerFontWeight: 600,
  fontSize: 13,
  spacing: 8,
});

const formatDate = (date?: string) => {
  if (!date) return "—";

  const value = date.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const match = value.split("T")[0].match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return value;
};

const formatPrice = (value: number) =>
  `${(Number(value) || 0).toFixed(2).replace(".", ",")} DT`;

export function SaisonTable({
  saisons,
  onEdit,
  onDelete,
}: SaisonTableProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<SaisonStatus>("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const filteredSaisons = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return saisons.filter((saison) => {
      const matchesSearch =
        !searchValue ||
        [
          saison.year,
          formatDate(saison.beginDate),
          formatDate(saison.endDate),
          saison.priceKilo,
          saison.priceAchat,
          saison.priceVente,
          saison.nbreCaisses,
        ].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesYear =
        selectedYear === "all" ||
        saison.year === Number(selectedYear);

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && saison.statusId === 1) ||
        (selectedStatus === "closed" && saison.statusId === 2);

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [saisons, search, selectedStatus, selectedYear]);

  const years = useMemo(
    () =>
      [...new Set(saisons.map((saison) => saison.year))].sort(
        (a, b) => b - a
      ),
    [saisons]
  );

  const activeCount = saisons.filter(
    (saison) => saison.statusId === 1
  ).length;

  const closedCount = saisons.filter(
    (saison) => saison.statusId === 2
  ).length;

  const handleReset = () => {
    setSearch("");
    setSelectedYear("all");
    setSelectedStatus("all");
  };

  const handleExport = () => {
    exportCsv({
      data: filteredSaisons,
      headers: [
        "Année",
        "Date début",
        "Date fin",
        "Prix/kg d'olive (DT)",
        "Prix achat huile (DT)",
        "Prix vente huile (DT)",
        "Nombre de caisses",
        "Statut",
      ],
      mapRow: (saison) => [
        saison.year,
        formatDate(saison.beginDate),
        formatDate(saison.endDate),
        saison.priceKilo,
        saison.priceAchat,
        saison.priceVente,
        saison.nbreCaisses,
        saison.statusId === 1 ? "En cours" : "Clôturée",
      ],
      filename: "saisons.csv",
    });
  };

  const columnDefs = useMemo<ColDef<Saison>[]>(
    () => [
      {
        field: "year",
        headerName: "Année",
        minWidth: 100,
        width: 120,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => {
          const saison = params.data;
          if (!saison) return null;

          const isCurrent = saison.statusId === 1;

          return (
            <div className="flex h-full items-center gap-2">
              <span
                className={`size-2 shrink-0 rounded-full ${
                  isCurrent ? "bg-[#7FA33B]" : "bg-[#cbd0d8]"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  isCurrent ? "text-[#1f2937]" : "text-[#334155]"
                }`}
              >
                {saison.year}
              </span>
            </div>
          );
        },
      },
      {
        field: "beginDate",
        headerName: "Date début",
        minWidth: 155,
        width: 170,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => (
          <div className="flex h-full items-center gap-2 whitespace-nowrap">
            <CalendarDays className="size-4 shrink-0 text-[#64748b]" />
            <span className="text-sm text-[#334155]">
              {formatDate(params.data?.beginDate)}
            </span>
          </div>
        ),
      },
      {
        field: "endDate",
        headerName: "Date fin",
        minWidth: 155,
        width: 170,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => (
          <div className="flex h-full items-center gap-2 whitespace-nowrap">
            <CalendarDays className="size-4 shrink-0 text-[#64748b]" />
            <span className="text-sm text-[#334155]">
              {formatDate(params.data?.endDate)}
            </span>
          </div>
        ),
      },
      {
        field: "priceKilo",
        headerName: "Prix/kg d'olive (DT)",
        minWidth: 175,
        width: 190,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => (
          <span className="whitespace-nowrap text-sm font-semibold text-[#1f2937]">
            {formatPrice(Number(params.value))}
          </span>
        ),
      },
      {
        field: "priceAchat",
        headerName: "Prix achat huile (DT)",
        minWidth: 180,
        width: 195,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => (
          <span className="whitespace-nowrap text-sm font-semibold text-[#1f2937]">
            {formatPrice(Number(params.value))}
          </span>
        ),
      },
      {
        field: "priceVente",
        headerName: "Prix vente huile (DT)",
        minWidth: 180,
        width: 195,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<Saison>) => (
          <span className="whitespace-nowrap text-sm font-semibold text-[#1f2937]">
            {formatPrice(Number(params.value))}
          </span>
        ),
      },
      {
        colId: "edit",
        headerName: "Modifier",
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<Saison>) =>
          params.data ? (
            <TableActions
              item={params.data}
              onEdit={onEdit}
              editLabel="Modifier la saison"
            />
          ) : null,
      },
      {
        colId: "delete",
        headerName: "Supprimer",
        width: 95,
        minWidth: 95,
        maxWidth: 95,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<Saison>) =>
          params.data ? (
            <TableActions
              item={params.data}
              onDelete={onDelete}
              deleteLabel="Supprimer la saison"
            />
          ) : null,
      },
    ],
    [onEdit, onDelete]
  );

  const defaultColDef = useMemo<ColDef<Saison>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    }),
    []
  );

  const toolbar = (
    <div className="w-full border-b border-slate-100 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end">
        <div className="w-full shrink-0 2xl:w-[220px]">
          <label
            htmlFor="saison-year"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Année
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-500" />

            <select
              id="saison-year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="h-11 w-full appearance-none rounded-md border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
            >
              <option value="all">Toutes les années</option>

              {years.map((year) => (
                <option key={year} value={String(year)}>
                  Saison {year}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={selectedStatus === "all"}
            onClick={() => setSelectedStatus("all")}
            className={`flex h-11 items-center gap-3 rounded-md border px-4 ${
              selectedStatus === "all"
                ? "border-[#c6dfb3] bg-[#f1f8eb] text-[#426329]"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Toutes
            <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
              {saisons.length}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={selectedStatus === "active"}
            onClick={() => setSelectedStatus("active")}
            className={`flex h-11 items-center gap-3 rounded-md border px-4 ${
              selectedStatus === "active"
                ? "border-[#c6dfb3] bg-[#f1f8eb] text-[#426329]"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <Circle className="size-3 fill-[#4d7c2f] text-[#4d7c2f]" />
            En cours
            <span className="flex size-7 items-center justify-center rounded-full bg-[#e4efd8] text-xs font-bold text-[#426329]">
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={selectedStatus === "closed"}
            onClick={() => setSelectedStatus("closed")}
            className={`flex h-11 items-center gap-3 rounded-md border px-4 ${
              selectedStatus === "closed"
                ? "border-slate-300 bg-slate-100 text-slate-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <Circle className="size-3 fill-slate-500 text-slate-500" />
            Clôturées
            <span className="flex size-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
              {closedCount}
            </span>
          </button>
        </div>

        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une saison..."
            aria-label="Rechercher une saison"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-[#556B2F] focus:bg-white focus:ring-2 focus:ring-[#556B2F]/10"
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-10 rounded-lg border-orange-200 bg-orange-50 px-4 text-sm font-semibold text-orange-700 hover:bg-orange-100"
          >
            <RotateCcw className="mr-2 size-4" />
            Réinitialiser
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={filteredSaisons.length === 0}
            className="h-10 rounded-lg border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-semibold text-[#556B2F] hover:bg-[#EAF2E0]"
          >
            <Download className="mr-2 size-4" />
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <GenericDataTable<Saison>
      rowData={filteredSaisons}
      columnDefs={columnDefs}
      getRowId={(item) => item.id}
      theme={saisonTheme}
      toolbar={toolbar}
      rowHeight={58}
      headerHeight={50}
      initialPageSize={10}
      minWidth={1100}
      emptyMessage="Aucune saison trouvée"
    />
  );
}

export default SaisonTable;
