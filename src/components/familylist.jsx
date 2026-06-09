import React from "react";
import "../pages/familychat.css";
const FamilyList = ({ families, selectedFamily, onSelect }) => {
  return (
<div className="family-section">
  <div className="family-header">
    <h2>My Families</h2>
    <p>Manage your family circles and shared activities</p>
  </div>
  
  <div className="family-chips-container">
    {families.map((family) => (
      <button
        key={family._id}
        className={`family-chip ${
          selectedFamily?._id === family._id ? "active" : ""
        }`}
        onClick={() => onSelect(family)}
      >
        {family.name}
      </button>
    ))}
  </div>
</div>

  );
};

export default FamilyList;
