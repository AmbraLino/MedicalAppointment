import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css"; 

const Register = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newUser.username) return setError("username should not be empty");
    if (!newUser.email) return setError("Email should not be empty");
    if (newUser.password.length < 6) return setError("Password must be at least 6 characters long!");

    try {
      const res = await axios.post('http://localhost:5000/user/register/', newUser);
      console.log("Perdoruesi u krijua:", res.data);
      navigate('/');
    } catch (err) {
      setError("Perdoruesi nuk u krijua");
    }
  };

  return (
    <div className='register-full-container'>
    <div className="register-container">
      <div className="register-form">
        <div className="logo-header">
        </div>

        <h2>Register</h2>
        <p className="form-subtext">Please fill in your details to create an account.</p>

        <label>Username *</label>
        <input type="text" name="username" value={newUser.username} onChange={handleChange} placeholder="Enter your username" />
        <label>Email *</label>
        <input type="text" name="email" value={newUser.email} onChange={handleChange} placeholder="Enter your email address" />

        <label>Password *</label>
        <input type="password" name="password" value={newUser.password} onChange={handleChange} placeholder="Enter your password" />

        {error && <p className="error">{error}</p>}

        <button className="submit-btn" onClick={handleSubmit}>Register</button>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>

      <div className="register-carousel">

      </div>
    </div>
    </div>
  );
};

export default Register;
