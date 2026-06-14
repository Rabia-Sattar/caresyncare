import React, { useState, useMemo } from 'react';
import { MOCK_NURSES, BANK_DETAILS } from '../data/nurses';
import { Container, Row, Col, Form, Button, InputGroup, Card, Badge } from 'react-bootstrap';
import { NurseCard } from '../components/nursecard';
import { BookingModal } from '../components/bookingmodal';
import "./nurse.css";

const Nurses = () => {
  const [nurses, setNurses] = useState(MOCK_NURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNurse, setSelectedNurse] = useState(null);

  const filteredNurses = useMemo(() => {
    return nurses.filter(nurse =>
      nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [nurses, searchQuery]);

  const handleBookingSuccess = (nurseId) => {
    setNurses(prev =>
      prev.map(n => (n.id === nurseId ? { ...n, availability: 'Booked' } : n))
    );
  };

  return (
    <div className="nurses-page">
      {/* Hero Section */}
      <section className="nurse-hero">
        <div className="nurse-hero-blur"></div>
        <Container>
          <div className="text-center mb-5">
            <Badge bg="soft-primary" className="mb-3 px-3 py-2 text-primary">
              <i className="bi bi-patch-check-fill me-2"></i> 100% CERTIFIED PROFESSIONALS
            </Badge>

            <h1 className="display-5 fw-bold text-white">
              Professional <span className="text-gradient-nurse">Nurse</span> Finder
            </h1>

            <p className="text-white lead mx-auto" style={{ maxWidth: '600px', fontSize: '0.9rem' }}>
              Search over 150+ verified caregivers. Get professional medical assistance at your doorstep in 60 minutes or less.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="search-wrapper-nurse shadow-lg mt-4">
            <i className="bi bi-search search-icon-nurse"></i>
            <input
              type="text"
              placeholder="Search by name, specialty, or area..."
              className="nurse-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type='button' className="btn-search-nurse" onClick={() => {}}>
              Search Now
            </Button>
          </div>
        </Container>
      </section>

      <Container className="mt-n5" style={{marginTop:'30px'}}>
        <Row className="g-4">
          {filteredNurses.length > 0 ? (
            filteredNurses.map(nurse => (
              <Col key={nurse.id} xs={12} md={6} lg={4}>
                <div className="nurse-premium-card">
                  {/* Top Section: Profile & Rating */}
                  <div className="card-header-clean p-4">
                    <div className="d-flex justify-content-between">
                      <div className="profile-wrapper">
                        <img src={nurse.imageUrl} alt={nurse.name} className="nurse-img" />
                        <div className={`status-dot ${nurse.availability === 'Available' ? 'online' : 'away'}`}></div>
                      </div>
                    </div>
                    <div className="nurse-rating-chip">
                      <i className="bi bi-star-fill me-1"></i> {nurse.rating}
                    </div>

                    <div className="mt-4">
                      <h5 className="nurse-name-bold">{nurse.name}</h5>
                      <p className="nurse-role-tag">{nurse.role}</p>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="nurse-stats-grid px-4">
                    <div className="stat-box">
                      <span className="stat-label">Exp.</span>
                      <span className="stat-value">{nurse.experience}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Patients</span>
                      <span className="stat-value">500+</span>
                    </div>
                  </div>

                  {/* Specialties & Bio */}
                  <div className="card-body-clean px-4 py-3">
                    <p className="nurse-bio-truncate">{nurse.bio}</p>
                    <div className="nurse-tags-row mt-3">
                      {nurse.specialties.slice(0, 2).map((tag, i) => (
                        <span key={i} className="nurse-glass-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Modern Action Bar */}
                  <div className="nurse-card-action-bar p-3">
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-2">
                      <div className="avail-info">
                        <span className="avail-label">Status</span>
                        <span className={`avail-status ${nurse.availability === 'Available' ? 'text-success' : 'text-warning'}`}>
                          {nurse.availability}
                        </span>
                      </div>
                      <button
                        type='button'
                        className="btn-nurse-action w-100 w-sm-auto"
                        onClick={() => setSelectedNurse(nurse)}
                      >
                        Book <i className="bi bi-arrow-right-short"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              {/* No Nurse State */}
            </Col>
          )}
        </Row>
      </Container>

      {/* ✅ Benefits Section — g-4 aur mb-4 add kiya */}
      <Container className="py-5 benefits-container">
        <div className="text-center mb-5">
          <h2 style={{fontSize:'2.5rem', fontWeight:'800'}}>Why Choose Us</h2>
          <p className="text-muted">Healthcare you can trust</p>
        </div>

        <Row className="justify-content-center g-4">
          <Col xs={12} md={4} className="px-3">
            <div className="benefit-card h-100" style={{background:'#0f172a', borderRadius:'20px', padding:'30px'}}>
              <div className="benefit-icon-wrapper blue">
                <i className="bi bi-shield-check"></i>
              </div>
              <h5 className="benefit-heading text-white mt-3">Verified Experts</h5>
              <p className="text-white mt-2" style={{fontSize:'0.9rem', opacity:'0.8'}}>
                Every caregiver passes a rigorous 5-step background and credential check.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4} className="px-3">
            <div className="benefit-card h-100" style={{background:'#0f172a', borderRadius:'20px', padding:'30px'}}>
              <div className="benefit-icon-wrapper green">
                <i className="bi bi-credit-card-2-back"></i>
              </div>
              <h5 className="benefit-heading text-white mt-3">Secure Payments</h5>
              <p className="text-white mt-2" style={{fontSize:'0.9rem', opacity:'0.8'}}>
                Transparent pricing with encrypted verification for every transaction.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4} className="px-3">
            <div className="benefit-card h-100" style={{background:'#0f172a', borderRadius:'20px', padding:'30px'}}>
              <div className="benefit-icon-wrapper orange">
                <i className="bi bi-calendar-event"></i>
              </div>
              <h5 className="benefit-heading text-white mt-3">24/7 Availability</h5>
              <p className="text-white mt-2" style={{fontSize:'0.9rem', opacity:'0.8'}}>
                Your health doesn't follow a schedule. Book professional help whenever you need it.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      {selectedNurse && (
        <BookingModal
          nurse={selectedNurse}
          show={!!selectedNurse}
          onClose={() => setSelectedNurse(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Nurses;
