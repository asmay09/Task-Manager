<script lang="ts">
  import { onMount } from "svelte";
  import { tasks, loading, loadTasks, toggleCompleted, filteredTasks, searchQuery, filterStatus } from "$lib/stores/taskStore";
  import { theme, toggleTheme } from "$lib/stores/theme";
  import AddTask from "./AddTask.svelte";
  import type { Task } from "$lib/models/task";

  import { Button } from "$lib/components/ui/button";
  import {Tabs, TabsList, TabsTrigger} from "$lib/components/ui/tabs"
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "$lib/components/ui/dialog";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
	import { Input } from "../ui/input";
	import { get } from "svelte/store";

  let showAddTask = false;
  let editingTask: Task | null = null;

  onMount(() => {
    loadTasks(); // fetch tasks from backend
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
    tasks.update(current => [...current, event.detail]);
    showAddTask = false;
  }

  function handleTaskUpdated(event: CustomEvent<Task>) {
    const updated = event.detail;
    tasks.update(current => current.map(t => t._id === updated._id ? updated : t));
    showAddTask = false;
  }
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold">Task Manager</h1>

  <!-- Add Task Button + Modal -->
  <Dialog open={showAddTask} onOpenChange={(open) => showAddTask = open}>
  <DialogTrigger>
    <Button class="bg-green-500 hover:bg-green-600">+ Add Task</Button>
  </DialogTrigger>

  <DialogContent class="p-6 rounded-lg shadow-lg w-96 bg-white dark:bg-gray-800">
    <DialogHeader>
      <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogDescription>
        {editingTask
          ? 'Update your task details below.'
          : 'Fill in the details for your new task.'}
      </DialogDescription>
    </DialogHeader>

    <AddTask
      task={editingTask}
      on:close={() => (showAddTask = false)}
      on:taskAdded={handleTaskAdded}
      on:taskUpdated={handleTaskUpdated}
    />
  </DialogContent>
</Dialog>

<div class="flex items-center justify-between gap-4 mb-4">
    <!-- Search -->
    <Input
      placeholder="Search tasks..."
      bind:value={$searchQuery}
      class="max-w-sm"
    />

    <!-- Filters -->
    <Tabs value={$filterStatus} onValueChange={(val) => filterStatus.set(val as typeof $filterStatus)}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>

     <Button onclick={toggleTheme} variant="outline">
      Toggle Theme
    </Button>
  </div>


  <!-- Task List -->
  {#if $loading}
    <p class="text-gray-500">Loading tasks...</p>
  {:else if $tasks.length === 0}
    <p class="text-gray-500">No tasks found.</p>
  {:else}
    <div class="space-y-3">
      {#each $filteredTasks  as task (task._id)}
        <Card>
          <CardHeader class="flex justify-between items-center space-y-0 pb-2">
            <div class="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleCompleted(task)}
              />
              <CardTitle class={task.completed ? "line-through text-gray-500" : ""}>
                {task.title}
              </CardTitle>
            </div>

            <div class="flex items-center space-x-2">
              <Badge variant={task.completed ? "default" : "outline"}>
                {task.completed ? "✅ Done" : "⏳ Pending"}
              </Badge>
              <Button size="sm" onclick={() => openEditModal(task)}>Edit</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500">{task.description}</p>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>
