import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './home.css';
import {
  FaUsers,
  FaCalendarAlt,
  FaCapsules,
  FaHeartbeat,
  FaUserMd,
  FaClinicMedical,
  FaArrowRight,
  FaQuoteRight
} from 'react-icons/fa';

const Home = () => {
  const features = [
    { title: "Family Dashboard", icon: <FaUsers />, text: "Create and join family groups to coordinate care", link: "/family-dashboard" },
    { title: "Shared Calendar", icon: <FaCalendarAlt />, text: "Manage appointments, tasks, and schedules", link: "/calendar" },
    { title: "Medicine Reminders", icon: <FaCapsules />, text: "Smart medication tracking", link: "/reminders" },
    { title: "Health Logs", icon: <FaHeartbeat />, text: "Track vitals, symptoms, and your health history", link: "/health-logs" },
    { title: "Doctors", icon: <FaUserMd />, text: "Find and connect with top health specialists", link: "/doctors" },
    { title: "Pharmacy", icon: <FaClinicMedical />, text: "Locate pharmacies and order medicines easily", link: "/pharmacies" }
  ];

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-glow"></div>
        <Container>
          <Row className="align-items-center">
            <Col lg={5}>
              <h1 className="hero-heading">CARESYNC COORDINATE</h1>
              <h2 className="hero-heading">CARE, <span className="text-gradient">TOGETHER</span></h2>
              <p className="hero-text">
                CareSync brings your family together to provide the best care for your loved ones. Manage tasks, track health, and stay organized all in one place.
              </p>
              <div className="d-flex gap-3">
                <Link to="/dashboard" className="btn-primary-custom text-decoration-none">
                  Go to Dashboard <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/forum" className="btn-glass text-decoration-none">Community</Link>
              </div>
            </Col>

            <Col lg={7} className="ps-lg-5">
              <div className="hero-grid-modern">
                <div className="grid-item item-1">
                  <img src="https://media.istockphoto.com/id/1490280970/photo/home-nurse-caregiver.jpg?s=612x612&w=0&k=20&c=qEO397wSWQuN1eoV9KWXoqOsDpLYhnqFywfiWQTRzeI=" alt="Care" />
                </div>
                <div className="grid-item item-2">
                  <img src="https://tenovi.b-cdn.net/wp-content/uploads/2023/02/istockphoto-1480607288-612x612-1.jpg" alt="Care" />
                </div>
                <div className="grid-item item-3">
                  <img src="https://www.caregivercalifornia.org/wp-content/uploads/2020/11/AdobeStock_374007340-scaled.jpeg" alt="Care" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="hero-heading text-dark" style={{fontSize: '2.5rem'}}>Our Features</h2>
          </div>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col md={6} lg={4} key={i}>
                <Link to={f.link} className="feature-link">
                  <div className="feature-card-modern">
                    <div className="feature-icon-wrapper">{f.icon}</div>
                    <h5 className="feature-title">{f.title}</h5>
                    <p className="feature-description">{f.text}</p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section pt-5">
        <Container>
          <div className="about-glass-card">
            <Row className="g-0 align-items-stretch">
              <Col lg={6} className="p-5">
                <h6 className="hero-title mb-3" style={{color: 'var(--brand-primary)'}}>OUR MISSION</h6>
                <h2 className="hero-heading text-dark" style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>
                  Who <span className="text-gradient">We Are</span>
                </h2>
                <p className="about-text">
                  CareSync is a family-centered health coordination platform designed to bring clarity, connection,
                  and control to caregiving. We believe that no one should manage health challenges alone.
                  Our mission is to help families stay organized with real-time updates and shared responsibility.
                </p>
                <Link to="/about" className="btn-primary-custom text-decoration-none d-inline-block">
                  Explore Our Mission
                </Link>
              </Col>
              <Col lg={6} className="d-flex">
                <div className="about-img-wrapper w-100">
                  <img
                    className="about-img"
                    src="https://lovinghomecareinc.com/wp-content/uploads/2024/03/Family-Caregivers-Vs-Professional-Home-Care-Comparison-Guide.jpg"
                    alt="Who we are"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* LIVE FEED & SOCIAL SECTION */}
      <section className="howit-section-modern">
        <Container>
          <Row className="g-5 align-items-center">

            {/* ✅ FIXED IMAGE */}
            <Col lg={6}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
              }}>
                <img
                  src="https://plus.unsplash.com/premium_photo-1682001161140-2a1ca0720c22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Caregiver checking blood pressure of elderly woman"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </Col>

            <Col lg={6}>
              <h2 className="hero-heading text-dark" style={{ fontSize: '2.5rem' }}>
                Trusted by Families
              </h2>
              <p className="hero-text text-muted">
                Join thousands of caregivers who have simplified their daily health management routines.
              </p>

              <div className="testimonial-card-modern">
                <FaQuoteRight className="quote-icon" />
                <p className="mb-3 italic">
                  "CareSync helped our family coordinate my father's meds. Life-changing!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="avatar-small me-3">A</div>
                  <div>
                    <h6 className="mb-0 fw-bold">Ayesha K.</h6>
                    <small className="text-muted">Daughter & Caregiver</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta text-center">
        <Container>
          <h2 className="hero-heading mb-4">Ready to simplify care?</h2>
          <Link to="/signup" className="btn-glass-sign px-5 py-3 text-decoration-none d-inline-block">
            Create Free Account
          </Link>
        </Container>
      </section>

      {/* Floating Action Button */}
      <Link to="/help" className="floating-action-btn">
        <FaHeartbeat color="var(--brand-primary)" />
      </Link>
    </div>
  );
};

export default Home;
