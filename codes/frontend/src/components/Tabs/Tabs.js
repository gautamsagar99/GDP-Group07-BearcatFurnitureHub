import React, { useState } from 'react';
import './Tabs.css'; // Import the CSS file for styling
// import FurnitureDetails from '../FurnitureCard/FurnitureCard'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('My Donations');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="tabs-container">
      <div className="tab-header">
        <div
          className={`tab ${activeTab === 'My Donations' ? 'active' : ''}`}
          onClick={() => handleTabClick('My Donations')}
        >
          My Donations
        </div>
        <div
          className={`tab ${activeTab === 'Active Donations' ? 'active' : ''}`}
          onClick={() => handleTabClick('Active Donations')}
        >
          Active Donations
        </div>
        <div
          className={`tab ${activeTab === 'My Requests' ? 'active' : ''}`}
          onClick={() => handleTabClick('My Requests')}
        >
          My Requests
        </div>
      </div>
      <div className="tab-content">
        {/* Render the content for the active tab here */}
        {activeTab === 'My Donations' && <p>Content for My Donations tab</p>
        // <FurnitureDetails/>
        }
        {activeTab === 'Active Donations' && <p>Content for Active Donations tab</p>}
        {activeTab === 'My Requests' && <p>Content for My Requests tab</p>}
      </div>
    </div>
  );
};

export default Tabs;
