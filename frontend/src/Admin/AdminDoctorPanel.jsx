import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Image, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import './AdminPanel.css';

const AdminDoctorPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.log("Doctors could not be loaded: " + err);
      }
    };
    fetchDoctors();
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë doktor?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`, {
        withCredentials: true,
      });
      setDoctors(doctors.filter((doc) => doc._id !== id));
      console.log("Doctor deleted successfully");
    } catch (err) {
      console.log("Could not delete doctor: " + err);
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="admin-panel-container">
      <h1 className="admin-panel-title">Admin Panel - Doctors</h1>

      <div className="d-flex gap-2 mb-3">
        <Link to="/admin/create">
          <Button style={{ backgroundColor: "#185816ff", borderColor: "#2b0a0aff" }}>
            Add New Doctor
          </Button>
        </Link>

        <Form.Control
          type="text"
          placeholder="Search by name, specialty, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "700px" }}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc._id}</td>
                <td>
                  {doc.image && (
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      thumbnail
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{doc.name}</td>
                <td>{doc.specialty}</td>
                <td>{doc.department}</td>
                <td className="d-flex gap-2">
                  <Link to={`/admin/update/${doc._id}`}>
                    <Button variant="warning">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(doc._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDoctorPanel;
