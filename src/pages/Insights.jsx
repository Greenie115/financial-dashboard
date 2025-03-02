// src/pages/Insights.jsx
import React, { useState, useEffect } from 'react';
import { Card, Grid, Badge, Loader, TabGroup, TabList, Tab, TabPanels, TabPanel } from '../components/common';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { getMockDashboardData } from '../api';
import InsightsList from '../components/dashboard/InsightsList';

const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('spending');
  const [timeframe, setTimeframe] = useState('month');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getMockDashboardData(timeframe);
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching insights data:', err);
        setError('Failed to load insights data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeframe]);
  
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
  
  if (!data) {
    return null;
  }

  // Prepare data for spending by category chart
  const categoryData = data.categoryExpenses;
  
  // Prepare data for spending over time chart
  const dailySpendingData = data.dailySpending;
  
  // Mock data for income vs expenses chart
  const incomeVsExpenses = [
    { month: 'Jan', income: 3200, expenses: 2100 },
    { month: 'Feb', income: 3200, expenses: 2300 },
    { month: 'Mar', income: 3400, expenses: 2800 },
    { month: 'Apr', income: 3300, expenses: 2200 },
    { month: 'May', income: 3500, expenses: 2400 },
    { month: 'Jun', income: 3200, expenses: 2100 },
  ];
  
  // Mock data for budget tracking
  const budgetData = [
    { category: 'Groceries', budget: 400, actual: 450, percentUsed: 112.5 },
    { category: 'Dining', budget: 300, actual: 320, percentUsed: 106.7 },
    { category: 'Entertainment', budget: 200, actual: 220, percentUsed: 110 },
    { category: 'Transport', budget: 200, actual: 180, percentUsed: 90 },
    { category: 'Shopping', budget: 300, actual: 280, percentUsed: 93.3 },
  ];

  // Colors for charts
  const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6', '#f43f5e'];
  
  // Timeframe label helper
  const timeframeLabel = (timeframe) => {
    switch (timeframe) {
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      case 'quarter':
        return 'Quarterly';
      case 'year':
        return 'Yearly';
      default:
        return 'Monthly';
    }
  };
  
  // Custom tooltip for category chart
  const CategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-700">£{data.value.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {(payload[0].percent * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', { 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Custom tooltip for daily spending chart
  const DailySpendingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-gray-700">£{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-500">Analyze your financial data and discover patterns</p>
        
        {/* Timeframe Selector */}
        <div className="flex space-x-2 mt-4">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeframe === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeframe === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeframe === 'quarter' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeframe === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Insights Tabs */}
      <TabGroup>
        <TabList className="mb-6">
          <Tab active={activeTab === 'spending'} onClick={() => setActiveTab('spending')}>
            Spending Analysis
          </Tab>
          <Tab active={activeTab === 'income'} onClick={() => setActiveTab('income')}>
            Income vs Expenses
          </Tab>
          <Tab active={activeTab === 'budget'} onClick={() => setActiveTab('budget')}>
            Budget Tracking
          </Tab>
          <Tab active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')}>
            Recommendations
          </Tab>
        </TabList>
        
        <TabPanels>
          {/* Spending Analysis Tab */}
          {activeTab === 'spending' && (
            <div className="space-y-6">
              <Grid cols={2}>
                {/* Spending by Category Chart */}
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Spending by Category</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {timeframeLabel(timeframe)} breakdown of your expenses
                  </p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CategoryTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Your largest spending category is {categoryData[0]?.name}</li>
                      <li>• {categoryData[0]?.name} represents {((categoryData[0]?.value / data.currentMonthSpending) * 100).toFixed(1)}% of your total spending</li>
                      <li>• You spent more on {categoryData[0]?.name} than {categoryData[1]?.name} and {categoryData[2]?.name} combined</li>
                    </ul>
                  </div>
                </Card>
                
                {/* Spending Trend Chart */}
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Spending Trend</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {timeframeLabel(timeframe)} spending patterns
                  </p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailySpendingData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `£${value}`}
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip content={<DailySpendingTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#4f46e5"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          dot={{ r: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Your spending tends to be higher on weekends</li>
                      <li>• Your average daily spending is £{(data.currentMonthSpending / dailySpendingData.length).toFixed(2)}</li>
                      <li>• Your spending has {data.spendingTrend > 0 ? 'increased' : 'decreased'} by {Math.abs(data.spendingTrend).toFixed(1)}% compared to last {timeframe}</li>
                    </ul>
                  </div>
                </Card>
              </Grid>
              
              {/* Top Merchants */}
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Merchants</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Merchant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transactions
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Transaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.transactions
                        .filter(t => t.amount < 0)
                        .reduce((acc, t) => {
                          const existingMerchant = acc.find(m => m.merchant === t.merchant);
                          if (existingMerchant) {
                            existingMerchant.amount += Math.abs(t.amount);
                            existingMerchant.count += 1;
                          } else {
                            acc.push({
                              merchant: t.merchant,
                              category: t.category,
                              amount: Math.abs(t.amount),
                              count: 1
                            });
                          }
                          return acc;
                        }, [])
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map((merchant, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{merchant.merchant}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {merchant.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {merchant.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              £{merchant.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              £{(merchant.amount / merchant.count).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          
          {/* Income vs Expenses Tab */}
          {activeTab === 'income' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Income vs Expenses</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {timeframeLabel(timeframe)} comparison
                </p>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={incomeVsExpenses}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `£${value}`} />
                      <Tooltip formatter={(value) => `£${value}`} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#10b981" />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Average Monthly Income</h4>
                    <p className="text-2xl font-bold text-green-600">
                      £{(incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) / incomeVsExpenses.length).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Average Monthly Expenses</h4>
                    <p className="text-2xl font-bold text-red-600">
                      £{(incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0) / incomeVsExpenses.length).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Average Monthly Savings</h4>
                    <p className="text-2xl font-bold text-indigo-600">
                      £{((incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) - incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0)) / incomeVsExpenses.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Rate</h3>
                
                <div className="flex items-center mb-6">
                  <div className="flex-1 bg-gray-200 rounded-full h-5">
                    <div 
                      className="bg-indigo-600 h-5 rounded-full" 
                      style={{ width: `${((incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) - incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0)) / incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-lg font-bold text-indigo-600">
                    {((incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) - incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0)) / incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Your current savings rate is {((incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) - incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0)) / incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(1)}% of your income.</p>
                  <p>Financial experts recommend saving at least 20% of your income. You're {((incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) - incomeVsExpenses.reduce((sum, month) => sum + month.expenses, 0)) / incomeVsExpenses.reduce((sum, month) => sum + month.income, 0) * 100) >= 20 ? 'meeting' : 'below'} this recommendation.</p>
                </div>
              </Card>
            </div>
          )}
          
          {/* Budget Tracking Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Budget Tracking</h3>
                  <button className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    Edit Budgets
                  </button>
                </div>
                
                <div className="space-y-6">
                  {budgetData.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{category.category}</span>
                          <span className="ml-2 text-xs text-gray-500">£{category.actual} of £{category.budget}</span>
                        </div>
                        <span className={`text-xs font-medium ${category.percentUsed > 100 ? 'text-red-600' : 'text-gray-700'}`}>
                          {category.percentUsed}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${category.percentUsed > 100 ? 'bg-red-600' : 'bg-indigo-600'}`} 
                          style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Budget Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Budget</p>
                      <p className="text-lg font-medium text-gray-900">
                        £{budgetData.reduce((sum, category) => sum + category.budget, 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="text-lg font-medium text-gray-900">
                        £{budgetData.reduce((sum, category) => sum + category.actual, 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className={`text-lg font-medium ${(budgetData.reduce((sum, category) => sum + category.budget, 0) - budgetData.reduce((sum, category) => sum + category.actual, 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        £{(budgetData.reduce((sum, category) => sum + category.budget, 0) - budgetData.reduce((sum, category) => sum + category.actual, 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget vs Actual Spending</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={budgetData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis tickFormatter={(value) => `£${value}`} />
                      <Tooltip formatter={(value) => `£${value}`} />
                      <Legend />
                      <Bar dataKey="budget" name="Budget" fill="#a5b4fc" />
                      <Bar dataKey="actual" name="Actual" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
          
          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Recommendations</h3>
                <InsightsList recommendations={data.recommendations} />
              </Card>
              
              <Grid cols={2}>
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reducing Your Expenses</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Reduce energy consumption to lower utility bills by installing smart thermostats and LED lighting.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Shop Smarter</p>
                        <p className="text-sm text-gray-500">Use cashback apps, loyalty programs, and wait for sales to reduce shopping expenses.</p>
                      </div>
                    </li>
                  </ul>
                </Card>
                
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Increasing Your Savings</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Automate Savings</p>
                        <p className="text-sm text-gray-500">Set up automatic transfers to a savings account on payday to ensure consistent saving.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">50/30/20 Rule</p>
                        <p className="text-sm text-gray-500">Allocate 50% of income to necessities, 30% to wants, and 20% to savings and debt repayment.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">High-Interest Savings</p>
                        <p className="text-sm text-gray-500">Move your savings to a high-interest account to maximize returns on your money.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Challenge Expenses</p>
                        <p className="text-sm text-gray-500">Try monthly challenges like no-spend weekends or cash-only spending periods.</p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </Grid>
              
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Personalized Action Plan</h3>
                  <button className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    Save to Goals
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Short-term Actions (Next 30 Days)</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                      <li>Review and cancel unused subscriptions (Netflix, Spotify, etc.)</li>
                      <li>Create a meal plan for weekdays to reduce dining out expenses</li>
                      <li>Set up automatic transfers of £300 to your savings account</li>
                      <li>Switch to your Amex card for Amazon purchases to earn cashback</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Medium-term Goals (Next 3-6 Months)</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                      <li>Reduce dining expenses by 25% (£80 monthly savings)</li>
                      <li>Increase savings rate from 15% to 20% of income</li>
                      <li>Build emergency fund to cover 3 months of expenses</li>
                      <li>Switch to a high-interest savings account for better returns</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Projected Outcome</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      By following this plan, you could save an additional £2,340 over the next 6 months
                      and reduce your monthly expenses by approximately 15%.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-indigo-600 h-3 rounded-full" 
                          style={{ width: '35%' }}
                        ></div>
                      </div>
                      <span className="ml-4 text-sm font-medium text-indigo-600">
                        35% progress to financial goal
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Insights