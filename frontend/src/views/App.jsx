import '../styles/base/index.scss';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from './Dashboard.jsx';
import StudentScreen from './StudentScreen.jsx';
import DepartmentScreen from './DepartmentScreen.jsx';
import CourseScreen from './CourseScreen.jsx';
import RegistrationScreen from './RegistrationScreen.jsx';
import Tabbar from '../components/tabbar/Tabbar.jsx';
// layout
const App = () => {
    return (
        <Router>
            <div className="AppContainer"> {/* This is your overall application wrapper */}
                <Tabbar /> {/* Tabbar is rendered here */}
                {/* MainScreen is the content area that needs to adjust */}
                <div className="MainScreen">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/student" element={<StudentScreen />} />
                        <Route path="/department" element={<DepartmentScreen />} />
                        <Route path="/course" element={<CourseScreen />} />
                        <Route path="/registration" element={<RegistrationScreen />} />
                        {/* <Route path="/registration/:registrationId" element={<RegistrationDetailPage/>} /> */}

                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;