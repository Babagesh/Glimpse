import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database';
import { getUser, updateUser } from "../data";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for handling errors

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      sessionStorage.setItem('user', JSON.stringify(user));
      navigate("/glimpses");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setError(errorMessage); // Update the error state
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-gray-800 text-center font-[sans-serif] text-4xl font-extrabold">
          Glimpses
        </div>
        <input
          size={30}
          required
          type="text"
          value={email}
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          className="mt-16 w-96 h-12 border-b border-gray-300 rounded-lg p-2"
        />
        <input
          size={30}
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          className="mt-4 w-96 h-12 border-b border-gray-300 rounded-lg p-2"
        />
        {error && ( // Conditional rendering for error message
          <div className="mt-4 text-red-600 text-md">
            {error}
          </div>
        )}
        <div className="mt-8">
          <button 
            className="w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800" 
            onClick={onSubmit}
          >
            Log in
          </button>
        </div>  
        <Link to="/signup" className="mt-4 text-sky-600 text-md">Sign Up</Link>
      </div>
    </div>
  );
}
