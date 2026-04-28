import React from 'react';
import './App.css';

const GlobalHealthObservatoryPage = () => {
  const disaggregationOptions = ['Sex (M/F)'];

  return (
    <div className="gho-container">
      <header className="gho-header">
        <div className="gho-logo-section">
          <img src="public/images/GHO_Logo.png" alt="GHO Logo" className="gho-logo" />
          <div className="gho-title">
         
          </div>
        </div>
        

        <div className="gho-search-container">
         
        </div>
      </header>

      <main className="gho-main">
        <div className="gho-summary-header">
          <h2 className="gho-main-title">INFANT MORTALITY RATE (0-1 YEAR)</h2>
          <div className="gho-stat-display">
            <span className="gho-stat-value">28.0</span>
            <span className="gho-stat-unit">deaths per 1000 live births</span>
          </div>
        </div>

        <div className="gho-grid">
          <section className="gho-info-card">

            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
               
              </div>
              <div>

              </div>
            </div>

            
          </section>

          <section className="gho-sidebar-card">
           
            <div className="gho-toggle-group">
              {disaggregationOptions.map((item, index) => (
                <button
                  key={index}
                  className={`gho-toggle-btn ${index === 0 ? 'active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>

          
            <div className="gho-link-list">
             
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GlobalHealthObservatoryPage;