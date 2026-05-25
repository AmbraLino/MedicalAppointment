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
  // const [bio, setBio] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password || !department || !specialty || !description) {
      setError("Fill in all required fields!");
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
      // formData.append("bio", bio);
      formData.append("description", description);
      formData.append("role", "doctor"); 
      if (image) formData.append("image", image);

      const response = await axios.post("http://localhost:5000/admin/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("The doctor was successfully created.!");
      navigate("/admin/doctors");
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Error creating the doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <div className="p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center text-primary">Add a new doctor</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Full name</Form.Label>
            <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control type="text" onChange={(e) => setDepartment(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialty</Form.Label>
            <Form.Control type="text" onChange={(e) => setSpecialty(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? "Loading..." : "Register Doctor"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AdminDoctorForm;