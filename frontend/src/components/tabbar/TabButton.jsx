// src/components/common/TabButton.jsx (Example)
import React from 'react';
// import './TabButton.scss'; // Import its own styles if you create a separate file

const TabButton = ({ icon, label, isActive, onClick, isCollapsed, ...restProps }) => {
  return (
    <button
      className={`TabButton ${isActive ? "active" : ""} ${isCollapsed ? "collapsed-visual-state" : ""}`} // Add a class for visual state if needed beyond parent
      onClick={onClick}
      title={isCollapsed ? label : undefined} // Show label as tooltip when collapsed
      {...restProps} // Pass aria attributes etc.
    >
      <span className="tab-icon">{icon}</span>
      {!isCollapsed && <span className="tab-label">{label}</span>}
    </button>
  );
};

export default TabButton;