import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../App.css';  // Import the CSS file

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 40.7128,
  lng: -74.0060,
};

const MyComponent = () => {
  return (
    <div className="half-screen">
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MyComponent;
