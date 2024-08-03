import React, { useState } from "react";
import "./css/login.css";

const Login = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);

    // Mock response data for login
    const responseData = { success: true, token: "mockToken" };

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Signup Function Executed", formData);

    // Mock response data for signup
    const responseData = { success: true, token: "mockToken" };

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>{state}</h1>
        <div className="login-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
          <button
            onClick={() => {
              state === "Login" ? login() : signup();
            }}
          >
            Continue
          </button>
          {state === "Login" ? (
            <>
              <p className="login-signup">
                Create An Account!{" "}
                <span onClick={() => setState("Sign Up")}>Click Here!</span>
              </p>
              <p className="forgot-password">
                Forgot Password ?{" "}
                <span
                  onClick={() => (window.location.href = "/forgot-password")}
                >
                  Click Here!
                </span>
              </p>
            </>
          ) : (
            <p className="login-login">
              Already Have An Account?{" "}
              <span onClick={() => setState("Login")}>Login Here!</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
