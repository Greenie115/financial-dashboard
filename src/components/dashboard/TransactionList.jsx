// src/components/dashboard/TransactionList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TransactionList Component 
 * Displays a list of financial transactions
 */
const TransactionList = ({ transactions, showAccount = true, limit = null }) => {
  // If we don't have transactions, show a message
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions to display</p>
      </div>
    );
  }
  
  // Limit the number of transactions if specified
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get icon for category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Groceries':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Dining':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Entertainment':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        );
      case 'Transport':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'Shopping':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Utilities':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Rent':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'Income':
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  // Get background color for category icon
  const getCategoryBgColor = (category) => {
    switch (category) {
      case 'Groceries':
        return 'bg-green-100 text-green-600';
      case 'Dining':
        return 'bg-red-100 text-red-600';
      case 'Entertainment':
        return 'bg-purple-100 text-purple-600';
      case 'Transport':
        return 'bg-blue-100 text-blue-600';
      case 'Shopping':
        return 'bg-pink-100 text-pink-600';
      case 'Utilities':
        return 'bg-yellow-100 text-yellow-600';
      case 'Rent':
        return 'bg-gray-100 text-gray-600';
      case 'Income':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Get account badge color
  const getAccountBadgeColor = (account) => {
    switch (account) {
      case 'Starling':
        return 'bg-blue-100 text-blue-800';
      case 'Amex':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="divide-y divide-gray-200">
      {displayTransactions.map((transaction) => (
        <Link 
          key={transaction.id}
          to={`/transactions/${transaction.id}`}
          className="block py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          <div className="flex items-center">
            {/* Category Icon */}
            <div className={`rounded-full p-2 ${getCategoryBgColor(transaction.category)}`}>
              {getCategoryIcon(transaction.category)}
            </div>
            
            {/* Transaction Info */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{transaction.merchant}</h4>
                <span className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount >= 0 ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500 mr-2">{formatDate(transaction.date)}</span>
                <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5">{transaction.category}</span>
                {showAccount && (
                  <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${getAccountBadgeColor(transaction.account)}`}>
                    {transaction.account}
                  </span>
                )}
              </div>
            </div>
            
            {/* Right arrow */}
            <div className="ml-2 text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TransactionList;