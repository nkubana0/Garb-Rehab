import React, { useState } from "react";
import "./css/login.css";

const Login = () => {
  const [state, setState] = useState("Login");
  const login = async ()=> {
    console.log("Login Function Executed");
  }

  const signup = async () => {
    console.log("Signup Function Executed");
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>{state}</h1>
        <div className="login-fields">
          {state === "Sign Up" ? (
            <input type="text" placeholder="Your Name" />
          ) : (
            <></>
          )}
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <button onClick={()=>{state === "Login"?login():signup()}}>Continue</button>
          {state === "Sign Up" ? (
            <p className="login-login">
              Already Have An Account? <span onClick={()=>{setState("Login")}}>Login Here!</span>
            </p>
          ) : (
            <p className="login-login">
              Create An Account! <span onClick={()=>{setState("Sign Up")}}>Click Here!</span>
            </p>
          )}
          <div className="agree">
            <input type="checkbox" name="" id="" className="checkbox" />
            <p>
              By continuing I agree to use the terms of Use and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
