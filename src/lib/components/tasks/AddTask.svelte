<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createTask, updateTask } from '../../services/taskservices';
	import type { Task } from '../../models/task';
	import { cn } from '$lib/utils.js';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '$lib/components/ui/dropdown-menu';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		fromDate
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover/index.js';

	// ✅ props in Svelte 5
	const { task = null } = $props<{ task?: Task | null }>();
	const dispatch = createEventDispatcher();

	// ✅ state
	let title = $state(task?.title ?? '');
	let completed = $state(task?.completed ?? false);
	let category = $state(task?.category ?? 'General');
	const categories = ['General', 'Work', 'Personal', 'Urgent'];
	let date = $state<DateValue | undefined>(
		task?.due_date ? fromDate(task.due_date, getLocalTimeZone()) : undefined
	);

	let due_date = $derived(() => (date ? date.toDate(getLocalTimeZone()) : undefined));

	const save = async () => {
		if (!title.trim()) return;

		if (task) {
			const updatedTask = await updateTask(task.id!, {
				title,
				completed,
				category,
				due_date: due_date()
			});
			dispatch('taskUpdated', updatedTask);
		} else {
			const newTask: Omit<Task, 'id'> = {
				title,
				completed,
				category,
				due_date: due_date()
			};
			const savedTask = await createTask(newTask);
			dispatch('taskAdded', savedTask);
		}

		dispatch('close');
	};

	const setCategory = (c: string) => {
		category = c;
	};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let contentRef = $state<HTMLElement | null>(null);
</script>

<div class="space-y-4">
	<!-- Task title -->
	<Input bind:value={title} placeholder="Task title" class="w-full" />

	<!-- Completed checkbox -->
	<div class="flex items-center space-x-2">
		<Checkbox bind:checked={completed} />
		<span class="text-gray-800 dark:text-white">Completed</span>
	</div>

	<!-- Category -->
	<div>
		<label for="category-dropdown" class="block text-sm font-medium mb-1">Category</label>
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button id="category-dropdown" variant="outline" class="w-full justify-between">
					{category}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent class="w-[200px]">
				{#each categories as c}
					<DropdownMenuItem onclick={() => setCategory(c)}>
						{c}
					</DropdownMenuItem>
				{/each}
			</DropdownMenuContent>
		</DropdownMenu>
	</div>

	<!-- Due Date -->
	<div>
		<label for="due-date" class="block text-sm font-medium mb-1">Due Date</label>
		<Popover.Root>
			<Popover.Trigger
				class={cn(
					buttonVariants({
						variant: 'outline',
						class: 'w-[280px] justify-start text-left font-normal'
					}),
					!due_date && 'text-muted-foreground'
				)}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{#if date}
					{df.format(date.toDate(getLocalTimeZone()))}
				{:else}
					Pick a date
				{/if}
			</Popover.Trigger>
			<Popover.Content bind:ref={contentRef} class="w-auto p-0">
				<Calendar type="single" bind:value={date} />
			</Popover.Content>
		</Popover.Root>
	</div>

	<!-- Actions -->
	<div class="flex justify-end space-x-2">
		<Button variant="outline" onclick={() => dispatch('close')}>Cancel</Button>
		<Button onclick={save}>Save</Button>
	</div>
</div>
