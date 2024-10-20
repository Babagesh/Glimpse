import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getUser } from "../data"

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

export default function Glimpses() {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <FileList />
      <Taskbar />
    </div>
  );
}

const Taskbar = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 pt-2 shadow-md"> {/* Removed rounded-md */}
      <div className="flex flex-row items-center h-full"> {/* Keep items centered vertically */}
        <div className="taskbar-option flex-1 text-center"> {/* Apply flex-1 for equal width */}
          <button
            onClick={() => navigate("/existing")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition w-full" // Ensure full width
          >
            Contribute To Glimpse
          </button>
        </div>
        <div className="taskbar-option flex-1 text-center"> {/* Apply flex-1 for equal width */}
          <button
            onClick={() => navigate("/new")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition w-full" // Ensure full width
          >
            New Glimpse
          </button>
        </div>
        <div className="taskbar-option flex-1 text-center"> {/* Apply flex-1 for equal width */}
          <button
            onClick={() => navigate("/future")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition w-full" // Ensure full width
          >
            Future Glimpse
          </button>
        </div>
      </div>
    </div>
  );
};


const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const userData = sessionStorage.getItem('user');
        const parseData = JSON.parse(userData);
        const uid = parseData.uid;
        const q = query(collection(db, 'maps'), where('users', 'array-contains', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const filesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(filesData);
          setFiles(filesData);
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="flex flex-grow p-4 overflow-auto">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-gray-500 text-xl font-semibold">Create a Glimpse</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-around w-full">
          {files.map((file) => (
            <FileCard
              key={file.id}
              title={file.name || "No Title"}
              id={file.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const FileCard = ({ title, id }) => {
  const navigate = useNavigate();

  return (
    <div
      className="file-card bg-white rounded-md shadow-lg m-2 p-4 flex flex-col justify-center items-center h-32 w-1/4 cursor-pointer transition-transform duration-200 ease-in-out hover:bg-blue-50 hover:shadow-xl" // Added hover effects
      onClick={() => navigate("/map", { state: { documentId: id } })} // Handle click on the card
    >
      <div className="flex flex-col justify-center items-center h-full">
        <span className="text-gray-800 text-center font-bold text-lg hover:underline">
          {title ? title : "Loading..."}
        </span>
      </div>
    </div>
  );
};