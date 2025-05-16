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
import Select from "../components/Select.jsx";

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
  
  // State for academic year and semester selection
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showData, setShowData] = useState(false);

  // Generate academic years (example: last 5 years and next 5 years)
    const currentYear = new Date().getFullYear();
    const startYear = 2020;

    const academicYears = [];

    for (let year = startYear; year <= currentYear + 1; year++) {
      academicYears.push({
        value: `${year}-${year + 1}`,
        label: `${year}-${year + 1}`
      });
    }


  const semesters = [
    { value: "1", label: t('semester1') },
    { value: "2", label: t('semester2') },
    { value: "3", label: t('summerSemester') }
  ];

  useEffect(() => {
    console.log("Fetching data...");
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
  }, [fetchCourses, fetchDepartments, fetchTeachers, fetchStudents]);

  useEffect(() => {
    if (selectedAcademicYear && selectedSemester) {
      fetchRegistrations(selectedAcademicYear, selectedSemester);
    }
  }, [selectedAcademicYear, selectedSemester, fetchRegistrations]);

  const handleSaveRegistration = async (newRegistration) => {
    try {
      // Add academic year and semester to the new registration
      const registrationWithTerm = {
        ...newRegistration,
        academicYear: selectedAcademicYear,
        semester: selectedSemester
      };
      await registrationService.addRegistration(registrationWithTerm);
      await fetchRegistrations(selectedAcademicYear, selectedSemester);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding registration:", error);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    try {
      await registrationService.deleteRegistration(registrationId);
      await fetchRegistrations(selectedAcademicYear, selectedSemester);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleEditRegistration = async (registrationId, registrationData) => {
    try {
      // Ensure academic year and semester are preserved
      const updatedRegistration = {
        ...registrationData,
        academicYear: selectedAcademicYear,
        semester: selectedSemester
      };
      await registrationService.updateRegistration(registrationId, updatedRegistration);
      await fetchRegistrations(selectedAcademicYear, selectedSemester);
    } catch (error) {
      console.error("Error updating registration:", error);
    }
  };

  const handleShowData = () => {
    if (selectedAcademicYear && selectedSemester) {
      setShowData(true);
    }
  };

  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('error')}</div>;
  }

  return (
    <div className="RegistrationScreen">
      <h1>{t('registrationList')}</h1>

      <div className="selection-container">
        <div className="selection-row">
          <Select
            options={academicYears}
            value={selectedAcademicYear}
            onChange={(e) => {
              setSelectedAcademicYear(e.target.value);
              setShowData(false);
            }}
            placeholder={t('selectAcademicYear')}
          />
          
          <Select
            options={semesters}
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setShowData(false);
            }}
            placeholder={t('selectSemester')}
          />
          
          <Button
            label={t('showData')}
            variant="primary"
            onClick={handleShowData}
            disabled={!selectedAcademicYear || !selectedSemester}
          />
        </div>
      </div>

      {showData && (
        <>
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
              disabled={!selectedAcademicYear || !selectedSemester}
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
              academicYear={selectedAcademicYear}
              semester={selectedSemester}
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
        </>
      )}
    </div>
  );
};

export default RegistrationScreen;