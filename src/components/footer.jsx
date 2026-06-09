import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./footer.css";


const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>

        {/* TOP SECTION */}
        <Row className="footer-top">
          {/* BRAND */}
          <Col md={4} className="footer-brand">
            <div className="footer-logo d-flex align-items-center gap-2">
              <div className="footer-logo-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
                       4.5 2.09C13.09 3.81 14.76 3 16.5 3 
                       19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z"
                    stroke="none"
                  />
                </svg>
              </div>
              <span className="footer-logo-text">CareSync</span>
            </div>
            <p className="footer-desc">
              Empowering families with seamless caregiving coordination.
              Manage tasks, track health, and stay connected with your loved ones.
            </p>
          </Col>

          {/* QUICK LINKS */}
          <Col md={3} className="footer-links-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/doctors">Doctors</a></li>
              <li><a href="/nurses">Nurses</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </Col>

          {/* CONTACT */}
          <Col md={3} className="footer-contact-col">
            <h5 className="footer-title">Contact</h5>
            <ul className="footer-contact">
              <li>📧 support@caresync.com</li>
              <li>📞 (555) 000-0000</li>
              <li>📍 Pakistan</li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          <Row>
            <Col className="text-center">
              <p className="footer-copy">© 2025 CareSync. All rights reserved.</p>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;