import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TasksPage from './TasksPage';
import TaskDetailPage from './TaskDetailPage';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <div>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<TasksPage />} />
        <Route path='/tasks' element={<TasksPage />} />
        <Route path='/tasks/:taskId' element={<TaskDetailPage />} />
      </Routes>
    </div>
  );
}
