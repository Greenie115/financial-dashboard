// src/components/analysis/MonthlySpendingAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Grid, Badge } from '../common';
import { getMonthlySpendingTotals } from '../../utils/storage';

const MonthlySpendingAnalysis = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('monthly'); // 'monthly' or 'category'
  
  // Colors for charts
  const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6', '#f43f5e'];
  
  // Load monthly spending data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getMonthlySpendingTotals();
        setMonthlyData(data);
        
        // Select the two most recent months with data
        const monthsWithData = data
          .filter(month => month.expenses > 0)
          .sort((a, b) => b.month.localeCompare(a.month));
          
        if (monthsWithData.length >= 2) {
          setSelectedMonths([monthsWithData[0].month, monthsWithData[1].month]);
        } else if (monthsWithData.length === 1) {
          setSelectedMonths([monthsWithData[0].month]);
        }
      } catch (err) {
        console.error('Error loading monthly data:', err);
        setError('Failed to load monthly spending data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Toggle month selection
  const toggleMonthSelection = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      // Limit to comparing 2 months at a time
      if (selectedMonths.length < 2) {
        setSelectedMonths([...selectedMonths, month]);
      } else {
        // Replace the oldest selected month
        setSelectedMonths([...selectedMonths.slice(1), month]);
      }
    }
  };
  
  // Get data for selected months
  const getSelectedMonthsData = () => {
    return monthlyData.filter(month => selectedMonths.includes(month.month));
  };
  
  // Get category comparison data
  const getCategoryComparisonData = () => {
    const selected = getSelectedMonthsData();
    if (selected.length === 0) return [];
    
    // Get all unique categories across selected months
    const allCategories = new Set();
    selected.forEach(month => {
      Object.keys(month.categories).forEach(category => {
        allCategories.add(category);
      });
    });
    
    // Create comparison data for each category
    return Array.from(allCategories).map(category => {
      const result = { category };
      
      selected.forEach(month => {
        const formattedMonth = formatMonth(month.month);
        result[formattedMonth] = month.categories[category] || 0;
      });
      
      return result;
    }).sort((a, b) => {
      // Sort by total spending across months
      const aTotal = selected.reduce((sum, month) => sum + (a[formatMonth(month.month)] || 0), 0);
      const bTotal = selected.reduce((sum, month) => sum + (b[formatMonth(month.month)] || 0), 0);
      return bTotal - aTotal;
    });
  };
  
  // Calculate month-on-month changes
  const calculateChanges = () => {
    const selected = getSelectedMonthsData().sort((a, b) => a.month.localeCompare(b.month));
    
    if (selected.length < 2) {
      return { totalChange: 0, categoryChanges: [] };
    }
    
    const older = selected[0];
    const newer = selected[1];
    
    // Calculate total spending change
    const totalChange = {
      older: older.expenses,
      newer: newer.expenses,
      change: newer.expenses - older.expenses,
      percentChange: older.expenses > 0 
        ? ((newer.expenses - older.expenses) / older.expenses) * 100 
        : 0
    };
    
    // Calculate category-specific changes
    const allCategories = new Set([
      ...Object.keys(older.categories),
      ...Object.keys(newer.categories)
    ]);
    
    const categoryChanges = Array.from(allCategories).map(category => {
      const olderAmount = older.categories[category] || 0;
      const newerAmount = newer.categories[category] || 0;
      const change = newerAmount - olderAmount;
      const percentChange = olderAmount > 0 
        ? (change / olderAmount) * 100 
        : newerAmount > 0 ? 100 : 0;
      
      return {
        category,
        older: olderAmount,
        newer: newerAmount,
        change,
        percentChange
      };
    }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    
    return { totalChange, categoryChanges };
  };
  
  // Loading state
  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }
  
  // No data state
  if (monthlyData.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Data Available</h3>
          <p className="text-gray-500">Import your transaction data to see monthly spending analysis</p>
        </div>
      </Card>
    );
  }
  
  const selectedData = getSelectedMonthsData();
  const categoryData = getCategoryComparisonData();
  const { totalChange, categoryChanges } = calculateChanges();
  
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending Analysis</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Months to Compare (max 2)
          </label>
          <div className="flex flex-wrap gap-2">
            {monthlyData
              .filter(month => month.expenses > 0)
              .sort((a, b) => b.month.localeCompare(a.month))
              .map(month => (
                <button
                  key={month.month}
                  onClick={() => toggleMonthSelection(month.month)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedMonths.includes(month.month)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formatMonth(month.month)}
                </button>
              ))
            }
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comparison Mode
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={comparisonMode === 'monthly'}
                onChange={() => setComparisonMode('monthly')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Monthly Overview</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={comparisonMode === 'category'}
                onChange={() => setComparisonMode('category')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Category Comparison</span>
            </label>
          </div>
        </div>
        
        {selectedMonths.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">Select at least one month to view analysis</p>
          </div>
        ) : comparisonMode === 'monthly' ? (
          <div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonth}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`£${value.toFixed(2)}`, 'Amount']}
                    labelFormatter={formatMonth}
                  />
                  <Legend />
                  <Bar name="Expenses" dataKey="expenses" fill="#ef4444" />
                  <Bar name="Income" dataKey="income" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {selectedData.length === 2 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-md font-medium text-gray-900 mb-3">Month-on-Month Comparison</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Previous Month</p>
                    <p className="text-xl font-bold text-gray-900">£{totalChange.older.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{formatMonth(selectedData[0].month)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Current Month</p>
                    <p className="text-xl font-bold text-gray-900">£{totalChange.newer.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{formatMonth(selectedData[1].month)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Change</p>
                    <p className={`text-xl font-bold ${totalChange.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalChange.change < 0 ? '-' : '+'}£{Math.abs(totalChange.change).toFixed(2)}
                    </p>
                    <p className={`text-xs ${totalChange.percentChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalChange.percentChange < 0 ? '-' : '+'}
                      {Math.abs(totalChange.percentChange).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-gray-700 mb-2">Biggest Category Changes</h4>
                <div className="space-y-3">
                  {categoryChanges.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${category.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {category.change < 0 ? '-' : '+'}£{Math.abs(category.change).toFixed(2)}
                        </span>
                        <span className={`ml-2 text-xs ${category.percentChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({category.percentChange < 0 ? '-' : '+'}
                          {Math.abs(category.percentChange).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    width={80}
                  />
                  <Tooltip formatter={(value) => [`£${value.toFixed(2)}`, '']} />
                  <Legend />
                  {selectedData.map((month, index) => (
                    <Bar 
                      key={month.month} 
                      dataKey={formatMonth(month.month)} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {selectedData.length === 2 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-md font-medium text-gray-900 mb-3">Category Comparison</h3>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {formatMonth(selectedData[0].month)}
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {formatMonth(selectedData[1].month)}
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryChanges.map((category, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">
                          {category.category}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-right">
                          £{category.older.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-right">
                          £{category.newer.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-right">
                          <span className={category.change < 0 ? 'text-green-600' : 'text-red-600'}>
                            {category.change < 0 ? '-' : '+'}£{Math.abs(category.change).toFixed(2)}
                            <span className="text-xs ml-1">
                              ({category.percentChange < 0 ? '-' : '+'}
                              {Math.abs(category.percentChange).toFixed(1)}%)
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MonthlySpendingAnalysis;