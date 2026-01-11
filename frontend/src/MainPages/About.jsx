import React from "react";
import { useNavigate } from "react-router-dom"; 
import { Container, Row, Col } from "react-bootstrap";
import "./About.css";
import about from "../Images/1about.jpg";
import { FaCalendarAlt, FaStethoscope, FaHeart, FaBrain, FaUsers, FaEye, FaWheelchair } from "react-icons/fa";
import about1 from "../Images/3about.PNG";
const About = () => {
  const navigate = useNavigate();

  const department = [
    {
      id: "emergency",
      icon: <FaCalendarAlt />,
      title: "Emergency Department",
      desc: "This department provides immediate medical care to patients with acute illnesses or injuries.",
    },
    {
      id: "pediatric",
      icon: <FaStethoscope />,
      title: "Pediatric Department",
      desc: "Specialized care for infants, children, and adolescents.",
    },
    {
      id: "cardiology",
      icon: <FaHeart />,
      title: "Cardiology Department",
      desc: "Expert care for heart-related conditions and cardiovascular health.",
    },
    {
      id: "ophthalmology",
      icon: <FaEye />,
      title: "Ophthalmology Department",
      desc: "Comprehensive eye care and vision correction services.",
    },
    {
      id: "neurology",
      icon: <FaBrain />,
      title: "Neurology Department",
      desc: "Diagnosis and treatment of disorders of the nervous system.",
    },
    {
      id: "occupationalTherapy",
      icon: <FaUsers />,
      title: "Occupational Therapy",
      desc: "Helping patients regain daily living skills through therapy.",
    }, // Added missing comma here
    {
      id: "physicalTherapy",
      icon: <FaWheelchair />,
      title: "Physical Therapy Department",
      desc: "Rehabilitation services to improve movement and manage pain.",
    }
  ];

  return (
    <div className="about-page-wrapper" style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <div
        className="about-top d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          backgroundImage: `url(${about})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh',
          color: 'white',
          padding: '20px'
        }}
      >
        <h1 className="about-top-text" >
          Get to Know <br /> ProHealth Departments
        </h1>
        <p className="about-text">
          At ProHealth, we offer a wide range of medical and healthcare services <br />
          designed to meet your individual needs and help you achieve optimal health.
        </p>
      </div>

      {/* Departments Grid */}
      <Container className="my-5">
        <Row className="g-4">
          {department.map((item) => (
            <Col key={item.id} xs={12} md={6} lg={4}>
              <div
                className="dept-item p-4 text-center shadow-sm h-100"
                onClick={() => navigate(`/department/${item.id}`)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  transition: 'transform 0.3s'
                }}
              >
                <div className="dept-icon-box mb-3" style={{ fontSize: '2.5rem', color: '#007bff' }}>
                  {item.icon}
                </div>
                <h3 className="dept-title">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
                <div className="dept-arrow-btn">
                  <span>→</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="about-footer-container">
  <div className="about-footer-content">
    {/* Pjesa e Imazhit */}
    <div className="footer-image-side">
      <img src={about1} alt="Medical Professional" className="nurse-img" />
    </div>

    {/* Pjesa e Tekstit */}
    <div className="footer-text-side">
      <h2 className="footer-title">
        Don't Let Your Health <br /> <span>Take a Backseat!</span>
      </h2>
      <p className="footer-subtitle">
        Schedule an appointment with one of our <br /> 
        experienced medical professionals today!
      </p>
    </div>
  </div>
  
  {/* Logoja në qendër poshtë (si në foto) */}
  {/* <div className="footer-logo-badge">
    <div className="logo-shield">
       <FaHeart className="shield-icon" /> 
       <span>ProHealth</span>
    </div>
  </div> */}
</div>
    </div>
  );
};

export default About;