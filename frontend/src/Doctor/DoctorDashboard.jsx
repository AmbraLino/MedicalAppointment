import React, { useState, useEffect, useContext, useCallback } from "react";
import { Table, Button, Badge, Container } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../Auth/UserContext";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { userInfo } = useContext(UserContext);
  const fetchAppointments = useCallback(async () => {
  try {
    const response = await axios.get("http://localhost:5000/booking/doctor-list", {
      withCredentials: true 
    });
    setAppointments(response.data);
  } catch (err) {
    console.error("error while reservation:", err.response?.status);
  }
}, []);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      fetchAppointments();
    }
  }, [userInfo, fetchAppointments]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/booking/update/${id}`,
        { status: newStatus }, 
        { withCredentials: true }
      );

      alert(`Meeting is ${newStatus === 'approved' ? 'approved' : 'rejected'}!`);
      fetchAppointments();
    } catch (error) {
      console.error("error while reservation:", error.response?.data || error.message);
      alert(error.response?.data?.message || "no premission to update this reservation!");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Management panel -  {userInfo?.username}</h2>
        <Badge bg="info">ID: {userInfo?._id}</Badge>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Patient</th>
            <th>Phone number</th>
            <th>Date and time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map(app => (
              <tr key={app._id}>
                <td>{app.fullName}</td>
                <td>{app.phoneNumber}</td>
                <td>{app.preferredDate} | {app.preferredTime}</td>
                <td>
                  <Badge bg={
                    app.status === 'approved' ? 'success' : 
                    app.status === 'rejected' ? 'danger' : 'warning'
                  }>
                    {app.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  {app.status === 'pending' ? (
                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(app._id, 'approved')}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted small">Completed</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center">No appointments found.</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default DoctorDashboard;