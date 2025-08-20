<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createTask, updateTask } from '../../services/taskservices';
  import type { Task } from '../../models/task';

  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";

  export let task: Task | null = null;
  const dispatch = createEventDispatcher();

  let title = task?.title || '';
  let completed = task?.completed || false;

  // Save handler for Add or Edit
  const save = async () => {
    if (!title.trim()) return;

    if (task) {
      const updatedTask = await updateTask(task._id!, { title, completed });
      dispatch('taskUpdated', updatedTask);
    } else {
      const newTask: Omit<Task, '_id'> = { title, completed };
      const savedTask = await createTask(newTask);
      dispatch('taskAdded', savedTask);
    }

    dispatch('close');
  };
</script>

<div class="space-y-4">
  <!-- Task title -->
  <Input
    bind:value={title}
    placeholder="Task title"
    class="w-full"
  />

  <!-- Completed checkbox -->
  <div class="flex items-center space-x-2">
    <Checkbox bind:checked={completed} />
    <span class="text-gray-800 dark:text-white">Completed</span>
  </div>

  <!-- Actions -->
  <div class="flex justify-end space-x-2">
    <Button variant="outline" onclick={() => dispatch('close')}>
      Cancel
    </Button>
    <Button onclick={save}>
      Save
    </Button>
  </div>
</div>

