import { useTranslation } from 'react-i18next';
import '../styles/pages/Dashboard.scss'
const Dashboard = () => {
    const { t } = useTranslation('dashboard');
    return (
        <div className="Dashboard">
            <h1> {t('dashboard')}</h1>
        </div>
    )
}

export default Dashboard;