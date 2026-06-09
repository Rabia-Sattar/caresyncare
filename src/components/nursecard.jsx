import React from 'react';
import { Button, Badge, Row, Col } from 'react-bootstrap';
import "./nursecard.css";

export const NurseCard = ({ nurse, onBook }) => {
  const isAvailable = nurse.availability !== 'Booked';

  return (
    <div className="nurse-card-refined">
      {/* Top Section: Status & Image */}
      <div className="card-header-minimal">
        <Badge className={`status-pill ${isAvailable ? 'available' : 'booked'}`}>
          <span className="dot"></span> {nurse.availability}
        </Badge>
        <div className="profile-image-container">
          <img src={nurse.imageUrl} alt={nurse.name} className="profile-img" />
        </div>
      </div>

      {/* Body Section */}
      <div className="card-body-minimal">
        <div className="text-center mb-3">
          <h4 className="nurse-name">{nurse.name}</h4>
          <p className="nurse-role-label">{nurse.role}</p>
        </div>

        <div className="nurse-info-tags d-flex justify-content-center gap-2 mb-4">
          {nurse.specialties.slice(0, 2).map(spec => (
            <span key={spec} className="tag-outline">{spec}</span>
          ))}
          {nurse.specialties.length > 2 && (
             <span className="tag-more">+{nurse.specialties.length - 2}</span>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="card-footer-minimal pt-3">
          <div className="d-flex justify-content-between align-items-center text-white">
            <div className="price-box">
              <span className="label">Hourly Rate</span>
              <p className="amount">${nurse.hourlyRate}<span>/hr</span></p>
            </div>
            <Button
              onClick={() => onBook(nurse)}
              disabled={!isAvailable}
              className={`action-pill-btn ${isAvailable ? 'btn-primary-blue' : 'btn-disabled'}`}
            >
              {isAvailable ? 'Book Appointment' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};