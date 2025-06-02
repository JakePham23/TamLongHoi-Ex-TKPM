import { useTranslation } from 'react-i18next';
import '../styles/pages/Dashboard.scss'
const Dashboard = () => {
    const { t } = useTranslation('dashboard');
    return (
        <h1> {t('dashboard')}</h1>
    )
}

export default Dashboard;