import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database';

export default function Signup() {
  // State management
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error handling state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if email and confirm email match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return; // Prevent further execution
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      setSuccessMessage('Registration successful! You can now log in.'); // Set success message
      setError(''); // Clear any previous errors
      setTimeout(() => navigate("/login"), 2000); // Navigate after a delay
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setError(errorMessage); // Set error message from Firebase
      setSuccessMessage(''); // Clear success message
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-gray-800 text-center font-[sans-serif] text-4xl font-extrabold">
          Glimpses
        </div>
        
        {/* Email Input */}
        <input
          size={30}
          required
          type="text"
          value={email}
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          className={"mt-16 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
        />

        {/* Confirm Email Input */}
        <input
          size={30}
          required
          type="text"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={"mt-4 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
        />

        {/* Password Input */}
        <input
          size={30}
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          className={"mt-4 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
        />
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-600 text-md">{error}</div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 text-green-600 text-md">{successMessage}</div>
        )}

        {/* Sign Up Button */}
        <button 
          className="w-full text-lg shadow-xl py-2 px-8 text-sm tracking-wide rounded-lg text-white bg-slate-800 mt-8" 
          onClick={onSubmit}
        >
          Sign Up
        </button>

        {/* Link to Log In */}
        <Link to="/login" className="mt-4 text-sky-600 text-md">Back to Log In</Link>
      </div>
    </div>
  );
}
