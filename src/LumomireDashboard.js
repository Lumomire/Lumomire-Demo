import React, { useState, useEffect, useRef } from 'react';
import { getDemoDataGenerator } from './DemoDataGenerator';

import './LumomireDashboard.css';

const LumomireDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [missingTimeEntries, setMissingTimeEntries] = useState([]);
  const [stats, setStats] = useState({
    hoursFound: 0,
    revenueRecovered: 0,
    confidenceAvg: 0,
    entriesProcessed: 0,
    weeklyAverage: 0,
    monthlyProjection: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataGenerated, setDataGenerated] = useState(false);
  const [firmData, setFirmData] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const dropdownRef = useRef(null);

   useEffect(() => {
    // Auto-generate data on component mount
    if (!dataGenerated) {
      generateDemoData();
    }
  }, []);

  useEffect(() => {
    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const generateDemoData = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const generator = getDemoDataGenerator();
      const firmType = user?.firm?.toLowerCase().includes('solo') ? 'solo' : 
                       user?.firm?.toLowerCase().includes('large') ? 'large' : 'medium';
      
      const data = generator.generateForFirmType(firmType);
      
      setFirmData(data.firm);
      setMissingTimeEntries(data.missingTimeEntries);
      setStats(data.stats);
      setScenarios(generator.getDemoScenarios());
      setDataGenerated(true);
      setIsAnalyzing(false);
    }, 3000); // 3 second analysis simulation
  };

  const refreshAnalysis = () => {
    setDataGenerated(false);
    generateDemoData();
  };

  const filterByScenario = (scenarioType) => {
    if (!scenarios || !scenarios[scenarioType]) return;
    
    const scenarioGaps = scenarios[scenarioType];
    const generator = getDemoDataGenerator();
    
    // Convert scenario gaps to dashboard format
    const formattedEntries = scenarioGaps.map((gap, index) => ({
      id: index + 1,
      date: gap.date.toISOString().split('T')[0],
      duration: gap.duration,
      confidence: gap.confidence,
      context: gap.context,
      calendarEvent: gap.calendarEvent,
      emailCount: gap.emailCount,
      suggestedMatter: gap.matter ? gap.matter.id : null,
      value: Math.round(gap.duration * gap.hourlyRate),
      status: 'pending',
      attorney: gap.attorney,
      type: gap.type
    }));
    
    setMissingTimeEntries(formattedEntries);
  };

    // Calculate stats

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name || 'User';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const handleApproveEntry = (entryId) => {
    setMissingTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, status: 'approved' } : entry
      )
    );
  };

  const handleRejectEntry = (entryId) => {
    setMissingTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, status: 'rejected' } : entry
      )
    );
  };

  const UserDropdown = () => (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <div className="user-avatar-large">
          <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
        </div>
        <div className="user-details">
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className="user-role-badge">{user?.role || 'Attorney'}</span>
        </div>
      </div>
      
      <div className="dropdown-content">
        <button className="dropdown-item" onClick={() => alert('Account Settings - Coming Soon!')}>
          <span className="item-icon">⚙️</span>
          <div className="item-content">
            <div className="item-label">Account Settings</div>
            <div className="item-description">Manage your profile and preferences</div>
          </div>
        </button>
        <button className="dropdown-item" onClick={() => alert('Billing Settings - Coming Soon!')}>
          <span className="item-icon">💳</span>
          <div className="item-content">
            <div className="item-label">Billing & Subscription</div>
            <div className="item-description">Manage your plan and payment</div>
          </div>
        </button>
        <button className="dropdown-item" onClick={() => alert('Platform Connections - Coming Soon!')}>
          <span className="item-icon">🔗</span>
          <div className="item-content">
            <div className="item-label">Platform Connections</div>
            <div className="item-description">Manage Clio/MyCase integration</div>
          </div>
        </button>
      </div>
      
      <div className="dropdown-footer">
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="lumomire-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20 L40 100 L40 200 L100 280 L160 200 L160 100 Z" 
                    stroke="#d4a574" strokeWidth="8" fill="none"/>
                  <path d="M100 20 L100 280 M40 140 L160 140" 
                    stroke="#d4a574" strokeWidth="6"/>
                </svg>
              </div>
              <span className="logo-text">Lumomire</span>
            </div>
            <div className="user-greeting">
              <h2>{getGreeting()}</h2>
              <p>Discover, Recover, Preserve</p>
            </div>
          </div>
          <div className="header-right">
            <div className="sync-status">
              <span className="sync-dot active"></span>
              <span>Last sync: 5 min ago</span>
            </div>
            <div className="user-menu">
              <button
                className="user-menu-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-avatar">
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{user?.firm || 'Law Firm'}</span>
                </div>
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
              
              {showUserDropdown && <UserDropdown />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Analysis Section */}
          {isAnalyzing && (
            <section className="analysis-section">
              <div className="analysis-card">
                <div className="analysis-header">
                  <h2>Analyzing Your Billable Time</h2>
                  <p>Lumomire is scanning your calendar and email patterns to seek missing time entries...</p>
                </div>
                <div className="analysis-progress">
                  <div className="progress-item active">
                    <div className="progress-icon">📅</div>
                    <div className="progress-label">Analyzing Calendar Events</div>
                    <div className="progress-bar">
                      <div className="progress-fill calendar-progress"></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-icon">📧</div>
                    <div className="progress-label">Scanning Email Patterns</div>
                    <div className="progress-bar">
                      <div className="progress-fill email-progress"></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-icon">🔍</div>
                    <div className="progress-label">Detecting Time Gaps</div>
                    <div className="progress-bar">
                      <div className="progress-fill gap-progress"></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-icon">🤖</div>
                    <div className="progress-label">AI Enhancement</div>
                    <div className="progress-bar">
                      <div className="progress-fill ai-progress"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Demo Controls - Only show after initial analysis */}
          {!isAnalyzing && dataGenerated && (
            <section className="demo-controls">
              <div className="controls-header">
                <h3>Demo Scenarios</h3>
                <button className="refresh-button" onClick={refreshAnalysis}>
                  🔄 Refresh Analysis
                </button>
              </div>
              <div className="scenario-buttons">
                <button onClick={() => generateDemoData()}>All Gaps</button>
                <button onClick={() => filterByScenario('highValue')}>High Value</button>
                <button onClick={() => filterByScenario('courtRelated')}>Court Related</button>
                <button onClick={() => filterByScenario('travelTime')}>Travel Time</button>
                <button onClick={() => filterByScenario('documentWork')}>Document Work</button>
                <button onClick={() => filterByScenario('phoneCalls')}>Phone Calls</button>
              </div>
            </section>
          )}

          {/* Stats Section */}
          <section className="stats-section">
            <h2>This Month's Recovery</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.hoursFound}</span>
                  <span className="stat-label">Hours Found</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <span className="stat-number">${stats.revenueRecovered.toLocaleString()}</span>
                  <span className="stat-label">Revenue Recovered</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.confidenceAvg}%</span>
                  <span className="stat-label">Avg Confidence</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.entriesProcessed}</span>
                  <span className="stat-label">Entries Found</span>
                </div>
              </div>
              {stats.weeklyAverage > 0 && (
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <span className="stat-number">{stats.weeklyAverage}h</span>
                    <span className="stat-label">Weekly Average</span>
                  </div>
                </div>
              )}
              {stats.monthlyProjection > 0 && (
                <div className="stat-card">
                  <div className="stat-icon">💎</div>
                  <div className="stat-content">
                    <span className="stat-number">${stats.monthlyProjection.toLocaleString()}</span>
                    <span className="stat-label">Monthly Projection</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Missing Time Entries */}
          <section className="missing-time-section">
            <div className="section-header">
              <h2>Missing Time This Week</h2>
              <p>Review and approve time entries we've found for you</p>
            </div>
            
            <div className="time-entries-list">
              {missingTimeEntries.map(entry => (
                <div key={entry.id} className={`time-entry-card ${entry.status}`}>
                  <div className="entry-header">
                    <div className="entry-date">
                      <span className="date-day">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="date-full">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="confidence-badge">
                      <span className="confidence-value">{Math.round(entry.confidence * 100)}%</span>
                      <span className="confidence-label">confidence</span>
                    </div>
                  </div>
                  
                  <div className="entry-content">
                    <h3>{entry.context}</h3>
                    <div className="entry-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{entry.calendarEvent}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">✉️</span>
                        <span>{entry.emailCount} related emails</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📁</span>
                        <span>Matter: {entry.suggestedMatter}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="entry-footer">
                    <div className="entry-value">
                      <span className="duration">{entry.duration} hours</span>
                      <span className="value">${entry.value}</span>
                    </div>
                    {entry.status === 'pending' && (
                      <div className="entry-actions">
                        <button 
                          className="action-button approve"
                          onClick={() => handleApproveEntry(entry.id)}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="action-button modify"
                          onClick={() => alert('Modify functionality coming soon!')}
                        >
                          ✏️ Modify
                        </button>
                        <button 
                          className="action-button reject"
                          onClick={() => handleRejectEntry(entry.id)}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {entry.status === 'approved' && (
                      <div className="status-badge approved">✓ Approved</div>
                    )}
                    {entry.status === 'rejected' && (
                      <div className="status-badge rejected">✗ Rejected</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <h2>How Lumomire Helps You</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Gap Detection</h3>
                <p>Automatically seek out unbilled time between calendar events and time entries</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>AI-Enhanced Analysis</h3>
                <p>Smart pattern recognition to identify billable activities you might have missed</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📧</div>
                <h3>Email Intelligence</h3>
                <p>Analyzes email patterns to suggest missing time entries with context</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Quick Approval</h3>
                <p>Review and approve found time in seconds, syncing directly to your platform</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LumomireDashboard;