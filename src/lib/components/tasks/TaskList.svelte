<script lang="ts"> 
  import { onMount } from "svelte";
  import { getTasks, updateTask } from "$lib/services/taskservices";
  import type { Task } from "$lib/models/task";
  import AddTask from "./AddTask.svelte";

  let tasks: Task[] = [];
  let loading = true;
  let showAddTask = false;
  let editingTask: Task | null = null;

  onMount(async () => {
    try {
      tasks = await getTasks();
      console.log("Tasks loaded:", tasks);
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    } finally {
      loading = false;
    }
  });

  function openAddModal() {
    editingTask = null; 
    showAddTask = true;
  }

  function openEditModal(task: Task) {
    editingTask = task;  
    showAddTask = true;
  }

  function closeAddModal() {
    showAddTask = false;
    editingTask = null;
  }

  function handleTaskAdded(event: CustomEvent<Task>) {
    tasks = [...tasks, event.detail];
  }

  function handleTaskUpdated(event: CustomEvent<Task>) {
    const updated = event.detail;
    tasks = tasks.map(t => (t._id === updated._id ? updated : t));
  }

  async function toggleCompleted(task: Task) {
    const originalStatus = task.completed;
    task.completed = !originalStatus;

    tasks = [...tasks];
    try {
      await updateTask(task._id, { completed: task.completed });
    } catch (err) {
      task.completed = originalStatus;
      tasks = [...tasks];
      console.error("Failed to update task", err);
    }
  }
</script>

<div class={`content-wrapper`}>
  <h1 class="text-2xl font-bold mb-4">Task Manager</h1>

  <button
    class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    on:click={openAddModal}
  >
    + Add Task
  </button>

  {#if loading}
    <p>loading tasks...</p>
  {:else if tasks.length === 0}
    <p>No tasks found.</p>
  {:else}
    <ul class="space-y-2">
      {#each tasks as task (task._id)}
        <li class="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              on:change={() => toggleCompleted(task)}
              class="w-5 h-5"
            />
            <span class={task.completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
          </label>

          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-400">
              {task.completed ? "✅ Done" : "⏳ Pending"}
            </span>

            <!-- Edit button -->
            <button
              on:click={() => openEditModal(task)}
              class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Edit
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  {#if showAddTask}
    <AddTask
      show={showAddTask}
      task={editingTask}
      on:close={closeAddModal}
      on:taskAdded={handleTaskAdded}
      on:taskUpdated={handleTaskUpdated}
    />
  {/if}
</div>
