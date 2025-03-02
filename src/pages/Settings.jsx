// src/pages/Settings.jsx
import React, { useState } from 'react';
import { Card, Grid, TabGroup, TabList, Tab, TabPanels, TabPanel } from '../components/common';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [profileSaved, setProfileSaved] = useState(false);
  
  // Password settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState({
    weeklyReport: true,
    budgetAlerts: true,
    accountActivity: true,
    marketingEmails: false
  });
  
  // App settings state
  const [theme, setTheme] = useState('system');
  const [currency, setCurrency] = useState('GBP');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user's profile
    setTimeout(() => {
      setProfileSaved(true);
      setTimeout(() => {
        setProfileSaved(false);
      }, 3000);
    }, 500);
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    
    // Simple validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // In a real app, this would call an API to update the user's password
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
      setTimeout(() => {
        setPasswordSaved(false);
      }, 3000);
    }, 500);
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (setting) => {
    setEmailNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>
      
      {/* Settings Tabs */}
      <TabGroup>
        <TabList className="mb-6">
          <Tab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            Profile
          </Tab>
          <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
            Security
          </Tab>
          <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
            Notifications
          </Tab>
          <Tab active={activeTab === 'app'} onClick={() => setActiveTab('app')}>
            App Settings
          </Tab>
        </TabList>
        
        <TabPanels>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    {profileSaved && (
                      <span className="inline-flex items-center mr-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Changes saved
                      </span>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </Card>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSubmit}>
                  {passwordError && (
                    <div className="rounded-md bg-red-50 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {passwordError}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      {passwordSaved && (
                        <span className="inline-flex items-center mr-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Password updated
                        </span>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </Card>
              
              <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Account Actions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Sign Out From All Devices</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-3">
                      This will log you out from all devices where you're currently signed in.
                    </p>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">
                      Sign Out Everywhere
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-md font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Email Notifications</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Weekly Report</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive a weekly email summary of your finances.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${
                        emailNotifications.weeklyReport ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="switch"
                      aria-checked={emailNotifications.weeklyReport}
                      onClick={() => handleNotificationChange('weeklyReport')}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          emailNotifications.weeklyReport ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Budget Alerts</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Get notified when you're approaching budget limits.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${
                        emailNotifications.budgetAlerts ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="switch"
                      aria-checked={emailNotifications.budgetAlerts}
                      onClick={() => handleNotificationChange('budgetAlerts')}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          emailNotifications.budgetAlerts ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Account Activity</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive notifications about important account activity.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${
                        emailNotifications.accountActivity ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="switch"
                      aria-checked={emailNotifications.accountActivity}
                      onClick={() => handleNotificationChange('accountActivity')}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          emailNotifications.accountActivity ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive product updates and promotional offers.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${
                        emailNotifications.marketingEmails ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="switch"
                      aria-checked={emailNotifications.marketingEmails}
                      onClick={() => handleNotificationChange('marketingEmails')}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          emailNotifications.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {/* App Settings Tab goes here */}
          {activeTab === 'app' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Application Preferences</h2>
              
              {/* Add your App Settings content here */}
            </Card>
          )}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Settings;