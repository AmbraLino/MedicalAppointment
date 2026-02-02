import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { UserContext } from '../Auth/UserContext'; // Sigurohu që ky path është i saktë
import './Booking.css';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userInfo, ready } = useContext(UserContext); // Marrim informacionin e përdoruesit
  
  const { selectedDate, selectedTime, docId } = state || {};
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '' });

  // 1. Kontrolli nëse përdoruesi është i loguar
  useEffect(() => {
    if (ready && !userInfo) {
      alert("Duhet të logoheni për të bërë një rezervim!");
      navigate("/login");
    }
  }, [userInfo, ready, navigate]);

  // 2. Kontrolli nëse të dhënat e orarit kanë ardhur nga faqja paraprake
  if (!docId || !selectedDate || !selectedTime) {
    return (
      <Container className="text-center my-5">
        <p>Ju lutem zgjidhni një orar nga fillimi.</p>
        <Button onClick={() => navigate("/finddoctor")}>Kthehu te Doktorët</Button>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://localhost:5000/booking/create`, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        doctor: docId, 
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        status: 'pending'
      }, { 
        withCredentials: true // Kjo dërgon cookie-n te serveri
      });

      console.log("Rezervimi u krijua:", response.data);
      alert("Rezervimi u dërgua me sukses!");
      navigate("/");
    } catch (err) {
      // Nëse tokeni ka skaduar ose nuk ekziston
      if (err.response?.status === 401) {
        alert("Sesioni juaj ka skaduar. Ju lutem logohuni përsëri.");
        navigate("/login");
      } else {
        alert("Gabim: " + (err.response?.data?.message || "Ndodhi një gabim."));
      }
    }
  };

  // Nëse nuk është gati akoma context-i, mos shfaq gjë
  if (!ready) return <p className="text-center mt-5">Duke u ngarkuar...</p>;

  return (
    <div className="confirm-booking-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="booking-card shadow p-4 bg-white rounded">
            <h2 className="text-center mb-4">Confirm Appointment</h2>
            
            <div className="selected-slot-info mb-4 text-center p-3 bg-light rounded">
              <p className="mb-1 text-muted">Selected Slot</p>
              <h5>{selectedDate} &bull; {selectedTime}</h5>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Shkruani emrin tuaj të plotë"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control 
                  type="tel" 
                  placeholder="06X XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required 
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-3 mb-2 fw-bold">
                CONFIRM RESERVATION
              </Button>

              <Button variant="outline-secondary" className="w-100 py-2" onClick={() => navigate(-1)}>
                Go Back to Schedule
              </Button>
              
              <p className="booking-footer-note mt-3 text-center text-muted small">
                Duke konfirmuar, ju pranoni kushtet e shërbimit të klinikës.
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Booking;