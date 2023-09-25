import React, { useState, useEffect } from 'react';
import './Tabs.css'; // Import the CSS file for styling
import { getFurnitureForUser } from "../../utils/api";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('My Donations');
  const [tabData, setTabData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataForTab = async (tabName) => {
    try {
      setIsLoading(true);
      var data = ""
      if(tabName === "My Donations"){
        data = await getFurnitureForUser();
      }
       // Fetch data asynchronously

      // Store the data for the tab
      setTabData((prevData) => ({
        ...prevData,
        [tabName]: data,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab]);

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
        {isLoading && <p>Loading...</p>}
        {activeTab === 'My Donations' && (
          <p>Content for My Donations tab: {tabData['My Donations']}</p>
        )}
        {activeTab === 'Active Donations' && (
          <p>Content for Active Donations tab: {tabData['Active Donations']}</p>
        )}
        {activeTab === 'My Requests' && (
          <p>Content for My Requests tab: {tabData['My Requests']}</p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
