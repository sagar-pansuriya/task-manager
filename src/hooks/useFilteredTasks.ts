import { useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAppSelector } from "@/store/hooks";
import {
  type Task,
  type TaskStatusFilter,
  type TaskPriority,
  type TaskCategory,
  isLocalTask,
  getTaskMeta,
} from "@/types/task";

export type TaskSortOption = "newest" | "oldest" | "priority" | "alphabetical";

interface UseFilteredTasksArgs {
  statusFilter: TaskStatusFilter;
  priorityFilter: TaskPriority | "all";
  categoryFilter: TaskCategory | "all";
  sortBy: TaskSortOption;
  searchTerm: string; // already-debounced value
}

export function useFilteredTasks({
  statusFilter,
  priorityFilter,
  categoryFilter,
  sortBy,
  searchTerm,
}: UseFilteredTasksArgs) {
  const tasksQuery = useTasks();
  const localTasks = useAppSelector((state) => state.tasks.localTasks);
  const remoteCompletionOverrides = useAppSelector((state) => state.tasks.remoteCompletionOverrides);
  const deletedRemoteTaskIds = useAppSelector((state) => state.tasks.deletedRemoteTaskIds);

  const mergedTasks: Task[] = useMemo(() => {
    // 1. Filter out deleted remote tasks
    const activeRemoteTasks = (tasksQuery.data ?? []).filter(
      (task) => !deletedRemoteTaskIds.includes(task.id)
    );

    // 2. Map remote tasks with optimistic completion overrides and metadata
    const remoteWithOverrides: Task[] = activeRemoteTasks.map((task) => {
      const meta = getTaskMeta(task.id);
      return {
        ...task,
        completed: remoteCompletionOverrides[task.id] ?? task.completed,
        priority: meta.priority,
        category: meta.category,
      };
    });

    return [...localTasks, ...remoteWithOverrides];
  }, [tasksQuery.data, localTasks, remoteCompletionOverrides, deletedRemoteTaskIds]);

  const filteredAndSortedTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // Filtering
    const filtered = mergedTasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "pending" && !task.completed);

      const matchesSearch =
        normalizedSearch.length === 0 || task.title.toLowerCase().includes(normalizedSearch);

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;

      return matchesStatus && matchesSearch && matchesPriority && matchesCategory;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeight[a.priority ?? "low"];
        const weightB = priorityWeight[b.priority ?? "low"];
        if (weightA !== weightB) {
          return weightB - weightA; 
        }
      }

      if (sortBy === "oldest") {
        // Sort oldest first
        if (isLocalTask(a) && isLocalTask(b)) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (isLocalTask(a)) return 1; 
        if (isLocalTask(b)) return -1; 
        return a.id - b.id; 
      }

      if (isLocalTask(a) && isLocalTask(b)) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (isLocalTask(a)) return -1; 
      if (isLocalTask(b)) return 1; 
      return b.id - a.id; 
    });
  }, [mergedTasks, statusFilter, priorityFilter, categoryFilter, sortBy, searchTerm]);

  const completedCount = useMemo(() => {
    return mergedTasks.filter((t) => t.completed).length;
  }, [mergedTasks]);

  const pendingCount = mergedTasks.length - completedCount;

  return {
    tasks: filteredAndSortedTasks,
    totalCount: mergedTasks.length,
    completedCount,
    pendingCount,
    isLoading: tasksQuery.isLoading,
    isFetching: tasksQuery.isFetching,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
  };
}


