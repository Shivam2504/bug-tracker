import React from 'react';
import { Link } from 'react-router-dom';
import { Bug, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center">
          <Bug className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">404 - Page Not Found</h1>
        <p className="mt-2 text-base text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;