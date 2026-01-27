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

  const categories = [
    "All",
    "Emergency",
    "Pediatric",
    "Cardiology",
    "Ophthalmology",
    "Neurology",
  ];

//getting doctors nga backendi
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

 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase();

    if (searchQuery) {
      const matchedCategory = categories.find(
        (cat) => cat.toLowerCase() === searchQuery
      );
      setFilter(matchedCategory || "All");
    }
  }, [location]);

  
  const filteredDoctors = doctors.filter((doc) => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase() || "";

    if (filter !== "All") return doc.department === filter;

    if (searchQuery !== "") {
      return (
        doc.name.toLowerCase().includes(searchQuery) ||
        doc.department.toLowerCase().includes(searchQuery)
      );
    }

    return true;
  });

  const handleFilterClick = (cat) => {
    setFilter(cat);
    navigate("/finddoctor", { replace: true });
  };

  return (
    <div className="find-doctor-page">

      <section className="doctor-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">
                Introduce You to <br /> <span>Our Experts</span>
              </h1>
              <p className="hero-subtitle">
                The list of certified doctors with years of professional experiences.
              </p>
            </Col>
            <Col md={6} className="text-end">
              <img
                src={background_Doctor}
                alt="Hero"
                className="hero-doctor-img"
                style={{ maxWidth: "100%" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* FILTERS */}
      <Container className="my-5">
        <div className="filter-container d-flex align-items-center">
          <span className="me-3 fw-bold">Sort by:</span>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "btn-filter active" : "btn-filter"}
                onClick={() => handleFilterClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* DOCTORS GRID */}
        <Row className="mt-4 g-4">
          {filteredDoctors.map((doc) => (
            <Col key={doc._id} md={4} className="d-flex align-items-stretch">
              <Card className="doctor-card h-100 w-100 shadow-sm border-0">
                <div className="doctor-img-container">
                  <Card.Img
                    variant="top"
                    src={doc.image}
                    className="doctor-image"
                  />
                  <div className="dept-badge">
                    {doc.department} Department
                  </div>
                </div>

                <Card.Body className="text-center d-flex flex-column">
                  <Card.Title className="dr-name">{doc.name}</Card.Title>
                  <p className="dr-specialty text-primary">
                    {doc.specialty}
                  </p>

                  <Card.Text className="dr-desc text-muted small">
                    {doc.description}
                  </Card.Text>

                 <Button
  variant="primary"
  className="mt-auto mb-3 fw-bold"
  onClick={() => navigate(`/doctor-schedule/${doc._id}`)}
>
  Book Appointment
</Button>


                  <div className="social-icons">
                    <FaFacebook className="me-2" />
                    <FaLinkedin className="me-2" />
                    <FaTwitter />
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
