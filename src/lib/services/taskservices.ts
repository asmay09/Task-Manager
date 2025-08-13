import axios from 'axios';
import type { Task } from '../models/task'; 
import {API_HOST} from '../config'; 

const api = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get('/tasks');
  return res.data;
};

export const createTask = async (task: Omit<Task, '_id'>): Promise<Task> => {
  const res = await api.post('/tasks', task);
  return res.data;
};

export async function updateTask(
  id: string,
  update: Partial<Pick<Task, "title" | "completed">>
): Promise<Task> {
  const res = await api.patch(`/tasks/${id}`, update);
  return res.data;
}
