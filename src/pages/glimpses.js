import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
    <div className="flex flex-col h-screen bg-slate-100"> {/* Set background color here */}
      <FileList />
      <Taskbar />
    </div>
  );
}


const Taskbar = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 p-4 rounded-md shadow-md">
      <div className="flex justify-around">
        <div className="taskbar-option">
          <button
            onClick={() => navigate("/existing")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition"
          >
            Contribute To Glimpse
          </button>
        </div>
        <div className="taskbar-option">
          <button
            onClick={() => navigate("/neww")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition"
          >
            New Glimpse
          </button>
        </div>
        <div className="taskbar-option">
          <button
            onClick={() => navigate("/future")}
            className="text-white font-semibold hover:bg-blue-600 rounded-md px-4 py-2 transition"
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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const querySnapshot = await getDocs(collection(db, 'maps'));
        const filesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(filesData);
        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFiles();
  }, []);
  
  return (
    <div className="flex justify-between flex-wrap p-4 rounded-md shadow-md flex-grow overflow-auto">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full"> {/* Center loading indicator */}
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        files.map((file) => (
          <FileCard
            key={file.id}
            title={file.name || "No Title"}
            id={file.id}
          />
        ))
      )}
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
