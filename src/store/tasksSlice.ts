import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocalTask, TaskPriority, TaskCategory } from "@/types/task";

interface TasksState {
  localTasks: LocalTask[];
  remoteCompletionOverrides: Record<number, boolean>;
  deletedRemoteTaskIds: number[];
}

const initialState: TasksState = {
  localTasks: [],
  remoteCompletionOverrides: {},
  deletedRemoteTaskIds: [],
};

interface AddLocalTaskPayload {
  title: string;
  userId: number;
  priority: TaskPriority;
  category: TaskCategory;
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    hydrateState(state, action: PayloadAction<Partial<TasksState>>) {
      if (action.payload.localTasks) {
        state.localTasks = action.payload.localTasks;
      }
      if (action.payload.remoteCompletionOverrides) {
        state.remoteCompletionOverrides = action.payload.remoteCompletionOverrides;
      }
      if (action.payload.deletedRemoteTaskIds) {
        state.deletedRemoteTaskIds = action.payload.deletedRemoteTaskIds;
      }
    },
    addLocalTask: {
      reducer(state, action: PayloadAction<LocalTask>) {
        state.localTasks.unshift(action.payload);
      },
      prepare({ title, userId, priority, category }: AddLocalTaskPayload) {
        const task: LocalTask = {
          id: `local-${Date.now()}`,
          userId,
          title: title.trim(),
          completed: false,
          isLocal: true,
          createdAt: new Date().toISOString(),
          priority,
          category,
        };
        return { payload: task };
      },
    },
    toggleLocalTaskCompletion(state, action: PayloadAction<{ id: string }>) {
      const task = state.localTasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    toggleRemoteTaskCompletion(state, action: PayloadAction<{ id: number; completed: boolean }>) {
      state.remoteCompletionOverrides[action.payload.id] = action.payload.completed;
    },
    removeLocalTask(state, action: PayloadAction<{ id: string }>) {
      state.localTasks = state.localTasks.filter((t) => t.id !== action.payload.id);
    },
    deleteRemoteTask(state, action: PayloadAction<{ id: number }>) {
      if (!state.deletedRemoteTaskIds.includes(action.payload.id)) {
        state.deletedRemoteTaskIds.push(action.payload.id);
      }
    },
  },
});

export const {
  hydrateState,
  addLocalTask,
  toggleLocalTaskCompletion,
  toggleRemoteTaskCompletion,
  removeLocalTask,
  deleteRemoteTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;

