import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deleteTask, getTaskById, Task, updateTask } from './api';
import { getStatusStyle } from './TasksPage';
import { handleApiError } from './utilis/ErrorHandler';

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(Number(taskId));
        setTask(data);
      } catch (err) {
        handleApiError(err);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    if (task) {
      try {
        const updated = await updateTask(task.task_id, { status: newStatus });
        setTask(updated);
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const handleDelete = async () => {
    if (task) {
      try {
        await deleteTask(task.task_id);
        navigate('/tasks');
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const handleBack = () => {
    const previousLocation = location.state?.from || '/tasks';
    navigate(previousLocation);
  };

  return (
    <div className='pt-20 p-2 '>
      <button onClick={handleBack} className='text-blue-600 hover:underline mb-4 m-2'>
        ← Back to all tasks
      </button>
      {task && (
        <div className='flex justify-self-center md:max-w-[800px]  max-w-[500px] sm:min-w-2xl min-w-[450px]'>
          <div className='flex flex-col w-full min-h-screen p-20'>
            <h1 className='text-3xl font-bold mb-10  break-words'>{task.title}</h1>
            <p className='text-gray-600 mb-6  overflow-hidden wrap-break-word'>
              {task.description}
            </p>
            <p className='text-sm text-gray-500 mb-6'>
              Due: {new Date(task.due_date).toLocaleString()}
            </p>

            <div className='text-sm font-medium mb-4'>
              Current Status:{' '}
              <span
                className={`inline-block px-2 py-1 rounded-full ${getStatusStyle(task.status)}`}
              >
                {task.status}
              </span>
            </div>

            <div className='flex  flex-col mt-10'>
              <label className=' text-sm font-medium mb-1 flex items-center gap-1'>
                🛠️ Change Status:
              </label>
              <select
                value={task.status}
                onChange={handleStatusChange}
                className='border p-2 rounded w-fill '
              >
                <option value='Pending'>Pending</option>
                <option value='In Progress'>In Progress</option>
                <option value='Completed'>Completed</option>
              </select>
            </div>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className='mt-20  text-red-600 border border-red-600 hover:border-red-800 hover:bg-red-500 hover:text-white px-4 py-2 rounded'
            >
              🗑 Delete Task
            </button>
          </div>

          {showConfirmDelete && (
            <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
              <div className='bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md'>
                <div className='flex items-start gap-3 mb-4'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800 mb-1'>Confirm Delete</h2>
                    <p className='text-gray-600'>
                      Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className='flex justify-end gap-2 mt-4'>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 !important'
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
