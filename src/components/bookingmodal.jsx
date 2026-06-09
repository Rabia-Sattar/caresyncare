import React, { useState } from 'react';
import { Modal, Button, Image, Form, Spinner, Row, Col, Card } from 'react-bootstrap';
import API from "../api/axiosinstance";
import "../pages/nurse.css";

export const BookingModal = ({ nurse, show, onClose, onSuccess }) => {
  const [step, setStep] = useState('details');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🔥 SAFE USER FETCH (prevents crash)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const hours = 4;
  const totalAmount = nurse?.hourlyRate * hours + 5;

  const handleNext = () => setStep('payment');

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 🔥 MAIN BOOKING FUNCTION
  const handleConfirm = async () => {
    if (!file) {
      alert("Please upload payment screenshot");
      return;
    }

    try {
      setIsUploading(true);

      // 🔥 SEND DATA TO BACKEND
      await API.post("/api/book-nurse", {
        nurseName: nurse?.name,

        // ✅ DEMO NURSE EMAIL (as you requested)
        nurseEmail: "demo.nurse@caresync.com",

        // ✅ REAL LOGGED-IN USER
        userName: user?.name,
        userEmail: user?.email,

        amount: totalAmount
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsUploading(false);
      setStep('success');

      setTimeout(() => {
        onSuccess(nurse?.id);
        onClose();

        // reset modal
        setStep('details');
        setFile(null);
      }, 2000);

    } catch (error) {
      console.error("Booking Error:", error);
      setIsUploading(false);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-white">
          Book Caregiver
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* ---------------- DETAILS STEP ---------------- */}
        {step === 'details' && (
          <>
            <Card className="mb-4 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <Image
                  src={nurse?.imageUrl}
                  rounded
                  className="me-3"
                  width={80}
                  height={80}
                />
                <div>
                  <h5 className="mb-1">{nurse?.name}</h5>
                  <p className="text-primary mb-0">{nurse?.role}</p>
                </div>
              </Card.Body>
            </Card>

            <div className="mb-4">
              <Row className="mb-2">
                <Col className="text-white">Hourly Rate</Col>
                <Col className="text-end text-white">
                  ${nurse?.hourlyRate}
                </Col>
              </Row>

              <Row className="mb-2">
                <Col className="text-white">Duration</Col>
                <Col className="text-end text-white">4 Hours</Col>
              </Row>

              <Row className="mb-2">
                <Col className="text-white">Service Fee</Col>
                <Col className="text-end text-white">$5</Col>
              </Row>

              <hr />

              <Row className="fw-bold fs-5">
                <Col className="text-white">Total</Col>
                <Col className="text-end text-white">
                  ${totalAmount}
                </Col>
              </Row>
            </div>

            <Button className="w-100" onClick={handleNext}>
              Proceed to Payment
            </Button>
          </>
        )}

        {/* ---------------- PAYMENT STEP ---------------- */}
        {step === 'payment' && (
          <>
            <Card bg="dark" text="white" className="mb-4">
              <Card.Body>
                <h6>Bank Details</h6>
                <p className="mb-1">Account: CareSync</p>
                <p className="mb-1">IBAN: XXXX-XXXX-XXXX</p>
                <p className="mb-0">Bank: Demo Bank</p>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                Upload Payment Screenshot
              </Form.Label>

              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Form.Group>

            <Button
              className="w-100"
              variant={file && !isUploading ? "success" : "secondary"}
              disabled={!file || isUploading}
              onClick={handleConfirm}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </>
        )}

        {/* ---------------- SUCCESS STEP ---------------- */}
        {step === 'success' && (
          <div className="text-center py-4">
            <i className="bi bi-check-circle-fill text-success fs-1"></i>
            <h4 className="mt-3 text-white">
              Booking Successful!
            </h4>

            <p className="text-white">
              A confirmation email has been sent to {user?.email}.
              The nurse will contact you shortly.
            </p>
          </div>
        )}

      </Modal.Body>
    </Modal>
  );
};