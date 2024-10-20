import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Exif from 'exif-js'; // For reading image EXIF data
import '../App.css';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 40.712776, // Default latitude (New York City)
  lng: -74.005974, // Default longitude (New York City)
};

export default function Existing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-8">Please enter a map code to contribute to!</h1>
      <GlimpseInputField />
    </div>
  );
}

function GlimpseInputField() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    if (code) {
      setMessage(`Code "${code}" is valid! Welcome to your memories!`);
      setShowMap(true); // Show the map when the code is valid
    } else {
      setMessage('Please enter a valid code.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      getLocationFromImage(file);
    }
  };

  const getLocationFromImage = (file) => {
    Exif.getData(file, function() {
      const lat = Exif.getTag(this, "GPSLatitude");
      const lng = Exif.getTag(this, "GPSLongitude");
      if (lat && lng) {
        const latitude = convertToDecimal(lat);
        const longitude = convertToDecimal(lng);
        setLocation({ lat: latitude, lng: longitude }); // Update location state
        setMessage(`Location guessed from image: (${latitude}, ${longitude})`);
      } else {
        setMessage('No GPS data found in the image.');
      }
    });
  };

  const convertToDecimal = (coord) => {
    const degrees = coord[0] + coord[1] / 60 + coord[2] / 3600;
    return degrees;
  };

  return (
    <div className="flex flex-col items-center">
      {!showMap ? (
        <>
          <input
            type="text"
            size={30}
            placeholder="Glimpse code"
            value={code}
            onChange={handleChange}
            className="mt-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="button"
            className="mt-4 w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800 hover:bg-slate-700 transition"
            onClick={handleSubmit}
            value="Log in"
          />
          {message && <p className="mt-4 text-lg text-center text-gray-700">{message}</p>}
        </>
      ) : (
        <>
          <MapComponent location={location} image={image} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-4 mb-4 w-80 text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-l-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-slate-800 file:text-white
                       hover:file:bg-slate-700 transition"
          />
        </>
      )}
    </div>
  );
}

const MapComponent = ({ location, image }) => {
  return (
    <div className="mt-10 w-full h-full max-w-7xl mx-auto">
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs"> {/* Replace with your API key */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location || center}
          zoom={10}
        >
          {location && (
            <Marker
              position={location}
              icon={{
                url: image,
                scaledSize: new window.google.maps.Size(50, 50), // Adjust size as needed
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
