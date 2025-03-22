import React from "react";
import "../styles/Button.scss"; // File CSS riêng cho button

const Button = ({ icon, label, onClick, variant = "default" }) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;
