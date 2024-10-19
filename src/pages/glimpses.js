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
    const navigate = useNavigate()

    return (
      <div className="taskbar">
        <div className="taskbar-option">
          <button onClick={() => navigate("/existing")}>Contribute To Glimpse</button>
          </div>
        <div className="taskbar-option">
          <button onClick={() => navigate("/new")}>New Glimpse</button>
          </div>
        <div className="taskbar-option">
          <button onClick={() => navigate("/future")}>Future Glimpse</button>
          </div>
      </div>
    );
  }

const files = [
  {
    title: 'Chicago',
    thumbnail: "../public/chicago.jpg",
  },
  {
    title: 'San Francisco',
    thumbnail: "../public/sanfran.jpg",
  },
  {
    title: 'New York City',
    thumbnail: "../public/nyc.jpg",
  },
];

const FileList = () => {
  return (
    <div className="file-list">
      {files.map((file, index) => (
        <FileCard
          key={index}
          title={file.title}
          thumbnail={file.thumbnail}
        />
      ))}
    </div>
  );
};

const FileCard = ({ title, thumbnail }) => {
  console.log("Joe Mama");
  return (
    <div className="file-card">
      <img src={thumbnail} alt={`${title} thumbnail`} />
      <h3>{title}</h3>
    </div>
  );
};