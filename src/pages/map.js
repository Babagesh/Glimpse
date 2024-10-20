import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const ImageLocationFinder = () => {
  const [markers, setMarkers] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      EXIF.getData(file, function() {
        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W';
        // Convert coordinates to decimal
        const lat = convertDMSToDD(latitude, latRef);
        const lng = convertDMSToDD(longitude, lonRef);
        if (lat && lng) {
          setMarkers(prevMarkers => [...prevMarkers, { lat, lng, icon: imageUrl }]);
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const convertDMSToDD = (dms, ref) => {
    if (!dms) return null;
    const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
    return (ref === 'S' || ref === 'W') ? -degrees : degrees;
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={3}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: marker.icon,
                scaledSize: new window.google.maps.Size(35, 35), // Resize marker icon
                anchor: new window.google.maps.Point(25, 25), // Adjust anchor point
                labelOrigin: new window.google.maps.Point(20, 20) // Set label origin
              }}
              label={{
                text: '',
                fontFamily: 'sans-serif',
                fontSize: '0px',
                className: 'custom-marker' // Custom class for styling
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }} />
    </div>
  );
};

export default ImageLocationFinder;
