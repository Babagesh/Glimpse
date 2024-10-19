import React, { useState } from 'react'
import { redirect } from 'react-router-dom' 

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const onButtonClick = () => {
      redirect("/login")
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
                <input className = {'inputButton'} type = "button" onClick = {onButtonClick} value = {"Log in"}/>
            </div>
        </div>
    );
}