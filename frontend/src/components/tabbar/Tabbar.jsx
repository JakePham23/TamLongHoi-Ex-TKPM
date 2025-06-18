import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link and useLocation
import {
  FaTachometerAlt, FaUniversity, FaUserGraduate, FaBook, FaGlobe,
  FaAngleLeft, FaAngleRight
} from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import "../../styles/Tabbar.scss";
import logo from "../../assets/images/local/logo-khtn.png";
import TabButton from "./TabButton.jsx";
import { useTranslation } from 'react-i18next';
import Popover from "../common/Popover.jsx";
import { locales } from "../../i18n/i18n.js";

const TABBAR_EXPANDED_WIDTH_PX = 250;
const TABBAR_COLLAPSED_WIDTH_PX = 65;

const Tabbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false);

  const languageButtonRef = useRef(null);
  const popoverRef = useRef(null);

  const { t, i18n } = useTranslation();
  const location = useLocation(); // Get the current location
  const currentLanguage = locales[i18n.language];

  useEffect(() => {
    const newWidth = isCollapsed ? `${TABBAR_COLLAPSED_WIDTH_PX}px` : `${TABBAR_EXPANDED_WIDTH_PX}px`;
    document.documentElement.style.setProperty('--tabbar-current-width', newWidth);
  }, [isCollapsed]);

  const handleNavClick = () => {
    if (languagePopoverOpen) {
      setLanguagePopoverOpen(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
    if (languagePopoverOpen) {
      setLanguagePopoverOpen(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguagePopoverOpen(false);
  };

  const handleLanguageButtonClick = (event) => {
    event.stopPropagation();
    setLanguagePopoverOpen(prev => !prev);
  };

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

  // Determine active tab based on the current route
  const getActiveTab = (pathname) => {
    if (pathname === '/') return 'dashboard';
    return pathname.substring(1); // Removes the leading '/'
  };
  const activeTab = getActiveTab(location.pathname);

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
          aria-label={isCollapsed ? t('common:expandSidebar') : t('common:collapseSidebar')}
        >
          {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>

      <nav className="ListContent" aria-label={t('common:mainNavigation')}>
        <TabButton to="/" icon={<FaTachometerAlt />} label={t('dashboard')} isActive={activeTab === "dashboard"} onClick={handleNavClick} isCollapsed={isCollapsed} />
        <TabButton to="/department" icon={<FaUniversity />} label={t('department')} isActive={activeTab === "department"} onClick={handleNavClick} isCollapsed={isCollapsed} />
        <TabButton to="/student" icon={<FaUserGraduate />} label={t('student')} isActive={activeTab === "student"} onClick={handleNavClick} isCollapsed={isCollapsed} />
        <TabButton to="/course" icon={<FaBook />} label={t('course')} isActive={activeTab === "course"} onClick={handleNavClick} isCollapsed={isCollapsed} />
        <TabButton to="/registration" icon={<MdAppRegistration />} label={t('registration')} isActive={activeTab === "registration"} onClick={handleNavClick} isCollapsed={isCollapsed} />
      </nav>

      <div className="Tabbar-footer">
        <div className="language-selector-container" ref={languageButtonRef}>
          <TabButton
            icon={<FaGlobe />}
            label={currentLanguage}
            onClick={handleLanguageButtonClick}
            isCollapsed={isCollapsed}
            isActive={languagePopoverOpen}
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