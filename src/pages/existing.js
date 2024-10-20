import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Exif from 'exif-js';
import '../App.css';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
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
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (code && name) {
      setMessage(`Code "${code}" and Name "${name}" is valid! Welcome to ${name}!`);
      setShowMap(true);
      navigate('/glimpses');
    } else {
      setMessage('Please enter a valid code and name.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {!showMap ? (
        <>
          <h1 className="text-2xl font-bold mb-8">Please enter the map name and code you want to contribute to!</h1>
          <input
            type="text"
            size={30}
            placeholder="Glimpse name"
            value={name}
            onChange={handleNameChange}
            className="mb-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="text"
            size={30}
            placeholder="Glimpse code"
            value={code}
            onChange={handleCodeChange}
            className="mb-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="button"
            className="mt-4 w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800 hover:bg-slate-700 transition"
            onClick={handleSubmit}
            value="Save"
          />
          {message && <p className="mt-4 text-lg text-center text-gray-700">{message}</p>}
        </>
      ) : (
        <MapComponent />
      )}
    </div>
  );
}

const MapComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full relative">
      <button
        onClick={() => navigate('/glimpses')}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition z-50"
      >
        Back
      </button>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        />
      </LoadScript>
    </div>
  );
};
