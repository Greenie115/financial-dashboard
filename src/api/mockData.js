// src/api/mockData.js

// Helper function to generate random transactions
const generateTransactions = (count = 20) => {
    const categories = ['Groceries', 'Dining', 'Entertainment', 'Transport', 'Shopping', 'Utilities', 'Rent', 'Income'];
    const merchants = {
      Groceries: ['Tesco', 'Sainsbury\'s', 'Waitrose', 'ASDA', 'Lidl', 'Aldi'],
      Dining: ['Nando\'s', 'Pizza Express', 'Wagamama', 'Pret A Manger', 'Costa Coffee', 'Starbucks'],
      Entertainment: ['Netflix', 'Spotify', 'Cinema', 'Amazon Prime', 'Disney+', 'Theater'],
      Transport: ['TFL', 'Uber', 'National Rail', 'Bolt', 'EasyJet', 'British Airways'],
      Shopping: ['Amazon', 'ASOS', 'John Lewis', 'Apple', 'Currys', 'Ikea'],
      Utilities: ['British Gas', 'EDF Energy', 'Thames Water', 'BT', 'Sky', 'Virgin Media'],
      Rent: ['Rent Payment', 'Mortgage'],
      Income: ['Salary', 'Freelance Payment', 'Refund', 'Interest']
    };
    
    const accounts = ['Starling', 'Amex'];
    const statuses = ['COMPLETED', 'PENDING', 'SCHEDULED'];
    
    const transactions = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const merchant = merchants[category][Math.floor(Math.random() * merchants[category].length)];
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isIncome = category === 'Income';
      
      // Random date in the last 30 days
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      // Random amount (positive for income, negative for expenses)
      const amount = isIncome 
        ? Math.floor(Math.random() * 200000) / 100 
        : -Math.floor(Math.random() * 15000) / 100;
      
      transactions.push({
        id: `tr-${i}-${Date.now()}`,
        date: date.toISOString(),
        merchant,
        description: `Payment to ${merchant}`,
        amount,
        category,
        account,
        status,
        reference: `REF${Math.floor(Math.random() * 1000000)}`,
        provider: account.toLowerCase()
      });
    }
    
    // Sort by date, newest first
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Mock data for dashboard
  export const getMockDashboardData = (timeframe = 'month') => {
    const transactions = generateTransactions(50);
    
    // Calculate totals
    const totalBalance = 2458.67;
    const currentMonthSpending = Math.abs(
      transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    // Create accounts data
    const accounts = [
      {
        id: 'acc-1',
        name: 'Starling Current Account',
        type: 'bank',
        provider: 'starling',
        balance: 1458.67,
        currency: 'GBP',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'acc-2',
        name: 'American Express Gold',
        type: 'credit',
        provider: 'amex',
        balance: -678.21,
        limit: 5000,
        currency: 'GBP',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];
    
    // Generate spending by category
    const categoryExpenses = Object.entries(
      transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
          if (!acc[t.category]) acc[t.category] = 0;
          acc[t.category] += Math.abs(t.amount);
          return acc;
        }, {})
    )
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
    
    // Generate daily spending data
    const dailySpending = [];
    const today = new Date();
    const totalDays = timeframe === 'week' ? 7 : 30;
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Get transactions for this day
      const dayTransactions = transactions.filter(t => 
        t.amount < 0 && t.date.split('T')[0] === dateStr
      );
      
      // Sum amounts
      const amount = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      dailySpending.push({
        date: dateStr,
        amount: Math.round(amount * 100) / 100
      });
    }
    
    // Sort by date, oldest first
    dailySpending.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Generate recommendations
    const recommendations = [
      {
        id: 'rec-1',
        type: 'warning',
        title: 'Credit Card Payment Due Soon',
        description: 'Your American Express payment of £678.21 is due in 15 days.'
      },
      {
        id: 'rec-2',
        type: 'info',
        title: 'Subscription Increase',
        description: 'Your Netflix subscription has increased by £2 this month compared to last month.'
      },
      {
        id: 'rec-3',
        type: 'success',
        title: 'Savings Goal Achieved',
        description: 'Congratulations! You\'ve reached your dining budget goal this month.'
      },
      {
        id: 'rec-4',
        type: 'danger',
        title: 'Unusual Activity',
        description: 'We\'ve detected an unusually large transaction at Amazon on your Amex card.'
      }
    ];
    
    return {
      transactions,
      accounts,
      totalBalance,
      currentMonthSpending,
      spendingTrend: -5.2, // Negative is good (spending decreased)
      categoryExpenses,
      dailySpending,
      recommendations
    };
  };
  
  // Mock data for transaction details
  export const getMockTransactionDetails = (id) => {
    // Generate a detailed transaction based on the ID
    // In a real app, you'd fetch the specific transaction
    return {
      id,
      date: new Date().toISOString(),
      merchant: 'Amazon',
      description: 'Amazon.co.uk',
      amount: -67.99,
      category: 'Shopping',
      account: 'Amex',
      status: 'COMPLETED',
      reference: 'REF123456',
      provider: 'amex',
      location: {
        address: '1-2 Principal Place',
        city: 'London',
        postcode: 'EC2A 2FA',
        country: 'United Kingdom'
      },
      notes: ''
    };
  };
  
  // Generate mock implementations for API clients
  export const createStarlingClientMock = () => {
    return {
      getAccounts: async () => ({
        accounts: [
          {
            accountUid: 'acc-1',
            name: 'Starling Current Account',
            currency: 'GBP',
            balance: { amount: 1458.67 }
          }
        ]
      }),
      getTransactions: async () => ({
        feedItems: generateTransactions(20)
          .filter(t => t.account === 'Starling')
          .map(t => ({
            feedItemUid: t.id,
            transactionTime: t.date,
            amount: { minorUnits: t.amount * 100 },
            counterPartyName: t.merchant,
            reference: t.reference,
            spendingCategory: t.category,
            status: t.status
          }))
      }),
      getTransaction: async (accountId, transactionId) => {
        const transaction = generateTransactions(1)[0];
        return {
          feedItemUid: transactionId,
          transactionTime: transaction.date,
          amount: { minorUnits: transaction.amount * 100 },
          counterPartyName: transaction.merchant,
          reference: transaction.reference,
          spendingCategory: transaction.category,
          status: transaction.status,
          notes: 'Transaction notes',
          counterPartySubEntityIdentifier: {
            address: '1 High Street',
            city: 'London',
            country: 'United Kingdom'
          }
        };
      }
    };
  };
  
  export const createAmexClientMock = () => {
    return {
      getCardAccounts: async () => ({
        accounts: [
          {
            accountId: 'acc-2',
            name: 'American Express Gold',
            currency: 'GBP',
            balance: 678.21,
            creditLimit: 5000,
            paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString()
          }
        ]
      }),
      getTransactions: async () => ({
        transactions: generateTransactions(20)
          .filter(t => t.account === 'Amex')
          .map(t => ({
            transactionId: t.id,
            date: t.date,
            amount: Math.abs(t.amount),
            description: t.description,
            category: t.category,
            merchantName: t.merchant,
            status: t.status
          }))
      }),
      getTransaction: async (accountId, transactionId) => {
        const transaction = generateTransactions(1)[0];
        return {
          transactionId,
          date: transaction.date,
          amount: Math.abs(transaction.amount),
          description: transaction.description,
          category: transaction.category,
          merchantName: transaction.merchant,
          status: transaction.status,
          referenceNumber: 'REF123456',
          notes: 'Transaction notes',
          merchant: {
            address: '1 High Street',
            city: 'London',
            country: 'United Kingdom'
          }
        };
      }
    };
  };