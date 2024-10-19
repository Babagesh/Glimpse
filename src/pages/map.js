import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MyComponent = () => {
  const [location, setLocation] = useState(defaultCenter);
  const [markerIcon, setMarkerIcon] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setMarkerIcon(imageUrl);

      EXIF.getData(file, function() {
        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W';

        // Convert coordinates to decimal
        const lat = convertDMSToDD(latitude, latRef);
        const lng = convertDMSToDD(longitude, lonRef);
        setLocation({ lat, lng });
      });
    };
    reader.readAsDataURL(file);
  };

  const convertDMSToDD = (dms, ref) => {
    if (!dms) return null;
    const degrees = dms[0] + dms[1]/60 + dms[2]/3600;
    return (ref === 'S' || ref === 'W') ? -degrees : degrees;
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={5}
        >
          {markerIcon && (
            <Marker
              position={location}
              icon={markerIcon}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MyComponent;
