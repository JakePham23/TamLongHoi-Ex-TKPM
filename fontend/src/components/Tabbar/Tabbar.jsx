import React, { useState } from "react";
import { FaTachometerAlt, FaUniversity, FaUserGraduate, FaBook } from "react-icons/fa";
import "../../styles/Tabbar.scss";
import logo from "../../assets/images/local/logo-khtn.png";
import TabButton from "./TabButton.jsx";

const Tabbar = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabClick = (view) => {
    console.log("Switching to:", view); // Debug xem có log đúng không
    setActiveTab(view);
    setView(view);
  };

  return (
    <div className="Tabbar">
      <div className="Logo">
        <img src={logo} alt="Logo KHTN" />
        <h2>Student Management</h2>
      </div>
      <div className="ListContent">
      <TabButton icon={<FaTachometerAlt />} label="Dashboard" isActive={activeTab == "dashboard"} onClick={() => handleTabClick("dashboard")} />
      <TabButton icon={<FaUniversity />} label="Department" isActive={activeTab == "department"} onClick={() => handleTabClick("department")} />
      <TabButton icon={<FaUserGraduate />} label="Student" isActive={activeTab == "student"} onClick={() => handleTabClick("student")} />

      </div>
    </div>
  );
};

export default Tabbar;
