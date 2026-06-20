"use client";

import { cn } from "@/lib/utils";
import type { TaskStatusFilter, TaskPriority, TaskCategory } from "@/types/task";
import type { TaskSortOption } from "@/hooks/useFilteredTasks";

interface FilterBarProps {
  status: TaskStatusFilter;
  onStatusChange: (value: TaskStatusFilter) => void;
  priority: TaskPriority | "all";
  onPriorityChange: (value: TaskPriority | "all") => void;
  category: TaskCategory | "all";
  onCategoryChange: (value: TaskCategory | "all") => void;
  sortBy: TaskSortOption;
  onSortChange: (value: TaskSortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_FILTERS: { label: string; value: TaskStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const PRIORITIES: { label: string; value: TaskPriority | "all" }[] = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const CATEGORIES: { label: string; value: TaskCategory | "all" }[] = [
  { label: "All Categories", value: "all" },
  { label: "Work", value: "work" },
  { label: "Personal", value: "personal" },
  { label: "Learning", value: "learning" },
  { label: "Health", value: "health" },
  { label: "Other", value: "other" },
];

const SORT_OPTIONS: { label: string; value: TaskSortOption }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "High Priority First", value: "priority" },
  { label: "Alphabetical (A-Z)", value: "alphabetical" },
];

export function FilterBar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Filters & Sorting
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Status
        </span>
        <div role="group" aria-label="Filter tasks by status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onStatusChange(f.value)}
              aria-pressed={status === f.value}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                status === f.value
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <label htmlFor="filter-priority" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Priority
        </label>
        <select
          id="filter-priority"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "all")}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label htmlFor="filter-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as TaskCategory | "all")}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <label htmlFor="sort-tasks" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Sort By
        </label>
        <select
          id="sort-tasks"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

