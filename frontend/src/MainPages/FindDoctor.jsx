import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./FindDoctor.css";
// Sigurohu që i ke imazhet në folderin tend
import background_Doctor from "../Images/findDoc1.PNG"; 
import drLisa from "../Images/dr_lisa.jpg";
import drMichael from "../Images/dr_michael.jpg";
import drLaren from "../Images/dr_laren.PNG";
import drPaul from "../Images/dr_paul.jpg";
import drLauren from "../Images/dr_lauren.PNG";
import drAnna from "../Images/dr_anna.PNG";
const FindDoctor = () => {
  const [filter, setFilter] = useState("All");

  const doctors = [
    {
      id: 1,
      name: "Dr. Lisa Chen, MD",
      specialty: "Ophthalmology Specialist",
      dept: "Ophthalmology",
      image: drLisa,
      desc: "Dr. Chen has over 10 years of experience in emergency medicine and is board certified in emergency medicine."
    },
    {
      id: 2,
      name: "Dr. Michael Johnson, MD",
      specialty: "Emergency Medicine Specialist",
      dept: "Emergency",
      image: drMichael,
      desc: "Dr. Johnson is a highly experienced emergency medicine physician with over 15 years of experience."
    },
    {
      id: 3,
      name: "Dr. Laren Lee, MD",
      specialty: "Cardiology Specialist",
      dept: "Cardiology",
      image: drLaren,
      desc: "Dr. Lee is a skilled emergency medicine physician with expertise in the treatment of acute medical illnesses."
    },
     {
      id: 4,
      name: "Dr. Paul Brown, MD",
      specialty: "Pediatric Specialist",
      dept: "Pediatric",
      image: drPaul,
      desc: "Dr. Brown is a skilled emergency medicine physician with expertise in the treatment of acute medical illnesses."
    },
     {
      id: 5,
      name: "Dr. Lauren Peggy, MD",
      specialty: "Emergency Medicine Specialist",
      dept: "Emergency",
      image: drLauren,
      desc: "Dr. Lauren is a skilled emergency medicine physician with expertise in the treatment of acute medical illnesses."
    },
     {
      id: 6,
      name: "Dr. Anna Riviera, MD",
      specialty: "Neurology Specialist",
      dept: "Neurology",
      image: drAnna,
      desc: "Dr. Anna is a skilled emergency medicine physician with expertise in the treatment of acute medical illnesses."
    },
  ];

  const categories = ["All", "Emergency", "Pediatric", "Cardiology", "Ophthalmology", "Neurology"];

  const filteredDoctors = filter === "All" 
    ? doctors 
    : doctors.filter(doc => doc.dept === filter);

  return (
    <div className="find-doctor-page">
      {/* HERO SECTION */}
      <section className="doctor-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Introduce You to <br /> <span>Our Experts</span></h1>
              <p className="hero-subtitle">
                The list of certified doctors with years of professional experiences.
              </p>
            </Col>
            <Col md={6} className="text-end position-relative">
              <img src={background_Doctor} alt="Doctor" className="hero-doctor-img" />
              {/* <div className="floating-card">
                <div className="icon-box">👨‍⚕️</div>
                <div>
                  <strong>24 Hour Doctors</strong>
                  <p>can help your needs</p>
                </div>
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>

      {/* FILTER SECTION */}
      <Container className="my-5">
        <div className="filter-container">
          <span>Sort by:</span>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={filter === cat ? "btn-filter active" : "btn-filter"}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* DOCTORS GRID */}
        <Row className="mt-4 g-4">
          {filteredDoctors.map((doc) => (
            <Col key={doc.id} md={4}>
              <Card className="doctor-card">
                <div className="doctor-img-container">
                  <Card.Img variant="top" src={doc.image} />
                  <div className="dept-badge">{doc.dept} Department</div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="dr-name">{doc.name}</Card.Title>
                  <p className="dr-specialty">{doc.specialty}</p>
                  <Card.Text className="dr-desc">{doc.desc}</Card.Text>
                  <div className="social-icons">
                    <FaFacebook /> <FaLinkedin /> <FaTwitter />
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