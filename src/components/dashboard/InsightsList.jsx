// src/components/dashboard/InsightsList.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * InsightsList Component
 * Displays a list of financial insights and recommendations
 */
const InsightsList = ({ recommendations }) => {
  // If we don't have recommendations, show a message
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No insights to display</p>
      </div>
    );
  }
  
  // Get icon for recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
            <AlertCircle size={16} className="text-amber-600" />
          </div>
        );
      case 'danger':
        return (
          <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
            <AlertCircle size={16} className="text-red-600" />
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
            <AlertCircle size={16} className="text-gray-600" />
          </div>
        );
    }
  };
  
  // Get badge background color based on recommendation type
  const getBadgeColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get badge text based on recommendation type
  const getBadgeText = (type) => {
    switch (type) {
      case 'warning':
        return 'Warning';
      case 'danger':
        return 'Action Needed';
      case 'info':
        return 'Tip';
      case 'success':
        return 'Good News';
      default:
        return 'Info';
    }
  };
  
  return (
    <div className="divide-y divide-gray-200">
      {recommendations.map((recommendation) => (
        <div key={recommendation.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex">
            {/* Icon */}
            {getRecommendationIcon(recommendation.type)}
            
            {/* Content */}
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{recommendation.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(recommendation.type)}`}>
                  {getBadgeText(recommendation.type)}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <p>{recommendation.description}</p>
              </div>
              
              {/* Action buttons - could be dynamic based on recommendation type */}
              {recommendation.type === 'warning' || recommendation.type === 'danger' ? (
                <div className="mt-2">
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    View details
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightsList;