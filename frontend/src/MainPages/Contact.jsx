import React from 'react';
import './Contact.css';
import { Container, Row, Col } from "react-bootstrap";

const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      {/* Hero Section */}
      <section className="contact-doctor-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} md={6}>
              <h1 className="contact-hero-title">
                Don't Let Your Health <br/> Take a Backseat!
              </h1>
              <p className="contact-hero-subtitle">
                Fill out the appointment form below to schedule a consultation 
                with one of our certified healthcare professionals with years of experience.
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

      {/* Form & Info Section */}
      <div className="contact-form-container">
        <div className="grid-wrapper">
          
          <div className="form-section">
            <h2 className="section-title">Book an Appointment</h2>
            <form className="appointment-form" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-row">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter your full name" required />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="(+355) 6X XXX XXXX" required />
                </div>
              </div>

              <div className="input-group full-width">
                <label>Medical Record Number</label>
                <input type="text" placeholder="123456-7890-0987" />
              </div>

              <div className="contact-row">
                <div className="input-group">
                  <label>Reason for Visit</label>
                  <div className="select-wrapper">
                    <select defaultValue="">
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
                    <select defaultValue="">
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
                    <input type="date" className="date-picker" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Preferred Time</label>
                  <div className="icon-input-wrapper">
                    <span className="icon-left">🕒</span>
                    <input type="time" className="time-picker" />
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