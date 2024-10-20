import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app); // Initialize storage

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MAX_DIMENSION = 48;
const MIN_DIMENSION = 32;

const ImageLocationFinder = () => {
  const [markers, setMarkers] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const { documentId } = location.state || {};
  const docRef = doc(db, 'maps', documentId);

  const navigate = useNavigate();

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
      const img = new Image();
      img.src = imageUrl;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > 1080) {
            height *= (1080 / width);
            width = 1080;
          }
        } else {
          if (height > 720) {
            width *= (720 / height);
            height = 720;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

        if (typeof compressedImageUrl !== 'string') {
          console.error("Compressed image URL is not a valid string.");
          return;
        }

        const blob = await (await fetch(compressedImageUrl)).blob();
        const storageRef = ref(storage, `images/${file.name}`);

        uploadBytes(storageRef, blob).then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
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
              const imageDoc = await addDoc(collection(db, 'images'), {
                imageUrl: downloadURL,
                width,
                height
              });

              const newMarker = { lat, lng, icon: imageDoc.id };

              // Update local state to include the new marker
              const updatedMarkers = [...data.markers, newMarker];
              setMarkers(updatedMarkers);

              // Update Firestore with the new markers
              await updateDoc(docRef, { markers: updatedMarkers });
              window.location.reload();
              // Optionally, you could refetch markers to ensure the latest data
              // fetchMarkers();
            } else {
              console.error("No EXIF data found for latitude, longitude, or size.");
            }
          });
        }).catch((error) => {
          console.error("Error uploading image: ", error);
        });
      };

      img.onerror = () => {
        console.error("Error loading image.");
      };
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
    let newWidth, newHeight;
    if (currentZoom < 2) {
      newWidth = Math.max(MIN_DIMENSION, originalWidth);
    } else {
      newWidth = Math.min(MAX_DIMENSION, originalWidth);
    }
    newHeight = newWidth / aspectRatio;
    return { w: newWidth, h: newHeight };
  };

  const handleMarkerClick = (marker) => {
    setSelectedImage(marker.imageUrl); // Set the image URL from the marker to open it in a modal
  };

  const closeModal = () => {
    setSelectedImage(null); // Set selectedImage to null to close the modal
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <button
        onClick={() => navigate('/glimpses')} // Navigate to /glimpses
        style={{
          position: 'absolute',
          bottom: '8px', // Position it 20px from the bottom
          left: '50%', // Center it horizontally
          transform: 'translateX(-50%)', // Adjust to truly center it
          padding: '10px 20px',
          backgroundColor: '#003366', // Dark blue background color
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000
        }}
      >
        Back
      </button>
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
                  url: marker.imageUrl || '',
                  scaledSize: new window.google.maps.Size(scaledSize.w, scaledSize.w),
                  anchor: new window.google.maps.Point(scaledSize.w / 2, scaledSize.h / 2),
                }}
                onClick={() => handleMarkerClick(marker)}
              />
            );
          })}
        </GoogleMap>
      

      {/* Render labels outside of the GoogleMap */}
      {markers.map((marker, index) => (
        <div key={index} style={{
          position: 'absolute',
          transform: 'translate(-50%, -100%)',
          left: `${marker.lng}px`,
          top: `${marker.lat}px`,
          background: 'white',
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}>
          {marker.label} {/* Adjust this to show whatever label you want */}
        </div>
      ))}

      {/* File input and loading message */}
      <label
        style={{
          position: 'absolute',
          bottom: '8px', // Position it above the back button
          left: '8px', // Align it to the left
          padding: '10px 20px',
          backgroundColor: '#003366', // Dark blue background color
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Add File
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            display: 'none' // Hide the default file input
          }}
        />
      </label>
      {loading && (
        <div style={loadingStyle}>Loading memories...</div>
      )}

      {/* Modal for displaying the selected image */}
      {selectedImage && (
        <div style={modalStyle} onClick={closeModal}>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '90%', maxHeight: '90%' }} />
          <button onClick={closeModal} style={closeButtonStyle}>Close</button>
        </div>
      )}
    </div>
    </LoadScript>
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

