import React from "react";
import "./loader.css"; // we will create this next

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="text-muted mt-2">Loading...</p>
    </div>
  );
};

export default Loader;