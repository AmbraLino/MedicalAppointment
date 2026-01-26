import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { Container, Row, Col } from "react-bootstrap";

const Contact = () => {
  // Rregulluar: Emrat e fushave përputhen fiks me Models/contactModel.js
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    medicalRecordNumber: '',
    reasonForVisit: '',
    department: '',
    preferredDate: '',
    preferredTime: ''
  });
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Shto withCredentials këtu poshtë
    const response = await axios.post("http://localhost:5000/contact", formData, {
      withCredentials: true 
    });
    
    if (response.status === 201 || response.status === 200) {
      alert("Rezervimi u dërgua me sukses në sistem!");
      setFormData({
        fullName: '',
        phoneNumber: '',
        medicalRecordNumber: '',
        reasonForVisit: '',
        department: '',
        preferredDate: '',
        preferredTime: ''
      });
    }
  } catch (error) {
    // Këtu do të shohësh nëse është 401 apo 500
    console.error("Gabim gjatë dërgimit:", error.response?.status, error.response?.data);
    alert("Ndodhi një gabim: " + (error.response?.data?.message || "Kontrolloni autorizimin"));
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page-wrapper">
      {/* Hero Section */}
      <section className="contact-doctor-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} md={6}>
              <h1 className="contact-hero-title">
                Don't Let Your Health <br /> Take a Backseat!
              </h1>
              <p className="contact-hero-subtitle">
                Fill out the appointment form below to schedule a consultation
                with one of our certified healthcare professionals.
              </p>
            </Col>
            <Col lg={5} md={6} className="text-center">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000"
                alt="Doctor"
                className="contact-doctor-img"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Form Section */}
      <div className="contact-form-container">
        <div className="grid-wrapper">
          <div className="form-section">
            <h2 className="section-title">Book an Appointment</h2>
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    name="fullName" // Përputhet me modelin
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(+355) 6X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label>Medical Record Number</label>
                <input
                  name="medicalRecordNumber" // Përputhet me modelin
                  type="text"
                  value={formData.medicalRecordNumber}
                  onChange={handleChange}
                  placeholder="123456-7890-0987"
                />
              </div>

              <div className="contact-row">
                <div className="input-group">
                  <label>Reason for Visit</label>
                  <div className="select-wrapper">
                    <select 
                      name="reasonForVisit" // Përputhet me modelin
                      value={formData.reasonForVisit} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="" disabled>Choose reason</option>
                      <option value="routine">Routine Checkup</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <span className="icon-right">▼</span>
                  </div>
                </div>
                <div className="input-group">
                  <label>Department</label>
                  <div className="select-wrapper">
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select department</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                    </select>
                    <span className="icon-right">▼</span>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <div className="input-group">
                  <label>Preferred Date</label>
                  <div className="icon-input-wrapper">
                    <span className="icon-left">📅</span>
                    <input 
                      name="preferredDate"
                      type="date" 
                      value={formData.preferredDate}
                      onChange={handleChange} 
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Preferred Time</label>
                  <div className="icon-input-wrapper">
                    <span className="icon-left">🕒</span>
                    <input 
                      name="preferredTime"
                      type="time" 
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="button-container">
                <button type="submit" className="contact-submit-btn">
                  Submit &rarr;
                </button>
              </div>
            </form>
          </div>

          <div className="info-section">
            <h2 className="section-title">Contact Info</h2>
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                alt="Medical Clinic"
              />
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <h4>Phone</h4>
                <p>+355 123 456 789</p>
              </div>
              <div className="contact-item">
                <h4>Email Us</h4>
                <p>contact@prohealth.com</p>
              </div>
              <div className="contact-item">
                <h4>Our Location</h4>
                <p>Tiranë, Albania</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;