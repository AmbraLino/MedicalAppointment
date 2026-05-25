// import React from "react";
// import { useNavigate } from "react-router-dom"; 
// import { Container, Row, Col } from "react-bootstrap";
// import "./About.css";
// import about from "../Images/1about.jpg";
// import { FaCalendarAlt, FaStethoscope, FaHeart, FaBrain, FaUsers, FaEye, FaWheelchair } from "react-icons/fa";
// import about1 from "../Images/3about.PNG";
// const About = () => {
//   const navigate = useNavigate();

//   const department = [
//     {
//       id: "emergency",
//       icon: <FaCalendarAlt />,
//       title: "Emergency Department",
//       desc: "This department provides immediate medical care to patients with acute illnesses or injuries.",
//     },
//     {
//       id: "pediatric",
//       icon: <FaStethoscope />,
//       title: "Pediatric Department",
//       desc: "Specialized care for infants, children, and adolescents.",
//     },
//     {
//       id: "cardiology",
//       icon: <FaHeart />,
//       title: "Cardiology Department",
//       desc: "Expert care for heart-related conditions and cardiovascular health.",
//     },
//     {
//       id: "ophthalmology",
//       icon: <FaEye />,
//       title: "Ophthalmology Department",
//       desc: "Comprehensive eye care and vision correction services.",
//     },
//     {
//       id: "neurology",
//       icon: <FaBrain />,
//       title: "Neurology Department",
//       desc: "Diagnosis and treatment of disorders of the nervous system.",
//     },
//     {
//       id: "occupationalTherapy",
//       icon: <FaUsers />,
//       title: "Occupational Therapy",
//       desc: "Helping patients regain daily living skills through therapy.",
//     },
//     {
//       id: "physicalTherapy",
//       icon: <FaWheelchair />,
//       title: "Physical Therapy Department",
//       desc: "Rehabilitation services to improve movement and manage pain.",
//     }
//   ];

//   return (
//     <div className="about-page-wrapper" style={{ overflowX: 'hidden' }}>
//       <div
//         className="about-top d-flex flex-column justify-content-center align-items-center text-center"
//         style={{
//           backgroundImage: `url(${about})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           width: '100%',
//           height: '100vh',
//           color: 'white',
//           padding: '20px'
//         }}
//       >
//         <h1 className="about-top-text" >
//           Get to Know <br /> ProHealth Departments
//         </h1>
//         <p className="about-text">
//           At ProHealth, we offer a wide range of medical and healthcare services <br />
//           designed to meet your individual needs and help you achieve optimal health.
//         </p>
//       </div>


//       <Container className="my-5">
//         <Row className="g-4">
//           {department.map((item) => (
//             <Col key={item.id} xs={12} md={6} lg={4}>
//               <div
//                 className="dept-item p-4 text-center shadow-sm h-100"
//                 onClick={() => navigate(`/department/${item.id}`)}
//                 style={{
//                   cursor: 'pointer',
//                   border: '1px solid #eee',
//                   borderRadius: '10px',
//                   transition: 'transform 0.3s'
//                 }}
//               >
//                 <div className="dept-icon-box mb-3" style={{ fontSize: '2.5rem', color: '#007bff' }}>
//                   {item.icon}
//                 </div>
//                 <h3 className="dept-title">{item.title}</h3>
//                 <p className="text-muted">{item.desc}</p>
//                 <div className="dept-arrow-btn">
//                   <span>→</span>
//                 </div>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//       <div className="about-footer-container">
//   <div className="about-footer-content">

//     <div className="footer-image-side">
//       <img src={about1} alt="Medical Professional" className="nurse-img" />
//     </div>

//     <div className="footer-text-side">
//       <h2 className="footer-title">
//         Don't Let Your Health <br /> <span>Take a Backseat!</span>
//       </h2>
//       <p className="footer-subtitle">
//         Schedule an appointment with one of our <br /> 
//         experienced medical professionals today!
//       </p>
//     </div>
//   </div>
// </div>
//     </div>
//   );
// };

// export default About;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import "./About.css";
import about from "../Images/1about.jpg";
import about1 from "../Images/3about.PNG";

// IMPORTON TË GJITHA IKONAT SI OBJEKT (Asnjë ikonë nuk është hardcoded këtu)
import * as FontAwesome from "react-icons/fa";

const About = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Tërheqja e të dhënave dinamike nga Databaza
  useEffect(() => {
    axios.get("http://localhost:5000/api/departments")
      .then((res) => {
        setDepartments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gabim gjatë ngarkimit të departamenteve:", err);
        setError("Nuk u mundësua ngarkimi i departamenteve.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="about-page-wrapper" style={{ overflowX: 'hidden' }}>
      {/* Seksioni Hero */}
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
        <h1 className="about-top-text">
          Get to Know <br /> ProHealth Departments
        </h1>
        <p className="about-text">
          At ProHealth, we offer a wide range of medical and healthcare services <br />
          designed to meet your individual needs and help you achieve optimal health.
        </p>
      </div>

      {/* Seksioni Dinamik i Departamentit */}
      <Container className="my-5">
        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Duke ngarkuar departamentet...</p>
          </div>
        )}

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        {!loading && departments.length === 0 && (
          <Alert variant="info" className="text-center">Nuk u gjet asnjë departament në databazë.</Alert>
        )}

        <Row className="g-4">
          {departments.map((dept) => {
            // Kontrollon nëse emri i ikonës që ka shkruar admini ekziston realisht në FontAwesome
            const IconComponent = FontAwesome[dept.icon];

            return (
              <Col key={dept._id} xs={12} md={6} lg={4}>
                <div
                  className="dept-item p-4 text-center shadow-sm h-100"
                  onClick={() => navigate(`/department/${dept.id}`)}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #eee',
                    borderRadius: '10px',
                    transition: 'transform 0.3s'
                  }}
                >
                  <div className="dept-icon-box mb-3" style={{ fontSize: '2.5rem', color: '#007bff', minHeight: '3rem' }}>
                    {/* Shfaqet ikona vetëm nëse admini e ka shkruar saktë tek inputi */}
                    {IconComponent ? <IconComponent /> : <div style={{ height: "40px" }}></div>}
                  </div>
                  <h3 className="dept-title">{dept.title}</h3>
                  <p className="text-muted dept-description">{dept.desc}</p>
                  <div className="dept-arrow-btn">
                    <span>→</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* Seksioni i Footer-it */}
      <div className="about-footer-container">
        <div className="about-footer-content">
          <div className="footer-image-side">
            <img src={about1} alt="Medical Professional" className="nurse-img" />
          </div>

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
      </div>
    </div>
  );
};

export default About;