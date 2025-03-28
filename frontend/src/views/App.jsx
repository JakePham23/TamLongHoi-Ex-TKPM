import '../styles/base/index.scss';
import { useState } from "react";
import Dashboard from './Dashboard.jsx';
import StudentScreen from './StudentScreen.jsx';
import DepartmentScreen from './DepartmentScreen.jsx'; // Thêm dòng này
import Tabbar from '../components/Tabbar/Tabbar.jsx';

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
            </div>
        </div>
    );
};


export default App;
