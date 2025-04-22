import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bug, Plus, LogOut, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Bug className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BugTracker</span>
            </Link>
            
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link 
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-primary-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/test-cases"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-primary-600 hover:bg-gray-50"
                >
                  Test Cases
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                <Link 
                  to="/create" 
                  className="mr-4 flex items-center px-4 py-2 rounded-md bg-primary-500 text-white transition hover:bg-primary-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>New Bug</span>
                </Link>
                <div className="mr-4 text-sm font-medium text-gray-700">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-primary-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-1">Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-600 transition px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;