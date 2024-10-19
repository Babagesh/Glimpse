import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './database';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
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
        <div className = "min-h-screen bg-slate-100 flex justify-center">
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
        {/*
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="border border-gray-300 rounded-lg px-24 py-12 shadow-xl m-auto">
                    <div className="text-gray-800 text-center text-3xl font-extrabold text-large bg-gradient-to-r from-[#cda882] to-[#eadbcb] inline-block text-transparent bg-clip-text">
                        Glimpses
                    </div>
                    <br />
                    <div className="bg-slate-950 size-xxl w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none">
                        <input
                            size={30}
                            classname=""
                            required
                            type="text"
                            value={email}
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <label className="errorLabel">{emailError}</label>
                    </div>
                    <br />
                    <div className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none">
                        <input
                            value={password}
                            required
                            placeholder="Password"
                            onChange={(event) => setPassword(event.target.value)}
                            className={'inputBox'}
                        />
                        <label className="errorLabel">{passwordError}</label>
                    </div>
                    <br />
                    <div className="mt-8">
                        <input type="button" className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none bg-gradient-to-r from-[#cda882] to-[#eadbcb]" onClick={onSubmit} value={'Log in'} />
                    </div>
                </div>
            </div>
        </div>
        */}
        </div>
    );
}