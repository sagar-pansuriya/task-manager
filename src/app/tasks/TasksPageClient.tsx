"use client";

import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { TaskForm } from "@/components/TaskForm";
import { Modal } from "@/components/Modal";
import { TaskListSkeleton } from "@/components/Skeletons";
import { ErrorState, EmptyState } from "@/components/States";
import { Pagination } from "@/components/Pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFilteredTasks, type TaskSortOption } from "@/hooks/useFilteredTasks";
import { usePagination } from "@/hooks/usePagination";
import { useAppDispatch } from "@/store/hooks";
import {
  addLocalTask,
  toggleLocalTaskCompletion,
  toggleRemoteTaskCompletion,
  removeLocalTask,
  deleteRemoteTask,
} from "@/store/tasksSlice";
import { isLocalTask, type Task, type TaskStatusFilter, type TaskPriority, type TaskCategory } from "@/types/task";
import { Plus, RefreshCw } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 10;

export function TasksPageClient() {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");
  const [sortBy, setSortBy] = useState<TaskSortOption>("newest");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  const {
    tasks,
    totalCount,
    completedCount,
    pendingCount,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useFilteredTasks({
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortBy,
    searchTerm: debouncedSearch,
  });

  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    debouncedSearch !== "";

  function handleClearFilters() {
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSearchInput("");
  }

  // Sync pagination reset key
  const paginationResetKey = `${statusFilter}:${priorityFilter}:${categoryFilter}:${sortBy}:${debouncedSearch}`;

  const {
    pageItems,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = usePagination(tasks, PAGE_SIZE, paginationResetKey);

  function handleToggleComplete(task: Task) {
    if (isLocalTask(task)) {
      dispatch(toggleLocalTaskCompletion({ id: task.id }));
    } else {
      dispatch(toggleRemoteTaskCompletion({ id: task.id, completed: !task.completed }));
    }
  }

  function handleCreateTask(
    title: string,
    priority: TaskPriority,
    category: TaskCategory,
    userId: number
  ) {
    dispatch(addLocalTask({ title, userId, priority, category }));
    setIsFormOpen(false);
  }

  function handleDeleteTask(task: Task) {
    setTaskToDelete(task);
  }

  function handleConfirmDelete() {
    if (!taskToDelete) return;
    if (isLocalTask(taskToDelete)) {
      dispatch(removeLocalTask({ id: taskToDelete.id }));
    } else {
      dispatch(deleteRemoteTask({ id: taskToDelete.id }));
    }
    setTaskToDelete(null);
  }

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Metrics Row */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Task metrics dashboard">
        {/* Metric 1: Completion Rate */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:backdrop-blur-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completion Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {completionRate}%
              </span>
              <span className="text-xs text-slate-400">
                ({completedCount} of {totalCount} completed)
              </span>
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200/30 dark:border-slate-800/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pending Tasks */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:backdrop-blur-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pending Tasks
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-450">
                {pendingCount}
              </span>
              <span className="text-xs text-slate-400">requires action</span>
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-450">
            Keep crushing your goals!
          </div>
        </div>

        {/* Metric 3: Total Tasks */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:backdrop-blur-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Managed Tasks
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-brand-600 dark:text-brand-400">
                {totalCount}
              </span>
              <span className="text-xs text-slate-400">active items</span>
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-450">
            Syncing with JSONPlaceholder API
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Sidebar Filters */}
        <aside className="md:col-span-4">
          <FilterBar
            status={statusFilter}
            onStatusChange={setStatusFilter}
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Task List Panel */}
        <section className="md:col-span-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search input */}
            <div className="flex-1">
              <SearchBar value={searchInput} onChange={setSearchInput} />
            </div>

            {/* Actions & Refresh */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-slate-400">
                {isFetching && !isLoading && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-650 dark:text-brand-400">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    syncing...
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/10 hover:from-brand-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg focus:outline-none"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
                New Task
              </button>
            </div>
          </div>

          {/* List States */}
          {isLoading ? (
            <TaskListSkeleton />
          ) : isError ? (
            <ErrorState
              message="Couldn't retrieve tasks. Please verify your connection."
              onRetry={() => refetch()}
            />
          ) : tasks.length === 0 ? (
            <EmptyState
              message={
                debouncedSearch
                  ? `No matching tasks found for "${debouncedSearch}".`
                  : "Workspace is empty. Create a task to get started."
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {pageItems.map((task) => (
                  <TaskCard
                    key={isLocalTask(task) ? task.id : `remote-${task.id}`}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>

              {/* Pagination footer */}
              <div className="border-t border-slate-200/50 pt-4 dark:border-slate-800/40">
                <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                  Showing {rangeStart}–{rangeEnd} of {totalItems} matches
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPrevPage={hasPrevPage}
                  onNext={nextPage}
                  onPrev={prevPage}
                  onPageChange={goToPage}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      <Modal title="Create New Task" isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal title="Delete Task" isOpen={taskToDelete !== null} onClose={() => setTaskToDelete(null)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{taskToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTaskToDelete(null)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
