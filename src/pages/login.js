/*import React, { useEffect } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

export default function Login() {
  useEffect(() => {
    // Load the Google API script if not already loaded
    const loadGapi = () => {
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('auth', () => {
            window.gapi.load('picker');
          });
        };
        document.body.appendChild(script);
      } else {
        window.gapi.load('auth', () => {
          window.gapi.load('picker');
        });
      }
    };

    loadGapi();
  }, []);

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Manually call the Picker creation
      createPicker(token);
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  const createPicker = (accessToken) => {
    if (!window.google || !window.google.picker) {
      console.error('Google Picker API is not loaded');
      return;
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.PHOTOS)
      .setOAuthToken(accessToken)
      .setDeveloperKey('AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs') // Replace with your Developer Key
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data) => {
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const doc = data[window.google.picker.Response.DOCUMENTS][0];
      const id = doc[window.google.picker.Document.ID];
      const url = doc[window.google.picker.Document.URL];
      console.log('Selected photo ID:', id);
      console.log('Selected photo URL:', url);
    }
  };

  return (
    <div>
      <h1>Google Photos Picker</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}*/
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import { auth } from '../database';
import Data from "../ data"

export default function Login() {
  //Handle Error Eventually
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Data.user = user;
        console.log(user)
        navigate("/glimpses")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

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
          className={"mt-16 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
        />
        <input
          size={30}
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          className={"mt-4 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
        />
        <div className="mt-8">
          <input type="button" className="w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800" onClick={onSubmit} value={'Log in'} />
        </div>  
        <Link to="/signup" className="mt-4 text-sky-600 text-md">Sign Up</Link>
      </div>
    </div>
  );
}