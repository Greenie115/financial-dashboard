// src/pages/Import.jsx
import React, { useState, useEffect } from 'react';
import { Card, Grid } from '../components/common';
import CSVImport from '../components/import/CSVImport';
import { getAllTransactions, clearAllTransactions, exportTransactionsAsCsv } from '../utils/storage';

const Import = () => {
  const [transactions, setTransactions] = useState([]);
  const [importSummary, setImportSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load existing transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, []);
  
  // Handle import completion
  const handleImportComplete = (importedTransactions) => {
    // Update local transactions list
    setTransactions(prev => [...prev, ...importedTransactions]);
    
    // Calculate import summary
    const summary = {
      count: importedTransactions.length,
      totalAmount: importedTransactions.reduce((sum, t) => sum + t.amount, 0),
      expenses: importedTransactions.filter(t => t.amount < 0).length,
      expensesAmount: importedTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      income: importedTransactions.filter(t => t.amount > 0).length,
      incomeAmount: importedTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
      dateRange: {
        start: new Date(Math.min(...importedTransactions.map(t => new Date(t.date)))),
        end: new Date(Math.max(...importedTransactions.map(t => new Date(t.date))))
      },
      source: importedTransactions[0]?.source || 'Unknown'
    };
    
    setImportSummary(summary);
  };
  
  // Handle data export
  const handleExportData = async () => {
    try {
      const csvData = await exportTransactionsAsCsv();
      
      if (!csvData) {
        alert('No data to export');
        return;
      }
      
      // Create blob and download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data');
    }
  };
  
  // Handle clearing all data
  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to delete ALL transaction data? This cannot be undone.')) {
      try {
        await clearAllTransactions();
        setTransactions([]);
        setImportSummary(null);
        alert('All transaction data has been deleted');
      } catch (err) {
        console.error('Error clearing data:', err);
        alert('Failed to clear data');
      }
    }
  };
  
  // Group transactions by source
  const transactionsBySource = transactions.reduce((acc, transaction) => {
    const source = transaction.source || 'Unknown';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(transaction);
    return acc;
  }, {});
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import & Export</h1>
        <p className="text-gray-500">Manage your transaction data</p>
      </div>
      
      <Grid cols={1}>
        {/* CSV Import */}
        <CSVImport onImportComplete={handleImportComplete} />
        
        {/* Import Summary */}
        {importSummary && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Import Summary</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Success
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Transactions Imported</p>
                  <p className="text-xl font-bold text-gray-900">{importSummary.count}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">£{importSummary.expensesAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{importSummary.expenses} transactions</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-xl font-bold text-green-600">£{importSummary.incomeAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{importSummary.income} transactions</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date Range</p>
                    <p className="text-md font-medium text-gray-900">
                      {importSummary.dateRange.start.toLocaleDateString()} — {importSummary.dateRange.end.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Source File</p>
                    <p className="text-md font-medium text-gray-900">{importSummary.source}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Data Management */}
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-md font-medium text-gray-900">Export All Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">Download all your transaction data as a CSV file</p>
              </div>
              <button 
                onClick={handleExportData}
                className="mt-2 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Export Data
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-red-50 rounded-md">
              <div>
                <h3 className="text-md font-medium text-red-700">Clear All Data</h3>
                <p className="text-sm text-red-500 mt-1">Permanently delete all your transaction data</p>
              </div>
              <button 
                onClick={handleClearAllData}
                className="mt-2 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </Card>
        
        {/* Imported Data Summary */}
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Imported Data</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No transaction data imported yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-700 font-medium">Total Transactions: {transactions.length}</p>
                <p className="text-blue-600 text-sm mt-1">
                  From {Object.keys(transactionsBySource).length} different import{Object.keys(transactionsBySource).length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(transactionsBySource)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([source, sourceTransactions]) => {
                      const dates = sourceTransactions.map(t => new Date(t.date));
                      const startDate = new Date(Math.min(...dates));
                      const endDate = new Date(Math.max(...dates));
                      
                      return (
                        <tr key={source}>
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">
                            {source}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500 text-center">
                            {sourceTransactions.length}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500 text-center">
                            {startDate.toLocaleDateString()} — {endDate.toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default Import;