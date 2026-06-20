import { useMemo, useState } from "react";

interface UsePaginationResult<T> {
  pageItems: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePagination<T>(items: T[], pageSize: number, resetKey: unknown): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setCurrentPage(1);
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  return {
    pageItems,
    currentPage: safePage,
    totalPages,
    pageSize,
    totalItems,
    goToPage,
    nextPage: () => goToPage(safePage + 1),
    prevPage: () => goToPage(safePage - 1),
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
}
