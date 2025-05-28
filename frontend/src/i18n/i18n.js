import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import dashboard_EN from '../assets/locales/en/dashboard.json'
import department_EN from '../assets/locales/en/department.json'
import component_EN from '../assets/locales/en/component.json'
import student_EN from '../assets/locales/en/student.json'
import course_EN from '../assets/locales/en/course.json'
import registration_EN from '../assets/locales/en/registration.json'
import class_EN from '../assets/locales/en/class.json';

import dashboard_VI from '../assets/locales/vi/dashboard.json'
import department_VI from '../assets/locales/vi/department.json'
import component_VI from '../assets/locales/vi/component.json'
import student_VI from '../assets/locales/vi/student.json'
import course_VI from '../assets/locales/vi/course.json'
import registration_VI from '../assets/locales/vi/registration.json'
import class_VI  from '../assets/locales/vi/class.json';


export const locales = {
    "en": "English",
    "vi": "Tiếng Việt"
}

const resources = {
    en: {
        dashboard: dashboard_EN,
        department: department_EN,
        component: component_EN,
        student: student_EN,
        course: course_EN,
        registration: registration_EN,
        class: class_EN
    },
    vi: {
        dashboard: dashboard_VI,
        department: department_VI,
        component: component_VI,
        student: student_VI,
        course: course_VI,
        registration: registration_VI,
        class: class_VI
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    ns: ['dashboard', 'department', 'component', 'student', 'course', 'registration', 'class'],
    fallbackLng: ['vi', 'en'],
    supportedLngs: ['vi', 'en'],
    interpolation: {
        escapeValue: false
    }
});
