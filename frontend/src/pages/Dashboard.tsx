import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import BugCard from '../components/BugCard';
import { fetchBugs } from '../services/bugService';
import { Bug } from '../types';

const Dashboard: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'serialNo' | 'date' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const loadBugs = async () => {
      try {
        setLoading(true);
        const data = await fetchBugs();
        setBugs(data);
      } catch (err) {
        setError('Failed to load bugs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBugs();
  }, []);
  
  const handleSort = (field: 'serialNo' | 'date' | 'priority') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedBugs = [...bugs].sort((a, b) => {
    if (sortField === 'serialNo') {
      return sortDirection === 'asc' 
        ? a.serialNo - b.serialNo 
        : b.serialNo - a.serialNo;
    } else if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by priority (assuming priority is a number 1-5)
      return sortDirection === 'asc' 
        ? a.priority - b.priority 
        : b.priority - a.priority;
    }
  });
  
  const filteredBugs = sortedBugs.filter(bug => 
    bug.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bug.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bug Tracking Dashboard</h1>
        <p className="text-gray-600">Track and manage all reported bugs in your projects</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => handleSort('serialNo')}
          >
            <span>ID</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </button>
          <button 
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => handleSort('date')}
          >
            <span>Date</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </button>
          <button 
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => handleSort('priority')}
          >
            <span>Priority</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-error-50 p-4 rounded-md text-error-700">{error}</div>
      ) : filteredBugs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No bugs found</div>
          <Link 
            to="/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Report a bug
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;