import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminCreateDepartment = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  
  // 1. SHTOHET STATE PËR IKONËN (Fillon plotësisht bosh siç e kërkove)
  const [icon, setIcon] = useState(""); 
  
  // Fillon me një fushë trajtimi bosh
  const [treatments, setTreatments] = useState([{ name: "", desc: "" }]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Funksion për të ndryshuar vlerat e një trajtimi specifik
  const handleTreatmentChange = (index, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[index][field] = value;
    setTreatments(newTreatments);
  };

  // Shto një rresht të ri trajtimi në formë
  const addTreatmentField = () => {
    setTreatments([...treatments, { name: "", desc: "" }]);
  };

  // Hiq një rresht trajtimi
  const removeTreatmentField = (index) => {
    const newTreatments = treatments.filter((_, i) => i !== index);
    setTreatments(newTreatments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. SHTOHET 'icon' TEK OBJEKTI QË DËRGOHET NË BACKEND
    const finalData = { 
      id: id.trim().toLowerCase(), 
      title: title, 
      desc: desc, 
      icon: icon.trim(), // <--- KJO DUHET TË ISHTE KËTU!
      treatments: treatments 
    };

    try {
      await axios.post("http://localhost:5000/api/departments", finalData, { withCredentials: true });
      setMessage("Department and treatments added successfully!");
      setTimeout(() => navigate("/admin/departments"), 2000);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "700px" }}>
      <h3>Add New Department</h3>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="mb-3">
          <Form.Label>URL ID (e.g., pediatric)</Form.Label>
          <Form.Control type="text" onChange={(e) => setId(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department Title</Form.Label>
          <Form.Control type="text" onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>

        {/* 3. INPUT-I I RI PËR IKONËN (I pastër dhe i lidhur me state-in) */}
        <Form.Group className="mb-3">
          <Form.Label>Icon Name (e.g., FaHeart, FaStethoscope, FaBrain)</Form.Label>
          <Form.Control 
            type="text" 
            value={icon} 
            onChange={(e) => setIcon(e.target.value)} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={(e) => setDesc(e.target.value)} required />
        </Form.Group>

        <hr />
        <h5>Treatments</h5>
        {treatments.map((treatment, index) => (
          <Row key={index} className="mb-3 align-items-end border p-2 rounded bg-light">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Treatment Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={treatment.name} 
                  onChange={(e) => handleTreatmentChange(index, "name", e.target.value)} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Treatment Description</Form.Label>
                <Form.Control 
                  type="text" 
                  value={treatment.desc} 
                  onChange={(e) => handleTreatmentChange(index, "desc", e.target.value)} 
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              {treatments.length > 1 && (
                <Button variant="danger" size="sm" onClick={() => removeTreatmentField(index)}>Remove</Button>
              )}
            </Col>
          </Row>
        ))}
        <Button variant="secondary" size="sm" className="mb-4" onClick={addTreatmentField}>
          + Add More Treatment
        </Button>

        <br />
        <Button variant="primary" type="submit" className="w-100">Save </Button>
      </Form>
    </Container>
  );
};

export default AdminCreateDepartment;