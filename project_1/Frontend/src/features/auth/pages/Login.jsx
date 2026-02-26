import React, { useState } from "react";
import "../style/form.scss";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/api/auth/login", {
        identifier: formData.identifier,
        password: formData.password
      }, {
        withCredentials: true
      })
      alert("login successful!");
      // optionally redirect or clear form here

    } catch (error) {
      if (error.response?.status === 409) {
        alert("User not found.");
      } else if (error.response?.status === 401) {
        alert("Password invalid")
      }
      else {
        alert("Something went wrong. Try again.");
      }
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="logo">Instagram Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Phone number, username, or email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="login-text">
          Forgot password?
        </p>

        <p className="login-text">
          Don't have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;