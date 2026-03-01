import React, { useState } from "react";
import "../style/form.scss";

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()  

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
          Have an account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;