import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditDepartment = () => {
  const { id: urlId } = useParams(); // Marrim id e thjeshtë (psh: pediatric) nga URL
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState(""); // State për ikonën
  const [treatments, setTreatments] = useState([]);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const navigate = useNavigate();

  // Ngarko të dhënat aktuale të departamentit
  useEffect(() => {
    if (!urlId) return;

    axios.get("http://localhost:5000/api/departments")
      .then(res => {
        // Kërkojmë në listë departamentin që ka id ekzaktë sa urlId e faqes
        const current = res.data.find(d => d.id.toLowerCase() === urlId.toLowerCase());
        if (current) {
          setId(current.id);
          setTitle(current.title);
          setDesc(current.desc);
          setIcon(current.icon || ""); // U SHTUA KËTU: Mbush input-in me ikonën ekzistuese nga DB
          setTreatments(current.treatments || []);
        }
      })
      .catch(err => console.error("Error loading department:", err));
  }, [urlId]);

  const handleTreatmentChange = (index, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[index][field] = value;
    setTreatments(newTreatments);
  };

  const addTreatmentField = () => {
    setTreatments([...treatments, { name: "", desc: "" }]);
  };

  const removeTreatmentField = (index) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Përdorim ekzaktë urlId tënde pa asmjë ndryshim emri
      await axios.put(`http://localhost:5000/api/departments/${urlId}`, {
        id: id,
        title: title,
        desc: desc,
        icon: icon, // Dërgohet ikona e përditësuar
        treatments: treatments
      }, { withCredentials: true });

      setVariant("success");
      setMessage("Department updated successfully!");
      setTimeout(() => navigate("/admin/departments"), 1500);
    } catch (err) {
      setVariant("danger");
      setMessage("Error updating: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "700px" }}>
      <h3>Edit Department: {urlId}</h3>
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>URL ID (Kujdes: Nëse e ndryshon këtu, ndryshon URL-ja e faqes)</Form.Label>
          <Form.Control type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>

        {/* INPUT-I I IKONËS: Tani tregon emrin që ka pasur të ruajtur më parë */}
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
          <Form.Control as="textarea" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </Form.Group>

        <hr />
        <h5>Treatments</h5>
        {treatments.map((treatment, index) => (
          <Row key={index} className="mb-3 align-items-end border p-2 rounded bg-light">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={treatment.name} onChange={(e) => handleTreatmentChange(index, "name", e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={treatment.desc} onChange={(e) => handleTreatmentChange(index, "desc", e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="danger" size="sm" onClick={() => removeTreatmentField(index)}>Remove</Button>
            </Col>
          </Row>
        ))}
    
        <Button variant="secondary" size="sm" className="mb-4" onClick={addTreatmentField}>+ Add Treatment</Button>
        
        <Button variant="primary" type="submit" className="w-100">Update Department</Button>
      </Form>
    </Container>
  );
};

export default AdminEditDepartment;