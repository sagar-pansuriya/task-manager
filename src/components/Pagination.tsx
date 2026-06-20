"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function getPageRange(current: number, total: number) {
    const pages: Array<number | "ellipsis"> = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      if (current <= 4) {
        // Near start
        pages.push(2, 3, 4, 5);
        pages.push("ellipsis");
        pages.push(total);
      } else if (current >= total - 3) {
        // Near end
        pages.push("ellipsis");
        for (let i = total - 4; i < total; i++) {
          pages.push(i);
        }
        pages.push(total);
      } else {
        // Middle
        pages.push("ellipsis");
        pages.push(current - 1, current, current + 1);
        pages.push("ellipsis");
        pages.push(total);
      }
    }

    return pages;
  }

  const pageRange = getPageRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Task list pagination"
      className="mt-6 flex flex-wrap items-center justify-between gap-4"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrevPage}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-650 transition shadow-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 enabled:hover:bg-slate-50 dark:enabled:hover:bg-slate-800/80 focus:outline-none"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
        Prev
      </button>

      {/* Pages Container */}
      <div className="flex items-center gap-1">
        {pageRange.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-slate-400 dark:text-slate-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition focus:outline-none",
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-500/25 dark:bg-brand-500"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNextPage}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-650 transition shadow-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 enabled:hover:bg-slate-50 dark:enabled:hover:bg-slate-800/80 focus:outline-none"
      >
        Next
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </nav>
  );
}


