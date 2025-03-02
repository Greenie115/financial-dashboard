// src/pages/TransactionDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Loader } from '../components/common';
import { AlertCircle } from 'lucide-react';
import { getMockTransactionDetails } from '../api';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const data = await getMockTransactionDetails(id);
        setTransaction(data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [id]);
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <Loader size="large" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }
  
  if (!transaction) {
    return null;
  }
  
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
  
  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Groceries':
        return 'bg-green-100 text-green-800';
      case 'Dining':
        return 'bg-red-100 text-red-800';
      case 'Entertainment':
        return 'bg-purple-100 text-purple-800';
      case 'Transport':
        return 'bg-blue-100 text-blue-800';
      case 'Shopping':
        return 'bg-pink-100 text-pink-800';
      case 'Utilities':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rent':
        return 'bg-gray-100 text-gray-800';
      case 'Income':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Transactions
        </button>
      </div>
      
      {/* Transaction Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{transaction.merchant}</h1>
          <span className={`text-xl font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.amount >= 0 ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-gray-500">{formatDate(transaction.date)}</p>
          <div className="flex ml-4 space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountBadgeColor(transaction.account)}`}>
              {transaction.account}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(transaction.category)}`}>
              {transaction.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Transaction Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Merchant</span>
              <span className="text-sm font-medium text-gray-900">{transaction.merchant}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium text-gray-900">{transaction.category}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Account</span>
              <span className="text-sm font-medium text-gray-900">{transaction.account}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="text-sm font-medium text-gray-900">{transaction.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium text-gray-900">{transaction.status}</span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
          {transaction.location ? (
            <>
              <div className="h-40 bg-gray-200 rounded-md mb-4">
                {/* Placeholder for a map */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Map placeholder</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{transaction.merchant}</p>
                <p className="text-sm text-gray-500">{transaction.location.address}</p>
                <p className="text-sm text-gray-500">{transaction.location.city}, {transaction.location.postcode}</p>
                <p className="text-sm text-gray-500">{transaction.location.country}</p>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No location data available</p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Actions */}
      <Card className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Edit Category
          </button>
          <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            Add to Budget
          </button>
          <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            Add Note
          </button>
          <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            Dispute Transaction
          </button>
        </div>
      </Card>
      
      {/* Similar Transactions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Similar Transactions</h2>
          <a href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </a>
        </div>
        <div className="space-y-4">
          {/* Just placeholders, would be real similar transactions in a real app */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <p className="font-medium">{transaction.merchant}</p>
              <p className="text-sm text-gray-500">2 weeks ago</p>
            </div>
            <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount >= 0 ? '+' : ''}£{(Math.abs(transaction.amount) * 0.9).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <p className="font-medium">{transaction.merchant}</p>
              <p className="text-sm text-gray-500">Last month</p>
            </div>
            <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount >= 0 ? '+' : ''}£{(Math.abs(transaction.amount) * 1.1).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{transaction.merchant}</p>
              <p className="text-sm text-gray-500">2 months ago</p>
            </div>
            <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount >= 0 ? '+' : ''}£{Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionDetails;