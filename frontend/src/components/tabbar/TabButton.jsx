import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TabButton Component:
 * - Renders a <Link> for navigation if 'to' prop is provided.
 * - Renders a <button> for other actions if 'to' is not provided.
 * - Applies correct classes for styling based on active, collapsed, and hover states.
 */
const TabButton = ({ to, icon, label, isActive, onClick, isCollapsed, ...props }) => {
  const buttonContent = (
    <>
      {/* Icon is always visible */}
      <span className="tab-icon">{icon}</span>
      {/* Label is hidden when tabbar is collapsed */}
      {!isCollapsed && <span className="tab-label">{label}</span>}
    </>
  );

  const classNames = `TabButton ${isActive ? 'active' : ''}`;

  // Use Link for navigation
  if (to) {
    return (
      <Link to={to} className={classNames} onClick={onClick} {...props}>
        {buttonContent}
      </Link>
    );
  }

  // Use button for other actions (like the language selector)
  return (
    <button className={classNames} onClick={onClick} {...props}>
      {buttonContent}
    </button>
  );
};

export default TabButton;