import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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

const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

const center = {
  lat: -3.745,
  lng: -738.112
};

const GlimpseForm = () => {
  const [glimpseName, setGlimpseName] = useState('');
  const [glimpsePassword, setGlimpsePassword] = useState('');
  const [location, setLocation] = useState(center); // Default center location

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'glimpses'), {
        name: glimpseName,
        password: glimpsePassword,
        location: location
      });
      alert('Data saved successfully!');
      setGlimpseName('');
      setGlimpsePassword('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleMapClick = (event) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Glimpse Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Glimpse Name:
            <input
              type="text"
              value={glimpseName}
              onChange={(e) => setGlimpseName(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Glimpse Password:
            <input
              type="password"
              value={glimpsePassword}
              onChange={(e) => setGlimpsePassword(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
        </div>
        <div>
          <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={10}
              onClick={handleMapClick}
            >
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default GlimpseForm;
