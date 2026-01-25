import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Container } from "react-bootstrap";
import axios from "axios"; 

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  // Marrim të dhënat sapo hapet faqja
  const fetchAppointments = async () => {
    try {
      // Zëvendëso '1' me ID-në reale të doktorit nëse është e nevojshme
      const res = await axios.get("http://localhost:5000/booking/doctor/1");
      setAppointments(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const approveAppointment = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/booking/update/${id}`, { status: 'approved' });
      alert("Takimi u aprovua!");
      fetchAppointments(); // Rifreskojmë listën
    } catch (error) {
      console.error("Gabim gjatë aprovimit:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-primary">Doctor Management Dashboard</h2>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map(app => (
              <tr key={app._id}>
                <td>{app.fullName}</td>
                <td>{app.phoneNumber}</td>
                <td>{app.preferredDate} | {app.preferredTime}</td>
                <td>
                  <Badge bg={app.status === 'approved' ? 'success' : 'warning'}>
                    {app.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  {app.status === 'pending' && (
                    <Button variant="success" size="sm" onClick={() => approveAppointment(app._id)}>
                      Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center">No bookings found.</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default DoctorDashboard;