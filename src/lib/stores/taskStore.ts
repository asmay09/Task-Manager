import { writable } from "svelte/store";
import type {Task} from "../models/task"

export const tasksStore = writable<Task[]>([]);

// exppo

// Helper functions
export function setTasks(tasks: Task[]) {
	tasksStore.set(tasks);
}

export function addTask(task: Task) {
	tasksStore.update((current) => [...current, task]);
}

export function toggleTaskCompletion(id: string) {
	tasksStore.update((current) =>
		current.map((task) =>
			task._id === id ? { ...task, completed: !task.completed } : task
		)
	);
}