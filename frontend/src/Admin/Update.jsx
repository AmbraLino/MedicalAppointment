import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
// import "./Update.css";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    specialty: "",
    department: "",
    image: "",
    description: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors`);
        const currentDoctor = res.data.find((d) => d._id === id);
        if (currentDoctor) setDoctor(currentDoctor);
      } catch (err) {
        console.log("Could not fetch doctor:", err);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) =>
    setDoctor({ ...doctor, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDoctor({ ...doctor, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(doctor).forEach((key) => {
      if (key === "image" && doctor.image instanceof File) {
        formData.append("image", doctor.image);
      } else if (key !== "image") {
        formData.append(key, doctor[key]);
      }
    });

    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Doctor updated successfully!");
      navigate("/admin/doctors");
    } catch (err) {
      console.log("Error updating doctor:", err.response?.data || err);
    }
  };

  return (
    <Container className="create-container d-flex align-items-center justify-content-center">
      <Card className="shadow-lg create-card p-4">
        <h2 className="text-center mb-4">Update Doctor</h2>
        <Form onSubmit={handleUpdate} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={doctor.name} onChange={handleChange} />
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
            <Form.Control as="textarea" rows={3} name="description" value={doctor.description} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleFile} />
          </Form.Group>

          {preview ? (
            <img src={preview} alt="Preview" style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "1rem" }} />
          ) : doctor.image ? (
            <img src={doctor.image} alt="Current" style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "1rem" }} />
          ) : null}

          <Button type="submit" className="d-block w-100">Update Doctor</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Update;
