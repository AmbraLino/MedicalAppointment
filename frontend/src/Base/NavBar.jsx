import React, { useContext, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Dropdown, Button, Navbar, Nav, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import logo from "../Images/logoHealth.PNG";
import { UserContext } from "../Auth/UserContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
      setUserInfo(null);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <Navbar expand="lg" style={{ background: "#769382" }}>
      <Container>
        <Navbar.Brand>
          <img src={logo} alt="ProHealth Logo" width="100px" style={{borderRadius: "5px"}} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" style={{ color: "#FEFAE0" }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/department" style={{ color: "#FEFAE0" }}>
              Department
            </Nav.Link>
             <Nav.Link as={Link} to="/finddoctor" style={{ color: "#FEFAE0" }}>
              Find Doctor
            </Nav.Link>
            <Nav.Link as={Link} to="/about" style={{ color: "#FEFAE0" }}>
              About 
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" style={{ color: "#FEFAE0" }}>
              Contact
            </Nav.Link>
            

            <div className="home-top-filter d-inline-flex align-items-center px-4 py-2 rounded-pill" style={{ background: "rgba(255,255,255,0.1)", marginLeft: "10px" }}> 
              <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2 home-icon" style={{ color: "white" }} /> 
               <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim() !== "") {
                    navigate(`/categories?category=${encodeURIComponent(search.trim().toLowerCase())}`);
                  }
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "16px",
                  width: "150px",
                }}
              />
            </div> 

            {/* {!userInfo ? (
              <Nav.Link as={Link} to="/login" style={{ color: "#FEFAE0", marginLeft: "10px" }}>
                Login
              </Nav.Link>
            ) : (
              <>
                {userInfo.role === "agent" && (
                  <Nav.Link as={Link} to="/agjentPanel" style={{ color: "#FEFAE0" }}>
                    Panel of Doctor
                  </Nav.Link>
                )}
                {userInfo.role === "admin" && (
                  <Nav.Link as={Link} to="/adminPanel" style={{ color: "#FEFAE0" }}>
                    Panel of Admin
                  </Nav.Link>
                )}
                <Dropdown align="end" className="ms-3">
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <FaUserCircle size={25} /> {userInfo.username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ minWidth: "200px" }}>
                    <Dropdown.Item as={Link} to="/profile">
                      Profili im
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.ItemText>
                      <strong>Username:</strong> {userInfo.username}
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                      <strong>Email:</strong> {userInfo.email}
                    </Dropdown.ItemText>
                    <Dropdown.Divider />
                    <div className="px-3">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={handleLogout}
                        className="w-100"
                      >
                        Logout
                      </Button>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )} */}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;