import React, { use, useState } from "react";
import { FaTachometerAlt, FaUniversity, FaUserGraduate, FaBook, FaGlobe } from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import "../../styles/Tabbar.scss";
import logo from "../../assets/images/local/logo-khtn.png";
import TabButton from "./TabButton.jsx";
import { useTranslation } from 'react-i18next'
import Popover from "../Popover.jsx";
import "../../styles/Popover.scss"
import { locales } from "../../i18n/i18n.js";

const Tabbar = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeDropdown, setActiveDropdown] = useState(false);

  const { t, i18n } = useTranslation();
  const currentLanguage = locales[i18n.language]

  const handleTabClick = (view) => {
    console.log("Switching to:", view); // Debug xem có log đúng không
    setActiveTab(view);
    setView(view);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const handleLanClick = () => {
    setActiveDropdown((s) => !s);
  }

  return (
    <div className="Tabbar">
      <div className="Logo">
        <img src={logo} alt="Logo KHTN" />
        <h2>{t('student management')}</h2>
      </div>
      <div className="ListContent">
        <TabButton icon={<FaTachometerAlt />} label={t('dashboard')} isActive={activeTab == "dashboard"} onClick={() => handleTabClick("dashboard")} />
        <TabButton icon={<FaUniversity />} label={t('department')} isActive={activeTab == "department"} onClick={() => handleTabClick("department")} />
        <TabButton icon={<FaUserGraduate />} label={t('student')} isActive={activeTab == "student"} onClick={() => handleTabClick("student")} />
        <TabButton icon={<FaBook />} label={t('course')} isActive={activeTab == "course"} onClick={() => handleTabClick("course")} />
        <TabButton icon={<MdAppRegistration />} label={t('registration')} isActive={activeTab == "registration"} onClick={() => handleTabClick("registration")} />

        {/* Languague select */}
        <TabButton icon={<FaGlobe />} label={currentLanguage} onClick={() => handleLanClick()} />
        {activeDropdown && (<Popover variants={locales} onClick={changeLanguage}></Popover>)}
      </div>
    </div>
  );
};

export default Tabbar;
