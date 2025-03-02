// src/components/dashboard/AccountSummary.jsx
import React from 'react';
import { Grid, Card, Badge } from '../common';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react';

/**
 * Account Summary Component
 * Displays a summary of all financial accounts and key metrics
 */
const AccountSummary = ({ accounts, totalBalance, monthlySpending, spendingTrend }) => {
  return (
    <Grid cols={3}>
      {/* Total Balance Card */}
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            £{totalBalance.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 mt-1">Across all accounts</span>
        </div>
      </Card>
      
      {/* Monthly Spending Card */}
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Monthly Spending</h3>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900">£{monthlySpending.toFixed(2)}</span>
          <div className="flex items-center mt-1">
            {spendingTrend > 0 ? (
              <div className="flex items-center text-red-500 text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{Math.abs(spendingTrend).toFixed(1)}% from last month</span>
              </div>
            ) : (
              <div className="flex items-center text-green-500 text-xs">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span>{Math.abs(spendingTrend).toFixed(1)}% from last month</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Accounts Overview Card */}
      <Card>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Accounts</h3>
          <div className="space-y-3">
            {accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  {account.type === 'bank' ? (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                        <path d="M7 15h.01" />
                        <path d="M11 15h2" />
                      </svg>
                    </div>
                  )}
                  <span className="font-medium text-sm text-gray-700">{account.name}</span>
                </div>
                <span className={`font-medium text-sm ${account.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                  £{account.balance.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {/* Credit Card Due Date Reminder */}
          {accounts.some(account => account.type === 'credit') && (
            <div className="mt-4 p-2 bg-amber-50 rounded-md">
              <div className="flex items-center text-amber-800 text-xs">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Amex payment due in 15 days</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Grid>
  );
};

export default AccountSummary;