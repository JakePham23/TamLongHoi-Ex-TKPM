import React, { useState, useEffect } from "react";
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
  const { t } = useTranslation("registration");

  const { courses = [], fetchCourses } = useCourses();
  const { teachers = [], fetchTeachers } = useTeachers();
  const { students = [], fetchStudents } = useStudents();
  const { departments = [], fetchDepartments } = useDepartments();

  const [allRegistrations, setAllRegistrations] = useState([]); // all data from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showData, setShowData] = useState(false);

  // Generate academic years
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

  // Fetch all data for dropdowns on mount
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
  }, [fetchCourses, fetchDepartments, fetchTeachers, fetchStudents]);

  // Fetch all registrations once or after add/edit/delete
  const fetchAllRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrationService.getAllRegistrations(); // API lấy toàn bộ data
      setAllRegistrations(data);
    } catch (err) {
      setError(err.message || "Error fetching registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  // Filter registrations by selected year & semester
    const filteredByTerm = allRegistrations.filter(r => {

      if (selectedAcademicYear) {
        // chỉ chọn năm
        return r.year == selectedAcademicYear;
      }
      if (selectedSemester) {
        // chỉ chọn kỳ
        return r.semester == selectedSemester;
      }
      if (selectedAcademicYear && selectedSemester) {
        // cả 2 có chọn thì lọc theo AND
        return r.year == selectedAcademicYear && r.semester == selectedSemester;
      }
      // chưa chọn gì
      return true;
    });


  // Show data only if year & semester selected and data exist
  useEffect(() => {
    if (selectedAcademicYear || selectedSemester) {
      setShowData(true);
    } else {
      setShowData(false);
    }
  }, [selectedAcademicYear, selectedSemester]);

  // Further filter by search term
  const filteredRegistrations = filteredByTerm.filter((reg) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (reg.className && reg.className.toLowerCase().includes(search)) ||
      (reg.courseName && reg.courseName.toLowerCase().includes(search)) ||
      (reg.teacherName && reg.teacherName.toLowerCase().includes(search))
    );
  });

  const handleSaveRegistration = async (newRegistration) => {
    try {
      const registrationWithTerm = {
        ...newRegistration,
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
      };
      await registrationService.addRegistration(registrationWithTerm);
      await fetchAllRegistrations();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding registration:", error);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await registrationService.deleteRegistration(registrationId);
      await fetchAllRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const handleEditRegistration = async (registrationId, registrationData) => {
    try {
      const updatedRegistration = {
        ...registrationData,
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
      };
      await registrationService.updateRegistration(
        registrationId,
        updatedRegistration
      );
      await fetchAllRegistrations();
    } catch (error) {
      console.error("Error updating registration:", error);
    }
  };

  if (loading) {
    return <div className="loading">{t("loading")}</div>;
  }

  if (error) {
    return <div className="error">{t("error")}</div>;
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
          />

          <Select
            options={semesters}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            placeholder={t("selectSemester")}
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
              label={t("addClass")}
              variant="gray"
              onClick={() => setIsAdding(true)}
              disabled={!selectedAcademicYear || !selectedSemester}
            />
          </div>

          {isAdding && (
            <RegistrationForm
              onSave={handleSaveRegistration}
              courses={courses}
              teachers={teachers}
              departments={departments}
              onClose={() => setIsAdding(false)}
              academicYear={selectedAcademicYear}
              semester={selectedSemester}
            />
          )}

          <RegistrationTable
            registrations={filteredRegistrations}
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
