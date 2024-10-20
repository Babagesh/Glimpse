import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export default function Existing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <GlimpseInputField />
    </div>
  );
}

function GlimpseInputField() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mapData, setMapData] = useState(null);
  const [markerIcons, setMarkerIcons] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]); // State for generated images

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const fetchMarkerIcons = async () => {
    const icons = [];
    try {
      const q = query(collection(db, 'maps'), where('password', '==', code));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.icon) {
          icons.push(data.icon);
        } else {
          console.warn("No icon found in document:", doc.id); // Log missing icon
        }
      });

      return icons;
    } catch (error) {
      console.error("Error fetching marker icons: ", error);
      setMessage('An error occurred while fetching marker icons.');
    }
  };

  const handleSubmit = async () => {
    if (code && name) {
      try {
        const q = query(collection(db, 'maps'), where('password', '==', code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          console.log("Map Data:", data);
          setMapData(data);

          // Fetch marker icons after setting map data
          const icons = await fetchMarkerIcons();
          setMarkerIcons(icons);
          
          // Generate images based on icons
          await generateSimilarImages(icons);
          
          setMessage(`Welcome to ${data.name || name}'s possible new memories`);
        } else {
          setMessage('No map found with the provided code.');
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        setMessage('An error occurred while checking the map.');
      }
    } else {
      setMessage('Please enter a valid code and name.');
    }
  };

  const generateSimilarImages = async (icons) => {
    try {
      const response = await fetch('AIzaSyCB593aHPMQxYV_vUYk6qGS8eJsIbhpTl8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY' // Replace with your API key
        },
        body: JSON.stringify({ icons })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setGeneratedImages(data.images || []); // Assuming the API returns an array of image URLs
    } catch (error) {
      console.error('Error generating images:', error);
      setMessage('An error occurred while generating images.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="fixed top-4 text-xl font-bold text-blue-600">
          {message}
        </div>
      )}
      {!mapData ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Create Future Glimpses</h1>
          <input
            type="text"
            size={30}
            placeholder="Enter Glimpse name"
            value={name}
            onChange={handleNameChange}
            className="mb-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="text"
            size={30}
            placeholder="Enter Glimpse code"
            value={code}
            onChange={handleCodeChange}
            className="mb-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="button"
            className="mb-4 w-40 text-lg py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSubmit}
            value="Generate Glimpses"
          />
        </>
      ) : (
        <MapComponent mapData={mapData} markerIcons={markerIcons} generatedImages={generatedImages} />
      )}
    </div>
  );
}

const MapComponent = ({ mapData, markerIcons, generatedImages }) => {
  const center = {
    lat: mapData.lat || 40.712776,
    lng: mapData.lng || -74.005974,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      />
      <div className="image-gallery">
        {generatedImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Generated ${index}`} className="generated-image" />
        ))}
      </div>
    </LoadScript>
  );
};
