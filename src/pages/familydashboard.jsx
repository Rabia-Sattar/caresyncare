// src/pages/FamilyDashboard.jsx
import { useState, useEffect } from "react";
import API from "../api/axiosinstance";
import { Modal, Form, Button } from "react-bootstrap";

import {
  Plus,
  Link as LinkIcon,
  Users,
  X,
  Trash2,
  ArrowUpRight
} from "lucide-react";
import { FaUserPlus, FaCopy } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import "./familydashboard.css";

const FamilyDashboard = () => {
  const { user } = useAuth();

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showAddInline, setShowAddInline] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [removeMode, setRemoveMode] = useState(false);

  const isAdmin = selectedFamily?.createdBy?._id === user?._id;

  /* ---------------- FETCH FAMILIES ---------------- */
  const loadFamilies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/family/my-families");
      const familiesData = Array.isArray(res.data) ? res.data : [];
      setFamilies(familiesData);
    } catch (error) {
      console.error("Family load error:", error);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  /* ---------------- FAMILY ACTIONS ---------------- */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/family/create", { name: familyName });
      setShowCreate(false);
      setFamilyName("");
      await loadFamilies();
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/family/join", { inviteCode });
      setShowJoin(false);
      setInviteCode("");
      await loadFamilies();
    } catch (error) {
      console.error("Join error:", error);
    }
  };

  const handleDeleteFamily = async (id) => {
    if (!window.confirm("Delete this family group?")) return;
    try {
      await API.delete(`/api/family/delete/${id}`);
      await loadFamilies();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ---------------- MEMBER ACTIONS ---------------- */
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const emails = newMemberEmail
        .split(",")
        .map(e => e.trim())
        .filter(Boolean);

      const res = await API.post("/api/family/add-member", {
        familyId: selectedFamily._id,
        userEmails: emails
      });

      const updatedFamily = res.data.family;
      setSelectedFamily(updatedFamily);
      setFamilies(prev =>
        prev.map(f => f._id === updatedFamily._id ? updatedFamily : f)
      );

      setNewMemberEmail("");
      setShowAddInline(false);
    } catch (error) {
      console.error("Add member error:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const res = await API.post("/api/family/remove-member", {
        familyId: selectedFamily._id,
        userId: memberId
      });

      const updatedFamily = res.data.family;
      setSelectedFamily(updatedFamily);
      setFamilies(prev =>
        prev.map(f => f._id === updatedFamily._id ? updatedFamily : f)
      );

    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Syncing Family Data...</p>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="family-dashboard-premium">
      {/* HEADER */}
      <header className="dashboard-header-modern mb-5">
        <div>
          <h2 className="fw-800">Family Group 🏡</h2>
          <p className="text-muted">Coordinate care and stay connected</p>
        </div>
        <div className="header-actions">
          <button className="btn-join-outline" onClick={() => setShowJoin(true)}>
            <LinkIcon size={14} /> Join
          </button>
          <button className="btn-create-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> Create
          </button>
        </div>
      </header>

      {/* FAMILY LIST */}
      <div className="content-section-card" style={{background:'#2563eb'}}>
        <div className="family-list">
          {families.length === 0 ? (
            <div className="empty-state text-center p-5">
              <h5>No Family Groups Yet 👋</h5>
              <p className="text-muted">Create a new group or join using an invite code.</p>
            </div>
          ) : (
            families.map(fam => (
              <div key={fam._id} className="family-item-card">
                <div className="family-avatar">{fam.name[0]}</div>
                <div className="family-info">
                  <h6>{fam.name}</h6>
                  <span>{fam.members.length} Members</span>
                </div>
                <div className="family-actions">
                  {fam.createdBy?._id === user?._id && (
                    <button className="btn-action btn-delete" onClick={() => handleDeleteFamily(fam._id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button className="btn-action btn-view" onClick={() => {
                    setSelectedFamily(fam);
                    setShowFamilyModal(true);
                    setShowAddInline(false);
                    setRemoveMode(false);
                  }}>
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= FAMILY MODAL ================= */}
      <Modal show={showFamilyModal} onHide={() => setShowFamilyModal(false)} centered className="modern-modal" >
        {selectedFamily && (
          <>
            <Modal.Header >
              <Modal.Title>{selectedFamily.name}</Modal.Title>
              <button onClick={() => setShowFamilyModal(false)} className="custom-close-btn">✕</button>
            </Modal.Header>

            <Modal.Body>
              <div className="invite-box mb-4" onClick={() => navigator.clipboard.writeText(selectedFamily.inviteCode)}>
                <code>{selectedFamily.inviteCode}</code>
                <FaCopy/>
              </div>

              {isAdmin && (
                <div className="action-grid mb-3">
                  <button className="btn-modern btn-primary-modern" onClick={() => setShowAddInline(!showAddInline)}>
                    <FaUserPlus /> {showAddInline ? "Cancel" : "Add Member"}
                  </button>
                  <button className={`btn-modern ${removeMode ? "btn-danger-active" : "btn-outline-modern"}`}
                          onClick={() => setRemoveMode(!removeMode)}>
                    {removeMode ? "Exit Manage" : "Manage Members"}
                  </button>
                </div>
              )}

              {isAdmin && showAddInline && (
                <div className="invite-box mb-4">
                  <Form onSubmit={handleAddMember}>
                    <Form.Control
                      className="mb-2"
                      placeholder="Enter emails (comma separated)"
                      value={newMemberEmail}
                      onChange={e => setNewMemberEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-100 btn-primary-modern">Send Invite</Button>
                  </Form>
                </div>
              )}

              {selectedFamily.members.map(m => (
                <div key={m._id} className="member-row">
                  <span>{m.name} — {m.email}</span>
                  <span className={`status-badge ${m.isAvailable ? "available" : "unavailable"}`}>
                    {m.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  {isAdmin && removeMode && m._id !== selectedFamily.createdBy?._id && (
                    <button onClick={() => handleRemoveMember(m._id)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* ================= CREATE FAMILY MODAL ================= */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered className="modern-modal">
        <div className="modal-content-wrapper p-3">
          <button className="custom-close-btn" onClick={() => setShowCreate(false)}><X size={20} /></button>
          <div className="text-center w-100 pt-4">
            <div className="icon-badge-header mb-3">
              <Users size={32} className="text-white" />
            </div>
            <h2 className="fw-bold h4 mb-2">Create New Family</h2>
            <p className="small px-5" style={{color:'#64748b'}}>
              Start a new group to coordinate tasks and share health updates with your loved ones.
            </p>
          </div>
          <Modal.Body className="px-4 pb-4 pt-2">
            <Form onSubmit={handleCreate}>
              <div className="form-group-modern mb-4 text-start">
                <label className="input-label-modern fw-semibold mb-1 p-2">Family Name</label>
                <Form.Control
                  type="text"
                  className="input-field-modern py-3 px-3"
                  placeholder="e.g., The Henderson Family"
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" className="btn-primary-modern w-50 py-3 fw-bold shadow-sm">Create Group</Button>
              </div>
              <div className="text-center mt-3">
                <button type="button" className="btn btn-link text-decoration-none small" onClick={() => setShowCreate(false)} style={{color:'#64748b'}}>Cancel</button>
              </div>
            </Form>
          </Modal.Body>
        </div>
      </Modal>

      {/* ================= JOIN FAMILY MODAL ================= */}
      <Modal show={showJoin} onHide={() => setShowJoin(false)} centered className="jf-special-modal">
        <div className="jf-modal-wrapper">
          <button className="jf-close-x" onClick={() => setShowJoin(false)}><X size={20} /></button>
          <Modal.Body className="text-center p-4">
            <div className="jf-icon-circle mt-3 mb-3">
              <Users size={32} className="text-dark" />
            </div>
            <h3 className="jf-modal-title">Join Family</h3>
            <p className="jf-modal-subtitle">Enter your invite code below to join an existing family group.</p>
            <Form onSubmit={handleJoin} className="d-flex flex-column align-items-center">
              <div className="w-100 mb-4 text-start">
                <label className="jf-input-label">Invite Code</label>
                <Form.Control type="text" className="jf-input-control" placeholder="Invite Code"
                              value={inviteCode} onChange={e => setInviteCode(e.target.value)} required autoFocus/>
              </div>
              <Button type="submit" className="jf-main-button shadow-sm">Join Family</Button>
              <button type="button" className="btn jf-cancel-btn mt-3" onClick={() => setShowJoin(false)}>Cancel</button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>

    </div>
  );
};

export default FamilyDashboard;