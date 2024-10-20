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

const center = {
  lat: 40.712776,
  lng: -74.005974,
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
  const [isValid, setIsValid] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const fetchImages = async () => {
    const urls = [];
    try {
      const q = query(collection(db, 'maps'), where('password', '==', code));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.icon) {
          urls.push(data.icon);
        }
      });

      return urls;
    } catch (error) {
      console.error("Error fetching images: ", error);
      setMessage('An error occurred while fetching images.');
    }
  };

  const handleSubmit = async () => {
    if (code && name) {
      try {
        const q = query(collection(db, 'maps'), where('password', '==', code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const urls = await fetchImages();
          setImageUrls(urls);
          setIsValid(true);
          setMessage(`Welcome to ${name}'s possible new memories`);
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

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="fixed top-4 text-xl font-bold text-blue-600">
          {message}
        </div>
      )}
      {!isValid ? (
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
        <>
          <MapComponent />
          {imageUrls.length > 0 && (
            <div className="image-gallery mt-4">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Glimpse ${index}`} className="w-32 h-32 object-cover m-2" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      />
    </LoadScript>
  );
};
