"use client";

import Link from "next/link";
import { memo } from "react";
import { isLocalTask, type Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskCardImpl({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const detailHref = `/tasks/${task.id}`;

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
    medium: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    low: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  };

  const categoryStyles = {
    work: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
    personal: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
    learning: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/30",
    health: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    other: "bg-slate-50 text-slate-700 border-slate-200/60 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-800/50",
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-850 dark:bg-slate-900/70 dark:backdrop-blur-sm",
        task.completed && "bg-slate-50/50 dark:bg-slate-900/30 opacity-80"
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Custom Animated Checkbox Button */}
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          aria-label={task.completed ? "Mark task as pending" : "Mark task as completed"}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            task.completed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
              : "border-slate-300 text-transparent hover:border-brand-500 dark:border-slate-650 dark:hover:border-brand-400"
          )}
        >
          {task.completed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-checkmark"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          ) : (
            <div className="h-2 w-2 rounded-full bg-brand-500 scale-0 group-hover:scale-100 transition duration-300" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <Link
            href={detailHref}
            className={cn(
              "block truncate text-[15px] font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-650 dark:hover:text-brand-400 transition-colors",
              task.completed && "line-through text-slate-500 dark:text-slate-450"
            )}
          >
            {task.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>User #{task.userId}</span>
            <span>•</span>
            <span className={cn(
              "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              categoryStyles[task.category ?? "other"]
            )}>
              {task.category ?? "other"}
            </span>
            {isLocalTask(task) && (
              <>
                <span>•</span>
                <span className="font-medium text-brand-600/80 dark:text-brand-400/80">
                  added just now
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Priority Badge */}
        <span
          className={cn(
            "hidden xs:inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            priorityStyles[task.priority ?? "low"]
          )}
        >
          {task.priority ?? "low"}
        </span>

        {/* Delete Action Button */}
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Memoized for performance
export const TaskCard = memo(TaskCardImpl);

