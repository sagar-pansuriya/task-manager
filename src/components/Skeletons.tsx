export function TaskCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-5 w-16 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-busy="true">
      <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
