import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TasksPage from './TasksPage';
import TaskDetailPage from './TaskDetailPage';

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<TasksPage />} />
        <Route path='/tasks' element={<TasksPage />} />
        <Route path='/tasks/:taskId' element={<TaskDetailPage />} />
      </Routes>
    </div>
  );
}
