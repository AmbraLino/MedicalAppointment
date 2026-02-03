import React from "react";
import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const AdminProp = ({ _id, name, description, photo }) => {
  const { id } = useParams();
  const navItem = useNavigate();
  const [element, setElement] = useState({});
  
  const handleDelete = async (id) => {
    await axios
      .delete("http://localhost:5000/deleteOneProduct/" + id)
      .then((res) => {
        navItem("/");
      })
      .catch((err) => console.log("Not deleted" + err));
  };

  return (
    <Card className="h-100 shadow-lg border-0 rounded-4">
      <div className="overflow-hidden rounded-top-4">
        <Card.Img
          variant="top"
          src={`http://localhost:5000/images/${photo}`}
          className="img-fluid object-fit-cover"
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold text-center mb-3">{name}</Card.Title>
        <Card.Text className="text-muted text-center flex-grow-1">
          {description}
        </Card.Text>

        <Button
          as={Link}
          to={`/updateOne/${_id}`}
          variant="warning"
          className="px-5 py-2 rounded fw-bold"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(_id)}
          className="px-5 py-2 rounded fw-bold"
        >
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AdminProp;
