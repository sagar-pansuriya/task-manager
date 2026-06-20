export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "work" | "personal" | "learning" | "health" | "other";

export interface RemoteTask {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
}


export interface LocalTask {
  id: string; 
  userId: number;
  title: string;
  completed: boolean;
  isLocal: true;
  createdAt: string; 
  priority: TaskPriority;
  category: TaskCategory;
}


export type Task =
  | (RemoteTask & { isLocal?: false })
  | LocalTask;

export type TaskStatusFilter = "all" | "completed" | "pending";

export function isLocalTask(task: Task): task is LocalTask {
  return (task as LocalTask).isLocal === true;
}

export function getTaskMeta(id: number): { priority: TaskPriority; category: TaskCategory } {
  const priorities: TaskPriority[] = ["high", "medium", "low"];
  const categories: TaskCategory[] = ["work", "personal", "learning", "health", "other"];
  
  const priority = priorities[id % priorities.length];
  const category = categories[(id + 2) % categories.length];
  
  return { priority, category };
}

