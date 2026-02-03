import React, { useContext, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Dropdown, Spinner, Button, Navbar, Nav, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import logo from "../Images/logoHealth.PNG";
import { UserContext } from "../Auth/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, loading } = useContext(UserContext);
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", {}, { withCredentials: true });
      setUserInfo(null);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/finddoctor?search=${encodeURIComponent(search.trim())}`);
      setSearch(""); 
    }
  };

  if (loading) {
    return (
      <Navbar expand="lg" style={{ background: "#6386ac" }} variant="dark" className="py-3">
        <Container className="justify-content-center">
          <Spinner animation="border" size="sm" variant="light" />
        </Container>
      </Navbar>
    );
  }

  const isDoctor = userInfo?.role === "doctor";

  return (
    <Navbar expand="lg" style={{ background: "#6386ac" }} variant="dark" className="py-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to={isDoctor ? "/doctorDashboard" : "/"}>
          <img src={logo} alt="ProHealth Logo" width="100px" style={{ borderRadius: "5px" }} />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {!isDoctor && (
              <>
                <Nav.Link as={Link} to="/" className="mx-2" style={{ color: "#FEFAE0" }}>Home</Nav.Link>
                <Nav.Link as={Link} to="/finddoctor" className="mx-2" style={{ color: "#FEFAE0" }}>Find Doctor</Nav.Link>
                <Nav.Link as={Link} to="/about" className="mx-2" style={{ color: "#FEFAE0" }}>About</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="mx-2" style={{ color: "#FEFAE0" }}>Contact</Nav.Link>
                
                <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill ms-lg-3 my-2 my-lg-0" 
                     style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}> 
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" style={{ color: "white" }} /> 
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px", width: "120px" }}
                  />
                </div>
              </>
            )}

            {userInfo ? (
              <Dropdown align="end" className="ms-lg-3">
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="rounded-pill d-flex align-items-center border-0 py-2 shadow-sm">
                  <FaUserCircle size={20} className="me-2 text-primary" /> 
                  <span className="fw-semibold" style={{ color: "#40635F" }}>{userInfo.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 mt-2 p-2">
                  <Dropdown.Item as={Link} to="/profile" className="rounded">Profile</Dropdown.Item>

                  {isDoctor && (
                    <Dropdown.Item as={Link} to="/doctor/doctorDashboard" className="rounded fw-bold text-primary">
                      Dashboard
                    </Dropdown.Item>
                  )}

                  {userInfo.role === "admin" && (
                    <>
                      <Dropdown.Item as={Link} to="/admin/create" className="rounded">Create</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/doctors" className="rounded">Admin Panel</Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider />
                  <div className="px-2 pb-1">
                    <Button variant="danger" size="sm" onClick={handleLogout} className="w-100 rounded-pill">
                      Logout
                    </Button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link 
                as={Link} 
                to="/login" 
                className="ms-lg-4 px-4 py-2 rounded-pill shadow-sm text-center"
                style={{ background: "#40635F", color: "white", fontWeight: "600" }}
              >
                Log in
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;