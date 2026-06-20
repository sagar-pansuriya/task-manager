import { AlertCircle, Inbox } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong while loading tasks.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/10">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-semibold text-red-700 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition duration-200 shadow-sm shadow-red-500/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No tasks match your filters." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-450 dark:bg-slate-900/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-450 dark:bg-slate-900 dark:text-slate-500">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-1 font-medium">{message}</p>
    </div>
  );
}


