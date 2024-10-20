import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database';

export default function Login() {
  //Handle Error
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    if (email == confirmEmail) {
      e.preventDefault()
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user)
          navigate("/login")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
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
          required
          type="text"
          value={confirmEmail}
          placeholder="Confirm Email"
          onChange={(event) => setConfirmEmail(event.target.value)}
          className={"mt-4 w-96 h-12 border-b border-gray-300 rounded-lg p-2"}
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
        <Link className="mt-8">
          <input type="button" className="w-full text-lg shadow-xl py-2 px-8 text-sm tracking-wide rounded-lg text-white bg-slate-800" onClick={onSubmit} value={'Sign Up'} />
        </Link>
        <Link to="/login" className="mt-4 text-sky-600 text-md">Back to Log In</Link>
      </div>
    </div>
  );
}