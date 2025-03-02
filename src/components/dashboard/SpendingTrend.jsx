// src/components/dashboard/SpendingTrend.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common';

/**
 * SpendingTrend Component
 * Displays a line chart of spending over time
 */
const SpendingTrend = ({ trendData, timeframe }) => {
  // If we don't have data, show loading state
  if (!trendData || trendData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Spending Trend</h3>
        <p className="text-sm text-gray-500 mb-4">
          Track your spending patterns over time
        </p>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </Card>
    );
  }

  // Format date for display based on timeframe
  const formatXAxis = (dateStr) => {
    const date = new Date(dateStr);
    
    switch (timeframe) {
      case 'week':
        // For weekly view, show day name
        return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      case 'month':
        // For monthly view, show day number
        return date.getDate();
      case 'quarter':
        // For quarterly view, show abbreviated month and day
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
      case 'year':
        // For yearly view, show month only
        return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      default:
        return date.getDate();
    }
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dateStr = payload[0].payload.date;
      const date = new Date(dateStr);
      const formattedDate = new Intl.DateTimeFormat('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(date);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-medium">{formattedDate}</p>
          <p className="text-gray-700">£{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Helper for timeframe display
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
  
  // Calculate average daily spending
  const avgSpending = trendData.reduce((sum, day) => sum + day.amount, 0) / trendData.length;
  
  // Find highest spending day
  const highestSpending = [...trendData].sort((a, b) => b.amount - a.amount)[0];
  const highestDate = new Date(highestSpending?.date);
  const formattedHighestDate = highestDate ? new Intl.DateTimeFormat('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(highestDate) : 'N/A';
  
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Spending Trend</h3>
      <p className="text-sm text-gray-500 mb-4">
        {timeframeLabel(timeframe)} spending patterns
      </p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
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
              tickFormatter={formatXAxis}
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
            <Tooltip content={<CustomTooltip />} />
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Avg. Daily Spending</p>
            <p className="text-base font-medium">£{avgSpending.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Highest Spending Day</p>
            <p className="text-base font-medium">£{highestSpending?.amount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{formattedHighestDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpendingTrend;