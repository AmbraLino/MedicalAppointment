import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Image, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './AdminPanel.css';

const AdminDoctorPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/doctors", { withCredentials: true });
        setDoctors(res.data);
      } catch (err) {
        console.log("Doctors could not be loaded: " + err);
      }
    };
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`, { withCredentials: true });
      setDoctors(doctors.filter((doc) => doc._id !== id));
    } catch (err) {
      console.log("Could not delete doctor: " + err);
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.username?.toLowerCase().includes(search.toLowerCase()) ||
      doc.department?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="admin-panel-container mt-4">
      <h1 className="admin-panel-title">Admin Panel - Doctors</h1>

      <div className="d-flex gap-2 mb-3">
        <Link to="/admin/create">
          <Button variant="success">Add New Doctor</Button>
        </Link>
        <Form.Control
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "500px" }}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Description</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doc) => (
            <tr key={doc._id}>
              <td>
                {doc.image ? (
                  <Image
                    src={`http://localhost:5000/Images/${doc.image}`}
                    thumbnail
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : "No Photo"}
              </td>
              <td>{doc.username}</td>
              <td>{doc.specialty}</td>
              <td>{doc.description}</td>
              <td>{doc.department}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => navigate(`/admin/update/${doc._id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(doc._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDoctorPanel;