import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminDoctorForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password || !department) {
      setError("Plotësoni të gjitha fushat e detyrueshme!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("department", department);
      formData.append("specialty", specialty);
      formData.append("bio", bio);
      formData.append("role", "doctor"); // Shumë e rëndësishme
      if (image) formData.append("image", image);

      const response = await axios.post("http://localhost:5000/admin/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Doktori u krijua me sukses!");
      navigate("/admin/doctors");
    } catch (err) {
      console.error("Detajet e gabimit:", err.response?.data);
      setError(err.response?.data?.message || "Gabim gjatë krijimit të doktorit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <div className="p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center text-primary">Regjistro Doktor të Ri</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Emri i Plotë *</Form.Label>
            <Form.Control type="text" placeholder="Dr. Hohn DOe" onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" placeholder="doktori@email.com" onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fjalëkalimi *</Form.Label>
            <Form.Control type="password" placeholder="******" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Departamenti *</Form.Label>
            <Form.Control type="text" placeholder="Kardiologji" onChange={(e) => setDepartment(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialiteti</Form.Label>
            <Form.Control type="text" placeholder="Kirurg" onChange={(e) => setSpecialty(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={(e) => setBio(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Foto e Profitit</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? "Duke u procesuar..." : "Regjistro Doktorin"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AdminDoctorForm;