"use client";

import Link from "next/link";
import { DarkModeToggle } from "./DarkModeToggle";
import { Check } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link href="/tasks" className="flex items-center gap-2.5 group">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Task Manager
              </span>
            </Link>

            {/* Nav links */}
            {/* <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/tasks"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-900/60"
              >
                Dashboard
              </Link>
            </nav> */}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />

            {/* Mock User profile */}
            <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3 dark:border-slate-800/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-brand-700 text-xs font-semibold text-white uppercase ring-2 ring-white dark:ring-slate-950">
                JD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-none">
                  John Doe
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
