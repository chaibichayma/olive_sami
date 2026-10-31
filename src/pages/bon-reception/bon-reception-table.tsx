import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { DateRangeFilter } from "@/components/common/DateRangeFilter";
import { StatusFilter } from "@/components/common/StatusFilter";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";
import { BonReception, DateRange, StatusFilterItem } from "@/components/reception/bon-reception.types";
import { BonReceptionHistory } from "@/components/reception/BonReceptionHistory";




interface BonReceptionTableProps {
  bons?: BonReception[];
  onEdit?: (bon: BonReception) => void;
  onDelete?: (bon: BonReception) => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value || 0);

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

function getStatusClass(status: string) {
  switch (status) {
    case "En cours":
      return "bg-[#dcfce7] text-[#16833b]";

    case "Terminé":
      return "bg-[#dbeafe] text-[#2563eb]";

    case "En attente":
      return "bg-[#ffedd5] text-[#ea580c]";

    case "Annulé":
      return "bg-[#fee2e2] text-[#dc2626]";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

function parseDate(value: string): Date | null {
  if (!value) return null;

  // Format ISO : YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Format français : DD/MM/YYYY
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    const date = new Date(
      Number(match[3]),
      Number(match[2]) - 1,
      Number(match[1]),
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function ReferenceRenderer(
  params: ICellRendererParams<BonReception>,
) {
  if (!params.data) return null;

  return (
    <div className="flex h-full flex-col justify-center">
      <span className="text-sm font-bold text-[#172033]">
        {params.data.reference}
      </span>
      <span className="text-[11px] text-[#94a3b8]">
        #{params.data.id}
      </span>
    </div>
  );
}

function CompteRenderer(
  params: ICellRendererParams<BonReception>,
) {
  if (!params.data) return null;

  return (
    <div className="flex h-full flex-col justify-center">
      <span className="text-sm font-semibold text-[#334155]">
        {params.data.name}
      </span>
      <span className="text-[11px] text-[#94a3b8]">
        Compte #{params.data.compteId}
      </span>
    </div>
  );
}

function StatusRenderer(
  params: ICellRendererParams<BonReception>,
) {
  if (!params.data) return null;

  return (
    <div className="flex h-full items-center">
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${getStatusClass(
          params.data.statusLib,
        )}`}
      >
        {params.data.statusLib === "En cours" ||
        params.data.statusLib === "Terminé" ? (
          <CheckCircle2 className="size-3.5" />
        ) : (
          <Clock3 className="size-3.5" />
        )}

        {params.data.statusLib}
      </span>
    </div>
  );
}

export function BonReceptionTable({
  bons = [],
  onEdit,
  onDelete,
}: BonReceptionTableProps) {
  const navigate = useNavigate();

  const gridApiRef = useRef<GridApi<BonReception> | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: "",
    end: "",
  });

  const [statusFilter, setStatusFilter] = useState("Tous");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBon, setSelectedBon] =
    useState<BonReception | null>(null);

  const [historyCompteId, setHistoryCompteId] =
    useState<number | null>(null);

  const [localBons, setLocalBons] =
    useState<BonReception[]>(bons);

  useEffect(() => {
    setLocalBons(bons);
  }, [bons]);

  const handleGridReady = (event: GridReadyEvent<BonReception>) => {
    gridApiRef.current = event.api;
  };

  const handleEdit = (bon: BonReception) => {
    if (onEdit) {
      onEdit(bon);
    } else {
      navigate(`/store-admin/reception-vouchers/edit/${bon.id}`);
    }
  };

  const handleDelete = (bon: BonReception) => {
    setSelectedBon(bon);
  };

  const confirmDelete = () => {
    if (!selectedBon) return;

    // Suppression frontend uniquement.
    setLocalBons((previous) =>
      previous.filter((bon) => bon.id !== selectedBon.id),
    );

    // Callback facultatif pour informer le composant parent.
    onDelete?.(selectedBon);

    setSelectedBon(null);
  };

  const handleReset = () => {
    setDateRange({ start: "", end: "" });
    setStatusFilter("Tous");
    setCurrentPage(1);
  };

  const handleExport = () => {
    gridApiRef.current?.exportDataAsCsv({
      fileName: "bons-reception.csv",
    });
  };

  const filteredBons = useMemo(() => {
    return localBons.filter((bon) => {
      const date = parseDate(bon.dateCreation);

      if (dateRange.start) {
        const start = new Date(`${dateRange.start}T00:00:00`);

        if (!date || date < start) return false;
      }

      if (dateRange.end) {
        const end = new Date(`${dateRange.end}T23:59:59`);

        if (!date || date > end) return false;
      }

      if (
        statusFilter !== "Tous" &&
        bon.statusLib !== statusFilter
      ) {
        return false;
      }

      return true;
    });
  }, [localBons, dateRange, statusFilter]);

  const statusCounts: StatusFilterItem[] = useMemo(() => {
    const statuses = [
      "Tous",
      "Non Affecté",
      "Non Pesé",
      "En attente",
      "Fin Prod",
      "Non Payé",
      "Validé",
    ];

    return statuses.map((label) => ({
      label,
      count:
        label === "Tous"
          ? localBons.length
          : localBons.filter((bon) => bon.statusLib === label).length,
    }));
  }, [localBons]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBons.length / pageSize),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, statusFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBons = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredBons.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [filteredBons, currentPage, pageSize]);

  const historyBons = useMemo(() => {
    if (historyCompteId === null) return [];

    return localBons.filter(
      (bon) => bon.compteId === historyCompteId,
    );
  }, [localBons, historyCompteId]);

  const columnDefs = useMemo<ColDef<BonReception>[]>(
    () => [
      {
        field: "reference",
        headerName: "Référence",
        minWidth: 140,
        cellRenderer: ReferenceRenderer,
      },
      {
        field: "name",
        headerName: "Compte",
        minWidth: 180,
        flex: 1,
        cellRenderer: CompteRenderer,
      },
      {
        field: "quantityOlive",
        headerName: "Olives (kg)",
        minWidth: 120,
        valueFormatter: (params) =>
          formatNumber(params.value),
      },
      {
        field: "quantityOil",
        headerName: "Huile (L)",
        minWidth: 110,
        valueFormatter: (params) =>
          formatNumber(params.value),
      },
      {
        field: "priceKg",
        headerName: "Prix/kg",
        minWidth: 110,
        valueFormatter: (params) =>
          `${formatPrice(params.value)} DT`,
      },
      {
        field: "price",
        headerName: "Prix total",
        minWidth: 120,
        valueFormatter: (params) =>
          `${formatPrice(params.value)} DT`,
      },
      {
        field: "payement",
        headerName: "Paiement",
        minWidth: 110,
        valueFormatter: (params) =>
          `${formatPrice(params.value)} DT`,
      },
      {
        field: "acompte",
        headerName: "Acompte",
        minWidth: 110,
        valueFormatter: (params) =>
          `${formatPrice(params.value)} DT`,
      },
      {
        field: "statusLib",
        headerName: "Statut",
        minWidth: 130,
        cellRenderer: StatusRenderer,
      },
      {
        field: "dateCreation",
        headerName: "Date création",
        minWidth: 130,
      },
      {
        colId: "history",
        headerName: "Historique",
        width: 105,
        minWidth: 105,
        maxWidth: 105,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<BonReception>) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Voir l'historique du compte"
                onClick={() =>
                  setHistoryCompteId(params.data!.compteId)
                }
                className="flex size-9 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#e1ebd6]"
              >
                <Eye className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
      {
        colId: "edit",
        headerName: "Modifier",
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        pinned: "right",
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<BonReception>) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Modifier"
                onClick={() => handleEdit(params.data!)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#e1ebd6]"
              >
                <Pencil className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
      {
        colId: "delete",
        headerName: "Supprimer",
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        pinned: "right",
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<BonReception>) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Supprimer"
                onClick={() => handleDelete(params.data!)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd]"
              >
                <Trash2 className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, navigate],
  );

  const defaultColDef = useMemo<ColDef<BonReception>>(
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
    [],
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          onReset={handleReset}
          onExport={handleExport}
        />

        <StatusFilter
          items={statusCounts}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="w-full px-4 pb-4">
          <DataTable<BonReception>
            rowData={paginatedBons}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={58}
            headerHeight={50}
            getRowId={({ data }) => data.id.toString()}
            onGridReady={handleGridReady}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      <BonReceptionHistory
        open={historyCompteId !== null}
        bons={historyBons}
        onClose={() => setHistoryCompteId(null)}
      />

      <ConfirmDialog
        open={selectedBon !== null}
        title="Supprimer le bon de réception"
        message="Voulez-vous vraiment supprimer le bon de réception ?"
        itemName={
          selectedBon
            ? `${selectedBon.reference} — ${selectedBon.name}`
            : undefined
        }
        onCancel={() => setSelectedBon(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}