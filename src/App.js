import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { Outlet, Link } from "react-router-dom";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
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
        <div>
            <div>
                Login
            </div>
            <br/>
            <div>
                <input
                    value = {email}
                    placeholder = "Email"
                    onChange = { (event) => setEmail(event.target.value)}
                    className = {'inputBox'}
                />
                <label className = "errorLabel">{emailError}</label>
            </div>
            <br/>
            <div>
                <input
                    value = {password}
                    placeholder = "Password"
                    onChange = { (event) => setPassword(event.target.value)}
                    className = {'inputBox'}
                />
                <label className = "errorLabel">{passwordError}</label>
            </div>
            <br/>
            <div>
              <input className={'inputButton'} type="button" onClick={onSubmit} value={'Log in'} />
            </div>
        </div>
    );
}