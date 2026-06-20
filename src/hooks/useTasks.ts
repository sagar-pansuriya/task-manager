import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { taskKeys } from "@/lib/queryKeys";
import type { RemoteTask } from "@/types/task";

export async function fetchTasks(): Promise<RemoteTask[]> {
  const { data } = await api.get<RemoteTask[]>("/todos");
  return data;
}

export async function fetchTaskById(id: number): Promise<RemoteTask> {
  const { data } = await api.get<RemoteTask>(`/todos/${id}`);
  return data;
}

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: fetchTasks,
    staleTime: 60_000, 
  });
}

export function useTask(id: number | null) {
  return useQuery({
    queryKey: id !== null ? taskKeys.detail(id) : taskKeys.all,
    queryFn: () => fetchTaskById(id as number),
    enabled: id !== null,
  });
}
