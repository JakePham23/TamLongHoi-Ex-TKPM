import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import RegistrationForm from "../components/Registrations/RegistrationForm.jsx";
import RegistrationTable from "../components/Registrations/RegistrationTable.jsx";
import useRegistration from "../hooks/useRegistration.jsx";
import useCourses from "../hooks/useCourse.jsx";
import useTeachers from "../hooks/useTeachers.jsx";
import useStudents from "../hooks/useStudents.jsx";
import useDepartments from "../hooks/useDepartments.jsx";
import registrationService from "../services/registration.service.jsx";
import { useTranslation } from "react-i18next";
import "../styles/pages/RegistrationScreen.scss";

const RegistrationScreen = () => {
  const { t } = useTranslation('registration');

  const {
    registrations,
    fetchRegistrations,
    loading,
    error
  } = useRegistration();

  const { courses = [], fetchCourses } = useCourses();
  const { teachers = [], fetchTeachers } = useTeachers();
  const { students = [], fetchStudents } = useStudents();
  const { departments = [], fetchDepartments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    console.log("Fetching data..."); // Debug data fetching
    fetchRegistrations();
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
  }, [fetchRegistrations, fetchCourses, fetchDepartments, fetchTeachers, fetchStudents]);

  const handleSaveRegistration = async (newRegistration) => {
    try {
      await registrationService.addRegistration(newRegistration);
      await fetchRegistrations();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding registration:", error);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    try {
      await registrationService.deleteRegistration(registrationId);
      await fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleEditRegistration = async (registrationId, registrationData) => {
    try {
      await registrationService.updateRegistration(registrationId, registrationData);
      await fetchRegistrations();
    } catch (error) {
      console.error("Error updating registration:", error);
    }
  };

  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('error')}</div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="RegistrationScreen">
        <h1>{t('registrationList')}</h1>

        <div className="top-bar">
          <SearchInput
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            icon={<FaPlus />}
            label={t('addRegistration')}
            variant="gray"
            onClick={() => setIsAdding(true)}
          />
        </div>

        {isAdding && (
          <RegistrationForm
            onSave={handleSaveRegistration}
            courses={courses}
            teachers={teachers}
            departments={departments}
            onClose={() => setIsAdding(false)}
          />
        )}

        <RegistrationTable />
      </div>
    );
  }

  return (
    <div className="RegistrationScreen">
      <h1>{t('registrationList')}</h1>

      <div className="top-bar">
        <SearchInput
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={<FaPlus />}
          label={t('addRegistration')}
          variant="gray"
          onClick={() => setIsAdding(true)}
        />
      </div>

      {isAdding && (
        <RegistrationForm
          onSave={handleSaveRegistration}
          onEdit={handleEditRegistration}
          courses={courses}
          teachers={teachers}
          departments={departments}
          onClose={() => setIsAdding(false)}
        />
      )}

      <RegistrationTable
        registrations={registrations}
        courses={courses}
        teachers={teachers}
        students={students}
        departments={departments}
        searchTerm={searchTerm}
        onDelete={handleDeleteRegistration}
        onEdit={handleEditRegistration}
      />
    </div>
  );
};

export default RegistrationScreen;