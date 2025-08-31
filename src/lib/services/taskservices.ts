// import axios from 'axios';
// import {API_HOST} from '../config';

// const api = axios.create({
//   baseURL: API_HOST,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export const getTasks = async (): Promise<Task[]> => {
//   const res = await api.get('/tasks');
//   return res.data;
// };
// export const createTask = async (task: Omit<Task, '_id'>): Promise<Task> => {
//   const res = await api.post('/tasks', task);
//   return res.data;
// };

// export async function updateTask(
//   id: string,
//   update: Partial<Pick<Task, "title" | "completed" | "category">>
// ): Promise<Task> {
//   const res = await api.patch(`/tasks/${id}`, update);
//   return res.data;
// }

import { supabase } from '../../lib/supabaseClient';
import type { Task } from '../models/task';

export async function getTasks(): Promise<Task[]> {
	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);
	return data;;
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.insert(task)
		.select()
		.single();

	if (error) throw new Error(error.message);

	return data;
}

// ✅ Update a task
export async function updateTask(
	id: string,
	update: Partial<Pick<Task, 'title' | 'completed' | 'category' | 'description' | 'due_date'>>
): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.update(update)
		.eq('id', id)
		.select()
		.single();

	if (error) throw new Error(error.message);

	return data;
}

export async function deleteTask(id: string): Promise<void> {
	const { error } = await supabase.from('tasks').delete().eq('id', id);
	if (error) throw new Error(error.message);
}
