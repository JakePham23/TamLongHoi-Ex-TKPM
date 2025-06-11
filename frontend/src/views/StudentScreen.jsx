/* eslint-disable no-unused-vars */

// src/screens/StudentScreen.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import useStudents from "../hooks/useStudents.js";
import useDepartments from "../hooks/useDepartments.js";
import useCourses from "../hooks/useCourse.js";
import useTeachers from "../hooks/useTeachers.js";
import useRegistration from "../hooks/useRegistration.js";
import studentService from "../services/student.service.js";
import registrationService from "../services/registration.service.js";
import StudentTable from "../components/domain/students/StudentTable";
import StudentDetail from "../components/domain/students/StudentDetail";
import StudentForm from "../components/domain/students/StudentForm";
import SearchInput from "../components/common/SearchInput.jsx";
import Button from "../components/common/Button.jsx";
import "../styles/pages/StudentScreen.scss";
import removeVietnameseTones from "../utils/string.util.js";
import { useTranslation } from "react-i18next";
import { ExportFactory } from '../utils/export/ExportFactory.js';
import { ValidationFactory } from '../utils/factories/ValidationFactory.js';
import { STATUS_RULES, ALLOWED_EMAIL_DOMAIN, PHONE_REGEX } from "../utils/constants.js";

const StudentScreen = () => {
  const { students, setStudents, fetchStudents: fetchAllStudents } = useStudents();
  const { departments = [] } = useDepartments();
  const { courses = [], fetchCourses: fetchAllCourses } = useCourses();
  const { teachers = [], fetchTeachers: fetchAllTeachers } = useTeachers();
  const {
    registrations,
    fetchRegistrations: fetchAllRegistrations, // Using alias for consistency if preferred
    loading: registrationsLoading,
    error: registrationsError
  } = useRegistration();

  const { t } = useTranslation(['student', 'department', 'registration', 'course', 'common']);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(""); // This is schoolYear filter
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [exportType, setExportType] = useState("csv");
  const [isViewingRegisteredCourses, setIsViewingRegisteredCourses] = useState(false);

  const studentValidator = useMemo(() => {
    return ValidationFactory.createStudentValidator('active', STATUS_RULES, ALLOWED_EMAIL_DOMAIN, PHONE_REGEX);
  }, []);

  useEffect(() => {
    fetchAllCourses();
    fetchAllTeachers();
    // fetchAllRegistrations() is called by useRegistration hook's useEffect
  }, [fetchAllCourses, fetchAllTeachers]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => { 
      const studentDepartmentId = s.department?._id || s.department;
      const matchesDepartment = selectedDepartment ? studentDepartmentId === selectedDepartment : true;
      const matchesCourse = selectedCourse ? String(s.schoolYear) === String(selectedCourse) : true;
      const normalizedSearchTerm = removeVietnameseTones(searchTerm);
      const normalizedFullname = removeVietnameseTones(s.fullname);
      const normalizedStudentId = removeVietnameseTones(String(s.studentId));
      const matchesSearchTerm = searchTerm
      ? (
          normalizedFullname.includes(normalizedSearchTerm) ||
          normalizedStudentId.includes(normalizedSearchTerm)
        )
      : true;
      return matchesDepartment && matchesCourse && matchesSearchTerm;
    });
  }, [searchTerm, selectedDepartment, selectedCourse, students]);

  const handleDelete = async (studentRowId) => { // studentRowId is student.studentId from table
    if (!window.confirm(t('common:form.sureDelete'))) return;
    try {
      await studentService.deleteStudent(studentRowId);
      await fetchAllStudents(); // Refresh student list
      if (selectedStudent?.studentId === studentRowId) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error(t('student:error.deleteStudent') + ":", error);
      alert(t('student:error.deleteStudent') + ': ' + (error.message || t('common:error.unknown')));
    }
  };

  const handleAddStudent = async (studentData) => {
    const validationErrors = studentValidator.validate(studentData);
    if (validationErrors) {
      alert(t('common:error.validationFailed') + ': ' + Object.values(validationErrors).join('\n'));
      return;
    }
    try {
      await studentService.addStudent(studentData);
      await fetchAllStudents();
      setIsAdding(false);
    } catch (error) {
      console.error(t('student:error.addStudent') + ":", error);
      alert(t('student:error.addStudent') + ': ' + (error.message || t('common:error.unknown')));
    }
  };

  const handleSaveStudentDetails = async (updatedStudentData) => {
    const validationErrors = studentValidator.validate({
      ...updatedStudentData,
      currentStatus: selectedStudent?.studentStatus
    });
    if (validationErrors) {
      alert(t('common:error.validationFailed') + ': ' + Object.values(validationErrors).join('\n'));
      return;
    }
    try {
      await studentService.updateStudent(updatedStudentData.studentId, updatedStudentData);
      await fetchAllStudents();
      setSelectedStudent(prev => prev && prev.studentId === updatedStudentData.studentId ? { ...prev, ...updatedStudentData } : prev);
      setIsEditing(false);
      setEditedStudent(null);
    } catch (error) {
      console.error(t('student:error.updateStudent') + ":", error);
      alert(t('student:error.updateStudent') + ': ' + (error.message || t('common:error.unknown')));
    }
  };

  const exportAllStudentsData = async () => {
    if (filteredStudents.length === 0) {
      alert(t('student:noStudentExport'));
      return;
    }
    try {
      const exporter = ExportFactory.createStudentExporter(exportType);
      await exporter.export(filteredStudents, "students_list");
    } catch (error) {
      console.error(t('common:error.exportFailed') + ":", error);
      alert(t('common:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  // This function will be passed as onViewDetail to StudentDetail
  const handleViewRegisteredCourses = (studentToView) => {
    // selectedStudent is already set by StudentTable's onView.
    // This function just changes the state to show the courses view.
    if (studentToView && selectedStudent && studentToView._id === selectedStudent._id) {
        setIsViewingRegisteredCourses(true);
    } else {
        // This case should ideally not happen if StudentDetail only calls this for the student it's displaying.
        // But as a safeguard:
        setSelectedStudent(studentToView); // Ensure selectedStudent is set
        setIsViewingRegisteredCourses(true);
    }
  };

  const handleCloseRegisteredCoursesView = () => {
    setIsViewingRegisteredCourses(false);
    // Keep selectedStudent active so StudentDetail can re-render if desired,
    // or set selectedStudent to null if StudentDetail should also close.
    // For now, just closes the course view, user can close StudentDetail separately.
  };

  const handleUnregisterStudentFromCourse = async (registrationId, studentDbId) => {
    if (!window.confirm(t('registration:confirmUnregisterStudent'))) return;
    try {
      const registrationToUpdate = registrations.find(reg => reg._id === registrationId);
      if (!registrationToUpdate) {
        alert(t('common:error.notFound', { item: t('registration:registration') }));
        return;
      }
      const updatedRegStudents = registrationToUpdate.registrationStudent.filter(
        rs => (rs.studentId?._id || rs.studentId) !== studentDbId
      );
      const payload = { registrationStudent: updatedRegStudents };
      await registrationService.updateRegistration(registrationId, payload);
      await fetchAllRegistrations(); // Refresh registration list
      alert(t('registration:studentUnregisteredSuccessfully'));
    } catch (error) {
      console.error(t('registration:error.failedToUnregisterStudent') + ":", error);
      alert(t('registration:error.failedToUnregisterStudent') + ': ' + (error.message || t('common:error.unknown')));
    }
  };
  
  const handleCloseAllDetailViews = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setEditedStudent(null);
    setIsViewingRegisteredCourses(false);
  };

  // Dynamic year generation for filter
  const schoolYearOptions = useMemo(() => {
    const currentYr = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYr - i);
    }
    return years.map(year => ({ value: year, label: `${year}` }));
  }, [t]);


  return (
    <div className="StudentScreen">
      <h1>{t('list of students')}</h1>
      <div className="top-bar">
        <SearchInput
          placeholder={t('searchStudentPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="filterButton">
          <option value="">{t('all department', { ns: 'department' })}</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
          ))}
        </select>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="filterButton">
          <option value="">{t('all school year')}</option>
          {schoolYearOptions.map((yearOpt) => (
            <option key={yearOpt.value} value={yearOpt.value}>{yearOpt.label}</option>
          ))}
        </select>
        <Button icon={<FaPlus />} label={t('addStudentButton')} variant="primary" onClick={() => setIsAdding(true)} />
      </div>

      <StudentTable
        students={filteredStudents}
        onView={setSelectedStudent}
        onDelete={handleDelete}
      />

      {isAdding && (
        <StudentForm
          departments={departments}
          onSubmit={handleAddStudent}
          onClose={() => setIsAdding(false)}
        />
      )}

      {/* Show StudentDetail if a student is selected AND we are NOT viewing their registered courses */}
      {selectedStudent && !isViewingRegisteredCourses && (
        <StudentDetail
          departments={departments}
          student={selectedStudent}
          isEditing={isEditing}
          editedStudent={editedStudent}
          setEditedStudent={setEditedStudent}
          onSave={handleSaveStudentDetails}
          onEdit={() => setIsEditing(true)}
          onClose={handleCloseAllDetailViews} // Closes StudentDetail and any sub-views
          onViewDetail={handleViewRegisteredCourses} // Pass the handler here

          allRegistrations={registrations}
          allCourses={courses}
          allTeachers={teachers}
          onUnregister={handleUnregisterStudentFromCourse}
          onCloseRegister={handleCloseRegisteredCoursesView} // This closes only the course view
        />
      )}

      <div className="export-container">
        <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="export-select">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <Button label={t('export list')} onClick={exportAllStudentsData} />
      </div>
    </div>
  );
};

export default StudentScreen;