import React, { useState } from 'react';
import '../App.css';

export default function Existing() {
  return (
    <div>
      <h1>Please enter a map code to create future glimpses on!</h1>
      <GlimpseInputField />
    </div>
  );
}

function GlimpseInputField() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    // Simulate saving the code
    if (code) {
      setMessage(`Code "${code}" is valid! Welcome to your possible new memories!`);
    } else {
      setMessage('Please enter a valid code.');
    }
  };

  return (
    <div>
      <input
        type="text"
        size={30}
        placeholder="Glimpse code"
        value={code}
        onChange={handleChange}
        className="mt-16 w-96 h-12 border-b border-gray-300 rounded-lg p-2"
      />
      <input
        type="button"
        className="w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800"
        onClick={handleSubmit}
        value="Log in"
      />
      {message && <p>{message}</p>}
    </div>
  );
}
