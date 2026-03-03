import React, { useState } from "react";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
const Register = () => {
  const { user, loading, handleRegister } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate =useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
   await handleRegister(username, email, password)
      navigate('/')
  }
  if(loading){
    return ( <main><h1>Loading...</h1></main>)
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="logo">Instagram</h1>

        <p className="subtitle">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="login-text">
          Have an account? <span  onClick={() => navigate("/login")} >Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;