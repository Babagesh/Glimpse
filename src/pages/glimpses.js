import React from 'react';
import '../taskbar.css';
import { useNavigate } from 'react-router-dom' 

export default function Taskbar() {
  const navigate = useNavigate()

  const onButtonClick = () => {
    navigate("/glimpses")
  }

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
