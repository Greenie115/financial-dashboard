// src/pages/Accounts.jsx
import React, { useState, useEffect } from 'react';
import { Card, Grid, Badge, Loader } from '../components/common';
import { AlertCircle } from 'lucide-react';
import { getMockDashboardData } from '../api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await getMockDashboardData();
        
        // Extend the accounts data with additional mock details
        const extendedAccounts = data.accounts.map(account => ({
          ...account,
          accountNumber: account.type === 'bank' 
            ? `****${Math.floor(1000 + Math.random() * 9000)}` 
            : `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
          interestRate: account.type === 'bank' ? (Math.random() * 3).toFixed(2) : (Math.random() * 20 + 10).toFixed(2),
          availableBalance: account.type === 'bank' ? account.balance : account.limit - Math.abs(account.balance),
          transactions: Math.floor(Math.random() * 100 + 50),
          updated: new Date().toISOString()
        }));
        
        setAccounts(extendedAccounts);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);
  
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
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
  
  // Filter accounts based on active tab
  const filteredAccounts = activeTab === 'all' 
    ? accounts 
    : accounts.filter(account => account.type === activeTab);
  
  // Calculate summary statistics
  const totalBalance = accounts
    .filter(account => account.type === 'bank')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalDebt = accounts
    .filter(account => account.type === 'credit' && account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);
    
  const totalAvailableCredit = accounts
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + account.limit, 0) - totalDebt;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getAccountIcon = (type) => {
    if (type === 'bank') {
      return (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      );
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <p className="text-gray-500">Manage your bank and credit card accounts</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all bank accounts</p>
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Debt</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all credit cards</p>
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Credit</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAvailableCredit)}</p>
          <p className="text-xs text-gray-500 mt-1">Remaining credit limit</p>
        </Card>
      </div>
      
      {/* Account Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm transition-colors ${
            activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Accounts
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm transition-colors ${
            activeTab === 'bank' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('bank')}
        >
          Bank Accounts
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm transition-colors ${
            activeTab === 'credit' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('credit')}
        >
          Credit Cards
        </button>
      </div>
      
      {/* Account List */}
      <div className="space-y-6 mb-6">
        {filteredAccounts.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">No accounts found</p>
            </div>
          </Card>
        ) : (
          filteredAccounts.map(account => (
            <Card key={account.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {getAccountIcon(account.type)}
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.accountNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${account.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {account.type === 'bank' ? 'Current Balance' : 'Outstanding Balance'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {account.type === 'bank' ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                        <p className="text-lg font-medium text-gray-900">{account.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Transactions</p>
                        <p className="text-lg font-medium text-gray-900">{account.transactions} this month</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-lg font-medium text-gray-900">{formatDate(account.updated)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Available Credit</p>
                        <p className="text-lg font-medium text-green-600">{formatCurrency(account.availableBalance)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Credit Limit</p>
                        <p className="text-lg font-medium text-gray-900">{formatCurrency(account.limit)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">APR</p>
                        <p className="text-lg font-medium text-gray-900">{account.interestRate}%</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    View Transactions
                  </button>
                  <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                    Account Details
                  </button>
                  {account.type === 'credit' && (
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Add Account Button */}
      <div className="flex justify-center">
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Account
        </button>
      </div>
    </div>
  );
};

export default Accounts;