// src/components/import/CSVImport.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Card } from '../common';
import { saveTransactions } from '../../utils/storage';

const CSVImport = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importType, setImportType] = useState('amex'); // 'amex' or 'other'
  const [mapping, setMapping] = useState({
    date: '',
    description: '',
    amount: '',
    category: ''
  });
  const [previewData, setPreviewData] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Preview the file
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreviewData(results);
        }
      });
    }
  };
  
  const handleImportTypeChange = (e) => {
    const type = e.target.value;
    setImportType(type);
    
    // Set default mappings based on import type
    if (type === 'amex') {
      setMapping({
        date: 'Date',
        description: 'Description',
        amount: 'Amount',
        category: 'Category'
      });
    } else {
      setMapping({
        date: '',
        description: '',
        amount: '',
        category: ''
      });
    }
  };
  
  const handleMappingChange = (field, value) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleImport = () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }
    
    if (!mapping.date || !mapping.description || !mapping.amount) {
      setError('Please map the required fields (date, description, amount)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          // Transform data according to mappings
          const transactions = results.data
            .filter(row => row[mapping.date] && row[mapping.amount]) // Filter out empty rows
            .map((row, index) => {
              // Parse amount (handle negative values and currency symbols)
              let amount = row[mapping.amount];
              if (typeof amount === 'string') {
                // Remove currency symbols and commas
                amount = amount.replace(/[$£€,]/g, '');
                // Convert to number
                amount = parseFloat(amount);
              }
              
              // For AMEX, expenses are positive in the CSV but should be negative in our app
              if (importType === 'amex' && amount > 0) {
                amount = -amount;
              }
              
              // Format date consistently
              let date = new Date(row[mapping.date]);
              if (isNaN(date.getTime())) {
                // Try alternative date formats if parsing fails
                const parts = row[mapping.date].split(/[\/\-\.]/);
                if (parts.length === 3) {
                  // Try different date formats (MM/DD/YYYY, DD/MM/YYYY)
                  if (importType === 'amex') {
                    date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`); // MM/DD/YYYY
                  } else {
                    date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD/MM/YYYY
                  }
                }
              }
              
              return {
                id: `imp-${Date.now()}-${index}`,
                date: date.toISOString(),
                description: row[mapping.description] || 'Unknown',
                merchant: row[mapping.description]?.split(' ')[0] || 'Unknown',
                amount: amount,
                category: row[mapping.category] || 'Uncategorized',
                account: importType === 'amex' ? 'Amex' : 'Other',
                importDate: new Date().toISOString(),
                source: file.name
              };
            });
            
          // Save transactions to storage
          await saveTransactions(transactions);
          
          // Notify parent component
          if (onImportComplete) {
            onImportComplete(transactions);
          }
          
          setLoading(false);
          setFile(null);
          setPreviewData(null);
        } catch (err) {
          console.error('Import error:', err);
          setError('Error processing file: ' + err.message);
          setLoading(false);
        }
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
        setLoading(false);
      }
    });
  };
  
  // Get unique column names from preview data
  const getColumns = () => {
    if (!previewData || !previewData.meta || !previewData.meta.fields) {
      return [];
    }
    return previewData.meta.fields;
  };
  
  const columns = getColumns();
  
  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Import Transactions</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Import Type
          </label>
          <select
            value={importType}
            onChange={handleImportTypeChange}
            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="amex">American Express</option>
            <option value="other">Other Bank/Credit Card</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select a CSV file exported from your bank or credit card account
          </p>
        </div>
        
        {previewData && columns.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Map Columns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Column *
                </label>
                <select
                  value={mapping.date}
                  onChange={(e) => handleMappingChange('date', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Column *
                </label>
                <select
                  value={mapping.description}
                  onChange={(e) => handleMappingChange('description', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Column *
                </label>
                <select
                  value={mapping.amount}
                  onChange={(e) => handleMappingChange('amount', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Column (optional)
                </label>
                <select
                  value={mapping.category}
                  onChange={(e) => handleMappingChange('category', e.target.value)}
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map(col => (
                        <th
                          key={col}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.data.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map(col => (
                          <td key={col} className="px-3 py-2 text-xs text-gray-500">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={handleImport}
            disabled={loading || !file}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
              loading || !file ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Importing...' : 'Import Transactions'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CSVImport;