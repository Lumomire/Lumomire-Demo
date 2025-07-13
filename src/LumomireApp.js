import React, { useState, useEffect } from 'react';
import LumomireLogin from './LumomireLogin';
import LumomireDashboard from './LumomireDashboard';
import './LumomireApp.css';

const LumomireApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('lumomire_token');
      const userEmail = localStorage.getItem('lumomire_userEmail');
      const userFirm = localStorage.getItem('lumomire_userFirm');
      
      if (token && userEmail) {
        setUser({
          email: userEmail,
          name: localStorage.getItem('lumomire_userName') || userEmail.split('@')[0],
          firm: userFirm || 'Law Firm',
          barNumber: localStorage.getItem('lumomire_barNumber'),
          role: localStorage.getItem('lumomire_userRole') || 'Attorney',
          subscription: localStorage.getItem('lumomire_subscription') || 'trial'
        });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store user data
    localStorage.setItem('lumomire_token', 'mock-jwt-token');
    localStorage.setItem('lumomire_userEmail', userData.email);
    localStorage.setItem('lumomire_userName', userData.name);
    localStorage.setItem('lumomire_userFirm', userData.firm);
    localStorage.setItem('lumomire_userRole', userData.role);
    localStorage.setItem('lumomire_barNumber', userData.barNumber || '');
    localStorage.setItem('lumomire_subscription', userData.subscription || 'trial');
  };

  const handleLogout = () => {
    // Clear all stored data
    const keysToRemove = [
      'lumomire_token',
      'lumomire_userEmail',
      'lumomire_userName',
      'lumomire_userFirm',
      'lumomire_userRole',
      'lumomire_barNumber',
      'lumomire_subscription'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="logo-loader">
            <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20 L40 100 L40 200 L100 280 L160 200 L160 100 Z" 
                stroke="#d4a574" strokeWidth="8" fill="none"
                className="logo-path"/>
              <path d="M100 20 L100 280 M40 140 L160 140" 
                stroke="#d4a574" strokeWidth="6"
                className="logo-inner"/>
            </svg>
          </div>
          <p>Loading Lumomire...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LumomireLogin onLogin={handleLogin} />;
  }

  return <LumomireDashboard user={user} onLogout={handleLogout} />;
};

export default LumomireApp;