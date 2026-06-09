import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext.jsx";
import { FaEdit, FaTrash, FaPaperPlane, FaHeart, FaWhatsapp, FaPlus } from "react-icons/fa";
import "./forum.css";

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
  const [editingPost, setEditingPost] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});

  const API_URL = "http://localhost:5000/api/forum";

// "https://caresync-care-production.up.railway.app/api/forum";

  const loadPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, [user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (newPost.image) formData.append("image", newPost.image);

      if (editingPost) {
        await axios.put(`${API_URL}/${editingPost._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setShowModal(false);
      setNewPost({ title: "", content: "", image: null });
      setEditingPost(null);
      loadPosts();
    } catch (err) {
      console.error("Error creating/editing post:", err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      loadPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${API_URL}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      loadPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      loadPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const addComment = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    try {
      await axios.post(`${API_URL}/comment`, { postId, content: text }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCommentTexts(prev => ({ ...prev, [postId]: "" }));
      loadPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!user) return <div className="centered-info"><p>Please log in to view the forum.</p></div>;

  const latestTips = [
    { title: "Healthy Eating Habits" },
    { title: "Exercise Daily" },
    { title: "Mental Health Matters" },
  ];

  const trendingNews = [
    { title: "New Vaccine Updates" },
    { title: "Healthcare Tech Trends" },
    { title: "Local Health Campaigns" },
  ];

  return (
    <div className="forum-wrapper" style={{background:'#e9f3fd'}}>
<header className="forum-header-modern">
  <div className="header-container-centered">
    <div className="text-center">
      <span className="pill-label">Community Space</span>
      <h1 className="modern-title">Health <span>Forum</span></h1>
      <p className="modern-subtitle">
        Join 2,000+ members sharing insights and personal health journeys.
      </p>
    </div>
    
    <div className="button-wrapper">
      <button className="glass-button" onClick={() => setShowModal(true)}>
        <FaPlus />
        <span>Start a Discussion</span>
      </button>
    </div>
  </div>
</header>

      <div className="forum-main-layout" >
        <section className="feed-section">
          {loading ? (
            <div className="loader-box">Loading discussions...</div>
          ) : (
            posts.map(post => (
              <article className="post-card" key={post._id}>
                <div className="post-header">
                  <div className="user-info">
                    <div className="user-avatar">{post.author?.name?.charAt(0)}</div>
                    <div className="user-details">
                      <span className="user-name">{post.author?.name}</span>
                      <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {post.author?._id === user._id && (
                    <div className="post-controls">
                      <button className="icon-btn-edit" onClick={() => { setEditingPost(post); setNewPost({ title: post.title, content: post.content, image: null }); setShowModal(true); }}>
                        <FaEdit />
                      </button>
                      <button className="icon-btn-delete" onClick={() => handleDelete(post._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-text">{post.content}</p>
                  {post.image && (
                    <div className="post-image-container">
                      {/* <img src={`https://caresync-care-production.up.railway.app/${post.image}`} alt="post" /> */}
                      <img src={`http://localhost:5000/${post.image}`} alt="post" />
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button className={`action-btn ${post.likes?.includes(user._id) ? "liked" : ""}`} onClick={() => toggleLike(post._id)}>
                    <FaHeart /> <span>{post.likes?.length || 0}</span>
                  </button>
                  <span className="comment-count">{post.comments?.length || 0} Comments</span>
                </div>

                <div className="comments-section" style={{background:'#0f172a'}}>
                  <div className="comment-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Write a comment..." 
                      value={commentTexts[post._id] || ""} 
                      onChange={e => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && addComment(post._id)}
                    />
                    <button className="send-btn" onClick={() => addComment(post._id)}><FaPaperPlane /></button>
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map(c => (
                        <div className="comment-item" key={c._id}>
                          <div className="comment-content">
                            <span className="comment-author">{c.author?.name}</span>
                            <p>{c.content}</p>
                          </div>
                          {c.author?._id === user._id && (
                            <button className="del-comment-btn" onClick={() => deleteComment(c._id)}><FaTrash size={10} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="sidebar-section">
          <div className="sidebar-card whatsapp-widget">
            <FaWhatsapp className="wa-icon" />
            <h3>WhatsApp Group</h3>
            <p>Join for instant health discussions!</p>
            <a href="https://chat.whatsapp.com/GAORPKNh1TiCevw0Iveugl" target="_blank" className="join-btn">Join Now</a>
          </div>

          {/* <div className="sidebar-card" style={{background:'#ffffc2'}}>
            <h3>💡 Daily Health Tips</h3>
            <ul className="sidebar-list">
              {latestTips.map((tip, i) => <li key={i}>{tip.title}</li>)}
            </ul>
          </div>

          <div className="sidebar-card" style={{background:'#c5acff'}}>
            <h3>📰 Trending News</h3>
            <ul className="sidebar-list">
              {trendingNews.map((news, i) => <li key={i}>{news.title}</li>)}
            </ul>
          </div> */}
        </aside>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <h2 className="text-white">{editingPost ? "Edit Post" : "New Post"}</h2>
              <button className="close-x" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePostSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Content</label>
                <textarea rows="4" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Attachment</label>
                <input type="file" onChange={e => setNewPost({ ...newPost, image: e.target.files[0] })} />
              </div>
              <button type="submit" className="submit-post-btn">
                {editingPost ? "Update" : "Post Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;