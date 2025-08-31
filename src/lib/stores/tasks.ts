
// import { writable } from "svelte/store";
// import type { Task } from "$lib/models/task";

// const STORAGE_KEY = "taskManager:tasks";

// function createTasks(){
//   const { subscribe, set, update } = writable<Task[]>([]);

//   return {
//     subscribe,
//     add: (task: Task) => 
//       update((tasks) => {
//         const newTasks = [...tasks, task];
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//         return newTasks;
//     }),
//     remove: (id: string) =>
//       update((tasks) => {
//         const newTasks = tasks.filter((t) => t.id !== id);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//         return newTasks;
//     }),
//     toggle: (id: string) =>
//       update((tasks) => {
//         const newTasks = tasks.map((t) =>
//           t.id === id ? { ...t, completed: !t.completed } : t
//         );
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//         return newTasks;
//       }),
//     load: () => {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       if(stored) set(JSON.parse(stored));
//     },
//     clear: () => {
//       localStorage.removeItem(STORAGE_KEY);
//       set([]);
//     }
//   }
// }

// export const tasks = createTasks();