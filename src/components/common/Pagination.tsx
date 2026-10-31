
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems?: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    safeTotalPages
  );

  const startItem =
    totalItems === undefined || totalItems === 0
      ? 0
      : (safeCurrentPage - 1) * pageSize + 1;

  const endItem =
    totalItems === undefined
      ? 0
      : Math.min(safeCurrentPage * pageSize, totalItems);

  const getPages = (): (number | "...")[] => {
    if (safeTotalPages <= 5) {
      return Array.from(
        { length: safeTotalPages },
        (_, index) => index + 1
      );
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, "...", safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 2) {
      return [
        1,
        "...",
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      safeTotalPages,
    ];
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#edf0f2] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

      {/* GAUCHE : TAILLE DE PAGE */}

      <div className="flex items-center gap-3">
        <label
          htmlFor="pagination-page-size"
          className="whitespace-nowrap text-xs font-medium text-[#64748b]"
        >
          Lignes par page
        </label>

        <select
          id="pagination-page-size"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="h-9 min-w-[64px] rounded-lg border border-[#dfe4e9] bg-white px-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#82995e] focus:ring-2 focus:ring-[#82995e]/10"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* DROITE : INFORMATIONS ET NAVIGATION */}

      <div className="flex items-center justify-between gap-3 sm:justify-end">

        {/* Nombre d'éléments */}

        {totalItems !== undefined && (
          <span className="whitespace-nowrap text-xs font-semibold text-[#334155]">
            {startItem} à {endItem} sur {totalItems}
          </span>
        )}

        {/* Navigation */}

        <div className="flex items-center gap-1.5">

          {/* Précédent */}

          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => onPageChange(safeCurrentPage - 1)}
            aria-label="Page précédente"
            className="flex size-9 items-center justify-center rounded-lg border border-[#e5e9ed] bg-white text-[#64748b] transition hover:border-[#556B2F] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          {/* Numéros de pages */}

          {getPages().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-sm text-[#94a3b8]"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={
                  safeCurrentPage === page ? "page" : undefined
                }
                className={`flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  safeCurrentPage === page
                    ? "border-[#556B2F] bg-[#556B2F] text-white"
                    : "border-[#e5e9ed] bg-white text-[#475569] hover:border-[#556B2F] hover:text-[#556B2F]"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Suivant */}

          <button
            type="button"
            disabled={safeCurrentPage === safeTotalPages}
            onClick={() => onPageChange(safeCurrentPage + 1)}
            aria-label="Page suivante"
            className="flex size-9 items-center justify-center rounded-lg border border-[#e5e9ed] bg-white text-[#64748b] transition hover:border-[#556B2F] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
