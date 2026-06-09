import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaSearch, FaThumbtack, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { getUserNotes, createNote, updateNote, deleteNote, togglePin, searchNotes } from "../api/notes.js";
import "./notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    const res = await getUserNotes();
    const sorted = res.data.sort((a, b) => b.pinned - a.pinned || new Date(b.createdAt) - new Date(a.createdAt));
    setNotes(sorted);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    editId ? await updateNote(editId, { content }) : await createNote({ content });
    setEditId(null);
    setContent("");
    loadNotes();
  };

  return (
    <div className="notes-canvas">
      <Container>
        {/* Header Section */}
     <header className="intel-header">
  <div className="header-main">
    <div className="status-indicator-group">
      {/* <span className="module-tag">Module: Intelligence</span> */}
      {/* <div className="live-pulse"></div> */}
    </div>
    <h1 className="header-title">Notes</h1>
    <p className="header-subtitle">
      Encrypted repository for critical information and executive thoughts.
    </p>
  </div>

  <div className="header-actions">
    <div className="search-container">
      <div className="search-wrapper">
        <FaSearch className="search-meta-icon" />
        <input 
          type="text" 
          className="intel-search-input"
          placeholder="Filter intelligence..." 
          onChange={(e) => setSearch(e.target.value)} 
        />
        {/* <kbd className="search-key">⌘K</kbd> */}
      </div>
    </div>
  </div>
</header>

        {/* Input Section */}
<div className="intel-glass-wrapper">
  {/* Background Decor */}
  <div className="glass-blob"></div>

  <div className="capture-console">
    {/* TEXT AREA CARD */}
    <div className={`glass-capture-card ${content ? 'active' : ''}`}>
      <div className="capture-header">
       
        <span className="terminal-text">KEYNOTES</span>
      </div>

      <textarea
        className="glass-textarea"
        placeholder="Encrypt new intelligence..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={content ? 5 : 2}
      />
    </div>

    {/* EXTERNAL ACTION BUTTONS */}
    <div className={`external-actions ${content ? 'visible' : ''}`}>
      <div className="button-cluster">
        <button className="btn-out-cancel" onClick={() => setContent("")}>
          Cancel
        </button>
        <button className="btn-out-save" onClick={handleSave}>
          {editId ? "Update" : "Save"}
        </button>
      </div>
    </div>
  </div>
</div>

        {/* Notes Grid */}
      <Row className="g-4 mt-2">
  {notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase())).map((note) => (
    <Col key={note._id} xl={3} lg={4} md={6}>
      <div className={`intel-module-card ${note.pinned ? "is-priority" : ""}`}>
        {/* Top Decorative bar */}
        <div className="module-scanner"></div>
        
        <div className="module-inner" style={{background:'#e2f0ff'}}>
          <div className="module-header">
            <div className="meta-left">
              <span className="system-id">Note</span>
              <span className="module-date">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <FaThumbtack 
              className={`pin-trigger ${note.pinned ? "pinned" : ""}`} 
              onClick={() => togglePin(note._id).then(loadNotes)}
            />
          </div>

          <div className="module-content">
            <p>{note.content}</p>
          </div>

          <div className="module-footer">
            <div className="module-status">
              <span className="status-indicator"></span>
              {note.pinned ? "Important" : "Basic"}
            </div>
            <div className="module-actions">
              <button className="edit-trigger" onClick={() => setEditId(note._id) || setContent(note.content)}>
                <FaEdit />
              </button>
              <button className="delete-trigger" onClick={() => deleteNote(note._id).then(loadNotes)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Col>
  ))}
</Row>
      </Container>
    </div>
  );
};

export default Notes;