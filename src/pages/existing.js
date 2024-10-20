import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import '../App.css';
import {getUser} from "../data"

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
  const [fileCards, setFileCards] = useState([]);
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (code && name) {
      try {
        // Query the 'maps' collection to find matching name and password
        const q = query(collection(db, 'maps'), where('password', '==', code), where('name', '==', name));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          setMessage(`Welcome to ${name}!`);
          setShowMap(true);
          
          // Create file cards based on the retrieved maps
          const cards = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().name
          }));
          setFileCards(cards);
  
          // Append userData().uid to the users array in each document
          const uid = getUser().uid; // Assuming getUser() retrieves user data
  
          await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              const users = data.users || []; // Default to an empty array if users doesn't exist
              
              // Check if the user's UID is not already in the users array
              if (!users.includes(uid)) {
                users.push(uid); // Append the UID
                // Update the document with the new users array
                await updateDoc(doc.ref, { users: users });
              }
            })
          );
  
          navigate('/glimpses'); // Navigate to /glimpses
        } else {
          setMessage('No map found with the provided name and code.');
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
        <MapComponent fileCards={fileCards} />
      )}
    </div>
  );
}

const MapComponent = ({ fileCards }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full h-full relative">
      <button
        onClick={() => navigate('/glimpses')}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition z-50"
      >
        Back
      </button>
      <LoadScript googleMapsApiKey="AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        />
      </LoadScript>
      {/* Render File Cards */}
      <div className="absolute bottom-4 left-4 flex flex-wrap">
        {fileCards.map(card => (
          <FileCard key={card.id} title={card.title} id={card.id} />
        ))}
      </div>
    </div>
  );
};

const FileCard = ({ title, id }) => {
  const navigate = useNavigate();
  return (
    <div className="file-card bg-white rounded-md shadow-lg m-2 p-4 flex flex-col justify-center items-center min-w-[200px] h-32">
      <button
        onClick={() => navigate("/map", { state: { documentId: id } })} // Pass document ID
        className="text-gray-800 text-center font-bold text-lg hover:underline"
      >
        {title ? title : "Loading..."}
      </button>
    </div>
  );
};
