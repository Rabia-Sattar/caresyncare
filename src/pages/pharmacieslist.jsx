import React, { useState, useMemo } from "react";
import pharmacies from "../data/pharmacies";
import { 
  FiSearch, FiMapPin, FiClock, FiTruck, FiPhone, 
  FiArrowRight, FiCheckCircle, FiStar, FiFilter
} from "react-icons/fi";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import "./pharmacieslist.css";

const PharmaciesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Open 24/7", "Home Delivery", "Top Rated"];

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((pharma) => {
      const matchesSearch = pharma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pharma.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === "All" || 
        (activeFilter === "Open 24/7" && pharma.timings?.includes("24")) ||
        (activeFilter === "Home Delivery" && pharma.delivery) ||
        (activeFilter === "Top Rated" && pharma.rating >= 4.5);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="pharma-modern-page">
      {/* --- HERO SECTION (UNCHANGED) --- */}
      <div className="pharma-hero-clean">
        <div className="hero-blur-effect"></div>
        <Container>
          <div className="text-center mb-5">
            <Badge bg="soft-primary" className="mb-3 px-3 py-2 text-primary">
              <FiCheckCircle className="me-2" /> 100% Certified Pharmacies
            </Badge>
            <h1 className="display-5 fw-bold text-white">Local <span className="text-gradient">Pharmacy</span> Finder</h1>
            <p className="text-white lead mx-auto" style={{maxWidth: '600px', fontSize: '0.9rem'}}>
              Search over 100+ verified stores. Get your essentials delivered in 30 minutes or less.
            </p>
          </div>

          {/* Floating Search */}
          <div className="search-wrapper-specialist shadow-lg mt-4">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-specialist-search">Find Now</button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {/* --- FILTERS --- */}
        <div className="filter-chip-row mb-5">
          <div className="d-flex align-items-center gap-3 overflow-auto no-scrollbar pb-2">
            <div className="filter-label text-muted d-none d-md-flex align-items-center me-2">
              <FiFilter className="me-2" /> Filter By:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pharma-chip ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- PHARMACY CARDS --- */}
        <Row className="g-4">
          {filteredPharmacies.length > 0 ? (
            filteredPharmacies.map((pharma) => (
              <Col key={pharma.id} md={6} lg={4}>
                <div className="pharma-modern-card shadow-sm">
                  {/* Card Header */}
                  <div className="card-top p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="pharma-logo-squircle">
                        <img src={pharma.image} alt={pharma.name} />
                      </div>
                      <div className="rating-pill">
                        <FiStar className="star-icon" /> {pharma.rating}
                      </div>
                    </div>
                    <h3 className="pharma-title mt-3">{pharma.name}</h3>
                    <p className="pharma-address text-muted small">
                      <FiMapPin className="me-1" /> Lahore, Pakistan
                    </p>
                  </div>

                  {/* Card Details */}
                  <div className="card-mid px-4 pb-4">
                    <div className="detail-item-modern">
                      <FiClock className="icon" /> <span>24/7</span>
                    </div>
                    {pharma.contact && (
                      <div className="detail-item-modern">
                        <FiPhone className="icon" /> <span>{pharma.contact}</span>
                      </div>
                    )}
                    <div className="tags-container mt-3">
                      {pharma.highlights?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="soft-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer-modern p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className={`delivery-status-pill ${pharma.delivery ? 'available' : ''}`}>
                        <FiTruck className="me-2 " /> {pharma.delivery ? "Home Delivery" : "Pickup Only"}
                      </div>
                      
                    </div>
                    <Button 
                        variant="primary" 
                        className="btn-order-modern-compact mt-3"
                        onClick={() => window.open(pharma.website || `https://wa.me/${pharma.contact}`)}
                      >
                        Order <FiArrowRight className="ms-2" />
                      </Button>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <h4 className="text-muted fw-light">No pharmacies found matching your search...</h4>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default PharmaciesList;