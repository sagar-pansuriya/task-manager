import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchTasks } from "@/hooks/useTasks";
import { taskKeys } from "@/lib/queryKeys";
import { TasksPageClient } from "./TasksPageClient";

export const revalidate = 60;

export default async function TasksPage() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: taskKeys.all,
      queryFn: fetchTasks,
    });
  } catch {
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksPageClient />
    </HydrationBoundary>
  );
}
