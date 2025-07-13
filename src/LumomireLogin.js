import React, { useState } from 'react';
import './LumomireLogin.css';

const LumomireLogin = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firmName: '',
    barNumber: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp) {
      if (!formData.firmName) {
        newErrors.firmName = 'Law firm name is required';
      }

      if (!formData.barNumber) {
        newErrors.barNumber = 'Texas Bar number is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        email: formData.email,
        name: formData.email.split('@')[0],
        firm: formData.firmName || 'Demo Law Firm',
        barNumber: formData.barNumber,
        role: 'Attorney',
        subscription: 'trial'
      };

      onLogin(userData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo">
              <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 20 L40 100 L40 200 L100 280 L160 200 L160 100 Z" 
                  stroke="#d4a574" strokeWidth="8" fill="none"/>
                <path d="M100 20 L100 280 M40 140 L160 140" 
                  stroke="#d4a574" strokeWidth="6"/>
              </svg>
            </div>
            <h1>Lumomire</h1>
            <p>Discover, Recover, Preserve</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2>{isSignUp ? 'Start Your Free Trial' : 'Welcome Back'}</h2>
            
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="firmName">Law Firm Name</label>
                <input
                  type="text"
                  id="firmName"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  placeholder="Enter your firm name"
                  className={errors.firmName ? 'error' : ''}
                />
                {errors.firmName && <span className="error-message">{errors.firmName}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@lawfirm.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="barNumber">Texas Bar Number</label>
                <input
                  type="text"
                  id="barNumber"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                  placeholder="24000000"
                  className={errors.barNumber ? 'error' : ''}
                />
                {errors.barNumber && <span className="error-message">{errors.barNumber}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                isSignUp ? 'Start Free 30-Day Trial' : 'Sign In'
              )}
            </button>

            {isSignUp && (
              <div className="trial-info">
                <p>✓ No credit card required</p>
                <p>✓ 30 days free trial</p>
                <p>✓ Find missing billable time instantly</p>
              </div>
            )}
          </form>

          <div className="login-footer">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="toggle-button"
              >
                {isSignUp ? 'Sign In' : 'Start Free Trial'}
              </button>
            </p>
          </div>

          <div className="login-benefits">
            <h3>Why Texas Attorneys Choose Lumomire</h3>
            <div className="benefits-grid">
              <div className="benefit">
                <span className="benefit-icon">💰</span>
                <p>Recover an average of 2.5 hours per week</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⚡</span>
                <p>Integrated with Clio, MyCase & PracticePanther</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <p>Texas Bar compliant & secure</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🎯</span>
                <p>AI-powered accuracy with confidence scores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumomireLogin;