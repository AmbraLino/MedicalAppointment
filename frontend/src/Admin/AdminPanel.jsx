import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Image, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import './AdminPanel.css';


const AdminPanel = () => {
  const [infos, setInfos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const dbInfos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/product/reads");
        setInfos(res.data);
      } catch (err) {
        console.log("Nuk u lexua: " + err);
      }
    };
    dbInfos();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt qe doni ta fshini kete produkt?")) return;
    try {
      await axios.delete(`http://localhost:5000/product/deleteOneProduct/${id}`);
      setInfos(infos.filter((info) => info._id !== id));
      console.log("Proukti u fshi me sukses");
    } catch (err) {
      console.log("Produkti nuk u fshi: " + err);
    }
  };

  // FILTER
  const filteredInfos = infos.filter((info) =>
    info.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="admin-panel-container ">
      <h1 className="admin-panel-title">Paneli i adminit</h1>

      <div className="d-flex gap-2 mb-3">
        <Link to="/create">
          <Button  style={{ backgroundColor: "#185816ff", borderColor: "#2b0a0aff" }} >Krijo nje produkt te ri</Button>
        </Link>
        <Form.Control
          type="text"
          placeholder="Kerko ketu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "700px" }}
        />
      </div>

      <Table striped bordered hover responsive >
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Emri</th>
            <th>Cmimi</th>
            <th>Veprimet</th>
          </tr>
        </thead>
        <tbody>
          {filteredInfos.length > 0 ? (
            filteredInfos.map((info) => (
              <tr key={info._id}>
                <td>{info._id}</td>
                <td>
                  {info.photo && (
                    <Image
                      src={`http://localhost:5000/Images/${info.photo}`}
                      alt={info.name}
                      thumbnail
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{info.name}</td>
                <td>${info.price}</td>
                <td className="d-flex gap-2">
                  <Link to={`/updateproduct/${info._id}`}>
                    <Button variant="warning">Perditeso</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(info._id)}>
                    Fshi
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nuk u gjet asnje produkt
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
