import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'

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
  lat: 0,
  lng: 0
};

const GlimpseForm = () => {
  const [glimpseName, setGlimpseName] = useState('');
  const [glimpsePassword, setGlimpsePassword] = useState('');
  const [locations, setLocation] = useState(center); // Default center location

  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'maps'), {
        name: glimpseName,
        password: glimpsePassword,
        location: locations
      });
      alert('Data saved successfully!');
      setGlimpseName('');
      setGlimpsePassword('');
      navigate("/map")
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleMapClick = (event) => {
    setLocation([{ lat: event.latLng.lat(), lng: event.latLng.lng() }]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center"> 
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md h-96 w-96"> {/* Increased width */}
        <h1 className="text-2xl font-bold mb-12 text-center">Glimpse Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full"> {/* Ensured full width for the form */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Glimpse Name:
              <input
                type="text"
                value={glimpseName}
                onChange={(e) => setGlimpseName(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 h-8 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                className="mt-1 mb-8 block w-full h-8 border-gray-300 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlimpseForm;
