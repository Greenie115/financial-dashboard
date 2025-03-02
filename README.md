# Financial Dashboard

A modern, responsive financial dashboard application for visualizing and managing personal finances with Starling Bank and American Express integration.

## Features

- **Authentication System**
  - Secure login and registration
  - Protected routes for authenticated users
  - Token-based authentication

- **Dashboard Overview**
  - Account balances and summaries
  - Spending breakdown by category
  - Spending trends over time
  - Recent transactions
  - Personalized financial insights

- **Transaction Management**
  - Complete transaction history with filtering
  - Detailed transaction views
  - Transaction search and categorization
  - Spending analytics by merchant

- **Account Management**
  - Bank and credit card accounts overview
  - Balance tracking
  - Account-specific insights
  - Account linking capability

- **Financial Insights**
  - Spending analysis with visualizations
  - Income vs. expenses tracking
  - Budget monitoring
  - Personalized savings recommendations

- **Settings**
  - Profile management
  - Security settings
  - Notification preferences
  - Application preferences

## Technology Stack

- **Frontend**
  - React.js - Component-based UI library
  - React Router - Navigation and routing
  - Context API - State management
  - Tailwind CSS - Utility-first CSS framework
  - Recharts - Data visualization library

- **APIs**
  - Starling Bank API - For bank account integration
  - American Express API - For credit card integration

## Project Structure

```
financial-dashboard/
├── public/               # Static assets
├── src/
│   ├── api/              # API integration modules
│   │   ├── amex.js       # Amex API client
│   │   ├── starling.js   # Starling API client
│   │   └── index.js      # Unified API interface
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared UI elements
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   └── layout/       # Layout components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   └── index.jsx         # Application entry point
└── package.json          # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Starling Developer Account (for API access)
- American Express Developer Account (for API access)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/financial-dashboard.git
   cd financial-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   REACT_APP_STARLING_CLIENT_ID=your_starling_client_id
   REACT_APP_STARLING_CLIENT_SECRET=your_starling_client_secret
   REACT_APP_AMEX_CLIENT_ID=your_amex_client_id
   REACT_APP_AMEX_CLIENT_SECRET=your_amex_client_secret
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Using Mock Data

The application can run with mock data without requiring actual API credentials. To use mock data:

1. Make sure the `.env` file doesn't contain API credentials, or use the mock data explicitly in your code.
2. The mock data provides realistic financial transactions and account information for testing and development.

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory and can be deployed to your preferred hosting provider.

## Security Considerations

- Never commit your API keys to version control
- Always use environment variables for sensitive information
- Implement proper token refresh mechanisms for production
- For production, handle API authentication on the backend to protect client secrets

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.