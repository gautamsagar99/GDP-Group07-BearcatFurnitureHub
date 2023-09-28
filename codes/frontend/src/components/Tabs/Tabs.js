import React, { useState, useEffect, useCallback } from 'react';
import './Tabs.css';
import { getClosedFurniture, getAvailableAndRequestedFurniture } from '../../utils/api';
import MyDonations from '../../components/MyDonations/MyDonations';
import ActiveDonations from '../../components/ActiveDonations/ActiveDonations';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('My Donations');
  const [setTabData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [MyDonationsData, setMyDonationsData] = useState([]);
  const [ActiveDonationsData, setActiveDonationsData] = useState([]);

  const fetchDataForTab = useCallback(async (tabName) => {
    try {
      setIsLoading(true);
      let data = [];

      if (tabName === "My Donations") {
        const donationsData = await getClosedFurniture();
        setMyDonationsData(donationsData);
        data = donationsData;
      }
      if (tabName === "Active Donations") {
        const donationsData = await getAvailableAndRequestedFurniture();
        setActiveDonationsData(donationsData);
        data = donationsData;
      }

      setTabData((prevData) => ({
        ...prevData,
        [tabName]: data,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setMyDonationsData, setActiveDonationsData, setTabData]);

  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab, fetchDataForTab]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderNoItemsMessage = (tabName) => {
    // Define different "No items" messages for each tab
    const messages = {
      'My Donations': 'No successful donations found.',
      'Active Donations': 'No active donations found.',
      'My Requests': 'No requests found.',
    };

    return <p>{messages[tabName]}</p>;
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
        {activeTab === 'My Donations' && MyDonationsData.length > 0 ? (
          <div className="card-container-mydonations">
            {MyDonationsData.map((item, index) => (
              <MyDonations
                key={index}
                status={item.status}
                imageSrc={item.image_url}
                label={item.name}
                condition={item.furniture_condition}
              />
            ))}
          </div>
        ) : activeTab === 'My Donations' ? (
          renderNoItemsMessage('My Donations')
        ) : null}
        {activeTab === 'Active Donations' && ActiveDonationsData.length > 0 ? (
          <div className="card-container-activedonations">
            {ActiveDonationsData.map((item, index) => (
              <ActiveDonations
                key={index}
                productId={item.id}
                status={item.status}
                imageSrc={item.image_url}
                label={item.name}
                condition={item.furniture_condition}
              />
            ))}
          </div>
        ) : activeTab === 'Active Donations' ? (
          renderNoItemsMessage('Active Donations')
        ) : null}
        {activeTab === 'My Requests' && ActiveDonationsData.length > 0 ? (
          <p>Content for My Requests tab:</p>
        ) : activeTab === 'My Requests' ? (
          renderNoItemsMessage('My Requests')
        ) : null}
      </div>
    </div>
  );
};

export default Tabs;
