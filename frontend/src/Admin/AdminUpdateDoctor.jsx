import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col, Card, Spinner } from "react-bootstrap";

const AdminUpdateDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    specialty: "",
    bio: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      // Mbrojtje: nese ID vjen si string ":id" mos bej kerkese
      if (!id || id.startsWith(":")) {
        setError("ID invalide. Ju lutem kthehuni te lista.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/admin/doctors/${id}`, { withCredentials: true });
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          password: "", 
          department: res.data.department || "",
          specialty: res.data.specialty || "",
          bio: res.data.bio || ""
        });
        setLoading(false);
      } catch (err) {
        setError("Gabim: Nuk u gjet ky doktor në sistem.");
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("department", formData.department);
    data.append("specialty", formData.specialty);
    data.append("bio", formData.bio);
    if (formData.password) data.append("password", formData.password);
    if (image) data.append("image", image);

    try {
      await axios.put(`http://localhost:5000/admin/update/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin/doctors"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjatë përditësimit.");
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white py-3">
          <h5 className="mb-0">Përditëso Profilin: {formData.username}</h5>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Të dhënat u ruajtën!</Alert>}

          <Form onSubmit={handleUpdate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Emri</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Departamenti</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Foto e Re (Opsionale)</Form.Label>
                  <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => navigate("/admin/doctors")}>Anulo</Button>
              <Button variant="primary" type="submit">Ruaj Ndryshimet</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminUpdateDoctor;