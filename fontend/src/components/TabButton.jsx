import React from "react";
import "../styles/TabButton.scss"; // Tạo file CSS riêng cho nút

const TabButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button className={`tab-button ${isActive ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default TabButton;
