/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/common/SearchInput.jsx";
import Button from "../components/common/Button.jsx";
import RegistrationForm from "../components/domain/registrations/RegistrationForm.jsx";
import RegistrationTable from "../components/domain/registrations/RegistrationTable.jsx";
import useCourses from "../hooks/useCourse.js";
import useTeachers from "../hooks/useTeachers.js";
import useStudents from "../hooks/useStudents.js";
import useDepartments from "../hooks/useDepartments.js";
import registrationService from "../services/registration.service.js";
import { useTranslation } from "react-i18next";
import "../styles/pages/RegistrationScreen.scss";
import Select from "../components/common/Select.jsx";

const RegistrationScreen = () => {
  const { t } = useTranslation(["registration", "common"]); // Added common for general error messages

  const { courses = [], fetchCourses } = useCourses();
  const { teachers = [], fetchTeachers } = useTeachers();
  const { students = [], fetchStudents } = useStudents();
  const { departments = [], fetchDepartments } = useDepartments();

  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showData, setShowData] = useState(false);

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return {
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    };
  });

  const semesters = [
    { value: 1, label: t("semester1") },
    { value: 2, label: t("semester2") },
    { value: 3, label: t("summerSemester") },
  ];

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
  }, [fetchCourses, fetchDepartments, fetchTeachers, fetchStudents]);

  const fetchAllRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrationService.getAllRegistrations();
      setAllRegistrations(data);
    } catch (err) {
      setError(err.message || "Error fetching registrations");
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  const registrationsForSelectedTerm = useMemo(() => {
    if (selectedAcademicYear && selectedSemester) {
      return allRegistrations.filter(r =>
        r.year == selectedAcademicYear && r.semester == selectedSemester
      );
    }
    return []; // Return empty if term not fully selected, or allRegistrations if you want to show all initially
  }, [allRegistrations, selectedAcademicYear, selectedSemester]);

  useEffect(() => {
    if (selectedAcademicYear && selectedSemester) {
      setShowData(true);
    } else {
      setShowData(false);
    }
  }, [selectedAcademicYear, selectedSemester]);

  const filteredRegistrations = useMemo(() => {
    if (!showData) return []; // Don't filter or show if year/semester not selected

    return registrationsForSelectedTerm.filter((reg) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      // Assuming courseId and teacherId are populated or have necessary info for search
      // This search logic might need to be adjusted based on your actual data structure
      // For example, if courseName and teacherName are not directly on 'reg'
      const courseName = reg.courseId?.courseName || ""; // Example: access populated data
      const teacherName = reg.teacherId?.fullname || ""; // Example: access populated data

      return (
        courseName.toLowerCase().includes(search) ||
        teacherName.toLowerCase().includes(search) ||
        (reg.year && reg.year.toLowerCase().includes(search)) // If searching by year string is needed
        // Add other fields like description if needed
      );
    });
  }, [registrationsForSelectedTerm, searchTerm, showData]);


  const handleSaveRegistration = async (newRegistrationData) => { // newRegistrationData from RegistrationForm
    try {
      // The RegistrationForm should already include academicYear and semester if they are part of its fields.
      // If not, and they are determined by the global selection:
      const registrationToSave = {
        ...newRegistrationData,
        year: selectedAcademicYear, // Ensure field name matches schema ('year')
        semester: parseInt(selectedSemester), // Ensure semester is a number if schema expects it
      };
      await registrationService.addRegistration(registrationToSave);
      await fetchAllRegistrations(); // Refetch to get the new list including the added one
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding registration:", error);
      alert(t("common:error.failedToAdd", { item: t("registration") }) + `\n${error.message}`);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await registrationService.deleteRegistration(registrationId);
      await fetchAllRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert(t("common:error.failedToDelete", { item: t("registration") }) + `\n${error.message}`);
    }
  };

  const handleEditRegistration = async (registrationId, registrationDataFromForm) => {
    try {
      // If year/semester are editable in the form, registrationDataFromForm should contain them.
      // If they are fixed by the global filters for this screen context:
      const updatedRegistration = {
        ...registrationDataFromForm,
        year: selectedAcademicYear, // Or registrationDataFromForm.year if editable in form
        semester: parseInt(selectedSemester), // Or registrationDataFromForm.semester if editable
      };
      await registrationService.updateRegistration(
        registrationId,
        updatedRegistration
      );
      await fetchAllRegistrations();
    } catch (error) {
      console.error("Error updating registration:", error);
      alert(t("common:error.failedToUpdate", { item: t("registration") }) + `\n${error.message}`);
    }
  };

  const handleUnregisterStudent = async (registrationId, studentIdToUnregister, currentViewingRegistration) => {
    if (!window.confirm(t("confirmUnregisterStudent"))) {
      return;
    }
    try {
      const registrationToUpdate = currentViewingRegistration || allRegistrations.find(reg => reg._id === registrationId);

      if (!registrationToUpdate) {
        console.error("Error: Registration not found for unregistering student!");
        alert(t('common:error.notFound', { item: t('registration') }));
        return;
      }

      const updatedStudentList = registrationToUpdate.registrationStudent.filter(
        (rs) => (rs.studentId?._id || rs.studentId) !== studentIdToUnregister
      );

      const payload = {
        registrationStudent: updatedStudentList,
        // Only include year/semester if they are meant to change or backend requires them.
        // Typically for unregister, these don't change.
        // year: registrationToUpdate.year,
        // semester: registrationToUpdate.semester,
      };

      await registrationService.updateRegistration(registrationId, payload);
      // Consider how to efficiently update state:
      // 1. Refetch all (current method)
      await fetchAllRegistrations();
      // 2. Or, update locally if `fetchAllRegistrations` is too slow & `currentViewingRegistration` is available
      //    and `RegistrationInfoTable` (where this is likely called from) can have its props updated.

      alert(t('studentUnregisteredSuccessfully'));
    } catch (error) {
      console.error("Error unregistering student:", error);
      alert(t("error.failedToUnregisterStudent") + `\n${error.message}`);
    }
  };


  if (loading && !allRegistrations.length) { // Show loading only on initial load
    return <div className="loading">{t("common:loading")}</div>;
  }

  if (error) {
    return <div className="error-message">{t("common:error.generic")} {error}</div>;
  }

  return (
    <div className="RegistrationScreen">
      <h1>{t("registrationList")}</h1>

      <div className="selection-container">
        <div className="selection-row">
          <Select
            options={academicYears}
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            placeholder={t("selectAcademicYear")}
            classNamePrefix="react-select"
          />
          <Select
            options={semesters}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            placeholder={t("selectSemester")}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {showData && (
        <>
          <div className="top-bar">
            <SearchInput
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              icon={<FaPlus />}
              label={t("addClass")} // This button is for adding a new Registration (Class)
              variant="primary" // Changed variant for better visibility
              onClick={() => setIsAdding(true)}
              disabled={!selectedAcademicYear || !selectedSemester} // Should already be handled by showData
            />
          </div>

          {isAdding && (
            <RegistrationForm // Form for creating a new Registration/Class
              onSave={handleSaveRegistration}
              courses={courses}
              teachers={teachers}
              // departments prop might not be needed by RegistrationForm unless it's for filtering courses/teachers
              // departments={departments}
              onClose={() => setIsAdding(false)}
              // Pass current academic year and semester to pre-fill or associate
              academicYear={selectedAcademicYear}
              semester={parseInt(selectedSemester)}
            />
          )}

          <RegistrationTable
            registrations={filteredRegistrations} // Already filtered by year, semester, and search term
            courses={courses} // For mapping courseId to course details
            teachers={teachers} // For mapping teacherId to teacher details
            students={students} // For StudentRegistrationForm (enroll) and RegistrationInfoTable
            // departments={departments} // Pass if RegistrationTable or its children need it
            // searchTerm prop removed as filtering is done at screen level
            onDelete={handleDeleteRegistration}
            onEdit={handleEditRegistration}
            onUnregisterStudent={handleUnregisterStudent} // Pass the handler down
          />
        </>
      )}
      {!showData && !loading && (
        <div className="placeholder-message">{t("selectTermToViewData")}</div>
      )}
    </div>
  );
};

export default RegistrationScreen;