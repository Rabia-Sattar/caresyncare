// components/Sidebar.jsx
import React,{useContext} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Home,
  Users,
  CheckSquare,
  Calendar,
  HeartPulse,
  Bell,
  MessageCircle,
  FileText,
  BarChart3,
  Cpu,
  Bot,
  TrendingUp,
  BellRing,
  LogOut,
  ChevronLeft,
  Menu,
  User,
  
} from "lucide-react";
import "./sidebar.css";
import { AuthContext } from "../context/authcontext";
import Logo from "../assets/logo.png";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
  logout();           // clears user from context + localStorage
  navigate("/login"); // redirect to login page
};

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-left">
          {!collapsed && 
          <img
            src={Logo}
            alt="CareSync Logo"
            style={{
              width: "80px",
              height: "60px",
              objectFit: "contain",
              marginLeft: "-20px",
            }}
          />}
          {!collapsed && <span className="brand-text">CareSync</span>}
        </div>

        {/* Toggle button */}
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={25} /> : <ChevronLeft size={25} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <div className="menu-section">
          {!collapsed && <p className="menu-title">MAIN</p>}
          <NavLink to="/" className="menu-item">
            <Home size={18} />
            {!collapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/dashboard" className="menu-item">
            <LayoutGrid size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/family-dashboard" className="menu-item">
            <Users size={18} />
            {!collapsed && <span>Family Group</span>}
          </NavLink>
          <NavLink to="/tasks" className="menu-item">
            <CheckSquare size={18} />
            {!collapsed && <span>Tasks</span>}
          </NavLink>
          <NavLink to="/calendar" className="menu-item">
            <Calendar size={18} />
            {!collapsed && <span>Calendar</span>}
          </NavLink>
        </div>

        <div className="menu-section">
          {!collapsed && <p className="menu-title">HEALTH</p>}
          <NavLink to="/health-logs" className="menu-item">
            <HeartPulse size={18} />
            {!collapsed && <span>Health</span>}
          </NavLink>
          <NavLink to="/reminders" className="menu-item">
            <Bell size={18} />
            {!collapsed && <span>Reminders</span>}
          </NavLink>
        </div>

        <div className="menu-section">
          {!collapsed && <p className="menu-title">COMMUNITY</p>}
          <NavLink to="/forum" className="menu-item">
            <Users size={18} />
            {!collapsed && <span>Forum</span>}
          </NavLink>
          <NavLink to="/family-chat" className="menu-item">
            <MessageCircle size={18} />
            {!collapsed && <span>Messages</span>}
          </NavLink>
          <NavLink to="/notes" className="menu-item">
            <FileText size={18} />
            {!collapsed && <span>Notes</span>}
          </NavLink>
        </div>

        <div className="menu-section">
          {!collapsed && <p className="menu-title">INSIGHTS</p>}
          <NavLink to="/analytics" className="menu-item">
            <BarChart3 size={18} />
            {!collapsed && <span>Analytics</span>}
          </NavLink>
          <NavLink to="/ai-insights" className="menu-item">
            <Cpu size={18} />
            {!collapsed && <span>AI Insights</span>}
          </NavLink>
          <NavLink to="/ai-chatbot" className="menu-item">
            <Bot size={18} />
            {!collapsed && <span>AI Chatbot</span>}
          </NavLink>
          <NavLink to="/health-trends" className="menu-item">
            <TrendingUp size={18} />
            {!collapsed && <span>Health Trends</span>}
          </NavLink>
          <NavLink to="/smart-reminders" className="menu-item">
            <BellRing size={18} />
            {!collapsed && <span>Smart Reminders</span>}
          </NavLink>
        </div>

        <div className="menu-section">
          {!collapsed && <p className="menu-title">SETTINGS</p>}
          <NavLink to="/emergency" className="menu-item">
            <Bell size={18} />
            {!collapsed && <span>Emergency</span>}
          </NavLink>
        </div>
        <div className="menu-section">
          {!collapsed && <p className="menu-title">PERSONAL</p>}
          <NavLink to="/profile" className="menu-item">
            <User size={18} />
            {!collapsed && <span>Profile</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
  <LogOut size={20} />
  {!collapsed && <span>Sign Out</span>}
</button>
      </div>
    </aside>
  );
};

export default Sidebar;
