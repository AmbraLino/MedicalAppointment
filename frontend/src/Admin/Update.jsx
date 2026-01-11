import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./Update.css";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [element, setElement] = useState({
    name: "",
    description: "",
    siperfaqja: "",
    vendndodhja: "",
    price: "",
    photo: "",
  });

  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/product/readOneProduct/${id}`);
        // setElement(res.data);
        setElement({
        name: res.data.name || "",
        category: res.data.category || "",  // siguro vlerë
        description: res.data.description || "",
        siperfaqja: res.data.siperfaqja || "",
        vendndodhja: res.data.vendndodhja || "",
        price: res.data.price || "",
        photo: res.data.photo || "",
      });
      } catch (err) {
        console.log("Nuk u lexua: " + err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setElement({ ...element, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setElement({ ...element, photo: file });
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", element.name);
    formData.append("description", element.description);
    formData.append("siperfaqja", element.siperfaqja);
    formData.append("vendndodhja", element.vendndodhja);
    formData.append("price", element.price);

    if (element.photo instanceof File) {
      formData.append("photo", element.photo);
    }

    try {
      await axios.patch(
        `http://localhost:5000/product/updateProduct/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Produkti u perditesua");
      navigate("/adminPanel");
    } catch (err) {
      console.log("Produkti nuk u perditesua: " + err.response?.data || err);
    }
  };

  return (
    <div className="update-container">
      <div className="update-form">
        <div className="form-left">
          <h1>Perditeso produktin</h1>
          <Form onSubmit={handleUpdate} encType="multipart/form-data">
            <Form.Group className="mb-3" controlId="Name">
              <Form.Label>Emri</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={element.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Photo">
              <Form.Label>Foto</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                accept=".jpg, .png, .jpeg"
                onChange={handleFile}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Price">
              <Form.Label>Cmimi per meter katror</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={element.price || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Description">
              <Form.Label>Përshkrimi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={element.description}
                onChange={handleChange}
                placeholder="Shkruaj përshkrimin"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Siperfaqja">
              <Form.Label>Sipërfaqja</Form.Label>
              <Form.Control
                type="text"
                name="siperfaqja"
                value={element.siperfaqja || ""}
                onChange={handleChange}
                placeholder="P.sh. 120 m²"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Vendndodhja">
              <Form.Label>Vendndodhja</Form.Label>
              <Form.Control
                type="text"
                name="vendndodhja"
                value={element.vendndodhja || ""}
                onChange={handleChange}
                placeholder="P.sh. Tiranë, Shqipëri"
              />
            </Form.Group>

            <Button type="submit">Perditeso</Button>
          </Form>
        </div>

        <div className="form-right">
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded Preview" />
          ) : (
            element.photo && (
              <img
                src={`http://localhost:5000/Images/${element.photo}`}
                alt="Current"
              />
            )
          )}
        </div>
      </div>
    </div>
  ); 
};

export default Update;




