// src/components/dashboard/CategoryChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../common';

/**
 * CategoryChart Component
 * Displays spending breakdown by category in a pie chart
 */
const CategoryChart = ({ categoryData, timeframe }) => {
  // If we don't have data, show loading state
  if (!categoryData || categoryData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Spending by Category</h3>
        <p className="text-sm text-gray-500 mb-4">
          {timeframeLabel(timeframe)} breakdown of your expenses
        </p>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </Card>
    );
  }

  // Colors for the pie chart
  const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6', '#f43f5e'];
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
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
  
  // Calculate total spending
  const totalSpending = categoryData.reduce((sum, category) => sum + category.value, 0);
  
  return (
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
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Spending</span>
          <span className="text-sm font-medium">£{totalSpending.toFixed(2)}</span>
        </div>
        
        {/* Top categories */}
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Top Categories</h4>
          <div className="space-y-2">
            {categoryData.slice(0, 3).map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">£{category.value.toFixed(2)}</span>
                  <span className="text-gray-500 ml-1">
                    ({((category.value / totalSpending) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryChart;