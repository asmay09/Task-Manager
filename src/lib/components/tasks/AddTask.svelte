<!-- <script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createTask } from '../../services/taskservices';
  import type { Task } from '../../models/task';

  export let show = false;
  const dispatch = createEventDispatcher();

  let title = '';
  let completed = false;

  let posX = 0;
  let posY = 0;

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  let popupEl: HTMLDivElement | null = null;

  onMount(() => {
    const popupHeight = 350; // approximate height of popup
    posX = window.innerWidth / 2 - 384 / 2;
    posY = window.innerHeight / 2 - popupHeight / 2;
  });

  function onMouseDown(event: MouseEvent) {
    dragging = true;
    dragStartX = event.clientX - posX;
    dragStartY = event.clientY - posY;
    event.preventDefault();

    // Attach global listeners on window
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging) return;

    posX = event.clientX - dragStartX;
    posY = event.clientY - dragStartY;
  }

  function onMouseUp() {
    dragging = false;

    // Remove global listeners to prevent leaks
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  const save = async () => {
    if (!title.trim()) return;
    const newTask: Omit<Task, '_id'> = { title, completed };
    const savedTask = await createTask(newTask);

    dispatch('taskAdded', savedTask);
    title = '';
    completed = false;
    dispatch('close');
  };
</script>

{#if show}
  <div
    class="fixed z-50 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 cursor-default"
    bind:this={popupEl}
    style={`top: ${posY}px; left: ${posX}px;`}
  >
    <div
      class="mb-4 text-lg font-semibold text-gray-800 dark:text-white cursor-move select-none"
      on:mousedown={onMouseDown}
    >
      Add New Task
    </div>

    <input
      type="text"
      placeholder="Task title"
      bind:value={title}
      class="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
    />

    <label class="flex items-center space-x-2 mb-4">
      <input type="checkbox" bind:checked={completed} />
      <span class="text-gray-800 dark:text-white">Completed</span>
    </label>

    <div class="flex justify-end space-x-2">
      <button
        on:click={() => dispatch('close')}
        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
      >
        Cancel
      </button>
      <button
        on:click={save}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  </div>
{/if} -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createTask, updateTask } from '../../services/taskservices';
  import type { Task } from '../../models/task';

  export let show = false;
  export let task: Task | null = null;

  const dispatch = createEventDispatcher();

  let title = '';
  let completed = false;

  let posX = 0;
  let posY = 0;

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  let popupEl: HTMLDivElement | null = null;

  $: if (show) {
    if (task) {
      title = task.title;
      completed = task.completed;
    } else {
      title = '';
      completed = false;
    }
  }

  onMount(() => {
    const popupHeight = 350; 
    posX = window.innerWidth / 2 - 384 / 2;
    posY = window.innerHeight / 2 - popupHeight / 2;
  });

  function onMouseDown(event: MouseEvent) {
    dragging = true;
    dragStartX = event.clientX - posX;
    dragStartY = event.clientY - posY;
    event.preventDefault();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging) return;

    posX = event.clientX - dragStartX;
    posY = event.clientY - dragStartY;
  }

  function onMouseUp() {
    dragging = false;

    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  const save = async () => {
    if (!title.trim()) return;

    if (task) {
      const updatedTask = await updateTask(task._id, { title, completed });
      console.log("Task updated:", updatedTask);
      dispatch('taskUpdated', updatedTask);
    } else {
      const newTask: Omit<Task, '_id'> = { title, completed };
      const savedTask = await createTask(newTask);
      dispatch('taskAdded', savedTask);
    }

    dispatch('close');
  };
</script>

{#if show}
  <div
    class="fixed z-50 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 cursor-default"
    bind:this={popupEl}
    style={`top: ${posY}px; left: ${posX}px;`}
  >
    <div
      class="mb-4 text-lg font-semibold text-gray-800 dark:text-white cursor-move select-none"
      on:mousedown={onMouseDown}
    >
      {task ? 'Edit Task' : 'Add New Task'}
    </div>

    <input
      type="text"
      placeholder="Task title"
      bind:value={title}
      class="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
    />

    <label class="flex items-center space-x-2 mb-4">
      <input type="checkbox" bind:checked={completed} />
      <span class="text-gray-800 dark:text-white">Completed</span>
    </label>

    <div class="flex justify-end space-x-2">
      <button
        on:click={() => dispatch('close')}
        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
      >
        Cancel
      </button>
      <button
        on:click={save}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  </div>
{/if}
