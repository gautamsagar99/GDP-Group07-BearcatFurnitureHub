import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import SelectedLocationViewer from "./SelectedLocationViewer";
import {
    db,
    collection,
    addDoc
  } from '../Chat/firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const defaultCenter = [38.9072, -77.0369];
const defaultZoom = 8;

const defaultIcon = new Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      onLocationChange(lat, lng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      // Only set the position if it's not already set
      if (!position) {
        setPosition(e.latlng);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // If the position is not set, try to get the user's location
  if (!position) {
    map.locate();
  }

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>
        Latitude: {position.lat.toFixed(4)} <br />
        Longitude: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  );
}

function Location() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showLocationViewer, setShowLocationViewer] = useState(false);
  const loggedInUser = localStorage.getItem('LoggedInUser');
  const { ReceiverMail } = useParams();
  const navigate = useNavigate();

  const handleLocationChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

//   const handleShareLocation = () => {
//     if (latitude !== null && longitude !== null) {
//       setShowLocationViewer(true);
//     } else {
//       alert("No location is available.");
//     }
//   };

// Inside handleShareLocation function in Location.js

const handleShareLocation = async () => {
    if (latitude !== null && longitude !== null) {
      const messagesRef = collection(db, 'messages');
        console.log("ReceiverMail",ReceiverMail)
      try {
        await addDoc(messagesRef, {
          participants: [loggedInUser, ReceiverMail],
          sender: loggedInUser,
          latitude,
          longitude,
          timestamp: new Date(),
          new: true,
          status: 'unread',
          type: 'location',
        });
  
        alert('Location shared successfully!');

        navigate(`/Chat/${ReceiverMail}`);
        setShowLocationViewer(true);
      } catch (error) {
        console.error('Error sharing location:', error);
      }
    } else {
      alert('No location is available.');
    }
  };
  
  

  return (
    <div className="App">
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <LocationMarker onLocationChange={handleLocationChange} />
        </MapContainer>
      </div>

      <div className="sidebar">
        <h2>Selected Location</h2>
        {latitude !== null && longitude !== null ? (
          <div>
            <p>Latitude: {latitude.toFixed(4)}</p>
            <p>Longitude: {longitude.toFixed(4)}</p>
          </div>
        ) : (
          <p>No location selected</p>
        )}

        <button onClick={handleShareLocation}>Share Location</button>
      </div>

      {showLocationViewer && latitude !== null && longitude !== null && (
        <SelectedLocationViewer latitude={latitude} longitude={longitude} />
      )}
    </div>
  );
}

export default Location;