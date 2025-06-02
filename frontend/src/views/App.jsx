import '../styles/base/index.scss';
import { useState } from "react";
import Dashboard from './Dashboard.jsx';
import StudentScreen from './StudentScreen.jsx';
import DepartmentScreen from './DepartmentScreen.jsx';
import CourseScreen from './CourseScreen.jsx';
import RegistrationScreen from './RegistrationScreen.jsx';
import Tabbar from '../components/tabbar/Tabbar.jsx';
import '../i18n/i18n.js'

// layout
// layout
const App = () => {
    const [view, setView] = useState("dashboard"); // Trạng thái ban đầu

    return (
        <div className="AppContainer"> {/* This is your overall application wrapper */}
            <Tabbar setView={setView} /> {/* Tabbar is rendered here */}
            {/* MainScreen is the content area that needs to adjust */}
            <div className="MainScreen">
                {view === "dashboard" && <Dashboard />}
                {view === "student" && <StudentScreen />}
                {view === "department" && <DepartmentScreen />}
                {view === "course" && <CourseScreen />}
                {view === "registration" && <RegistrationScreen />}
            </div>
        </div>
    );
};

export default App;
