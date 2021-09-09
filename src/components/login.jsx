import React, { useRef } from 'react'
import './css/tasks.css'

function Login({handlers}) {

    const userField = useRef()
    const passField = useRef()
    const loginButton = useRef()

    return (
        <>
            <div className="login-page">
                <div className="login-card">     
                    <h1>LOGIN / SIGN UP</h1>
                    <input onKeyUp={e => {if(e.key === 'Enter') loginButton.current.click()}} ref={userField} className="input-field username-field" type="text" placeholder="Username" autocomplete="new-password"/>
                    <input onKeyUp={e => {if(e.key === 'Enter') loginButton.current.click()}} ref={passField} className="input-field password-field" type="password" placeholder="Password" autocomplete="off"/>
                    <div className="btns-wrapper">
                        <button ref={loginButton} onClick={() => handlers.login(userField.current.value, passField.current.value)} type="button" className="btn btn-outline-success">Login</button>      
                        <button onClick={() => handlers.signup(userField.current.value, passField.current.value)} className="btn btn-outline-secondary">Sign Up</button>
                    </div>
                    <label id="warnings-label"></label>
                </div>
            </div>
        </>
    )
}

export default Login;

