import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatDistanceToNow, isPast } from 'date-fns';
import { getTasks, Task } from './api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Pagination from './components/Pagination';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const statusFromUrl = (searchParams.get('status') as 'All' | Task['status']) || 'All';
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks(statusFromUrl, pageFromUrl);
        setTasks(res.tasks);
        setTotalPages(res.totalPages);
        setCurrentPage(pageFromUrl);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data?.msg === 'Invalid status value.') {
            toast.error('Invalid status filter. Showing all tasks.');
            setSearchParams({ status: 'All', page: '1' });
          }
        }
      }
    };
    fetchTasks();
  }, [statusFromUrl, pageFromUrl]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'All' | Task['status'];
    setSearchParams({ status: newStatus, page: '1' });
  };
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ status: statusFromUrl, page: String(newPage) });
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='sticky  top-15 z-30 px-5 md:px-30 py-4 bg-white '>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 min-h-[80px]'>
          <h1 className='text-3xl font-bold text-gray-800'>Your Tasks</h1>
          <select
            className='border rounded p-2 text-sm'
            value={statusFromUrl}
            onChange={handleStatusChange}
          >
            <option value='All'>All</option>
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
          </select>
        </div>
      </div>
      <div className='flex-1'>
        <div className='p-6 max-w-7xl mx-auto pt-30 w-screen'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const overdue = isPast(new Date(task.due_date)) && task.status !== 'Completed';
                return (
                  <div
                    key={task.task_id}
                    onClick={() =>
                      navigate(`/tasks/${task.task_id}`, {
                        state: { from: window.location.pathname + window.location.search },
                      })
                    }
                    className='group cursor-pointer rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-6'
                  >
                    <h2 className='text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600'>
                      {task.title}
                    </h2>
                    <div className='p-7'>
                      <p className='text-sm text-gray-600 line-clamp-3 mb-3'>{task.description}</p>
                    </div>

                    <div className='flex justify-between items-center text-sm'>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1  font-medium text-sm ${getStatusStyle(task.status)}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`text-gray-500 ${overdue ? 'text-red-600 font-semibold' : ''}`}
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
              })
            ) : (
              <div className=' text-gray-500  flex items-center justify-center'>
                No tasks found.
              </div>
            )}
          </div>
        </div>
      </div>
      {tasks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
