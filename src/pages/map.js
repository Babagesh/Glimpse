import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';

// Firebase configuration
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

const MAX_DIMENSION = 64;
const MIN_DIMENSION = 32;

const ImageLocationFinder = () => {
  const [markers, setMarkers] = useState([]);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [currentZoom, setCurrentZoom] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const { documentId } = location.state || {};
  const docRef = doc(db, 'maps', documentId);

  // Fetch existing markers from Firestore on mount
  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.markers) {
            // Fetch image URL for each marker
            const updatedMarkers = await Promise.all(
              data.markers.map(async (marker) => {
                const imageRef = doc(db, 'images', marker.icon);
                const imageSnapshot = await getDoc(imageRef);
                if (imageSnapshot.exists()) {
                  const imageData = imageSnapshot.data();
                  return { ...marker, imageUrl: imageData.imageUrl, width: imageData.width, height: imageData.height };
                }
                return marker;
              })
            );
            setMarkers(updatedMarkers);
          }
        } else {
          console.error("Document does not exist.");
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
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      const docSnapshot = await getDoc(docRef);
      const data = docSnapshot.exists() ? docSnapshot.data() : { markers: [], name: '', password: '' };

      data.markers = Array.isArray(data.markers) ? data.markers : [];

      EXIF.getData(file, async function () {
        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W';
        const width = EXIF.getTag(this, 'PixelXDimension');
        const height = EXIF.getTag(this, 'PixelYDimension');
        const lat = convertDMSToDD(latitude, latRef);
        const lng = convertDMSToDD(longitude, lonRef);

        if (lat && lng && width && height) {
          // Save imageUrl, width, and height as fields in Firestore under the "images" collection
          const imageDoc = await addDoc(collection(db, 'images'), {
            imageUrl,
            width,
            height
          });

          // Store the document reference as the marker's icon
          const newMarker = { lat, lng, icon: imageDoc.id };

          // Update Firestore with the new marker data
          const updatedData = {
            ...data,
            markers: [...data.markers, newMarker]
          };

          updateDoc(docRef, updatedData)
            .then(() => {
              setMarkers(updatedData.markers);
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        } else {
          console.error("No EXIF data found for latitude, longitude, or size.");
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
  let newWidth = originalWidth;
  let newHeight = originalHeight;

  const handleMarkerClick = (marker) => {
    setSelectedImage(marker.imageUrl); // Set the image URL from the marker to open it in a modal
  };

  const closeModal = () => {
    setSelectedImage(null); // Set selectedImage to null to close the modal
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={currentZoom}>
          {markers.map((marker, index) => {
            const scaledSize = calculateScaledSize(marker.width, marker.height, currentZoom);
            return (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: marker.imageUrl, // Use preloaded image URL
                  scaledSize: new window.google.maps.Size(scaledSize.w, scaledSize.h),
                  anchor: new window.google.maps.Point(scaledSize.w / 2, scaledSize.h / 2),
                }}
                onClick={() => handleMarkerClick(marker)} // Trigger image display on click
              />
            );
          })}
        </GoogleMap>
        {selectedImage && (
          <div style={modalStyle}>
            <img src={selectedImage} alt="Full Screen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
          </div>
        )}
      </LoadScript>
      <input id="files" type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 1 }} />
      {/* Loading information */}
      {loading && (
        <div style={loadingStyle}>Loading memories...</div>
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
