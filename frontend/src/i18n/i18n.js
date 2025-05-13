import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import dashboard_EN from '../assets/locales/en/dashboard.json'
import department_EN from '../assets/locales/en/department.json'
import component_EN from '../assets/locales/en/component.json'
import student_EN from '../assets/locales/en/student.json'

import dashboard_VI from '../assets/locales/vi/dashboard.json'
import department_VI from '../assets/locales/vi/department.json'

export const locales = {
    "en": "English",
    "vi": "Tiếng Việt"
}

const resources = {
    en: {
        dashboard: dashboard_EN,
        department: department_EN,
        component: component_EN,
        student: student_EN
    },
    vi: {
        dashboard: dashboard_VI,
        department: department_VI
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    ns: ['dashboard', 'department', 'component'],
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false
    }
});
