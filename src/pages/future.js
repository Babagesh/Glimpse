import React, { useState } from 'react';
import '../App.css';

export default function Existing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <GlimpseInputField />
    </div>
  );
}

function GlimpseInputField() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    if (code) {
      setIsValid(true);
      setMessage('Welcome to your possible new memories!');
    } else {
      setMessage('Please enter a valid code.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isValid && (
        <div className="fixed top-4 text-xl font-bold text-blue-600">
          {message}
        </div>
      )}
      {!isValid ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Create Future Glimpses</h1>
          <input
            type="text"
            size={30}
            placeholder="Enter Glimpse code"
            value={code}
            onChange={handleChange}
            className="mb-4 w-80 h-12 border-b-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
          />
          <input
            type="button"
            className="mb-4 w-40 text-lg py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSubmit}
            value="Generate Glimpses"
          />
        </>
      ) : null}
    </div>
  );
}
