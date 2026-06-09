import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaStar, FaHospitalAlt, FaClock, FaCalendarCheck, 
  FaGraduationCap, FaMapMarkerAlt, FaVideo, 
  FaPhoneAlt, FaChevronLeft, FaCheckCircle, FaAward,
  FaShieldAlt, FaLanguage, FaQuoteLeft
} from "react-icons/fa";
import doctors from "../data/doctors";
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import "./doctordetail.css";

const DoctorDetail = () => {
  const { id } = useParams();

  // ✅ Safe ID matching (works for string or number IDs)
  const doctor = doctors.find((doc) => String(doc.id) === String(id));

  if (!doctor) return <div className="p-5 text-center">Doctor not found!</div>;

  /* =========================
     NORMALIZE CONSULTATION
  ========================== */

  const getClinicData = () => {
    const clinic = doctor?.consultationModes?.inClinic;

    if (!clinic) return null;

    if (Array.isArray(clinic)) {
      return clinic[0] || null; // take first clinic if array
    }

    if (typeof clinic === "object") {
      return clinic;
    }

    return null; // if boolean or invalid
  };

  const clinicData = getClinicData();
  const consultationFee = clinicData?.fee || 1500;

  /* =========================
     SAFE FALLBACK VALUES
  ========================== */

  const hospitalName = doctor?.hospital
    ? doctor.hospital.split(" - ")[0]
    : "City Hospital";

  const rating = doctor?.rating || 4.8;
  const reviewsCount = doctor?.reviewsCount || 433;
  const experienceYears = doctor?.experienceYears || 10;
  const qualifications = doctor?.qualifications || [];

  return (
    <div className="profile-premium-redesign">
      
      {/* HEADER */}
      <div className="profile-navigation-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-0">Specialist Profile</h2>
            </div>
            
            <Link to="/doctors" className="btn btn-back-modern">
              <FaChevronLeft className="me-2" /> Back to Doctor List
            </Link>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="gx-lg-5">

          {/* LEFT COLUMN */}
          <Col lg={8}>
            
            {/* HERO CARD */}
            <div className="doctor-hero-card shadow-sm mb-4">
              <div className="d-md-flex align-items-center gap-4">
                <div className="image-container">
                  <img src={doctor.image || "/placeholder.jpg"} alt={doctor.name} />
                  <span className="experience-badge">
                    {experienceYears}+ Yrs Exp
                  </span>
                </div>

                <div className="flex-grow-1 mt-3 mt-md-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h1 className="h2 fw-bold mb-0">{doctor.name}</h1>
                    <FaCheckCircle className="text-primary" />
                  </div>

                  <p className="text-primary fw-semibold mb-2">
                    {doctor.specialty}
                  </p>

                  <div className="meta-row">
                    <span><FaHospitalAlt /> {hospitalName}</span>
                    <span><FaMapMarkerAlt /> {doctor.location || "Lahore"}</span>
                    <span><FaLanguage /> English, Urdu, Punjabi</span>
                  </div>
                </div>

                <div className="rating-pill d-none d-lg-flex">
                  <FaStar className="star-icon" />
                  <div>
                    <span className="fw-bold">{rating}</span>
                    <small className="d-block text-muted">
                      {reviewsCount} Reviews
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <Row className="g-3 mb-4">
              <Col xs={6} md={3}>
                <div className="stat-box border-0 shadow-sm stat-blue">
                  <div className="stat-icon-circle"><FaAward /></div>
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">{experienceYears} Years</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="stat-box border-0 shadow-sm stat-orange">
                  <div className="stat-icon-circle"><FaStar /></div>
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{rating} / 5</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="stat-box border-0 shadow-sm stat-green">
                  <div className="stat-icon-circle"><FaCheckCircle /></div>
                  <span className="stat-label">Patients</span>
                  <span className="stat-value">2,000+</span>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="stat-box border-0 shadow-sm stat-cyan">
                  <div className="stat-icon-circle"><FaClock /></div>
                  <span className="stat-label">Wait Time</span>
                  <span className="stat-value">15 Mins</span>
                </div>
              </Col>
            </Row>

            {/* ABOUT */}
            <section className="info-section shadow-sm mb-4">
              <h4 className="section-title">
                About Dr. {doctor.name?.split(" ").pop()}
              </h4>

              <p className="text-secondary leading-relaxed">
                {doctor.name} is a distinguished expert in {doctor.specialty?.toLowerCase()} with over {experienceYears} years of 
                clinical excellence. Known for a patient-centric approach and advanced diagnostic techniques.
              </p>

              <h5 className="mt-4 mb-3 fw-bold small text-uppercase text-muted">
                Education & Training
              </h5>

              <div className="edu-list">
                {qualifications.map((q, i) => (
                  <div key={i} className="edu-item">
                    <FaGraduationCap className="text-primary mt-1" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* INSURANCE */}
            <section className="info-section shadow-sm mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaShieldAlt className="text-success" />
                <h4 className="section-title mb-0">Accepted Insurance</h4>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {['Jubilee Life', 'Allianz EFU', 'State Life', 'Adamjee Insurance'].map((ins) => (
                  <Badge key={ins} className="insurance-badge">
                    {ins}
                  </Badge>
                ))}
              </div>
            </section>

            {/* TESTIMONIAL */}
            <section className="info-section shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="section-title mb-0">Patient Testimonials</h4>
                <Button variant="link" className="p-0 text-primary fw-bold text-decoration-none small">
                  View All Reviews
                </Button>
              </div>

              <div className="review-card">
                <FaQuoteLeft className="quote-icon" />
                <div className="d-flex justify-content-between mb-2">
                  <div className="stars text-warning small">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-muted tiny">Oct 23, 2025</span>
                </div>

                <p className="review-text">
                  "Dr. Malik is exceptionally thorough. He explained my condition clearly and put my mind at ease. Highly recommended!"
                </p>

                <div className="reviewer">
                  <span className="fw-bold">Ahmed R.</span>
                  <Badge bg="success-soft" className="ms-2">
                    Verified Patient
                  </Badge>
                </div>
              </div>
            </section>

          </Col>

          {/* RIGHT SIDEBAR */}
          <Col lg={4}>
            <div className="sticky-booking-sidebar">
              <Card className="booking-card shadow-sm border-0 mb-4">
                <Card.Body className="p-4">

                  <h5 className="fw-bold mb-4">Consultation Details</h5>

                  <div className="consultation-options">
                    <div className="consult-option active">
                      <FaHospitalAlt className="text-primary" />
                      <div className="flex-grow-1">
                        <span className="d-block fw-bold">In-Clinic Visit</span>
                        <span className="price">
                          Rs. {consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="consultation-fee-box mt-4 text-center">
                    <h6 className="text-muted mb-2">Consultation Fee</h6>
                    <h3 className="text-primary fw-bold">
                      Rs. {consultationFee}
                    </h3>
                    <p className="small text-muted mb-0">In-Clinic Visit</p>
                  </div>

                  <div className="help-footer mt-4 text-center">
                    <p className="text-muted small mb-1">Need assistance?</p>
                    <a
                      href={`tel:${doctor.contact}`}
                      className="phone-link text-decoration-none fw-bold"
                    >
                      <FaPhoneAlt className="me-2" />
                      {doctor.contact || "111-222-333"}
                    </a>
                  </div>

                </Card.Body>
              </Card>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default DoctorDetail;