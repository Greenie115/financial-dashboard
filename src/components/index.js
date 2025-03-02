// src/components/index.js
// This file serves as a centralized export point for all components

// Common components
export * from './common';

// Auth components
export { default as LoginForm } from './auth/LoginForm';
export { default as ProtectedRoute } from './auth/ProtectedRoute';

// Dashboard components
export { default as AccountSummary } from './dashboard/AccountSummary';
export { default as CategoryChart } from './dashboard/CategoryChart';
export { default as InsightsList } from './dashboard/InsightsList';
export { default as SpendingTrend } from './dashboard/SpendingTrend';
export { default as TransactionList } from './dashboard/TransactionList';

// Layout components
export { default as MainLayout } from './layout/MainLayout';
export { default as Header } from './layout/Header';
export { default as Sidebar } from './layout/Sidebar';