import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Card, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ReadOne = () => {
  const { id } = useParams();
  const [element, setElement] = useState({});
  const [reserveShow, setReserveShow] = useState(false);

  const [reserveData, setReserveData] = useState({
    date: "",
    time: "",
    message: ""
  });

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await axios.get("http://localhost:5000/product/readOneProduct/" + id);
        setElement(res.data);
      } catch (err) {
        console.log("Not read " + err);
      }
    };
    fetchOne();
  }, [id]);

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/order/create",
        {
          productId: element._id,
          date: reserveData.date,
          time: reserveData.time,
          message: reserveData.message
        },
        { withCredentials: true }
      );

      alert("Rezervimi u krijua me sukses!");
      setReserveShow(false);
      setReserveData({ date: "", time: "", message: "" });
    } catch (err) {
      console.log("Gabim gjate rezervimit:", err.response?.data || err);
    }
  };

  return (
    <div style={{ backgroundColor: "#d7dde4" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={4} className="mb-4">
            <Card className="border-0 overflow-hidden">
              <Card.Img
                variant="top"
                src={`http://localhost:5000/images/${element.photo}`}
                className="img-fluid object-fit-cover rounded-3"
              />
            </Card>
          </Col>

          <Col md={8}>
            <Card className="border-0 rounded-4 p-4 h-100 d-flex flex-column justify-content-between"
              style={{ backgroundColor: "#d7dde4" }}>
              <div>
                <Card.Title className="fw-bold fs-1 text-left mb-4">
                  {element.name}
                </Card.Title>

                <Card.Text className="text-muted fs-5"
                  style={{ lineHeight: "1.6rem", maxHeight: "12rem", overflow: "auto" }}>
                  {element.description}
                </Card.Text>

                <Card.Text className="text-left fs-1 fw-bold">
                  €{element.price}
                </Card.Text>
              </div>

              <div className="d-flex justify-content-left gap-3 mt-4">
                <Button
                  variant="success"
                  className="px-4 py-2"
                  onClick={() => setReserveShow(true)}
                >
                  Rezervo me agjent
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={reserveShow} onHide={() => setReserveShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rezervo: {element.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReserve}>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={reserveData.date}
                onChange={(e) =>
                  setReserveData({ ...reserveData, date: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ora</Form.Label>
              <Form.Control
                type="time"
                value={reserveData.time}
                onChange={(e) =>
                  setReserveData({ ...reserveData, time: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mesazhi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Shkruani një mesazh (opsionale)"
                value={reserveData.message}
                onChange={(e) =>
                  setReserveData({ ...reserveData, message: e.target.value })
                }
              />
            </Form.Group>

            <Button type="submit" className="btn-success">
              Rezervo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReadOne;
