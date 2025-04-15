import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='fixed top-0 left-0 right-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50'>
      <div className='text-xl md:text-2xl font-bold text-blue-600'>
        <Link to='/' className='hover:text-blue-700 transition'>
          Task Manager
        </Link>
      </div>

      <nav className='flex gap-2 md:gap-4 items-center'>
        <div className='hidden md:flex gap-4'>
          <Link to='/tasks' className='text-gray-700 hover:text-blue-600 font-medium transition'>
            Tasks
          </Link>
        </div>

        <div className='md:hidden'>
          <button onClick={toggleMenu} className='text-gray-700 hover:text-blue-600'>
            {isMobileMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className='md:hidden absolute top-16 right-6 bg-white shadow-lg rounded-lg p-4 w-48'>
          <Link
            to='/tasks'
            className='block text-gray-700 hover:text-blue-600 font-medium mb-2'
            onClick={toggleMenu}
          >
            Tasks
          </Link>
        </div>
      )}
    </header>
  );
}
