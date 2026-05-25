import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./FindDoctor.css";
import background_Doctor from "../Images/findDoc1.PNG";

const FindDoctor = () => {
  const [filter, setFilter] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = ["All", "Emergency", "Pediatric", "Cardiology", "Ophthalmology", "Neurology"];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase() || "";
    if (filter !== "All" && doc.department !== filter) return false;
    if (searchQuery !== "") {
      return doc.username.toLowerCase().includes(searchQuery) ||
        doc.department.toLowerCase().includes(searchQuery) ||
        doc.specialty?.toLowerCase().includes(searchQuery);
    }
    return true;
  });

  return (
    <div className="find-doctor-page">
      <section className="doctor-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Introduce You to <br /> <span>Our Experts</span></h1>
              <p className="hero-subtitle">The list of certified doctors with years of professional experiences.</p>
            </Col>
            <Col md={6} className="text-end">
              <img src={background_Doctor} alt="Hero" className="hero-doctor-img" style={{ maxWidth: "100%" }} />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        <div className="filter-container d-flex align-items-center">
          <span className="me-3 fw-bold">Sort by:</span>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button key={cat} className={filter === cat ? "btn-filter active" : "btn-filter"} onClick={() => setFilter(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        <Row className="mt-4 g-4">
          {filteredDoctors.map((doc) => (
            <Col key={doc._id} md={4} className="d-flex align-items-stretch">
              <Card className="doctor-card h-100 w-100 shadow-sm border-0">
                <div className="doctor-img-container">
                  <Card.Img
                    variant="top"
                    src={doc.image ? `http://localhost:5000/Images/${doc.image}` : background_Doctor}
                    className="doctor-image"
                    onError={(e) => { e.target.src = background_Doctor; }}
                  />
                  <div className="dept-badge">{doc.department} Department</div>
                </div>
                <Card.Body className="text-center d-flex flex-column">
                  <Card.Title className="dr-name">{doc.username}</Card.Title>
                  <Card.Text className="dr-specialty text-primary">{doc.specialty}</Card.Text>
                  {doc.description && (
                    <Card.Text className="text-muted small">{doc.description}</Card.Text>
                  )}
                  <Button variant="primary" className="mt-auto mb-3 fw-bold" onClick={() => navigate(`/doctor-schedule/${doc._id}`)}>
                    Book Appointment
                  </Button>
                  <div className="social-icons">
                    <FaFacebook className="me-2" /> <FaLinkedin className="me-2" /> <FaTwitter />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FindDoctor;