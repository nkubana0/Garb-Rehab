import React from 'react'
import './css/login.css'

const Login = () => {
  return (
    <div className='login'>
      <div className="login-container">
        <h1>Sign Up</h1>
        <div className="login-fields">
          <input type="text" placeholder='Your Name' />
          <input type="email" placeholder='Email Address' />
          <input type="password" placeholder='Password' />
          <button>Continue</button>
          <p className='login-login'>Already Have An Account? <span>Login Here!</span></p>
          <div className="agree">
            <input type="checkbox" name='' id='' className='checkbox' />
            <p>By continuing I agree to use the terms of Use and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login