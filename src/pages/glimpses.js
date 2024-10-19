import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom' 

export default function glimpses() {
  return (
    <div>
      <FileList />
      <Taskbar />
    </div>
  );
}

const Taskbar = () => {
  const navigate = useNavigate();
  return (
    <div className="taskbar">
      <div className="taskbar-option">
        <button onClick={() => navigate("/existing")}>Contribute To Glimpse</button>
        </div>
      <div className="taskbar-option">
        <button onClick={() => navigate("/new")}>New Glimpse</button>
        </div>
    </div>
  );
}

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
    <div className="file-list">
      {files.map((file, index) => (
        <FileCard
          key={index}
          title={file.title}
        />
      ))}
    </div>
  );
};

const FileCard = ({title}) => {
  const navigate = useNavigate();
  return (
    <div className="file-card">
      <button onClick={() => navigate("/map")} class="text-gray-800 text-center font-[sans-serif] font-bold">{title}</button>
    </div>
  );
};