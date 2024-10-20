import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRv2sUSBbgsnoJsT1LnUcsE6eFaXXzlDk",
  authDomain: "glimpses-8bf56.firebaseapp.com",
  projectId: "glimpses-8bf56",
  storageBucket: "glimpses-8bf56.appspot.com",
  messagingSenderId: "90716597482",
  appId: "1:90716597482:web:94de9cb882f480504e7b93",
  measurementId: "G-Q00N0G3WRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MIN_DIMENSION = 32;
const MAX_DIMENSION = 64;

const ImageLocationFinder = () => {
  const [markers, setMarkers] = useState([]);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [currentZoom, setCurrentZoom] = useState(3);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { documentId } = location.state || {};
  const docRef = doc(db, 'maps', documentId);

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.markers) {
            setMarkers(data.markers);
          }
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkers();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const newMarkers = [];

    const processFile = (file) => {
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

          const lat = convertDMSToDD(latitude, latRef);
          const lng = convertDMSToDD(longitude, lonRef);

          if (lat && lng) {
            newMarkers.push({ lat, lng, icon: imageUrl });
            if (width && height) {
              setImageSize({ h: height, w: width });
            }
          }

          // Once all files are processed, update the markers in Firestore
          if (newMarkers.length === files.length) {
            updateDoc(docRef, {
              markers: [...markers, ...newMarkers]
            })
              .then(() => {
                setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          }
        });
      };
      reader.readAsDataURL(file);
    };

    files.forEach(processFile); // Process each file
  };

  const convertDMSToDD = (dms, ref) => {
    if (!dms) return null;
    const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
    return (ref === 'S' || ref === 'W') ? -degrees : degrees;
  };

  const calculateScaledSize = (originalWidth, originalHeight, currentZoom) => {
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    // Scale based on zoom level
    if (currentZoom < 2) {
      newWidth = Math.max(MIN_DIMENSION, originalWidth);
      newHeight = (newWidth * originalHeight) / originalWidth; // Maintain aspect ratio
    } else {
      const scaleFactor = (MAX_DIMENSION / originalWidth);
      newWidth = Math.min(MAX_DIMENSION, originalWidth);
      newHeight = newWidth * (originalHeight / originalWidth);
    }

    return { w: Math.round(newWidth), h: Math.round(newHeight) };
  };

  const handleMarkerClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

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
            const scaledSize = calculateScaledSize(imageSize.w || MIN_DIMENSION, imageSize.h || MIN_DIMENSION, currentZoom);
            return (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: marker.icon,
                  scaledSize: new window.google.maps.Size(scaledSize.w, scaledSize.h),
                  anchor: new window.google.maps.Point(scaledSize.w / 2, scaledSize.h / 2),
                }}
                onClick={() => handleMarkerClick(marker.icon)}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
      <input
        id="files"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple // Allow multiple file selection
        style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 1 }}
      />
      
      {loading && (
        <div style={loadingStyle}>Loading memories...</div>
      )}

      {selectedImage && (
        <div style={modalStyle}>
          <img src={selectedImage} alt="Full Screen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <button onClick={closeModal} style={closeButtonStyle}>Close</button>
        </div>
      )}
    </div>
  );
};

// Styles for loading message
const loadingStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '10px 20px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  zIndex: 999,
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
