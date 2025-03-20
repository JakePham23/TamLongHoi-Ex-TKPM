import React, { useState } from "react";
import { FaTachometerAlt, FaUserGraduate, FaBars } from "react-icons/fa";
import "./Tabbar.css";

const Tabbar = ({ setView }) => {
  const [collapsed] = useState(false);

  return (
    <div className={`tabbar ${collapsed ? "collapsed" : ""}`}>
      <div className="tabbar-header">
        {!collapsed && <img src="./logo-khtn.png" alt="Logo KHTN" className="tabbar-logo" />}
      </div>

      <div className="menu">
        <div className="menu-item" onClick={() => setView("dashboard")}>
          <FaTachometerAlt />
          {!collapsed && <span>Dashboard</span>}
        </div>
        <div className="menu-item" onClick={() => setView("students")}>
          <FaUserGraduate />
          {!collapsed && <span>Student</span>}
        </div>
      </div>
    </div>
  );
};

export default Tabbar;
