// src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { Card, Grid, Badge, Loader } from '../components/common';
import { AlertCircle } from 'lucide-react';
import TransactionList from '../components/dashboard/TransactionList';
import { getMockDashboardData } from '../api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    accounts: [],
    categories: [],
    dateRange: 'all',
    amountRange: [null, null], // [min, max]
  });
  
  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getMockDashboardData();
        setTransactions(data.transactions);
        setFilteredTransactions(data.transactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Filter transactions when search term or filters change
  useEffect(() => {
    let results = [...transactions];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        transaction => 
          transaction.merchant.toLowerCase().includes(term) || 
          transaction.category.toLowerCase().includes(term)
      );
    }
    
    // Apply account filter
    if (filters.accounts.length > 0) {
      results = results.filter(transaction => filters.accounts.includes(transaction.account));
    }
    
    // Apply category filter
    if (filters.categories.length > 0) {
      results = results.filter(transaction => filters.categories.includes(transaction.category));
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startDate = new Date();
          startDate.setDate(today.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        results = results.filter(transaction => new Date(transaction.date) >= startDate);
      }
    }
    
    // Apply amount range filter
    const [minAmount, maxAmount] = filters.amountRange;
    if (minAmount !== null) {
      results = results.filter(transaction => Math.abs(transaction.amount) >= minAmount);
    }
    if (maxAmount !== null) {
      results = results.filter(transaction => Math.abs(transaction.amount) <= maxAmount);
    }
    
    setFilteredTransactions(results);
  }, [searchTerm, filters, transactions]);
  
  // Extract unique accounts and categories for filters
  const uniqueAccounts = [...new Set(transactions.map(t => t.account))];
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];
  
  // Toggle account filter
  const toggleAccountFilter = (account) => {
    setFilters(prevFilters => {
      const accounts = [...prevFilters.accounts];
      const index = accounts.indexOf(account);
      
      if (index === -1) {
        accounts.push(account);
      } else {
        accounts.splice(index, 1);
      }
      
      return { ...prevFilters, accounts };
    });
  };
  
  // Toggle category filter
  const toggleCategoryFilter = (category) => {
    setFilters(prevFilters => {
      const categories = [...prevFilters.categories];
      const index = categories.indexOf(category);
      
      if (index === -1) {
        categories.push(category);
      } else {
        categories.splice(index, 1);
      }
      
      return { ...prevFilters, categories };
    });
  };
  
  // Set date range filter
  const setDateRangeFilter = (range) => {
    setFilters(prevFilters => ({ ...prevFilters, dateRange: range }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      accounts: [],
      categories: [],
      dateRange: 'all',
      amountRange: [null, null],
    });
  };
  
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
  
  // Calculate total, income, and expenses from filtered transactions
  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netAmount = totalIncome - totalExpenses;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500">View and manage your financial transactions</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">£{totalIncome.toFixed(2)}</p>
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">£{totalExpenses.toFixed(2)}</p>
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Net Amount</h3>
          <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            £{netAmount.toFixed(2)}
          </p>
        </Card>
      </div>
      
      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">Filters</h2>
          <button 
            onClick={resetFilters}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Reset all filters
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by merchant or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Account Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accounts
            </label>
            <div className="space-x-2">
              {uniqueAccounts.map(account => (
                <button
                  key={account}
                  onClick={() => toggleAccountFilter(account)}
                  className={`px-3 py-1 text-sm rounded-md mb-2 ${
                    filters.accounts.includes(account)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {account}
                </button>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="space-x-2 flex flex-wrap">
              {uniqueCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategoryFilter(category)}
                  className={`px-3 py-1 text-sm rounded-md mb-2 mr-2 ${
                    filters.categories.includes(category)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.dateRange}
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
          </div>
          
          {/* Amount Range Filter - could be implemented with a range slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.amountRange[0] || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  setFilters(prev => ({
                    ...prev,
                    amountRange: [value, prev.amountRange[1]]
                  }));
                }}
              />
              <input
                type="number"
                placeholder="Max"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.amountRange[1] || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  setFilters(prev => ({
                    ...prev,
                    amountRange: [prev.amountRange[0], value]
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Transactions List */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Transactions {filteredTransactions.length > 0 && `(${filteredTransactions.length})`}
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
              Export
            </button>
            <button className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
              Add Manual Transaction
            </button>
          </div>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <TransactionList transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;