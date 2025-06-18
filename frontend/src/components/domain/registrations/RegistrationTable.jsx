/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import StudentRegistrationForm from "./StudentRegistrationForm.jsx";
import RegistrationInfoTable from "./RegistrationInfoTable.jsx";
import Button from "../../common/Button.jsx";
import { useTranslation } from "react-i18next";
import "../../../styles/Modal.scss";
import "../../../styles/RegistrationTable.scss";

// HÀM HELPER: Chuyển đổi từ tiết học (số) sang chuỗi thời gian (string)
const getDisplayTimeFromLessons = (lessonBegin, lessonEnd) => {
  if (!lessonBegin || !lessonEnd) return null;
  const timeMap = {
    1: { start: "07:30", end: "08:20" }, 2: { start: "08:20", end: "09:10" },
    3: { start: "09:10", end: "10:00" }, 3.5: { start: "09:35", end: "09:45" }, // Nghỉ
    4: { start: "10:00", end: "10:50" }, 5: { start: "10:50", end: "11:40" },
    6: { start: "12:40", end: "13:30" }, 7: { start: "13:30", end: "14:20" },
    8: { start: "14:20", end: "15:10" }, 8.5: { start: "14:45", end: "14:55" }, // Nghỉ
    9: { start: "15:10", end: "16:00" }, 10: { start: "16:00", end: "16:50" },
  };

  let startTime = timeMap[lessonBegin]?.start;
  let endTime = timeMap[lessonEnd]?.end;

  if (lessonBegin === 3.5) startTime = timeMap[4].start;
  if (lessonEnd === 3.5) endTime = timeMap[3].end;
  if (lessonBegin === 8.5) startTime = timeMap[9].start;
  if (lessonEnd === 8.5) endTime = timeMap[8].end;

  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return null;
};

const RegistrationTable = ({
                             students = [],
                             registrations = [],
                             courses = [],
                             searchTerm,
                             teachers = [],
                             onDelete,
                             onEdit,
                             onUnregisterStudent,
                           }) => {
  const { t } = useTranslation(["registration", "course", "common", "class"]);

  // --- State Management ---
  const [sortField, setSortField] = useState("courseName");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollingRegistration, setEnrollingRegistration] = useState(null);

  const [isViewing, setIsViewing] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);

  const viewModalRef = useRef();
  const enrollModalRef = useRef();
  // Ref cho modal edit sẽ do RegistrationForm tự quản lý

  // --- Modal Closing Logic ---
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (isViewing) handleCloseView();
        if (isEnrolling) closeEnrollModal();
        if (isEditing) closeEditModal();
      }
    };
    // Click outside logic được xử lý bởi lớp phủ overlay của mỗi modal
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isViewing, isEnrolling, isEditing]);

  const closeEnrollModal = () => setIsEnrolling(false);
  const closeEditModal = () => setIsEditing(false);
  const handleCloseView = () => setIsViewing(false);

  // --- Data Processing ---
  const columns = useMemo(() => [
    { label: t("no."), field: "stt", sortable: false },
    { label: t("course"), field: "courseName", sortable: true },
    { label: t("teacher"), field: "teachers", sortable: true },
    { label: t("maxStudent"), field: "maxStudent", sortable: true },
    { label: t('dayOfWeek', { ns: 'class' }), field: 'scheduleDay', sortable: true },
    { label: t('classTime', { ns: 'class' }), field: 'scheduleTime', sortable: true },
    { label: t("description"), field: "description", sortable: true },
  ], [t]);

  const finalData = useMemo(() => {
    const filtered = searchTerm
        ? registrations.filter((r) =>
            (r.courseId?.courseName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (String(r.year) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (String(r.semester) || "") === searchTerm
        )
        : registrations;

    const sorted = [...filtered].sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      return sortOrder === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    return sorted.map((registration, index) => {
      const course = courses.find(c => c._id === (registration.courseId?._id || registration.courseId));
      const teacher = teachers.find(t => t._id === (registration.teacherId?._id || registration.teacherId));
      const scheduleDay = registration.schedule?.dayOfWeek ? t(registration.schedule.dayOfWeek.toLowerCase(), { ns: 'class', defaultValue: registration.schedule.dayOfWeek }) : t('notApplicableShort', { ns: 'common' });
      const scheduleTime = getDisplayTimeFromLessons(registration.schedule?.lessonBegin, registration.schedule?.lessonEnd) || t('notApplicableShort', { ns: 'common' });

      return {
        ...registration,
        stt: index + 1,
        courseName: course?.courseName || registration.courseId?.courseName || t('error.not determined', { ns: 'course' }),
        teachers: teacher?.fullname || t('error.not determined', { ns: 'course' }),
        scheduleDay,
        scheduleTime,
      };
    });
  }, [registrations, searchTerm, sortOrder, sortField, courses, teachers, t]);

  // --- Event Handlers ---
  const handleEditClick = (registration) => {
    setEditedRegistration(registration);
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedData) => {
    onEdit(updatedData._id, updatedData);
    closeEditModal();
  };

  const handleEnrollStudentsClick = (registration) => {
    setEnrollingRegistration(registration);
    setIsEnrolling(true);
  };

  const handleConfirmEnrollment = (initialData, newStudentIds) => {
    const existingStudents = initialData.registrationStudent || [];
    const newStudents = newStudentIds.map(id => ({ studentId: id, score: [], status: "registered" }));
    const updatedRegistrationStudent = [...existingStudents, ...newStudents];
    onEdit(initialData._id, { ...initialData, registrationStudent: updatedRegistrationStudent });
    closeEnrollModal();
  };

  const handleViewClick = (registrationData) => {
    setViewingRegistration(registrationData);
    setIsViewing(true);
  };

  return (
      <>
        <DataTable
            columns={columns}
            data={finalData}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={setSortField}
            onEdit={handleEditClick}
            onDelete={onDelete}
            onAdd={handleEnrollStudentsClick}
            onView={handleViewClick}
        />

        {/* Edit Modal: Dùng RegistrationForm */}
        {isEditing && (
            <RegistrationForm
                registration={editedRegistration}
                onSave={handleSaveEdit}
                onClose={closeEditModal}
                courses={courses}
                teachers={teachers}
                academicYear={editedRegistration?.year}
                semester={editedRegistration?.semester}
            />
        )}

        {/* Enroll Students Modal */}
        {isEnrolling && (
            <StudentRegistrationForm
                initialData={enrollingRegistration}
                course={courses.find(c => c._id === enrollingRegistration.courseId?._id)}
                teacher={teachers.find(t => t._id === enrollingRegistration.teacherId?._id)}
                students={students}
                onClose={closeEnrollModal}
                onConfirm={handleConfirmEnrollment}
            />
        )}

        {/* View Info Modal */}
        {isViewing && (
            <div className="registration-info-table-modal-overlay" onClick={handleCloseView}>
              <div ref={viewModalRef} className="registration-info-table-modal-content wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{t('registrationDetails')}</h3>
                  <button onClick={handleCloseView} className="modal-close">&times;</button>
                </div>
                <div className="modal-body">
                  <RegistrationInfoTable
                      registrationDetails={viewingRegistration}
                      allStudents={students}
                      onUnregisterStudent={onUnregisterStudent}
                  />
                </div>
                <div className="modal-footer">
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default RegistrationTable;