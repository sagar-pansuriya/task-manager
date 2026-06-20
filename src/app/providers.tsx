"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { hydrateState } from "@/store/tasksSlice";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("task-manager-redux-state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          store.dispatch(hydrateState(parsed));
        } catch (e) {
          console.error("Failed to parse saved state", e);
        }
      }
      
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().tasks;
        localStorage.setItem("task-manager-redux-state", JSON.stringify(state));
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}

