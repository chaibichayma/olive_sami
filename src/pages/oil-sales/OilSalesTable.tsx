
import {
  Download,
  Phone,
  Pencil,
  Trash2,
  ShoppingCart,
} from "lucide-react";

import { Pagination } from "@/components/common/Pagination";
import { DataTable } from "@/components/common/DataTable";

import type { ColDef } from "ag-grid-community";
import type { VenteHuile } from "./oil-sales.types";

interface OilSalesTableProps {
  ventes: VenteHuile[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (vente: VenteHuile) => void;
  onDelete: (vente: VenteHuile) => void;
  onExport: () => void;
}

const formatNombre = (valeur: number) =>
  valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function OilSalesTable({
  ventes,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onExport,
}: OilSalesTableProps) {
  const columns: ColDef<VenteHuile>[] = [
    {
      headerName: "#",
      valueGetter: (params) =>
        (params.node?.rowIndex ?? 0) + 1,
      width: 75,
      sortable: false,
      filter: false,
    },
    {
      field: "compte",
      headerName: "N° compte",
      flex: 1,
      minWidth: 130,
      cellClass: "font-semibold",
    },
    {
      field: "telephone",
      headerName: "Téléphone",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: { value: string }) => (
        <span className="inline-flex items-center gap-2 text-sm text-[#39465b]">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#edf3e5] text-[#526b32]">
            <Phone size={15} />
          </span>
          {params.value}
        </span>
      ),
    },
    {
      field: "quantite",
      headerName: "Quantité huile (L)",
      flex: 1,
      minWidth: 145,
      cellClass: "text-center",
      valueFormatter: (params) =>
        formatNombre(Number(params.value ?? 0)),
    },
    {
      field: "prixLitre",
      headerName: "Prix litre (DT)",
      flex: 1,
      minWidth: 135,
      cellClass: "text-center",
      valueFormatter: (params) =>
        formatNombre(Number(params.value ?? 0)),
    },
    {
      headerName: "Total (DT)",
      flex: 1,
      minWidth: 135,
      cellClass: "font-bold text-center",
      valueGetter: (params) =>
        (params.data?.quantite ?? 0) *
        (params.data?.prixLitre ?? 0),
      valueFormatter: (params) =>
        formatNombre(Number(params.value ?? 0)),
    },
    {
      headerName: "Modifier",
      width: 105,
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: VenteHuile }) => (
        <button
          type="button"
          title="Modifier"
          aria-label={`Modifier la vente ${params.data.compte}`}
          onClick={() => onEdit(params.data)}
          className="inline-flex size-9 items-center justify-center rounded-xl border border-[#dce4f0] bg-[#f0f4fa] text-[#34465f] transition hover:bg-[#e2eaf6]"
        >
          <Pencil size={17} />
        </button>
      ),
    },
    {
      headerName: "Supprimer",
      width: 110,
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: VenteHuile }) => (
        <button
          type="button"
          title="Supprimer"
          aria-label={`Supprimer la vente ${params.data.compte}`}
          onClick={() => onDelete(params.data)}
          className="inline-flex size-9 items-center justify-center rounded-xl border border-[#ffd8d8] bg-[#fff0f0] text-[#e32626] transition hover:bg-[#ffe1e1]"
        >
          <Trash2 size={17} />
        </button>
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-sm">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#526b32]">
            <ShoppingCart size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#26364a]">
              Liste des ventes d'huile
            </h2>
            <p className="mt-1 text-sm text-[#839080]">
              Consultez et gérez toutes les ventes enregistrées.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f7f9f4] px-4 py-3 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
        >
          <Download size={18} />
          Exporter
        </button>
      </div>

      {/* Tableau AG Grid */}
      <DataTable<VenteHuile>
        rowData={ventes}
        columnDefs={columns}
        getRowId={(params) => String(params.data.id)}
        rowHeight={58}
        headerHeight={50}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="vente(s)"
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
