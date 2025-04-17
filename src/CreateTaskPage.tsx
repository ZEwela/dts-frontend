import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, Task } from './api';

import { toast } from 'react-toastify';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'Pending' as Task['status'],
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.due_date) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createTask(formData);
      toast.success('Task added successfully!');
      navigate(`/tasks/${res.task_id}`);
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    return maxDate.toISOString().slice(0, 16);
  };
  return (
    <div className='pt-20 p-4 max-w-3xl mx-auto'>
      <button onClick={() => navigate('/tasks')} className='text-blue-600 hover:underline mb-4'>
        ← Back to all tasks
      </button>

      <h1 className='text-3xl font-bold mb-6'>Add New Task</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block mb-1 font-medium'>Title</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            maxLength={50}
            required
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Description</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full border p-2 rounded resize-none'
            rows={4}
            maxLength={225}
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Due Date</label>
          <input
            type='datetime-local'
            name='due_date'
            value={formData.due_date}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
            min={new Date().toISOString().slice(0, 16)}
            max={getMaxDate()}
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Status</label>
          <select
            name='status'
            value={formData.status}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
          </select>
        </div>

        <button
          type='submit'
          disabled={submitting}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
