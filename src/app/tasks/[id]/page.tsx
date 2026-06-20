"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTask } from "@/hooks/useTasks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleRemoteTaskCompletion,
  toggleLocalTaskCompletion,
  removeLocalTask,
  deleteRemoteTask,
} from "@/store/tasksSlice";
import { TaskDetailSkeleton } from "@/components/Skeletons";
import { ErrorState } from "@/components/States";
import { cn } from "@/lib/utils";
import { isLocalTask, getTaskMeta, type Task } from "@/types/task";
import { ArrowLeft, User, Folder, Calendar } from "lucide-react";
import { Modal } from "@/components/Modal";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const idParam = params.id;
  const isLocal = idParam ? idParam.startsWith("local") : false;

  const localTasks = useAppSelector((state) => state.tasks.localTasks);
  const remoteCompletionOverrides = useAppSelector((state) => state.tasks.remoteCompletionOverrides);
  const deletedRemoteTaskIds = useAppSelector((state) => state.tasks.deletedRemoteTaskIds);

  const localTask = isLocal ? localTasks.find((t) => t.id === idParam) : null;
  const numericId = !isLocal && idParam ? Number(idParam) : null;
  const isValidRemoteId = numericId !== null && Number.isInteger(numericId) && numericId > 0;
  const isDeleted = numericId !== null && deletedRemoteTaskIds.includes(numericId);

  const { data: remoteTask, isLoading, isError, refetch } = useTask(
    !isLocal && isValidRemoteId && !isDeleted ? numericId : null
  );

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  let task: Task | null = null;
  if (isLocal) {
    task = localTask ?? null;
  } else if (remoteTask && !isDeleted) {
    const meta = getTaskMeta(remoteTask.id);
    task = {
      ...remoteTask,
      completed: remoteCompletionOverrides[remoteTask.id] ?? remoteTask.completed,
      priority: meta.priority,
      category: meta.category,
    };
  }

  const completed = task?.completed ?? false;

  function handleToggleComplete() {
    if (!task) return;
    if (isLocalTask(task)) {
      dispatch(toggleLocalTaskCompletion({ id: task.id }));
    } else {
      dispatch(toggleRemoteTaskCompletion({ id: task.id, completed: !completed }));
    }
  }

  function handleConfirmDelete() {
    if (!task) return;
    if (isLocalTask(task)) {
      dispatch(removeLocalTask({ id: task.id }));
    } else {
      dispatch(deleteRemoteTask({ id: task.id }));
    }
    setIsDeleteConfirmOpen(false);
    router.push("/tasks");
  }

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
    medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  };

  const categoryStyles = {
    work: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
    personal: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-indigo-900/30",
    learning: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-indigo-900/30",
    health: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-indigo-900/30",
    other: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-800/50",
  };

  const hasTask = Boolean(task);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/tasks"
        className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to tasks
      </Link>

      {(!isLocal && !isValidRemoteId) || (numericId !== null && isDeleted) ? (
        <ErrorState message="This task could not be found or has been deleted." />
      ) : isLoading ? (
        <TaskDetailSkeleton />
      ) : isError || !hasTask || !task ? (
        <ErrorState
          message="Couldn't retrieve this task. It may not exist, or the server is down."
          onRetry={() => refetch()}
        />
      ) : (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:backdrop-blur-sm">
          {/* Header Banner */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 dark:bg-slate-950/40 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Task Workspace
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    completed
                      ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                      : "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                  )}
                >
                  {completed ? "Completed" : "Pending"}
                </span>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    priorityStyles[task.priority ?? "low"]
                  )}
                >
                  {task.priority ?? "low"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {task.title}
              </h1>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                Task ID: <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-950">{task.id}</code>
              </p>
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-1 gap-4 border-y border-slate-100 py-5 dark:border-slate-800 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-650 dark:bg-slate-950 dark:text-slate-450">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Assignee
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-355">
                    User #{task.userId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-650 dark:bg-slate-950 dark:text-slate-450">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Category
                  </span>
                  <span className={cn(
                    "inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider mt-0.5",
                    categoryStyles[task.category ?? "other"]
                  )}>
                    {task.category ?? "other"}
                  </span>
                </div>
              </div>

              {isLocalTask(task) && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-650 dark:bg-slate-950 dark:text-slate-450">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Created At
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-355">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Grid */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleComplete}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition-all duration-200 focus:outline-none",
                  completed
                    ? "bg-slate-100 text-slate-750 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    : "bg-emerald-500 text-white shadow-emerald-500/10 hover:bg-emerald-600 hover:shadow-md"
                )}
              >
                Mark as {completed ? "Pending" : "Completed"}
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 transition duration-200"
              >
                Delete Task
              </button>
            </div>
          </div>
        </article>
      )}

      <Modal title="Delete Task" isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{task?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(false)}
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

