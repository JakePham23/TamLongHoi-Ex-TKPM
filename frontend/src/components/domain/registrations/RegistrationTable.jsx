/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx";
import "../../../styles/Modal.scss"; // General modal styles
import "../../../styles/RegistrationTable.scss"; // Specific styles for this component/modals
import StudentRegistrationForm from "./StudentRegistrationForm.jsx";
import RegistrationInfoTable from "./RegistrationInfoTable.jsx";
import { useTranslation } from "react-i18next";

const RegistrationTable = ({
  students = [],
  registrations = [],
  courses = [],
  searchTerm, // searchTerm is received but local filtering is also done. Consider simplifying.
  teachers = [],
  onDelete,
  onEdit,
  // onAdd prop from parent (RegistrationScreen) is not directly used here for a specific action.
  // The onAdd for DataTable rows is handleEnrollStudentsClick.
  onUnregisterStudent // Prop received from RegistrationScreen
}) => {
  const { t } = useTranslation(['registration', 'course', 'common']);

  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollingRegistration, setEnrollingRegistration] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);

  const viewModalRef = useRef();
  const enrollModalRef = useRef();
  const editModalRef = useRef();

  // --- Start of useEffect hooks for modal closing ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isViewing && viewModalRef.current && !viewModalRef.current.contains(event.target)) {
        handleCloseView();
      }
    };
    const handleEscapeKey = (event) => {
      if (isViewing && event.key === 'Escape') {
        handleCloseView();
      }
    };
    if (isViewing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isViewing]);

  const closeEnrollModal = () => {
    setIsEnrolling(false);
    setEnrollingRegistration(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEnrolling && enrollModalRef.current && !enrollModalRef.current.contains(event.target)) {
        closeEnrollModal();
      }
    };
    const handleEscapeKey = (event) => {
      if (isEnrolling && event.key === 'Escape') {
        closeEnrollModal();
      }
    };
    if (isEnrolling) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isEnrolling]);

  const closeEditModal = () => {
    setIsEditing(false);
    setEditedRegistration(null);
    setErrors({});
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing && editModalRef.current && !editModalRef.current.contains(event.target)) {
        closeEditModal();
      }
    };
    const handleEscapeKey = (event) => {
       if (isEditing && event.key === 'Escape') {
        closeEditModal();
      }
    };
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isEditing]);
  // --- End of useEffect hooks for modal closing ---

  const columns = [
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('year'), field: "year", sortable: true },
    { label: t('semester'), field: "semester", sortable: true },
    { label: t('course'), field: "courseName", sortable: true },
    { label: t('teacher'), field: "teachers", sortable: true },
    { label: t('maxStudent'), field: "maxStudent", sortable: true },
    { label: t('description'), field: "description", sortable: true },
  ];

  // Local filtering based on searchTerm prop from RegistrationScreen.
  // If RegistrationScreen already fully filters, this might be redundant.
  // However, if searchTerm from RegistrationScreen is for a different purpose, this is fine.
  const locallyFilteredRegistrations = useMemo(() => {
    if (!searchTerm) return registrations;
    return registrations.filter((r) =>
      // Ensure courseId and courseName exist for robust filtering
      r.courseId?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.year && String(r.year).toLowerCase().includes(searchTerm.toLowerCase())) || // If year is a string "YYYY-YYYY"
      (r.semester && String(r.semester) === searchTerm) // If semester is a number
      // Add other fields to search if necessary
    );
  }, [registrations, searchTerm]);


  const sortedRegistrations = useMemo(() => {
    return [...locallyFilteredRegistrations].sort((a, b) => {
        const valA = a.courseName?.toLowerCase() || ""; // Mapped field
        const valB = b.courseName?.toLowerCase() || ""; // Mapped field
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [locallyFilteredRegistrations, sortOrder]);


  const finalData = useMemo(() => {
    return sortedRegistrations.map((registration, index) => {
        const course = courses.find(
        (c) =>
            c._id === registration.courseId?._id ||
            c.courseId === registration.courseId?.courseId // Handle different possible structures for courseId
        );
        const teacher = teachers.find((t) => t._id === registration.teacherId?._id);
        const courseNameFromRegistration = registration.courseId?.courseName; // If populated
        const courseKey = course?.courseId; // Actual course code for translation

        return {
        ...registration, // Spread original registration data
        stt: index + 1,
        // Use the already mapped courseName if available from sortedRegistrations,
        // otherwise, perform the mapping.
        // This assumes courseName might not be pre-mapped on `registration` objects.
        courseName: courseKey
            ? t(`course_list.${courseKey}.name`, { ns: 'course', defaultValue: courseNameFromRegistration || t('error.not determined', { ns: 'course' }) })
            : courseNameFromRegistration || t('error.not determined', { ns: 'course' }),
        teachers: teacher?.fullname || t('error.not determined', { ns: 'course' }),
        description: courseKey
            ? t(`course_list.${courseKey}.description`, { ns: 'course', defaultValue: t('error.no description', { ns: 'course' }) })
            : t('error.no description', { ns: 'course' }),
        };
    });
  }, [sortedRegistrations, courses, teachers, t]);


  const handleEditClick = (registration) => {
    setEditedRegistration({
      ...registration, // original registration data from finalData
      courseId: registration.courseId?._id || registration.courseId, // ensure we have the ID
      teacherId: registration.teacherId?._id || registration.teacherId, // ensure we have the ID
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const newErrors = {};
    if (!editedRegistration) return;
    const { _id, year, semester, courseId, teacherId, maxStudent, description, registrationStudent } = editedRegistration;

    if (!year) newErrors.year = t('year', { ns: 'registration'}) + " " + t('error.cannotBeEmpty', { ns: 'common' });
    if (!semester) newErrors.semester = t('semester', { ns: 'registration'}) + " " + t('error.cannotBeEmpty', { ns: 'common' });
    if (!courseId) newErrors.courseId = t('course', { ns: 'registration'}) + " " + t('error.isRequired', { ns: 'common' });
    if (!teacherId) newErrors.teacherId = t('teacher', { ns: 'registration'}) + " " + t('error.isRequired', { ns: 'common' });
    if (maxStudent === undefined || maxStudent === null || maxStudent < 1) newErrors.maxStudent = t('maxStudent', { ns: 'registration'}) + " " + t('error.mustBeGreaterThanZero', { ns: 'common' });


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Pass only the necessary fields for update. _id is the identifier.
    // The `onEdit` prop (from RegistrationScreen) will receive the ID and the data payload.
    const updatedData = { year, semester, courseId, teacherId, maxStudent, description, registrationStudent };
    onEdit(_id, updatedData);
    closeEditModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRegistration((prev) => ({
      ...prev,
      [name]: name === "maxStudent" ? (parseInt(value) || 0) : value,
    }));
  };

  const handleEnrollStudentsClick = (registration) => {
    setEnrollingRegistration({
      ...registration, // original registration data from finalData
      courseId: registration.courseId?._id || registration.courseId,
      teacherId: registration.teacherId?._id || registration.teacherId,
    });
    setIsEnrolling(true);
  };

  const handleConfirmEnrollment = (initialData, selectedStudentIds) => {
    const registrationData = {
      ...initialData, // This is enrollingRegistration, which includes _id
      registrationStudent: selectedStudentIds.map((id) => ({
        studentId: id,
        score: [],
        status: "registered",
      })),
    };
    // Call onEdit from RegistrationScreen to update the registration with new students
    onEdit(initialData._id, registrationData);
    closeEnrollModal();
  };

  const handleViewClick = (registrationData) => {
    setViewingRegistration(registrationData);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    setIsViewing(false);
    setViewingRegistration(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={finalData} // Use the fully processed and sorted data
        initialSortField="courseName" // Default sort
        sortOrder={sortOrder}
        onSortChange={setSortOrder} // Allows DataTable to signal sort order change
        onEdit={handleEditClick}
        onDelete={onDelete}
        onAdd={handleEnrollStudentsClick} // Row action to enroll students
        onView={handleViewClick}
      />

      {/* Edit Registration Modal */}
      {isEditing && editedRegistration && (
        <div className="modal-overlay">
          <div ref={editModalRef} className="modal-content">
            <EnityEdit
              title={t('editRegistration', { ns: 'registration' })}
              fields={[
                { name: "year", label: t('year', { ns: 'registration' }), type: "number" },
                { name: "semester", label: t('semester', { ns: 'registration' }), type: "number" },
                {
                  name: "courseId",
                  label: t('course', { ns: 'registration' }),
                  type: "select",
                  options: courses.map((c) => ({
                    value: c._id,
                    label: c.courseName || t(`course_list.${c.courseId}.name`, {ns: 'course', defaultValue: c.courseId }),
                  })),
                },
                {
                  name: "teacherId",
                  label: t('teacher', { ns: 'registration' }),
                  type: "select",
                  options: teachers.map((t) => ({
                    value: t._id,
                    label: t.fullname,
                  })),
                },
                { name: "maxStudent", label: t('maxStudent', { ns: 'registration' }), type: "number" },
                { name: "description", label: t('description', { ns: 'registration' }), type: "text" },
              ]}
              data={editedRegistration}
              errors={errors}
              onChange={handleChange}
              onSave={handleSaveEdit}
              onClose={closeEditModal}
            />
          </div>
        </div>
      )}

      {/* Enroll Students Modal (StudentRegistrationForm) */}
      {isEnrolling && enrollingRegistration && (
        <div className="student-registration-form-modal-overlay">
          <div ref={enrollModalRef} className="student-registration-form-modal-content">
            <StudentRegistrationForm
              initialData={enrollingRegistration}
              course={courses.find(c => c._id === (enrollingRegistration.courseId?._id || enrollingRegistration.courseId))}
              teacher={teachers.find(t => t._id === (enrollingRegistration.teacherId?._id || enrollingRegistration.teacherId))}
              students={students}
              onClose={closeEnrollModal}
              onConfirm={handleConfirmEnrollment}
              // onUnregisterStudent={onUnregisterStudent} // Pass if StudentRegistrationForm handles unregistering
            />
          </div>
        </div>
      )}

      {/* View RegistrationInfoTable Modal */}
      {isViewing && viewingRegistration && (
        <div className="registration-info-table-modal-overlay">
          <div ref={viewModalRef} className="registration-info-table-modal-content">
            <RegistrationInfoTable
              registrationDetails={viewingRegistration}
              allStudents={students}
              onUnregisterStudent={onUnregisterStudent} // Pass the prop here
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationTable;