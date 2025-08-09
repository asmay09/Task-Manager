<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let title = "";
  export let isOpen = false;

  function addTask() {
    if (!title.trim()) return;
    dispatch("add", { title, completed: false });
    title = "";
    dispatch("close"); // emit close event to parent
  }

  function closeModal() {
    dispatch("close");
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={closeModal}
  >
    <div
      class="bg-white dark:bg-gray-800 rounded p-6 w-96"
      on:click|stopPropagation
    >
      <form
        class="flex flex-col gap-4"
        on:submit|preventDefault={addTask}
      >
        <input
          type="text"
          placeholder="New task..."
          bind:value={title}
          class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
          autofocus
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            on:click={closeModal}
            class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
