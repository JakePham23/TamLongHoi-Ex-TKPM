import React, { useState, useRef, useEffect } from "react";
import {
  FaTachometerAlt, FaUniversity, FaUserGraduate, FaBook, FaGlobe,
  FaAngleLeft, FaAngleRight // Icons for collapse/expand
} from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import "../../styles/Tabbar.scss"; // We will create/update this
import logo from "../../assets/images/local/logo-khtn.png";
import TabButton from "./TabButton.jsx"; // Assuming TabButton can handle an isCollapsed prop
import { useTranslation } from 'react-i18next';
import Popover from "../common/Popover.jsx";
import { locales } from "../../i18n/i18n.js";

const TABBAR_EXPANDED_WIDTH_PX = 250; // Or your $tabbar-expanded-width from SCSS
const TABBAR_COLLAPSED_WIDTH_PX = 65;  // Or your $tabbar-collapsed-width from SCSS

const Tabbar = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false); // State for tabbar collapse
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false);

  const languageButtonRef = useRef(null);
  const popoverRef = useRef(null);

  const { t, i18n } = useTranslation();
  const currentLanguage = locales[i18n.language];
 useEffect(() => {
    const newWidth = isCollapsed ? `${TABBAR_COLLAPSED_WIDTH_PX}px` : `${TABBAR_EXPANDED_WIDTH_PX}px`;
    document.documentElement.style.setProperty('--tabbar-current-width', newWidth);
  }, [isCollapsed]);
  const handleTabClick = (view) => {
    setActiveTab(view);
    setView(view);
    if (languagePopoverOpen) { // Close language popover when a main tab is clicked
      setLanguagePopoverOpen(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
    if (languagePopoverOpen) { // Close popover if open when collapsing/expanding
      setLanguagePopoverOpen(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguagePopoverOpen(false);
  };

  const handleLanguageButtonClick = (event) => {
    event.stopPropagation(); // Prevent click from bubbling up if needed
    setLanguagePopoverOpen(prev => !prev);
  };

  // Effect to handle clicking outside the language popover to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languagePopoverOpen &&
          languageButtonRef.current && !languageButtonRef.current.contains(event.target) &&
          popoverRef.current && !popoverRef.current.contains(event.target)) {
        setLanguagePopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languagePopoverOpen]);

  return (
    <div className={`Tabbar ${isCollapsed ? "collapsed" : "expanded"}`}>
      <div className="Tabbar-header">
        <div className="Logo">
          <img src={logo} alt="Logo KHTN" />
          {!isCollapsed && <h2 className="logo-text">{t('student management')}</h2>}
        </div>
        <button
          onClick={toggleCollapse}
          className="collapse-toggle-button"
          aria-label={isCollapsed ? t('common:expandSidebar') : t('common:collapseSidebar')} // For accessibility
        >
          {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>

      <nav className="ListContent" aria-label={t('common:mainNavigation')}>
        <TabButton icon={<FaTachometerAlt />} label={t('dashboard')} isActive={activeTab === "dashboard"} onClick={() => handleTabClick("dashboard")} isCollapsed={isCollapsed} />
        <TabButton icon={<FaUniversity />} label={t('department')} isActive={activeTab === "department"} onClick={() => handleTabClick("department")} isCollapsed={isCollapsed} />
        <TabButton icon={<FaUserGraduate />} label={t('student')} isActive={activeTab === "student"} onClick={() => handleTabClick("student")} isCollapsed={isCollapsed} />
        <TabButton icon={<FaBook />} label={t('course')} isActive={activeTab === "course"} onClick={() => handleTabClick("course")} isCollapsed={isCollapsed} />
        <TabButton icon={<MdAppRegistration />} label={t('registration')} isActive={activeTab === "registration"} onClick={() => handleTabClick("registration")} isCollapsed={isCollapsed} />
      </nav>

      <div className="Tabbar-footer">
        <div className="language-selector-container" ref={languageButtonRef}>
          <TabButton
            icon={<FaGlobe />}
            label={currentLanguage} // Label will be hidden by TabButton when isCollapsed
            onClick={handleLanguageButtonClick}
            isCollapsed={isCollapsed}
            isActive={languagePopoverOpen} // Optionally make it appear active when popover is open
            aria-haspopup="true"
            aria-expanded={languagePopoverOpen}
          />
          {languagePopoverOpen && (
            <div ref={popoverRef} className={`language-popover ${isCollapsed ? 'popover-for-collapsed-tabbar' : ''}`}>
              <Popover
                variants={locales} 
                onClick={changeLanguage}
                currentLang={i18n.language}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabbar;