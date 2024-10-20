import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function Glimpses() {
  return (
    <div className="flex flex-col h-screen">
      <FileList />
      <Taskbar />
    </div>
  );
}

const Taskbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-around bg-blue-500 p-4 rounded-md shadow-md mb-6">
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
    </div>
  );
};

const files = [
  {
    title: 'Chicago Summer 2024',
  },
  {
    title: 'San Francisco Fall 2024',
  },
  {
    title: 'New York City Winter 2024',
  },
];

const FileList = () => {
  return (
    <div className="flex justify-between flex-wrap p-4 bg-slate-100 rounded-md shadow-md flex-grow overflow-auto">
      {files.map((file, index) => (
        <FileCard
          key={index}
          title={file.title}
        />
      ))}
    </div>
  );
};

const FileCard = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="file-card bg-white rounded-md shadow-lg m-2 p-4 flex flex-col justify-center items-center min-w-[200px] h-32">
      <button
        onClick={() => navigate("/map")}
        className="text-gray-800 text-center font-bold text-lg hover:underline"
      >
        {title}
      </button>
    </div>
  );
};
