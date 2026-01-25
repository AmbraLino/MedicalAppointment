import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./FindDoctor.css";

// Importet e imazheve (sigurohuni që path-et janë të sakta)
import background_Doctor from "../Images/findDoc1.PNG";
import drLisa from "../Images/dr_lisa.jpg";
import drMichael from "../Images/dr_michael.jpg";
import drLaren from "../Images/dr_laren.PNG";
import drPaul from "../Images/dr_paul.jpg";
import drLauren from "../Images/dr_lauren.PNG";
import drAnna from "../Images/dr_anna.PNG";

const FindDoctor = () => {
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();

  const doctors = [
    { id: 1, name: "Dr. Lisa Chen, MD", specialty: "Ophthalmology Specialist", dept: "Ophthalmology", image: drLisa, desc: "Dr. Chen has over 10 years of experience in medicine." },
    { id: 2, name: "Dr. Michael Johnson, MD", specialty: "Emergency Medicine Specialist", dept: "Emergency", image: drMichael, desc: "Dr. Johnson is a highly experienced emergency physician." },
    { id: 3, name: "Dr. Laren Lee, MD", specialty: "Cardiology Specialist", dept: "Cardiology", image: drLaren, desc: "Dr. Lee is a skilled cardiology physician." },
    { id: 4, name: "Dr. Paul Brown, MD", specialty: "Pediatric Specialist", dept: "Pediatric", image: drPaul, desc: "Dr. Brown is a skilled pediatric physician." },
    { id: 5, name: "Dr. Lauren Peggy, MD", specialty: "Emergency Medicine Specialist", dept: "Emergency", image: drLauren, desc: "Dr. Lauren is a skilled emergency physician." },
    { id: 6, name: "Dr. Anna Riviera, MD", specialty: "Neurology Specialist", dept: "Neurology", image: drAnna, desc: "Dr. Anna is a skilled neurology physician." },
  ];

  const categories = ["All", "Emergency", "Pediatric", "Cardiology", "Ophthalmology", "Neurology"];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase();
    if (searchQuery) {
      const matchedCategory = categories.find(cat => cat.toLowerCase() === searchQuery);
      setFilter(matchedCategory || "All");
    }
  }, [location]);

  const filteredDoctors = doctors.filter((doc) => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase() || "";
    if (filter !== "All") return doc.dept === filter;
    if (searchQuery !== "") {
      return doc.name.toLowerCase().includes(searchQuery) || doc.dept.toLowerCase().includes(searchQuery);
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
              <button key={cat} className={filter === cat ? "btn-filter active" : "btn-filter"} onClick={() => handleFilterClick(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Row className="mt-4 g-4">
          {filteredDoctors.map((doc) => (
            <Col key={doc.id} md={4} className="d-flex align-items-stretch">
              <Card className="doctor-card h-100 w-100 shadow-sm border-0">
                <div className="doctor-img-container">
                  <Card.Img variant="top" src={doc.image} className="doctor-image" />
                  <div className="dept-badge">{doc.dept} Department</div>
                </div>
                <Card.Body className="text-center d-flex flex-column">
                  <Card.Title className="dr-name">{doc.name}</Card.Title>
                  <p className="dr-specialty text-primary">{doc.specialty}</p>
                  <Card.Text className="dr-desc text-muted small">{doc.desc}</Card.Text>
                  
                  {/* BUTONI QE DERGON TE ORARI */}
                  <Button 
                    variant="primary" 
                    className="mt-auto mb-3 fw-bold"
                    onClick={() => navigate(`/doctor-schedule/${doc.id}`)}
                  >
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