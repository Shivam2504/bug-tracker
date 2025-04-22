import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Bug } from '../types';

interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expectedResult: string;
  status: 'passed' | 'failed' | 'pending';
  relatedBug?: string;
  notes?: string;
}

const mockTestCases: TestCase[] = [
  {
    id: '1',
    title: 'Login Functionality - Valid Credentials',
    steps: [
      'Navigate to login page',
      'Enter valid email',
      'Enter valid password',
      'Click login button'
    ],
    expectedResult: 'User should be successfully logged in and redirected to dashboard',
    status: 'passed'
  },
  {
    id: '2',
    title: 'Bug Report Creation',
    steps: [
      'Navigate to create bug page',
      'Fill in all required fields',
      'Upload screenshot',
      'Submit form'
    ],
    expectedResult: 'New bug should be created and user redirected to bug details page',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Mobile Menu Navigation',
    steps: [
      'Open application on mobile device',
      'Click hamburger menu',
      'Navigate through all menu items',
      'Close menu'
    ],
    expectedResult: 'Menu should open, allow navigation, and close properly',
    status: 'failed',
    relatedBug: '5',
    notes: 'Menu cannot be closed once opened'
  }
];

const TestCases: React.FC = () => {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'passed' | 'failed' | 'pending'>('all');
  
  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return 'text-success-500';
      case 'failed':
        return 'text-error-500';
      default:
        return 'text-warning-500';
    }
  };
  
  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    }
  };
  
  const filteredTestCases = testCases.filter(testCase => {
    if (selectedFilter === 'all') return true;
    return testCase.status === selectedFilter;
  });

  return (
    <div className="container-wide section-padding">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Cases</h1>
            <p className="text-gray-600">Manage and track test cases for quality assurance</p>
          </div>
          <button
            onClick={() => navigate('/test-cases/new')}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Test Case
          </button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`btn-secondary ${selectedFilter === 'all' ? 'bg-gray-100' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('passed')}
            className={`btn-secondary ${selectedFilter === 'passed' ? 'bg-gray-100' : ''}`}
          >
            Passed
          </button>
          <button
            onClick={() => setSelectedFilter('failed')}
            className={`btn-secondary ${selectedFilter === 'failed' ? 'bg-gray-100' : ''}`}
          >
            Failed
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`btn-secondary ${selectedFilter === 'pending' ? 'bg-gray-100' : ''}`}
          >
            Pending
          </button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredTestCases.map(testCase => (
          <div key={testCase.id} className="card fade-in">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{testCase.title}</h3>
                </div>
                {getStatusIcon(testCase.status)}
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Test Steps:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {testCase.steps.map((step, index) => (
                    <li key={index} className="text-gray-600">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Result:</h4>
                <p className="text-gray-600">{testCase.expectedResult}</p>
              </div>
              
              {testCase.relatedBug && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Related Bug:</h4>
                  <a 
                    href={`/bugs/${testCase.relatedBug}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Bug #{testCase.relatedBug}
                  </a>
                </div>
              )}
              
              {testCase.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                  <p className="text-gray-600">{testCase.notes}</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                <span className={`capitalize ${getStatusColor(testCase.status)}`}>
                  {testCase.status}
                </span>
              </div>
              <button
                onClick={() => navigate(`/test-cases/${testCase.id}/edit`)}
                className="btn-secondary"
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCases;