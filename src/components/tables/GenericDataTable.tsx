
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type Theme,
} from "ag-grid-community";

import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GenericDataTableProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  getRowId: (item: T) => string;
  theme: Theme;
  toolbar?: ReactNode;
  rowHeight?: number;
  headerHeight?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  minWidth?: number;
  emptyMessage?: string;
  defaultColDef?: ColDef<T>;
}

export function GenericDataTable<T>({
  rowData,
  columnDefs,
  getRowId,
  theme,
  toolbar,
  rowHeight = 50,
  headerHeight = 45,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  minWidth = 900,
  emptyMessage = "Aucune donnée trouvée",
  defaultColDef,
}: GenericDataTableProps<T>) {
  const paginationId = useId();

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // Nombre total de pages
  const totalPages = Math.max(
    1,
    Math.ceil(rowData.length / pageSize)
  );

  // Corriger la page courante si les données changent
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const safePage = Math.min(currentPage, totalPages);

  // Données affichées sur la page actuelle
  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return rowData.slice(start, start + pageSize);
  }, [rowData, safePage, pageSize]);

  // Compteur des lignes
  const startIndex =
    rowData.length === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const endIndex = Math.min(
    safePage * pageSize,
    rowData.length
  );

  // Génération des numéros de pagination
  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - safePage) <= 1
      ) {
        const previous = pages[pages.length - 1];

        if (
          typeof previous === "number" &&
          page - previous > 1
        ) {
          pages.push(`ellipsis-${page}`);
        }

        pages.push(page);
      }
    }

    return pages;
  }, [totalPages, safePage]);

  // Changement de taille de page
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  // Page précédente
  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  // Page suivante
  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  };

  return (
    <div className="w-full min-w-0 space-y-3">

      {/* TOOLBAR PERSONNALISABLE */}
      {toolbar && (
        <div className="w-full">
          {toolbar}
        </div>
      )}

      {/* TABLEAU AG GRID */}
      <div className="w-full overflow-hidden rounded-xl border border-[#edf0f2] bg-white shadow-sm">

        <div className="w-full overflow-x-auto">
          <div
            className="w-full"
            style={{ minWidth: `${minWidth}px` }}
          >
            <AgGridProvider modules={[AllCommunityModule]}>
              <AgGridReact<T>
                rowData={paginatedRows}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                theme={theme}
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                animateRows
                suppressCellFocus
                suppressPaginationPanel
                getRowId={(params) =>
                  getRowId(params.data)
                }
                overlayNoRowsTemplate={`<span>${emptyMessage}</span>`}
                localeText={{
                  loadingOoo: "Chargement...",
                  noRowsToShow: emptyMessage,
                  filterOoo: "Filtrer...",
                  equals: "Égal à",
                  notEqual: "Différent de",
                  contains: "Contient",
                  notContains: "Ne contient pas",
                  startsWith: "Commence par",
                  endsWith: "Se termine par",
                  lessThan: "Inférieur à",
                  greaterThan: "Supérieur à",
                  applyFilter: "Appliquer",
                  resetFilter: "Réinitialiser",
                  clearFilter: "Effacer",
                }}
              />
            </AgGridProvider>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          {/* LIGNES PAR PAGE */}
          <div className="flex items-center gap-3">
            <label
              htmlFor={paginationId}
              className="whitespace-nowrap text-xs font-medium text-slate-500"
            >
              Lignes par page
            </label>

            <select
              id={paginationId}
              value={pageSize}
              onChange={handlePageSizeChange}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* COMPTEUR ET NAVIGATION */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">

            <span className="whitespace-nowrap text-xs text-slate-500">
              <strong className="text-slate-700">
                {startIndex} à {endIndex}
              </strong>{" "}
              sur{" "}
              <strong className="text-slate-700">
                {rowData.length}
              </strong>
            </span>

            <div className="flex items-center gap-1.5">

              {/* PRÉCÉDENT */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Page précédente"
                disabled={safePage <= 1}
                onClick={handlePreviousPage}
                className="size-9 p-0"
              >
                <ChevronRight className="size-4 rotate-180" />
              </Button>

              {/* NUMÉROS DE PAGES */}
              {visiblePages.map((page) =>
                typeof page === "string" ? (
                  <span
                    key={page}
                    className="flex size-9 items-center justify-center text-xs text-slate-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    aria-label={`Page ${page}`}
                    aria-current={
                      safePage === page ? "page" : undefined
                    }
                    onClick={() => setCurrentPage(page)}
                    className={`flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                      safePage === page
                        ? "border-[#465a27] bg-[#556B2F] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-[#f5f8f1]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* SUIVANT */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Page suivante"
                disabled={safePage >= totalPages}
                onClick={handleNextPage}
                className="size-9 p-0"
              >
                <ChevronRight className="size-4" />
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenericDataTable;
