// src/utils/storage.js
import { openDB } from 'idb';

// Open or create the IndexedDB database
const openDatabase = async () => {
  return openDB('financeDashboardDB', 1, {
    upgrade(db) {
      // Create a store for transactions if it doesn't exist
      if (!db.objectStoreNames.contains('transactions')) {
        const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
        // Create indexes for common queries
        transactionStore.createIndex('date', 'date');
        transactionStore.createIndex('month', 'month');
        transactionStore.createIndex('category', 'category');
        transactionStore.createIndex('amount', 'amount');
      }
    }
  });
};

// Save multiple transactions to the database
export const saveTransactions = async (transactions) => {
  const db = await openDatabase();
  const tx = db.transaction('transactions', 'readwrite');
  const store = tx.objectStore('transactions');
  
  // Add a month index to each transaction for easier querying
  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    transaction.month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    await store.put(transaction);
  }
  
  await tx.done;
  return true;
};

// Get all transactions
export const getAllTransactions = async () => {
  const db = await openDatabase();
  return db.getAll('transactions');
};

// Get transactions for a specific month (format: 'YYYY-MM')
export const getTransactionsByMonth = async (month) => {
  const db = await openDatabase();
  const index = db.transaction('transactions').store.index('month');
  return index.getAll(month);
};

// Get transactions between two dates
export const getTransactionsByDateRange = async (startDate, endDate) => {
  const db = await openDatabase();
  const index = db.transaction('transactions').store.index('date');
  const range = IDBKeyRange.bound(
    new Date(startDate).toISOString(),
    new Date(endDate).toISOString()
  );
  return index.getAll(range);
};

// Get transactions by category
export const getTransactionsByCategory = async (category) => {
  const db = await openDatabase();
  const index = db.transaction('transactions').store.index('category');
  return index.getAll(category);
};

// Update a transaction
export const updateTransaction = async (transaction) => {
  const db = await openDatabase();
  const tx = db.transaction('transactions', 'readwrite');
  const store = tx.objectStore('transactions');
  
  // Ensure month property is updated if date changed
  if (transaction.date) {
    const date = new Date(transaction.date);
    transaction.month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  
  await store.put(transaction);
  await tx.done;
  return true;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction('transactions', 'readwrite');
  await tx.objectStore('transactions').delete(id);
  await tx.done;
  return true;
};

// Get monthly spending totals for the last 12 months
export const getMonthlySpendingTotals = async () => {
  const db = await openDatabase();
  const allTransactions = await db.getAll('transactions');
  
  // Get current date and date 12 months ago
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  // Initialize results object with last 12 months
  const results = {};
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now);
    monthDate.setMonth(now.getMonth() - i);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
    results[monthKey] = {
      month: monthKey,
      totalAmount: 0,
      expenses: 0,
      income: 0,
      categories: {}
    };
  }
  
  // Process transactions
  allTransactions.forEach(transaction => {
    if (!transaction.date) return;
    
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Only process transactions in the last 12 months
    if (results[monthKey]) {
      results[monthKey].totalAmount += transaction.amount;
      
      if (transaction.amount < 0) {
        results[monthKey].expenses += Math.abs(transaction.amount);
        
        // Track spending by category
        const category = transaction.category || 'Uncategorized';
        if (!results[monthKey].categories[category]) {
          results[monthKey].categories[category] = 0;
        }
        results[monthKey].categories[category] += Math.abs(transaction.amount);
      } else {
        results[monthKey].income += transaction.amount;
      }
    }
  });
  
  // Convert to array and sort by month
  return Object.values(results).sort((a, b) => a.month.localeCompare(b.month));
};

// Clear all transaction data
export const clearAllTransactions = async () => {
  const db = await openDatabase();
  const tx = db.transaction('transactions', 'readwrite');
  await tx.objectStore('transactions').clear();
  await tx.done;
  return true;
};

// Export transactions as CSV
export const exportTransactionsAsCsv = async () => {
  const transactions = await getAllTransactions();
  
  if (transactions.length === 0) {
    return null;
  }
  
  // Prepare CSV columns
  const columns = [
    'date',
    'description',
    'merchant',
    'amount',
    'category',
    'account'
  ];
  
  // Create CSV header
  let csv = columns.join(',') + '\r\n';
  
  // Add transaction rows
  transactions.forEach(transaction => {
    const row = columns.map(column => {
      let value = transaction[column] || '';
      
      // Format date
      if (column === 'date' && value) {
        const date = new Date(value);
        value = date.toISOString().split('T')[0];
      }
      
      // Escape commas in text fields
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      
      return value;
    });
    
    csv += row.join(',') + '\r\n';
  });
  
  return csv;
};