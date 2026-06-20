"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-72">
      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
        <Search className="h-4 w-4 text-slate-450" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks by title…"
        aria-label="Search tasks by title"
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-brand-400"
      />
    </div>
  );
}

