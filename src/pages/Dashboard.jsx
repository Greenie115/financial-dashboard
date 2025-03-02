import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Card, Grid, Badge, Loader } from '../components/common';

// Import dashboard components - these would be created in separate files
import AccountSummary from '../components/dashboard/AccountSummary';
import TransactionList from '../components/dashboard/TransactionList';
import CategoryChart from '../components/dashboard/CategoryChart';
import SpendingTrend from '../components/dashboard/SpendingTrend';
import InsightsList from '../components/dashboard/InsightsList';

// Mock data service - this would connect to your API in a real app
import { getMockDashboardData } from '../api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  
  // Simulated data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real app, this would be an API call with the timeframe parameter
        const data = await getMockDashboardData(timeframe);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeframe]);
  
  // Loading state
  if (isLoading) {
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
  
  if (!dashboardData) {
    return null;
  }
  
  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-500">Track your finances and spending habits</p>
        
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
      
      {/* Account Summary Section */}
      <div className="mb-8">
        <AccountSummary 
          accounts={dashboardData.accounts} 
          totalBalance={dashboardData.totalBalance}
          monthlySpending={dashboardData.currentMonthSpending}
          spendingTrend={dashboardData.spendingTrend}
        />
      </div>
      
      {/* Charts Section */}
      <div className="mb-8">
        <Grid cols={2}>
          <CategoryChart 
            categoryData={dashboardData.categoryExpenses} 
            timeframe={timeframe}
          />
          <SpendingTrend 
            trendData={dashboardData.dailySpending} 
            timeframe={timeframe}
          />
        </Grid>
      </div>
      
      {/* Insights and Recommendations */}
      <div className="mb-8">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Savings Recommendations</h2>
          <InsightsList recommendations={dashboardData.recommendations} />
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-8">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
            <a href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </a>
          </div>
          <TransactionList transactions={dashboardData.transactions.slice(0, 5)} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;