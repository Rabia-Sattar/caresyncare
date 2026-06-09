import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Form, Modal, Badge, Spinner, Row, Col, Container } from "react-bootstrap";
import API from "../api/axiosinstance";
import { FaUserPlus, FaUserMinus, FaChevronLeft, FaRegEnvelope, FaFingerprint, FaCopy, FaUsers } from "react-icons/fa";
import "./familydetails.css";

const FamilyDetails = () => {
    const { id } = useParams();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [removeMode, setRemoveMode] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = family?.createdBy?._id === user._id;

    const fetchFamily = async () => {
        try {
            const res = await API.get("/api/family/my-families");
            const found = res.data.find(fam => fam._id === id);
            setFamily(found || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamily();
    }, [id]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const emailsArray = newMemberEmail.split(",").map(e => e.trim());
            const res = await API.post("/api/family/add-member", {
                familyId: family._id,
                userEmails: emailsArray
            });
            setFamily(res.data.family);
            setNewMemberEmail("");
            setShowAddModal(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            await API.post("/api/family/remove-member", {
                familyId: family._id,
                userId: memberId
            });
            fetchFamily();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to remove member");
        }
    };

    if (loading) return <div className="loader-box"><Spinner animation="border" variant="primary" /></div>;
    if (!family) return <div className="p-5 text-center"><h5>Family not found.</h5></div>;

    return (
        <Container className="py-4">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <Link to="/family-dashboard" className="btn-back me-3">
                    <FaChevronLeft /> Back
                </Link>
                <div>
                    <h2 className="fw-bold mb-1">{family.name} Family</h2>
                    <p className="text-muted mb-0">Manage members, roles & permissions</p>
                </div>
            </div>

            <Row className="g-4">
                {/* Sidebar / Stats */}
                <Col lg={4}>
                    <Card className="shadow-sm mb-4 p-3 border-0">
                        <h6 className="text-uppercase text-muted mb-2">Family Stats</h6>
                        <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                            <div>
                                <h3 className="mb-0">{family.members.length}</h3>
                                <small className="text-muted">Members</small>
                            </div>
                            <FaUsers size={28} className="text-primary" />
                        </div>

                        <div className="invite-section p-3 border rounded mb-3 bg-white">
                            <div className="d-flex align-items-center mb-2">
                                <FaFingerprint className="me-2 text-primary" />
                                <small className="text-uppercase fw-bold text-muted">Invite Code</small>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border p-2 rounded">
                                <code className="text-truncate">{family.inviteCode}</code>
                                <FaCopy className="text-muted cursor-pointer" />
                            </div>
                            <small className="text-muted mt-1 d-block">Use this code to invite new members.</small>
                        </div>

                        {isAdmin && (
                            <div className="d-grid gap-2 mt-2">
                                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                    <FaUserPlus className="me-2" /> Add Member
                                </Button>
                                <Button 
                                    variant={removeMode ? "danger" : "outline-secondary"} 
                                    onClick={() => setRemoveMode(!removeMode)}
                                >
                                    {removeMode ? "Exit Remove Mode" : "Manage Members"}
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Members List */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0 p-3 mb-4">
                        <h6 className="fw-bold mb-3">Active Members <Badge bg="light" text="dark">{family.members.length}</Badge></h6>
                        {family.members.map(m => (
                            <div key={m._id} className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-circle me-3">{m.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <span className="fw-semibold">{m.name}</span>
                                            {m._id === family.createdBy._id && <Badge bg="warning" text="dark" className="ms-2">Admin</Badge>}
                                        </div>
                                        <div className="text-muted small"><FaRegEnvelope className="me-1" /> {m.email}</div>
                                    </div>
                                </div>
                                {isAdmin && removeMode && m._id !== family.createdBy._id && (
                                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveMember(m._id)}>Remove</Button>
                                )}
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Add Member Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMember}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter email(s), comma-separated"
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="light" className="w-50" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" className="w-50">Send Invite</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FamilyDetails;
