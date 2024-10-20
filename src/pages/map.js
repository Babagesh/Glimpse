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

const ZOOM_THRESHOLD = 2; // Maximum zoom level for size adjustment
const MIN_DIMENSION = 32; // Minimum size for scaling
const MAX_DIMENSION = 32; // Maximum size for scaling

const ImageLocationFinder = () => {
  const [markers, setMarkers] = useState([]);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [currentZoom, setCurrentZoom] = useState(3);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      EXIF.getData(file, function () {
        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W';
        const width = EXIF.getTag(this, 'PixelXDimension');
        const height = EXIF.getTag(this, 'PixelYDimension');

        // Convert coordinates to decimal
        const lat = convertDMSToDD(latitude, latRef);
        const lng = convertDMSToDD(longitude, lonRef);
        if (lat && lng) {
          setMarkers((prevMarkers) => [...prevMarkers, { lat, lng, icon: imageUrl }]);
        } else {
          console.error("No EXIF data found or size.");
        }

        if (width && height) {
          setImageSize({ h: height, w: width });
        } else {
          console.error("No EXIF data found or size.");
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

  const calculateScaledSize = (originalWidth, originalHeight, currentZoom) => {
    const aspectRatio = originalWidth / originalHeight;

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (currentZoom < ZOOM_THRESHOLD) {
      newWidth = Math.max(MIN_DIMENSION, newWidth);
      newHeight = newWidth / aspectRatio;
    } else if (currentZoom >= ZOOM_THRESHOLD) {
      newWidth = Math.min(MAX_DIMENSION, newWidth);
      newHeight = newWidth / aspectRatio;
    }

    return { w: newWidth, h: newHeight };
  };

  // Function to open the modal
  const handleMarkerClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={currentZoom}>
          {markers.map((marker, index) => {
            const scaledSize = calculateScaledSize(imageSize.h, imageSize.w, currentZoom);
            return (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: marker.icon,
                  scaledSize: new window.google.maps.Size(scaledSize.w, scaledSize.h),
                  anchor: new window.google.maps.Point(scaledSize.w / 2, scaledSize.h / 2),
                }}
                onClick={() => handleMarkerClick(marker.icon)} // Open modal on marker click
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }} />
      
      {/* Modal for full-screen image display */}
      {selectedImage && (
        <div style={modalStyle}>
          <img src={selectedImage} alt="Full Screen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <button onClick={closeModal} style={closeButtonStyle}>Close</button>
        </div>
      )}
    </div>
  );
};

// Styles for the modal
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const closeButtonStyle = {
  position: 'absolute',
  backgroundColor: "white",
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default ImageLocationFinder;
