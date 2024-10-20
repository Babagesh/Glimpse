import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI

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

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY); // Use your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  const [story, setStory] = useState(''); // State for generated story

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

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
        if (data.markers) {
          data.markers.forEach(marker => {
            if (marker.icon) {
              icons.push(marker.icon);
            }
          });
        }
      });

      for (const icon of icons) {
        const imgQuery = query(collection(db, 'images'), where('icon', '==', icon));
        const imgSnapshot = await getDocs(imgQuery);
        imgSnapshot.forEach((imgDoc) => {
          const imgData = imgDoc.data();
          if (imgData.imageUrl) {
            imageUrls.push(imgData.imageUrl);
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

  const fetchStoryFromImages = async (imageUrls) => {
    try {
      const result = await model.generateContent({
        prompt: `Generate a story inspired by these images: ${imageUrls.join(", ")}`,
        temperature: 0.7, // You can adjust the creativity level
      });
      setStory(result.response.text()); // Set the generated story
    } catch (error) {
      console.error("Error generating story: ", error);
      setStory('Failed to generate story.');
    }
  };

  const handleSubmit = async () => {
    if (code && name) {
      try {
        const q = query(collection(db, 'maps'), where('password', '==', code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();

          const { icons, imageUrls } = await fetchMarkerIcons();
          setGeneratedImages(imageUrls);

          await fetchStoryFromImages(imageUrls); // Generate a story based on the fetched images

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
      </div>
      {story && (
        <div className="story-output mt-4">
          <h2 className="text-xl font-bold">Generated Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}


/*import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Initialize the generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBxeEH079EREtonMSZ5ud07i5_XGOPOcp4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  const [futurePlaces, setFuturePlaces] = useState([]);
  const [inputsVisible, setInputsVisible] = useState(true);

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

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
        if (data.markers) {
          data.markers.forEach(marker => {
            if (marker.icon) {
              icons.push(marker.icon);
            }
          });
        }
      });

      for (const icon of icons) {
        const imgQuery = query(collection(db, 'images'), where('icon', '==', icon));
        const imgSnapshot = await getDocs(imgQuery);
        imgSnapshot.forEach((imgDoc) => {
          const imgData = imgDoc.data();
          if (imgData.imageUrl) {
            imageUrls.push(imgData.imageUrl);
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

  const fetchFuturePlaces = async (imageUrls) => {
    try {
      const prompt = `Based on the following places you have visited (indicated by their images), suggest a list of future places you might enjoy visiting: ${imageUrls.join(", ")}`;
      const result = await model.generateContent(prompt);
      const placesList = result.response.text();
      return placesList.split(",").map(place => place.trim()).filter(place => place);
    } catch (error) {
      console.error("Error generating future places: ", error);
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
          const { imageUrls } = await fetchMarkerIcons();
          
          if (imageUrls.length > 0) {
            const suggestedPlaces = await fetchFuturePlaces(imageUrls);
            setFuturePlaces(suggestedPlaces);
            setInputsVisible(false); // Hide inputs after successful generation
            setMessage(`Welcome to ${data.name || name}'s possible future travels`);
          } else {
            setMessage('No images found for the provided markers.');
          }
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
      {inputsVisible && (
        <div className="flex flex-col items-center">
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
        </div>
      )}
      {!inputsVisible && futurePlaces.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-lg bg-white mt-4">
          <h2 className="text-2xl font-bold mb-4">Suggested Future Places</h2>
          <ul className="list-disc pl-5">
            {futurePlaces.map((place, index) => (
              <li key={index} className="text-lg">{place}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/*import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Initialize the generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBxeEH079EREtonMSZ5ud07i5_XGOPOcp4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  const [inputsVisible, setInputsVisible] = useState(true);

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

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
        if (data.markers) {
          data.markers.forEach(marker => {
            if (marker.icon) {
              icons.push(marker.icon);
            }
          });
        }
      });

      for (const icon of icons) {
        const imgQuery = query(collection(db, 'images'), where('icon', '==', icon));
        const imgSnapshot = await getDocs(imgQuery);
        imgSnapshot.forEach((imgDoc) => {
          const imgData = imgDoc.data();
          if (imgData.imageUrl) {
            imageUrls.push(imgData.imageUrl);
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
      const prompt = `Generate images similar to the following URLs: ${imageUrls.join(", ")}`;
      const result = await model.generateContent(prompt);
      const generatedImageUrls = result.response.text();
      return generatedImageUrls.split(",").map(url => url.trim()).filter(url => url);
    } catch (error) {
      console.error("Error generating similar images: ", error);
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
          const { icons, imageUrls } = await fetchMarkerIcons();
          const similarImages = await fetchSimilarImages(imageUrls);

          setGeneratedImages(similarImages);
          setInputsVisible(false); // Hide inputs after successful generation
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
      {inputsVisible && (
        <div className="flex flex-col items-center">
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
        </div>
      )}
      {!inputsVisible && generatedImages.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-lg bg-white mt-4">
          <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
          <div className="image-gallery flex flex-wrap justify-center">
            {generatedImages.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Generated ${index}`} className="generated-image w-48 h-48 object-cover m-2" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/*
import React, { useState } from 'react';
import '../App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Initialize the generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBxeEH079EREtonMSZ5ud07i5_XGOPOcp4"); // Ensure this is set in your .env file
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        if (data.markers) {
          data.markers.forEach(marker => {
            if (marker.icon) {
              icons.push(marker.icon);
            }
          });
        }
      });

      for (const icon of icons) {
        const imgQuery = query(collection(db, 'images'), where('icon', '==', icon));
        const imgSnapshot = await getDocs(imgQuery);
        imgSnapshot.forEach((imgDoc) => {
          const imgData = imgDoc.data();
          if (imgData.imageUrl) {
            imageUrls.push(imgData.imageUrl);
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
      const prompt = `Generate images similar to the following URLs: ${imageUrls.join(", ")}`;
      const result = await model.generateContent(prompt);
      
      // Assuming the response contains a comma-separated list of URLs
      const generatedImageUrls = result.response.text(); // Adjust based on actual response structure
      return generatedImageUrls.split(",").map(url => url.trim()).filter(url => url); // Filter out any empty URLs
    } catch (error) {
      console.error("Error generating similar images: ", error);
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
        {generatedImages.length > 0 && generatedImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Generated ${index}`} className="generated-image" />
        ))}
        {similarImages.length > 0 && similarImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Similar ${index}`} className="similar-image" />
        ))}
      </div>
    </div>
  );
}
*/