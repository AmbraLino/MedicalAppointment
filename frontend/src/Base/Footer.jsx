import React from "react";
import "./Footer.css";
import { Button } from "react-bootstrap";
import logo from '../Images/logoHealth.PNG';

const Footer = () => {
return(
    <div>
      
      <div className="footer">
        <div className="footer-top">
          <div className="footer-left">
        
            <img src={logo} height="auto" alt="logo" width="200px" style={{borderRadius: "5px"}}  />
                      
            <div className="footer-logo">
              <div className="fb" >
                <i className="fa-brands fa-facebook-f" ></i>
                 <a href="https://www.facebook.com"></a>
              </div>
              <div className="ig">
                <i className="fa-brands fa-instagram"></i>
              </div>
              <div className="tt">
                <i className="fa-brands fa-tiktok"></i>
              </div>
            </div>
          </div>

          <div className="footer-right">
            <div className="company">
              <h3 className="footer-title"> <a href="/" style={{ textDecoration: "none", color: "white" }}>ProHealth</a></h3>
                <p>
                <a href="/about" style={{ textDecoration: "none", color: "white" }} className="footer-info">
                  About Us
                </a>
              </p>
              {/* <p>Blog</p> */}
              <p>
                <a href="/contact" style={{ textDecoration: "none", color: "white" }} className="footer-info">
                  Contact Us
                </a>
              </p>
            </div>

            <div className="contact">
              <h3 className="footer-title"><a href ="/contact" style={{ textDecoration: "none", color: "white" }}>
                  Information about contacts
                </a></h3>
              <p className="footer-info">+0123-456-789</p>
              <p className="footer-info">prohealth@care.com</p>
              <p className="footer-info">London, UK</p>
            </div>
          </div>
        </div>

        <div className="footer-line"></div>

        <div className="footer-terms">
          <p className="footer-info">
            Copyright &copy; 2025 - {new Date().getFullYear()} ProHealth - Medical Care
          </p>
        </div>
      </div>
      </div>
  );
};
export default Footer;

















