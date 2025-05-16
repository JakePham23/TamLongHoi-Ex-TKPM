import '../styles/base/index.scss';
import { useState } from "react";
import Dashboard from './Dashboard.jsx';
import StudentScreen from './StudentScreen.jsx';
import DepartmentScreen from './DepartmentScreen.jsx';
import CourseScreen from './CourseScreen.jsx';
import RegistrationScreen from './RegistrationScreen.jsx';
import Tabbar from '../components/Tabbar/Tabbar.jsx';
import '../i18n/i18n.js'

// layout
const App = () => {
    const [view, setView] = useState("dashboard"); // Trạng thái ban đầu

    return (
        <div className="AppContainer">
            <Tabbar setView={setView} />
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
