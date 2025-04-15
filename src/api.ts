import axios from 'axios';

export type Task = {
  task_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
};

export type NewTask = Omit<Task, 'task_id'>;

const BASE_URL = 'http://localhost:9090/api/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.tasks;
};

export const getTaskById = async (taskId: number): Promise<Task> => {
  const res = await axios.get(`${BASE_URL}/${taskId}`);
  return res.data.task;
};

export const createTask = async (task: NewTask): Promise<Task> => {
  const res = await axios.post(BASE_URL, task);
  return res.data.task;
};

export const updateTask = async (
  taskId: number,
  updatedFields: { status: Task['status'] },
): Promise<Task> => {
  const res = await axios.patch(`${BASE_URL}/tasks/${taskId}`, updatedFields);
  return res.data.task;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${taskId}`);
};
