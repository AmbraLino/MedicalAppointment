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
    if (!newUser.username) return setError("Emri nuk duhet te jete bosh");
    if (!newUser.email) return setError("Email nuk duhet te jete bosh");
    if (newUser.password.length < 6) return setError("Fjalekalimi duhet te kete te pakten 6 karaktere!");

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

        <h2>Regjistrohu</h2>
        <p className="form-subtext">Ju lutem plotësoni të dhënat tuaja për të krijuar një llogari.</p>

        <label>Emri përdoruesit *</label>
        <input type="text" name="username" value={newUser.username} onChange={handleChange} placeholder="Shkruani emrin e përdoruesit" />

        <label>Email *</label>
        <input type="text" name="email" value={newUser.email} onChange={handleChange} placeholder="Shkruani adresën e email-it" />

        <label>Fjalëkalimi *</label>
        <input type="password" name="password" value={newUser.password} onChange={handleChange} placeholder="Shkruani fjalëkalimin" />

        {error && <p className="error">{error}</p>}

        <button className="submit-btn" onClick={handleSubmit}>Regjistrohu</button>

        <p className="login-link">
          Keni tashmë një llogari? <a href="/login">Hyr</a>
        </p>
      </div>

      <div className="register-carousel">
        {/* <Carousel fade indicators={false}>
          {[home1, home22, vilaPushimi1].map((photo, index) => (
            <Carousel.Item key={index}>
              <img src={photo} className="d-block w-100" alt={`Slide ${index + 1}`} />
            </Carousel.Item>
          ))}
        </Carousel> */}
      </div>
    </div>
    </div>
  );
};

export default Register;
