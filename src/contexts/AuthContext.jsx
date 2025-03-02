// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const userData = localStorage.getItem('financeUser');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error retrieving auth data:', err);
        // Clear potentially corrupted data
        localStorage.removeItem('financeUser');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd call your API here
      // const response = await apiClient.post('/auth/login', { email, password });
      
      // For demo purposes, we'll simulate a successful login
      // with some validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (email !== 'demo@example.com' || password !== 'password123') {
        throw new Error('Invalid credentials');
      }
      
      // Create mock user data
      const userData = {
        id: '1',
        email: email,
        name: 'Demo User',
        role: 'user'
      };
      
      // Save to localStorage
      localStorage.setItem('financeUser', JSON.stringify(userData));
      setCurrentUser(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd call your API here
      // const response = await apiClient.post('/auth/register', { name, email, password });
      
      // For demo purposes, we'll simulate a successful registration
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Create mock user data
      const userData = {
        id: '1',
        email: email,
        name: name,
        role: 'user'
      };
      
      // Save to localStorage
      localStorage.setItem('financeUser', JSON.stringify(userData));
      setCurrentUser(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('financeUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;