import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { DateRangeFilter } from "@/components/common/DateRangeFilter";
import { StatusFilter } from "@/components/common/StatusFilter";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";


import ActionIconButton from "@/components/common/ActionIconButton";

import type {
  BonReception,
  DateRange,
  StatusFilterItem,
} from "@/components/reception/bon-reception.types";

import { BonReceptionHistory } from "@/components/reception/BonReceptionHistory";

import { usePagination } from "@/hooks/usePagination";
import { exportCsv } from "@/utils/exportCsv";
import { StatusBadge } from "@/components/common/StatusBadge";

// --------------------------------------------------
// PROPS
// --------------------------------------------------

interface BonReceptionTableProps {
  bons?: BonReception[];
  onEdit?: (bon: BonReception) => void;
  onDelete?: (bon: BonReception) => void;
}

// --------------------------------------------------
// FORMATAGE
// --------------------------------------------------

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value || 0);

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

// --------------------------------------------------
// CONVERSION DES DATES
// --------------------------------------------------

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
      Number(match[1])
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// --------------------------------------------------
// RENDERER : RÉFÉRENCE
// --------------------------------------------------

function ReferenceRenderer(
  params: ICellRendererParams<BonReception>
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

// --------------------------------------------------
// RENDERER : COMPTE
// --------------------------------------------------

function CompteRenderer(
  params: ICellRendererParams<BonReception>
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

// --------------------------------------------------
// RENDERER : STATUT
// --------------------------------------------------

function StatusRenderer(
  params: ICellRendererParams<BonReception>
) {
  if (!params.data) return null;

  return (
    <div className="flex h-full items-center">
  <StatusBadge label={params.data.statusLib} />
</div>
  );
}

// --------------------------------------------------
// COMPOSANT PRINCIPAL
// --------------------------------------------------

export function BonReceptionTable({
  bons = [],
  onEdit,
  onDelete,
}: BonReceptionTableProps) {
  const navigate = useNavigate();

  // ------------------------------------------------
  // ÉTATS
  // ------------------------------------------------

  const [dateRange, setDateRange] = useState<DateRange>({
    start: "",
    end: "",
  });

  const [statusFilter, setStatusFilter] = useState("Tous");

  const [selectedBon, setSelectedBon] =
    useState<BonReception | null>(null);

  const [historyCompteId, setHistoryCompteId] =
    useState<number | null>(null);

  const [localBons, setLocalBons] =
    useState<BonReception[]>(bons);

  // Synchroniser les données reçues du parent
  useEffect(() => {
    setLocalBons(bons);
  }, [bons]);

  // ------------------------------------------------
  // MODIFICATION
  // ------------------------------------------------

  const handleEdit = (bon: BonReception) => {
    if (onEdit) {
      onEdit(bon);
    } else {
      navigate(
        `/store-admin/reception-vouchers/edit/${bon.id}`
      );
    }
  };

  // ------------------------------------------------
  // SUPPRESSION
  // ------------------------------------------------

  const handleDelete = (bon: BonReception) => {
    setSelectedBon(bon);
  };

  const confirmDelete = () => {
    if (!selectedBon) return;

    // Suppression locale
    setLocalBons((previous) =>
      previous.filter((bon) => bon.id !== selectedBon.id)
    );

    // Informer le parent si un callback est fourni
    onDelete?.(selectedBon);

    setSelectedBon(null);
  };

  // ------------------------------------------------
  // RÉINITIALISER LES FILTRES
  // ------------------------------------------------

  const handleReset = () => {
    setDateRange({
      start: "",
      end: "",
    });

    setStatusFilter("Tous");
  };

  // ------------------------------------------------
  // FILTRAGE
  // ------------------------------------------------

  const filteredBons = useMemo(() => {
    return localBons.filter((bon) => {
      const date = parseDate(bon.dateCreation);

      if (dateRange.start) {
        const start = new Date(
          `${dateRange.start}T00:00:00`
        );

        if (!date || date < start) return false;
      }

      if (dateRange.end) {
        const end = new Date(
          `${dateRange.end}T23:59:59`
        );

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

  // ------------------------------------------------
  // NOMBRE DE BONS PAR STATUT
  // ------------------------------------------------

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
          : localBons.filter(
              (bon) => bon.statusLib === label
            ).length,
    }));
  }, [localBons]);

  // ------------------------------------------------
  // PAGINATION RÉUTILISABLE
  // ------------------------------------------------

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData: paginatedBons,
    setCurrentPage,
    setPageSize,
  } = usePagination(filteredBons, 10);

  // Revenir à la première page lorsque les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, statusFilter, setCurrentPage]);

  // ------------------------------------------------
  // HISTORIQUE DU COMPTE
  // ------------------------------------------------

  const historyBons = useMemo(() => {
    if (historyCompteId === null) return [];

    return localBons.filter(
      (bon) => bon.compteId === historyCompteId
    );
  }, [localBons, historyCompteId]);

  // ------------------------------------------------
  // EXPORT CSV
  // ------------------------------------------------

  const handleExport = () => {
    exportCsv({
      data: filteredBons,
      filename: "bons-reception.csv",
      columns: [
        {
          header: "Référence",
          accessor: (bon) => bon.reference,
        },
        {
          header: "Compte",
          accessor: (bon) => bon.name,
        },
        {
          header: "ID compte",
          accessor: (bon) => bon.compteId,
        },
        {
          header: "Quantité olives (kg)",
          accessor: (bon) => bon.quantityOlive,
        },
        {
          header: "Quantité huile (L)",
          accessor: (bon) => bon.quantityOil,
        },
        {
          header: "Prix/kg (DT)",
          accessor: (bon) => bon.priceKg.toFixed(2),
        },
        {
          header: "Prix total (DT)",
          accessor: (bon) => bon.price.toFixed(2),
        },
        {
          header: "Paiement (DT)",
          accessor: (bon) => bon.payement.toFixed(2),
        },
        {
          header: "Acompte (DT)",
          accessor: (bon) => bon.acompte.toFixed(2),
        },
        {
          header: "Statut",
          accessor: (bon) => bon.statusLib,
        },
        {
          header: "Date de création",
          accessor: (bon) => bon.dateCreation,
        },
      ],
    });
  };

  // ------------------------------------------------
  // COLONNES AG GRID
  // ------------------------------------------------

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

      // HISTORIQUE
      {
        colId: "history",
        headerName: "Historique",
        width: 105,
        minWidth: 105,
        maxWidth: 105,
        sortable: false,
        filter: false,
        cellRenderer: (
          params: ICellRendererParams<BonReception>
        ) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <ActionIconButton
                icon={<Eye className="size-[17px]" />}
                label="Voir l'historique du compte"
                onClick={() =>
                  setHistoryCompteId(params.data!.compteId)
                }
              />
            </div>
          );
        },
      },

      // MODIFIER
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
        cellRenderer: (
          params: ICellRendererParams<BonReception>
        ) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <ActionIconButton
                icon={<Pencil className="size-[17px]" />}
                label="Modifier"
                onClick={() => handleEdit(params.data!)}
              />
            </div>
          );
        },
      },

      // SUPPRIMER
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
        cellRenderer: (
          params: ICellRendererParams<BonReception>
        ) => {
          if (!params.data) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <ActionIconButton
                icon={<Trash2 className="size-[17px]" />}
                label="Supprimer"
                variant="danger"
                onClick={() => handleDelete(params.data!)}
              />
            </div>
          );
        },
      },
    ],
    [onEdit, navigate]
  );

  // ------------------------------------------------
  // CONFIGURATION AG GRID
  // ------------------------------------------------

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
    []
  );

  // ------------------------------------------------
  // RENDU
  // ------------------------------------------------

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* FILTRE PAR DATE */}
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          onReset={handleReset}
          onExport={handleExport}
        />

        {/* FILTRE PAR STATUT */}
        <StatusFilter
          items={statusCounts}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        {/* TABLEAU */}
        <div className="w-full px-4 pb-4">
          <DataTable<BonReception>
            rowData={paginatedBons}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={58}
            headerHeight={50}
            getRowId={({ data }) => data.id.toString()}
          />

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* HISTORIQUE DU COMPTE */}
      <BonReceptionHistory
        open={historyCompteId !== null}
        bons={historyBons}
        onClose={() => setHistoryCompteId(null)}
      />

      {/* CONFIRMATION DE SUPPRESSION */}
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

export default BonReceptionTable;