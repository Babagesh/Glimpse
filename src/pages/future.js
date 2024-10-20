import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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
  const [generatedImages, setGeneratedImages] = useState([]);
  const [similarImages, setSimilarImages] = useState([]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const fetchMarkerIcons = async () => {
    const icons = [];
    const imageUrls = [];
    try {
      const q = query(collection(db, 'maps'), where('password', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage('No maps found with the provided code.');
        return { icons, imageUrls };
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Document Data:", data);
        if (data.markers) {
          data.markers.forEach(marker => {
            if (marker.icon) {
              icons.push(marker.icon);
            } else {
              console.warn("No icon found in marker:", marker);
            }
          });
        } else {
          console.warn("No markers field found in document:", doc.id);
        }
      });

      for (const icon of icons) {
        const imgQuery = query(collection(db, 'images'), where('icon', '==', icon));
        const imgSnapshot = await getDocs(imgQuery);
        imgSnapshot.forEach((imgDoc) => {
          const imgData = imgDoc.data();
          if (imgData.imageUrl) {
            imageUrls.push(imgData.imageUrl);
          } else {
            console.warn("No image URL found for icon:", icon);
          }
        });
      }

      return { icons, imageUrls };
    } catch (error) {
      console.error("Error fetching marker icons: ", error);
      setMessage('An error occurred while fetching marker icons.');
      return { icons, imageUrls };
    }
  };

  const fetchSimilarImages = async (imageUrls) => {
    try {
      const response = await fetch('https://gemini-ai-endpoint-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: imageUrls }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.similarImages; // Adjust according to the API response structure
    } catch (error) {
      console.error("Error fetching similar images: ", error);
      return [];
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

          const { icons, imageUrls } = await fetchMarkerIcons();
          setGeneratedImages(imageUrls);

          const similarImages = await fetchSimilarImages(imageUrls);
          setSimilarImages(similarImages);

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

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="fixed top-4 text-xl font-bold text-blue-600">
          {message}
        </div>
      )}
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
      <div className="image-gallery">
        {generatedImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Generated ${index}`} className="generated-image" />
        ))}
        {similarImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Similar ${index}`} className="similar-image" />
        ))}
      </div>
    </div>
  );
}