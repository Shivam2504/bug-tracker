import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare, 
  Edit2, 
  Trash2
} from 'lucide-react';
import { fetchBugById, updateBugStatus, deleteBug } from '../services/bugService';
import { Bug } from '../types';

const statusOptions = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' },
];

const priorityLabels: Record<number, { label: string, color: string }> = {
  1: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  2: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  3: { label: 'High', color: 'bg-yellow-100 text-yellow-800' },
  4: { label: 'Critical', color: 'bg-orange-100 text-orange-800' },
  5: { label: 'Blocker', color: 'bg-red-100 text-red-800' },
};

const BugDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const loadBug = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchBugById(id);
        setBug(data);
      } catch (err) {
        setError('Failed to load bug details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBug();
  }, [id]);
  
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!bug || !id) return;
    
    try {
      setStatusLoading(true);
      const newStatus = e.target.value;
      await updateBugStatus(id, newStatus);
      setBug({ ...bug, status: newStatus });
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await deleteBug(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete bug');
      console.error(err);
      setDeleteLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !bug) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-error-50 p-4 rounded-md text-error-700">
          {error || 'Bug not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this bug? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-card rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-500 mr-2">#{bug.serialNo}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityLabels[bug.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                {bug.priority >= 4 && <AlertTriangle className="mr-1 h-3 w-3" />}
                {priorityLabels[bug.priority]?.label || 'Unknown'} Priority
              </span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusOptions.find(s => s.value === bug.status)?.color || 'bg-gray-100'}`}>
                {statusOptions.find(s => s.value === bug.status)?.label || 'Open'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{bug.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/bugs/${bug._id}/edit`)}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-500 hover:text-error-600 hover:bg-gray-100 rounded-full transition"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {bug.description}
                </div>
              </div>
              
              {bug.steps && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Steps to Reproduce</h2>
                  <div className="prose max-w-none text-gray-700">
                    {bug.steps}
                  </div>
                </div>
              )}
              
              {bug.screenshot && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Screenshot</h2>
                  <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={bug.screenshot} 
                      alt="Bug screenshot" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div className="relative">
                  <select
                    value={bug.status}
                    onChange={handleStatusChange}
                    disabled={statusLoading}
                    className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {statusLoading && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Reported by</h3>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">{bug.createdBy?.name || 'Unknown'}</span>
                </div>
              </div>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned to</h3>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">{bug.assignedTo?.name || 'Unassigned'}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created on</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">
                    {format(new Date(bug.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              {bug.updatedAt && bug.updatedAt !== bug.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Last updated</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-700">
                      {format(new Date(bug.updatedAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetails;