// src/api/index.js
import createStarlingClient from './starling';
import createAmexClient from './amex';
import { getMockDashboardData, getMockTransactionDetails } from './mockData';

/**
 * Financial API Interface
 * This module provides a unified interface for all financial APIs.
 */

// Centralized API client creator
export const createApiClient = ({ starlingToken, amexToken }) => {
  // Initialize API clients if tokens are provided
  const clients = {
    starling: starlingToken ? createStarlingClient(starlingToken) : null,
    amex: amexToken ? createAmexClient(amexToken) : null
  };
  
  return {
    // Check if a specific API client is available
    hasClient: (type) => !!clients[type],
    
    // Account methods
    getAccounts: async () => {
      try {
        const accounts = [];
        
        // Fetch accounts from Starling if available
        if (clients.starling) {
          const starlingAccounts = await clients.starling.getAccounts();
          const formattedAccounts = starlingAccounts.accounts.map(account => ({
            id: account.accountUid,
            name: account.name || 'Starling Account',
            type: 'bank',
            provider: 'starling',
            balance: parseFloat(account.balance.amount) || 0,
            currency: account.currency || 'GBP',
            lastUpdated: new Date().toISOString()
          }));
          
          accounts.push(...formattedAccounts);
        }
        
        // Fetch accounts from Amex if available
        if (clients.amex) {
          const amexAccounts = await clients.amex.getCardAccounts();
          const formattedAccounts = amexAccounts.accounts.map(account => ({
            id: account.accountId,
            name: account.name || 'Amex Card',
            type: 'credit',
            provider: 'amex',
            balance: -(parseFloat(account.balance) || 0), // Credit card balance as negative
            limit: parseFloat(account.creditLimit) || 0,
            currency: account.currency || 'GBP',
            dueDate: account.paymentDueDate,
            lastUpdated: new Date().toISOString()
          }));
          
          accounts.push(...formattedAccounts);
        }
        
        return accounts;
      } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
      }
    },
    
    // Transaction methods
    getTransactions: async (params = {}) => {
      try {
        const transactions = [];
        
        // Fetch transactions from Starling if available
        if (clients.starling) {
          // First get accounts to iterate through
          const starlingAccounts = await clients.starling.getAccounts();
          
          // For each account, get transactions
          for (const account of starlingAccounts.accounts) {
            const starlingTransactions = await clients.starling.getTransactions(
              account.accountUid,
              {
                from: params.startDate,
                to: params.endDate
              }
            );
            
            const formattedTransactions = starlingTransactions.feedItems.map(transaction => ({
              id: transaction.feedItemUid,
              accountId: account.accountUid,
              date: transaction.transactionTime,
              amount: parseFloat(transaction.amount.minorUnits) / 100,
              description: transaction.counterPartyName || transaction.reference || 'Transaction',
              category: transaction.spendingCategory || 'Uncategorized',
              merchant: transaction.counterPartyName || 'Unknown',
              status: transaction.status || 'COMPLETED',
              provider: 'starling'
            }));
            
            transactions.push(...formattedTransactions);
          }
        }
        
        // Fetch transactions from Amex if available
        if (clients.amex) {
          // First get accounts to iterate through
          const amexAccounts = await clients.amex.getCardAccounts();
          
          // For each account, get transactions
          for (const account of amexAccounts.accounts) {
            const amexTransactions = await clients.amex.getTransactions(
              account.accountId,
              {
                startDate: params.startDate,
                endDate: params.endDate,
                limit: params.limit
              }
            );
            
            const formattedTransactions = amexTransactions.transactions.map(transaction => ({
              id: transaction.transactionId,
              accountId: account.accountId,
              date: transaction.date,
              amount: -parseFloat(transaction.amount), // Amex transactions are positive for charges
              description: transaction.description || 'Transaction',
              category: transaction.category || 'Uncategorized',
              merchant: transaction.merchantName || 'Unknown',
              status: transaction.status || 'COMPLETED',
              provider: 'amex'
            }));
            
            transactions.push(...formattedTransactions);
          }
        }
        
        // Sort transactions by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return transactions;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    },
    
    getTransaction: async (id, provider) => {
      try {
        if (provider === 'starling' && clients.starling) {
          // Find the account this transaction belongs to
          const starlingAccounts = await clients.starling.getAccounts();
          
          // Iterate through accounts to find the transaction
          for (const account of starlingAccounts.accounts) {
            try {
              const transaction = await clients.starling.getTransaction(account.accountUid, id);
              
              return {
                id: transaction.feedItemUid,
                accountId: account.accountUid,
                date: transaction.transactionTime,
                amount: parseFloat(transaction.amount.minorUnits) / 100,
                description: transaction.counterPartyName || transaction.reference || 'Transaction',
                category: transaction.spendingCategory || 'Uncategorized',
                merchant: transaction.counterPartyName || 'Unknown',
                status: transaction.status || 'COMPLETED',
                reference: transaction.reference || '',
                notes: transaction.notes || '',
                provider: 'starling',
                location: transaction.counterPartySubEntityIdentifier ? {
                  address: transaction.counterPartySubEntityIdentifier.address || '',
                  city: transaction.counterPartySubEntityIdentifier.city || '',
                  country: transaction.counterPartySubEntityIdentifier.country || '',
                } : null
              };
            } catch (err) {
              // Transaction not found in this account, continue to next account
              continue;
            }
          }
          
          throw new Error('Transaction not found');
        } else if (provider === 'amex' && clients.amex) {
          // Find the account this transaction belongs to
          const amexAccounts = await clients.amex.getCardAccounts();
          
          // Iterate through accounts to find the transaction
          for (const account of amexAccounts.accounts) {
            try {
              const transaction = await clients.amex.getTransaction(account.accountId, id);
              
              return {
                id: transaction.transactionId,
                accountId: account.accountId,
                date: transaction.date,
                amount: -parseFloat(transaction.amount), // Amex transactions are positive for charges
                description: transaction.description || 'Transaction',
                category: transaction.category || 'Uncategorized',
                merchant: transaction.merchantName || 'Unknown',
                status: transaction.status || 'COMPLETED',
                reference: transaction.referenceNumber || '',
                notes: transaction.notes || '',
                provider: 'amex',
                location: transaction.merchant ? {
                  address: transaction.merchant.address || '',
                  city: transaction.merchant.city || '',
                  country: transaction.merchant.country || '',
                } : null
              };
            } catch (err) {
              // Transaction not found in this account, continue to next account
              continue;
            }
          }
          
          throw new Error('Transaction not found');
        }
        
        throw new Error(`Provider ${provider} not available or transaction not found`);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        throw error;
      }
    },
    
    // Analysis methods
    getSpendingByCategory: async (params = {}) => {
      try {
        // Fetch all transactions
        const transactions = await this.getTransactions(params);
        
        // Group transactions by category
        const categories = {};
        
        transactions.forEach(transaction => {
          if (transaction.amount < 0) { // Only count expenses (negative amounts)
            const category = transaction.category || 'Uncategorized';
            if (!categories[category]) {
              categories[category] = 0;
            }
            categories[category] += Math.abs(transaction.amount);
          }
        });
        
        // Convert to array format for charts
        return Object.entries(categories).map(([name, value]) => ({
          name,
          value: Math.round(value * 100) / 100
        })).sort((a, b) => b.value - a.value);
      } catch (error) {
        console.error('Error getting spending by category:', error);
        throw error;
      }
    },
    
    getSpendingTrend: async (params = {}) => {
      try {
        // Fetch all transactions
        const transactions = await this.getTransactions(params);
        
        // Group transactions by date
        const dailySpending = {};
        
        transactions.forEach(transaction => {
          if (transaction.amount < 0) { // Only count expenses (negative amounts)
            const date = transaction.date.split('T')[0]; // Get just the date part
            if (!dailySpending[date]) {
              dailySpending[date] = 0;
            }
            dailySpending[date] += Math.abs(transaction.amount);
          }
        });
        
        // Convert to array format for charts
        return Object.entries(dailySpending).map(([date, amount]) => ({
          date,
          amount: Math.round(amount * 100) / 100
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
      } catch (error) {
        console.error('Error getting spending trend:', error);
        throw error;
      }
    },
    
    // Mock data methods for development and testing
    getMockDashboardData,
    getMockTransactionDetails
  };
};

// Export mock data functions for direct use
export { getMockDashboardData, getMockTransactionDetails };