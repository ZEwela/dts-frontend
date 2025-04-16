import axios from 'axios';

export type Task = {
  task_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
};

export interface TasksPaginationResponse {
  tasks: Task[];
  totalPages: number;
}

export type NewTask = Omit<Task, 'task_id'>;

const BASE_URL = 'http://localhost:9090/api/tasks';

export const getTasks = async (
  status: 'All' | Task['status'],
  page: number = 1,
  limit: number = 10,
): Promise<TasksPaginationResponse> => {
  const res = await axios.get(BASE_URL, {
    params: {
      status,
      page,
      limit,
    },
  });

  return res.data;
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
  console.log(taskId);
  const res = await axios.patch(`${BASE_URL}/${taskId}`, updatedFields);
  return res.data.task;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${taskId}`);
};
