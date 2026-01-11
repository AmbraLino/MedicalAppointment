import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import AdminProp from "./AdminProp"; 

const Read = () => {
  const [infos, setInfos] = useState([]);
  const [search, setSearch] = useState(""); 

  useEffect(() => {
    const dbInfos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reads");
        setInfos(res.data);
      } catch (err) {
        console.log("Nuk u lexua: " + err);
      }
    };
    dbInfos();
  }, []);

//filtrimi i te dhenave to be easy per adminin 
  const filteredInfos = infos.filter((info) =>
    info.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="my-4">
      <h2 className="mb-3">Produktet</h2>
      <Form.Group className="mb-4" controlId="searchProducts">
        <Form.Control type="text" placeholder="Kerko..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Form.Group>

      <Row>
        {filteredInfos.length > 0 ? (
          filteredInfos.map((info) => (
            <Col key={info._id} md={2} className="mb-4">
              <AdminProp {...info} />
            </Col>
          ))
        ) : (
          <p>Nuk u gjet asnje produkt</p>
        )}
      </Row>
    </Container>
  );
};

export default Read;
