import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Nav, Button, Form } from "react-bootstrap";
import { useNavigate ,useLocation} from "react-router-dom";
import "./Categories.css";

const Categories = () => {
  const navigate = useNavigate();
 const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 9999]);
  const [locationFilter, setLocationFilter] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromQuery = params.get("category");
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery.toLowerCase());
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/product/reads");
        const items = res.data || [];
        setAllProducts(items);
        setProducts(items);

        const uniqueCategories = [...new Set(items.map((i) => i.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.log("Gabim:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (locationFilter.trim() !== "") {
      filtered = filtered.filter((p) =>
        (p.vendndodhja || "").toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (areaMin) filtered = filtered.filter((p) => (p.siperfaqja || 0) >= Number(areaMin));
    if (areaMax) filtered = filtered.filter((p) => (p.siperfaqja || 0) <= Number(areaMax));

    setProducts(filtered);
  }, [selectedCategory, priceRange, locationFilter, areaMin, areaMax, allProducts]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 9999]);
    setLocationFilter("");
    setAreaMin("");
    setAreaMax("");
  };

  return (
    <>
      <Nav variant="tabs" className="mt-3 justify-content-start">
        <Nav.Item>
          <Nav.Link
            active={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          >
            Të gjitha
          </Nav.Link>
        </Nav.Item>

        {/* {categories.map((cat) => (
          <Nav.Item key={cat}>
            <Nav.Link
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav> */}

      {categories
          .filter((cat) => allProducts.some((p) => p.category === cat))
          .map((cat) => (
            <Nav.Item key={cat}>
              <Nav.Link
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>

      <Row className="mt-4">
        <Col md={3}>
          <div className="p-3 border rounded shadow-sm bg-light filters-box">
            <h5 className="mb-3 text-success fw-bold">Filtra</h5>

            <div className="mb-4">
              <label className="fw-bold d-block mb-1">Çmimi (€)</label>
              <small className="text-muted d-block mb-2">
                {priceRange[0]}€ - {priceRange[1]}€
              </small>

              <input
                type="range"
                min="0"
                max="9999"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-100 mb-2"
              />

              <input
                type="range"
                min="0"
                max="9999"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-100"
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold d-block mb-1">Vendndodhja</label>
              <Form.Control
                type="text"
                placeholder="Qyteti..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold d-block mb-1">Sipërfaqja (m²)</label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                />
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={areaMax}
                  onChange={(e) => setAreaMax(e.target.value)}
                />
              </div>
            </div>

            <Button variant="outline-success" className="mt-2 w-100" onClick={resetFilters}>
              Pastro filtrat
            </Button>
          </div>
        </Col>

        <Col md={9}>
          <Row className="mt-2">
            {products.length > 0 ? (
               [...new Set(products.map((p) => p.category))].map((cat) => (
              // products.map((item) => (
                // <Col md={12} key={item._id} className="mb-4">
                 <Col md={6} key={cat} className="mb-3">
                  <h4 className="mb-3">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                  <Row>
                    {products
                      .filter((p) => p.category === cat)
                      .map((item) => (
                        <Col md={12} key={item._id} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm card-horizontal d-flex flex-column">
                    {item.photo && (
                      <Card.Img
                        src={`http://localhost:5000/Images/${item.photo}`}
                        className="card-img-left"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>

                      <Card.Text>
                        <strong>Çmimi:</strong> {item.price} €
                      </Card.Text>

                      {item.description && (
                        <Card.Text>
                          <strong>Përshkrimi:</strong> {item.description}
                        </Card.Text>
                      )}

                      {item.siperfaqja !== undefined && (
                        <Card.Text>
                          <strong>Sipërfaqja:</strong> {item.siperfaqja} m²
                        </Card.Text>
                      )}

                      {item.vendndodhja && (
                        <Card.Text>
                          <strong>Vendndodhja:</strong> {item.vendndodhja}
                        </Card.Text>
                      )}

                      <Button
                        className="btn-reserve"
                        onClick={() => navigate(`/readOne/${item._id}`)}
                      >
                        Shiko Detajet / Rezervo
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              </Row>
            </Col>
               ))
            ) : (
              <p className="text-muted">Asnjë produkt nuk u gjet.</p>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Categories;
