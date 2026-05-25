import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import "./Create.css";

const Create = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    username: "",
    email: "",
    password: "",
    specialty: "",
    department: "",
    image: null,
    description: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) =>
    setDoctor({ ...doctor, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDoctor({ ...doctor, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setDoctor({ ...doctor, image: null });
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor.username || !doctor.specialty || !doctor.department || !doctor.description) {
      return alert("Please fill all required fields!");
    }

    const formData = new FormData();
    Object.keys(doctor).forEach((key) => {
      if (doctor[key] !== null) formData.append(key, doctor[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/doctors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Doctor added successfully!");
      navigate("/admin/doctors");
    } catch (err) {
      console.log("Error adding doctor:", err.response?.data || err);
    }
  };

  return (
    <Container className="create-container d-flex align-items-center justify-content-center">
      <Card className="shadow-lg create-card p-4">
        <h2 className="text-center mb-4">Add New Doctor</h2>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={doctor.username} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialty</Form.Label>
            <Form.Control type="text" name="specialty" value={doctor.specialty} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control type="text" name="department" value={doctor.department} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description" 
              value={doctor.description}
              onChange={handleChange}
              placeholder="Enter the short bio or code"
            />          
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleFile} />
          </Form.Group>

          {preview && <img src={preview} alt="Preview" style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "1rem" }} />}

          <Button type="submit" className="d-block w-100">Add Doctor</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Create;
