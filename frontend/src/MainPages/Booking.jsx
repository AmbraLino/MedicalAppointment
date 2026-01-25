import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col } from "react-bootstrap";
import './Booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, docId } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    doctorId: docId || '',
    preferredDate: selectedDate || '',
    preferredTime: selectedTime || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dërgojmë të dhënat te rruga e saktë /booking
      await axios.post(`http://localhost:5000/booking/doctor-schedule/${formData.doctorId}`, { ...formData, status: 'pending' });
      alert("Rezervimi u dërgua me sukses!");
      navigate("/finddoctor");
    } catch (error) {
      console.error("Gabim gjatë rezervimit:", error);
      alert("Ndodhi një gabim. Provoni përsëri.");
    }
  };

  return (
    <div className="confirm-booking-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="booking-card shadow p-4 mt-5 bg-white rounded">
            <h2 className="text-center mb-4">Reservation Confirmation</h2>
            
            <div className="selected-slot-info mb-4 p-3 bg-light rounded border text-center">
              <p className="mb-1 text-muted">Selected appointment:</p>
              <h5 className="fw-bold text-primary">{formData.preferredDate} &bull; {formData.preferredTime}</h5>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Your full name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Contact number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="06X XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
                CONFIRM THE MEETING
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Booking;