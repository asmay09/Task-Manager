<script lang="ts">
  import AddTasks from "./AddTasks.svelte";

  interface Task {
    id: number;
    title: string;
    completed: boolean;
  }

  let tasks: Task[] = [
    { id: 1, title: "Learn Svelte", completed: false },
    { id: 2, title: "Build Task App", completed: true }
  ];

  let showAddModal = false;

  function handleAdd(event: CustomEvent) {
    tasks = [...tasks, { id: Date.now(), ...event.detail }];
  }

  function openAddModal() {
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
  }
</script>

<div class="p-6">
  <h2 class="text-2xl font-bold mb-4">Tasks</h2>

  <button
    class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    on:click={openAddModal}
  >
    + Add Task
  </button>

  <AddTasks
    isOpen={showAddModal}
    on:add={handleAdd}
    on:close={closeAddModal}
  />

  <ul class="space-y-2">
    {#each tasks as task}
      <li
        class="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
      >
        <span class={task.completed ? "line-through text-gray-500" : ""}>
          {task.title}
        </span>
      </li>
    {/each}
  </ul>
</div>
