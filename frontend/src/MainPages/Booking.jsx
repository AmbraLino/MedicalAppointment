import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { UserContext } from '../Auth/UserContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumber } from 'awesome-phonenumber'; // Libraria për validim zyrtar ndërkombëtar
import './Booking.css';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userInfo, ready } = useContext(UserContext);

  const { selectedDate, selectedTime, docId } = state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    appointmentType: 'normal'
  });

  useEffect(() => {
    if (ready && !userInfo) {
      alert("You need to be logged in to make an appointment!");
      navigate("/login");
    }
  }, [userInfo, ready, navigate]);

  if (!docId || !selectedDate || !selectedTime) {
    return (
      <Container className="text-center my-5">
        <p>Please select an hour first.</p>
        <Button onClick={() => navigate("/finddoctor")}>Return back to doctors</Button>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Formatojmë numrin duke i vendosur "+" përpara për validim të saktë ndërkombëtar
    const fullNumber = formData.phoneNumber.startsWith('+') 
      ? formData.phoneNumber 
      : "+" + formData.phoneNumber;

    // 2. Libraria inteligjente analizon numrin sipas rregullave të shtetit që i përket kodi
    const pn = parsePhoneNumber(fullNumber);

    // 3. Kontrolli i hekurt: Sistemi e di vetë nëse numri është i saktë, i shkurtër apo i gjatë për atë shtet
    if (!pn.valid) {
      alert("Invalid phone number! Please enter a valid number according to your country's format.");
      return; 
    }

    try {
      const response = await axios.post(`http://localhost:5000/booking/create`, {
        fullName: formData.fullName,
        phoneNumber: fullNumber, // Ruhet i pastër në DB: +355691111111
        appointmentType: formData.appointmentType,
        doctor: docId,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        status: 'pending'
      }, {
        withCredentials: true
      });

      console.log("The reservation was created:", response.data);
      alert("Reservation sent successfully!");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again..");
        navigate("/login");
      } else {
        alert("Error: " + (err.response?.data?.message || "Something went wrong."));
      }
    }
  };

  if (!ready) return <p className="text-center mt-5">Loading...</p>;

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
                  placeholder="Please insert your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </Form.Group>

              {/* Fusha e Telefonit Ndërkombëtare plotësisht Automatike */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput
                  value={formData.phoneNumber}
                  onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                  countryCodeEditable={false}  
                  enableAreaCodes={true}       
                  autoFormat={true}            
                  inputStyle={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    paddingLeft: '58px' 
                  }}
                  buttonStyle={{
                    border: '2px solid #e2e8f0',
                    borderRight: 'none',
                    borderRadius: '10px 0 0 10px',
                    backgroundColor: '#f8fafc',
                    width: '48px'
                  }}
                  required
                />
              </Form.Group>

              {/* Fusha për Llojin e Vizitës */}
              <Form.Group className="mb-4">
                <Form.Label>Reason for Visit / Appointment Type</Form.Label>
                <Form.Select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  style={{
                    height: '50px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0'
                  }}
                  required
                >
                  <option value="normal">Normal Visit</option>
                  <option value="emergency">Emergency</option>
                  <option value="consultation">Consultation</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-3 mb-2 fw-bold">
                Confirm Appointment
              </Button>

              <Button variant="outline-secondary" className="w-100 py-2" onClick={() => navigate(-1)}>
                Go Back to Schedule
              </Button>

              <p className="booking-footer-note mt-3 text-center text-muted small">
                By confirming you are accepting terms and conditions of ProHealth.
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Booking;