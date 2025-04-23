import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Bug as BugIcon, AlertTriangle, Clock, Image as ImageIcon } from 'lucide-react';
import { Bug } from '../types';

interface BugCardProps {
  bug: Bug;
}

// Replace with your actual backend URL
const BASE_URL = 'http://localhost:5000';

const PriorityBadge: React.FC<{ priority: number }> = ({ priority }) => {
  let color;
  let label;

  switch (priority) {
    case 1:
      color = 'bg-gray-100 text-gray-800';
      label = 'Low';
      break;
    case 2:
      color = 'bg-blue-100 text-blue-800';
      label = 'Medium';
      break;
    case 3:
      color = 'bg-yellow-100 text-yellow-800';
      label = 'High';
      break;
    case 4:
      color = 'bg-orange-100 text-orange-800';
      label = 'Critical';
      break;
    case 5:
      color = 'bg-red-100 text-red-800';
      label = 'Blocker';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      label = 'Unknown';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {priority > 3 && <AlertTriangle className="mr-1 h-3 w-3" />}
      {label}
    </span>
  );
};

//Here is the error
//Removed Screenshot
//Trying ${BASE_URL}${bug.screenshot}
const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  const imageUrl = bug.screenshot
    ? bug.screenshot.startsWith('http')
      ? bug.screenshot
      : ``
    : '';

    //

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <Link to={`/bugs/${bug._id}`} className="block">
      <div className="bg-white overflow-hidden shadow-card rounded-lg hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {bug.screenshot && (
          <div className="relative h-40 bg-gray-100 flex items-center justify-center">
            <button
              onClick={handleImageClick}
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
            >
              <ImageIcon className="w-4 h-4" />
              View Screenshot
            </button>
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <BugIcon className="h-4 w-4 text-error-500 mr-1" />
              <span className="text-sm font-medium text-gray-500">#{bug.serialNo}</span>
            </div>
            <PriorityBadge priority={bug.priority} />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{bug.title}</h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bug.description}</p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{format(new Date(bug.createdAt), 'MMM d, yyyy')}</span>
              </div>

              <div className="text-sm font-medium text-gray-700">
                {bug.assignedTo?.name || 'Unassigned'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BugCard;
