import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "./DepartmentDetails.css";
import doctor from "../Images/doctor.PNG";

const DepartmentDetails = () => {
    const { id } = useParams(); // Ky 'id' vjen nga /department/pediatric (psh. id = "pediatric")
    const [doctors, setDoctors] = useState([]);
    const [deptData, setDeptData] = useState(null); // Shtohet kjo për të mbajtur të dhënat nga DB
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Merr informacionin e departamentit specifik nga DB
                const deptRes = await axios.get(`http://localhost:5000/api/departments/${id}`);
                setDeptData(deptRes.data);

                // 2. Merr të gjithë doktorët nga DB
                const docRes = await axios.get("http://localhost:5000/api/doctors");
                console.log("Te dhenat e doktoreve nga DB:", docRes.data);

                // 3. Filtro doktorët sipas departamentit aktual
                const filtered = docRes.data.filter(doc => {
                    if (!doc.department) return false;
                    return doc.department.toLowerCase().trim() === id.toLowerCase().trim();
                });

                setDoctors(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error gjatë tërheqjes së të dhënave:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Nëse nuk ka mbaruar ende loading-u, ose nëse departamenti nuk ekziston në DB
    if (loading) {
        return <Container className="py-5 text-center"><p>Loading department data...</p></Container>;
    }

    // Nëse kërkesa mbaroi por nuk u gjet asnjë departament në DB
    if (!deptData) {
        return (
            <Container className="py-5 text-center">
                <h3>Department not found</h3>
                <p className="text-muted">Ju lutem sigurohuni që Admini e ka shtuar këtë departament në databazë.</p>
            </Container>
        );
    }

    return (
        <div className="dept-details-page">
            <Container className="py-5">
                <Row className="align-items-center">
                    <Col lg={6}>
                        {/* Tani të dhënat merren në mënyrë dinamike nga deptData */}
                        <h1 className="dept-main-title">{deptData.title}</h1>
                        <p className="dept-main-desc text-muted">{deptData.desc}</p>

                        {/* Karta e Doktorëve të Disponueshëm */}
                        <div className="available-doctor-card shadow-sm p-4 bg-white rounded-4 mt-4">
                            <h5 className="mb-4 border-bottom pb-2">Available Doctors</h5>
                            {doctors.length > 0 ? (
                                doctors.map((doc) => (
                                    <div key={doc._id} className="d-flex align-items-center mb-3">
                                        <Image
                                            src={doc.image ? `http://localhost:5000/Images/${doc.image}` : doctor}
                                            roundedCircle
                                            style={{ width: "55px", height: "55px", objectFit: "cover", marginRight: "15px" }}
                                            onError={(e) => { e.target.src = doctor; }} // fallback nëse dështon fotoja e DB-së
                                        />
                                        <div>
                                            <h6 className="mb-0 fw-bold text-primary">{doc.username}</h6>
                                            <small className="text-muted">{doc.specialty}</small>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No doctors found for this department.</p>
                            )}
                        </div>
                    </Col>

                    <Col lg={6} className="mt-4 mt-lg-0">
                        <div className="dept-image-container">
                            {/* Mund ta bësh edhe foton e madhe dinamike nëse i ruan në backend, për momentin po e mbajmë 'doctor' siç e kishir vënë ti */}
                            <img src={doctor} alt={id} className="img-fluid rounded-5 shadow" />
                        </div>
                    </Col>
                </Row>

                {/* Seksioni i Trajtimeve (Treatments) */}
                {/* Seksioni i Trajtimeve (Tani 100% Dinamik) */}
                <div className="mt-5 pt-5">
                    <h6 className="text-primary fw-bold text-uppercase">More Type of</h6>
                    <h2 className="fw-bold mb-4">Treatments</h2>

                    <Row className="g-4">
                        {deptData.treatments && deptData.treatments.length > 0 ? (
                            deptData.treatments.map((treatment, idx) => (
                                <Col md={3} key={treatment._id || idx}>
                                    <div className="treatment-box p-4 text-center h-100 shadow-sm border rounded-4 bg-white">
                                        <h6 className="fw-bold text-primary">{treatment.name}</h6>
                                        <p className="small text-muted mb-0">{treatment.desc}</p>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <p className="text-muted ps-3">No treatments added for this department yet.</p>
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default DepartmentDetails;