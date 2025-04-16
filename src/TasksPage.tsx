import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, isPast } from 'date-fns';
import { getTasks, Task } from './api';

export const getStatusStyle = (status: Task['status']) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<'All' | Task['status']>('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getTasks();
      setTasks(res);
    };
    fetchTasks();
  }, []);

  const filteredTasks =
    filteredStatus === 'All' ? tasks : tasks.filter((task) => task.status === filteredStatus);

  return (
    <div className='h-screen flex flex-col'>
      <div className='sticky top-15 z-30 px-6 py-4 bg-white '>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Your Tasks</h1>
          <select
            className='border rounded p-2 text-sm'
            value={filteredStatus}
            onChange={(e) => setFilteredStatus(e.target.value as 'All' | Task['status'])}
          >
            <option value='All'>All</option>
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
          </select>
        </div>
      </div>
      <div className='flex-1'>
        <div className='p-6 max-w-7xl mx-auto pt-30'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredTasks.map((task) => {
              const overdue = isPast(new Date(task.due_date)) && task.status !== 'Completed';
              return (
                <div
                  key={task.task_id}
                  onClick={() => navigate(`/tasks/${task.task_id}`)}
                  className='cursor-pointer border rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col justify-between hover:-translate-y-1 bg-white'
                >
                  <div>
                    <h2 className='text-xl font-semibold mb-1 text-gray-800'>{task.title}</h2>
                    <p className='text-sm text-gray-600 mb-4 line-clamp-3'>{task.description}</p>
                  </div>

                  <div className='flex justify-between items-center text-sm mt-auto'>
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${getStatusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`${overdue ? 'text-red-500 font-semibold' : 'text-gray-500'}`}
                      title={new Date(task.due_date).toLocaleString()}
                    >
                      Due:{' '}
                      {overdue
                        ? 'Overdue'
                        : formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
