import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminDoctorForm = () => {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    department: "",
    description: "",
    image: "",
  });

  // 🔥 Load doctor for editing
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/doctors/${id}`)
        .then((res) => setFormData(res.data))
        .catch(err => console.log(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/doctors/${id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/doctors", formData);
      }
      navigate("/admin/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "30px" }}>
      <h2>{id ? "Edit Doctor" : "Add New Doctor"}</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image URL"
          />
        </Form.Group>

        <Button type="submit" variant="success">
          {id ? "Update Doctor" : "Add Doctor"}
        </Button>
      </Form>
    </Container>
  );
};

export default AdminDoctorForm;
