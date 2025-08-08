<script lang="ts">
  import { onMount } from "svelte";
  import {API_HOST} from "../../config"

  interface Task {
    _id: string;
    title: string;
    completed: boolean;
  }

  let tasks: Task[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch(`${API_HOST}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      tasks = await res.json();
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold mb-4">Tasks</h2>

  {#if loading}
    <p>Loading tasks...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if tasks.length === 0}
    <p>No tasks found.</p>
  {:else}
    <ul class="space-y-2">
      {#each tasks as task}
        <li class="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
          <span class={task.completed ? "line-through text-gray-500" : ""}>
            {task.title}
          </span>
          <span class="text-sm text-gray-400">
            {task.completed ? "✅ Done" : "⏳ Pending"}
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
