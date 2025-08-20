import { writable } from "svelte/store";
import type { Task } from "$lib/models/task";
import { getTasks, updateTask } from "$lib/services/taskservices";

export const tasks = writable<Task[]>([]);
export const loading = writable<boolean>(true);

export async function loadTasks() {
  loading.set(true);
  try {
    const data = await getTasks();
    tasks.set(data);
  } catch (e) {
    console.error("Failed to load tasks", e);
  } finally {
    loading.set(false);
  }
}

export async function toggleCompleted(task: Task) {
  const originalStatus = task.completed;
  task.completed = !originalStatus;
  tasks.update(current =>
    current.map(t => (t._id === task._id ? { ...t, completed: task.completed } : t))
  );

  try {
    await updateTask(task._id!, { completed: task.completed });
  } catch (err) {
    // Revert change if update fails
    task.completed = originalStatus;
    tasks.update(current =>
      current.map(t => (t._id === task._id ? { ...t, completed: task.completed } : t))
    );
    console.error("Failed to update task", err);
  }
}
