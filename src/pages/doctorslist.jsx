import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import doctors from "../data/doctors";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaChevronRight,
  FaRegHeart,
} from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import "./doctorslist.css";

const specialties = [
  "All",
  "Cardiologist",
  "Neurologist",
  "Hepatologist",
  "Physician",
  "Child Specialist",
  "Dermatologist",
  "Dentist",
];

const DoctorsList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Remove duplicate doctors safely
  const uniqueDoctors = useMemo(() => {
    const seen = new Set();
    return doctors.filter((doc) => {
      const identifier = doc._id || doc.id || doc.name;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
  }, []);

  // Filtering logic
  const filteredDoctors = useMemo(() => {
    return uniqueDoctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

      const matchesSearch =
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchTerm, uniqueDoctors]);

  return (
    <div className="modern-directory-wrapper">
      
      {/* HERO SECTION */}
      <div className="modern-hero">
        <div className="hero-mesh"></div>
        <Container>
          <Row className="justify-content-center align-items-center py-5">
            <Col lg={8} className="text-center">
              <Badge
                bg="soft-primary"
                className="mb-3 px-3 py-2 text-primary"
                style={{ fontSize: "1.2rem" }}
              >
                Expert Care at your fingertips
              </Badge>

              <h1
                className="display-4 fw-bold mb-4"
                style={{ fontSize: "2.7rem", color: "white" }}
              >
                Find the right{" "}
                <span className="text-primary-gradient">
                  Specialist
                </span>{" "}
                for your health.
              </h1>

              <div className="search-container-modern shadow-lg mx-auto">
                <FaSearch className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedSpecialty !== "All") setSelectedSpecialty("All");
                  }}
                />
                <Button variant="primary" className="btn-search-hero">
                  Find Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="content-area">
        {/* FILTER BAR */}
        <div className="filter-scroll-wrapper">
          <div className="filter-scroll-container">
            {specialties.map((spec) => (
              <button
                key={spec}
                className={`filter-pill ${
                  selectedSpecialty === spec ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedSpecialty(spec);
                  setSearchTerm("");
                }}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* DOCTORS GRID */}
        <Row className="g-4" style={{ paddingBottom: "60px" }}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <Col key={doc._id || doc.id} md={6} lg={4}>
                <Card className="modern-doctor-card h-100 border-0 shadow-sm">
                  <div className="card-top-info">
                    <div className="doctor-avatar-box">
                      <img
                        src={doc.image || "https://via.placeholder.com/150"}
                        alt={doc.name}
                      />
                      <span
                        className={`availability-dot ${
                          doc.name?.length % 2 === 0 ? "online" : "away"
                        }`}
                      ></span>
                    </div>
                    <button className="btn-wishlist">
                      <FaRegHeart />
                    </button>
                  </div>

                  <Card.Body className="pt-0">
                    <div className="d-flex align-items-center mb-2">
                      <div className="rating-pill">
                        <FaStar className="star-icon" /> 4.9
                      </div>
                      <span className="text-muted small ms-2">
                        (120+ Reviews)
                      </span>
                    </div>

                    <h5 className="fw-bold mb-1">{doc.name}</h5>
                    <p className="text-primary fw-medium small mb-3">
                      {doc.specialty}
                    </p>

                    <div className="meta-info-grid">
                      <div className="meta-item">
                        <FaMapMarkerAlt className="text-muted" />
                        <span>{doc.location || "Central Hospital"}</span>
                      </div>
                      <div className="meta-item">
                        <FaCalendarAlt className="text-muted" />
                        <span>Next: Tomorrow</span>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-transparent border-0 p-4 pt-0">
                    <Link
                      to={`/doctors/${doc._id || doc.id}`}
                      className="text-decoration-none"
                    >
                      <Button className="w-100 btn-modern-action">
                        View Details{" "}
                        <FaChevronRight className="ms-2" size={12} />
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <h3 className="text-muted">No specialists found...</h3>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default DoctorsList;