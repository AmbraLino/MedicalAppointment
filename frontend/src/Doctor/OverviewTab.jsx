import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, ListGroup, Button, Badge } from "react-bootstrap";
import { FiCheck, FiX } from "react-icons/fi";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './OverviewTab.css';
const OverviewTab = ({ appointments, handleStatusUpdate, defaultPatientAvatar, date, setDate, doctorId }) => {
    const [inputPrices, setInputPrices] = useState({});
const [reviews, setReviews] = useState([]);
useEffect(() => {
        if (doctorId) { 
            axios.get(`http://localhost:5000/api/reviews/doctor/${doctorId}`)
                .then(res => setReviews(res.data))
                .catch(err => console.error("Gabim në marrjen e vlerësimeve:", err));
        }
    }, [doctorId]);
    return (
        <Row>
            <Col lg={8}>
                <Card className="content-card border-0 shadow-sm p-3">
                    <h5 className="section-title mb-3">Last Notifications</h5>
                    <ListGroup variant="flush">
                        {appointments.length > 0 ? (
                            appointments.filter(a => a.status === 'pending').map(app => (
                                <ListGroup.Item key={app._id} className="d-flex align-items-center py-3">
                                    <div className="d-flex align-items-center flex-grow-1">
                                        <img src={app.user?.image || defaultPatientAvatar} className="avatar-sub me-3" alt="Patient" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                        <div>
                                            <h6 className="fw-bold mb-0">{app.fullName}</h6>
                                            <small className="text-muted">{app.phoneNumber}</small>
                                            <div className="mt-1">
                                                <Badge bg={app.appointmentType === 'emergency' ? 'danger' : 'info'} className="me-1">
                                                    {app.appointmentType.charAt(0).toUpperCase() + app.appointmentType.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="me-3" style={{ width: "90px" }}>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Price $"
                                            value={inputPrices[app._id] || ""}
                                            onChange={(e) => setInputPrices(prev => ({ ...prev, [app._id]: e.target.value }))}
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="success" onClick={() => handleStatusUpdate(app._id, 'approved', inputPrices[app._id])}>
                                            <FiCheck />
                                        </Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleStatusUpdate(app._id, 'rejected', 0)}>
                                            <FiX />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p className="text-muted text-center py-3">No matching patients found.</p>
                        )}
                    </ListGroup>
                </Card>
            </Col>

            <Col lg={4}>
                <Card className="schedule-side-card border-0 shadow-sm p-3 h-100">
                    <h5 className="section-title mb-3">Your Schedule</h5>
                    <div className="calendar-box mb-3">
                        <Calendar onChange={setDate} value={date} className="custom-calendar" />
                    </div>

                    <h6 className="timeline-section-title small mb-3">TODAY'S TIMELINE</h6>
                    <div className="timeline-container-list">
                        {appointments.filter(a => a.status === 'approved').map((app, i) => (
                            <div key={i} className="timeline-card-item d-flex mb-3">
                                <div className="timeline-left-indicator">
                                    <span className="timeline-time-text">{app.preferredTime}</span>
                                </div>
                                <div className="timeline-right-body flex-grow-1">
                                    <p className="mb-0 fw-bold">{app.fullName}</p>

                                    <div className="mt-1">
                                        <Badge bg={app.appointmentType === 'emergency' ? 'danger' : 'info'} className="me-1">
                                            {app.appointmentType.charAt(0).toUpperCase() + app.appointmentType.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="mt-1">
                                        {app.isPaid ? (
                                            <Badge bg="success" className="me-1">Paguar Online</Badge>
                                        ) : (
                                            <Badge bg="warning" text="dark">Në pritje</Badge>
                                        )}
                                        {app.cost > 0 && <span className="ms-2 text-primary fw-bold small">${app.cost}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="content-card mt-4">
                    <h5>Vlerësimet e Pacientëve</h5>
                    {reviews.map(rev => (
                        <div key={rev._id} className="border-bottom py-2">
                            <p><strong>{rev.rating} ★</strong> - {rev.comment}</p>
                            <small>Nga: {rev.patientName}</small>
                        </div>
                    ))}
                </Card>
            </Col>
        </Row>
    );
};

export default OverviewTab;