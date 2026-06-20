"use client";

import { useState, type FormEvent } from "react";
import type { TaskPriority, TaskCategory } from "@/types/task";

interface TaskFormProps {
  onSubmit: (title: string, priority: TaskPriority, category: TaskCategory, userId: number) => void;
  onCancel: () => void;
}

const MIN_TITLE_LENGTH = 3;

const CATEGORIES: TaskCategory[] = ["work", "personal", "learning", "health", "other"];
const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("work");
  const [userId, setUserId] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  function validate(value: string): string | null {
    const trimmed = value.trim();
    if (trimmed.length === 0) return "Title is required.";
    if (trimmed.length < MIN_TITLE_LENGTH) {
      return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
    }
    return null;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationError = validate(title);
    setError(validationError);
    if (validationError) return;

    onSubmit(title.trim(), priority, category, userId);
    // Reset form
    setTitle("");
    setPriority("medium");
    setCategory("work");
    setUserId(1);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Task Title */}
      <div>
        <label htmlFor="task-title" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Task title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError(validate(event.target.value));
          }}
          placeholder="e.g. Design landing page hero area"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "task-title-error" : undefined}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-400"
        />
        {error && (
          <p id="task-title-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>

      {/* User ID & Category (Grid) */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="task-user" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assignee
          </label>
          <select
            id="task-user"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => (
              <option key={id} value={id}>
                User #{id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-category" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category
          </label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Priority Level
        </span>
        <div role="radiogroup" aria-label="Task Priority" className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => {
            const isSelected = priority === p;
            const activeColor = {
              low: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
              medium: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
              high: "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
            }[p];

            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                aria-checked={isSelected}
                role="radio"
                className={`rounded-xl border py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? activeColor + " ring-2 ring-brand-500/10 shadow-sm"
                    : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-950 dark:hover:bg-slate-900"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800/60"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-brand-700 hover:to-indigo-700 transition duration-200"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}

