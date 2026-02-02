import React, { useState, useEffect, useContext, useCallback } from "react";
import { Table, Button, Badge, Container } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../Auth/UserContext";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { userInfo } = useContext(UserContext);

  // 1. Definojmë funksionin për të marrë të dhënat jashtë useEffect që ta përdorim kudo
  // Përdorim useCallback që të mos krijohet si funksion i ri në çdo render
 const fetchAppointments = useCallback(async () => {
  try {
    const response = await axios.get("http://localhost:5000/booking/doctor-list", {
      withCredentials: true 
    });
    setAppointments(response.data);
  } catch (err) {
    console.error("GABIMI I REZERVIMEVE:", err.response?.status); // Nëse del 401, fajin e ka Logini
  }
}, []);

  // 2. Thirrja e parë kur ngarkohet komponenti ose kur userInfo ndryshon
  useEffect(() => {
    if (userInfo && userInfo._id) {
      fetchAppointments();
    }
  }, [userInfo, fetchAppointments]);

  // 3. Funksioni për përditësimin e statusit
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/booking/update/${id}`,
        { status: newStatus }, 
        { withCredentials: true }
      );

      alert(`Takimi u ${newStatus === 'approved' ? 'aprovua' : 'refuzua'}!`);
      fetchAppointments(); // Tani ky funksion është i aksesueshëm këtu
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Nuk keni autorizim për këtë veprim.");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Paneli i Menaxhimit - Dr. {userInfo?.username}</h2>
        <Badge bg="info">ID: {userInfo?._id}</Badge>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Pacienti</th>
            <th>Telefon</th>
            <th>Data & Ora</th>
            <th>Statusi</th>
            <th>Veprimet</th>
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
                        Prano
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      >
                        Refuzo
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted small">Përfunduar</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center">Nuk u gjet asnjë rezervim.</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default DoctorDashboard;