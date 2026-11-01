import { useMemo, useState } from "react";

export function usePagination<T>(
  data: T[],
  initialPageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;

    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safePage, pageSize]);

  function changePage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  function changePageSize(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  function resetPagination() {
    setCurrentPage(1);
  }

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    totalItems: data.length,
    paginatedData,
    setCurrentPage: changePage,
    setPageSize: changePageSize,
    resetPagination,
  };
}