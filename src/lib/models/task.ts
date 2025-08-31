export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  due_date?: Date;
}