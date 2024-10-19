import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { auth } from '../database';
import Data from "../ data"

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.photos.readonly")

export default function Login() {
  //Handle Error Eventually
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const auth = getAuth();

  const onSubmit = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        Data.credential = credential;
        Data.token = token;
        Data.user = user;
        navigate("/glimpses")
      }).catch((error) => {
        Data.credential, Data.token, Data.user = null;
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  return (
    <div>
      <div className="mt-8">
        <input type="button" className="w-full text-lg shadow-xl py-2 px-10 text-sm tracking-wide rounded-lg text-white bg-slate-800" onClick={onSubmit} value={'Log in'} />
      </div>
    </div>
  )

  /*const onSubmit = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
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
          type="text"
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
  );*/
}