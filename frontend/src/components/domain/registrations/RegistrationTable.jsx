/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
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
  searchTerm,
  teachers = [],
  onDelete,
  onEdit,
  onAdd, // This onAdd from parent is for creating NEW registrations, not enrolling.
           // The onAdd in DataTable is for the row action.
}) => {
  const { t } = useTranslation(['registration', 'course', 'common']);

  const [sortOrder, setSortOrder] = useState("asc");

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);
  const [errors, setErrors] = useState({}); // For edit form

  // Enroll Students Modal State (StudentRegistrationForm)
  const [isEnrolling, setIsEnrolling] = useState(false); // Renamed from isAdding for clarity
  const [enrollingRegistration, setEnrollingRegistration] = useState(null); // Renamed from addedRegistration

  // View Details Modal State (RegistrationInfoTable)
  const [isViewing, setIsViewing] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);

  const viewModalRef = useRef();
  const enrollModalRef = useRef(); // Ref for the enroll students modal
  const editModalRef = useRef(); // Ref for the edit modal

  // Click outside and Esc for View Modal (RegistrationInfoTable)
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

  // Click outside and Esc for Enroll Students Modal (StudentRegistrationForm)
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


  // Click outside and Esc for Edit Modal (EntityEdit)
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


  const columns = [
    // ... (columns remain the same)
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('year'), field: "year", sortable: true },
    { label: t('semester'), field: "semester", sortable: true },
    { label: t('course'), field: "courseName", sortable: true },
    { label: t('teacher'), field: "teachers", sortable: true },
    { label: t('maxStudent'), field: "maxStudent", sortable: true },
    { label: t('description'), field: "description", sortable: true },
  ];

  const filteredRegistrations = registrations.filter((r) =>
    r.courseId?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    // ... (sorting logic remains the same)
    const valA = a.courseName?.toLowerCase() || "";
    const valB = b.courseName?.toLowerCase() || "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const finalData = sortedRegistrations.map((registration, index) => {
    // ... (finalData mapping remains the same)
    const course = courses.find(
      (c) =>
        c._id === registration.courseId?._id ||
        c.courseId === registration.courseId?.courseId
    );
    const teacher = teachers.find((t) => t._id === registration.teacherId?._id);
    const courseNameFromRegistration = registration.courseId?.courseName;
    const courseKey = course?.courseId;

    return {
      ...registration,
      stt: index + 1,
      courseName: courseKey
        ? t(`course_list.${courseKey}.name`, { ns: 'course', defaultValue: courseNameFromRegistration || t('error.not determined', { ns: 'course' }) })
        : courseNameFromRegistration || t('error.not determined', { ns: 'course' }),
      teachers: teacher?.fullname || t('error.not determined', { ns: 'course' }),
      description: courseKey
        ? t(`course_list.${courseKey}.description`, { ns: 'course', defaultValue: t('error.no description', { ns: 'course' }) })
        : t('error.no description', { ns: 'course' }),
    };
  });

  const handleEditClick = (registration) => {
    // ... (edit click logic remains the same)
    setEditedRegistration({
      ...registration,
      courseId: registration.courseId?._id || registration.courseId,
      teacherId: registration.teacherId?._id || registration.teacherId,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // ... (save edit logic remains the same)
    const newErrors = {};
    if (!editedRegistration) return;
    const { _id, year, semester, courseId, teacherId, maxStudent, description, registrationStudent } = editedRegistration;
    if (!year) newErrors.year = t('year', { ns: 'registration'}) + " " + t('error.cannotBeEmpty', { ns: 'common' });
    // Add other validation checks
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const updatedData = { year, semester, courseId, teacherId, maxStudent, description, registrationStudent };
    onEdit(_id, updatedData); // onEdit is from props, for updating the registration
    closeEditModal();
  };

  const handleChange = (e) => {
    // ... (handleChange for edit form remains the same)
    const { name, value } = e.target;
    setEditedRegistration((prev) => ({
      ...prev,
      [name]: name === "maxStudent" ? parseInt(value) || 0 : value,
    }));
  };

  // This function is triggered by the "+ Add" button in DataTable row (for enrolling students)
  const handleEnrollStudentsClick = (registration) => {
    setEnrollingRegistration({ // Use the renamed state
      ...registration,
      courseId: registration.courseId?._id || registration.courseId,
      teacherId: registration.teacherId?._id || registration.teacherId,
    });
    setIsEnrolling(true); // Use the renamed state
  };

  // This confirms the student enrollment for a specific registration
  const handleConfirmEnrollment = (initialData, selectedStudentIds) => { // Renamed from handleConfirmRegistration
    const registrationData = {
      ...initialData, // This is enrollingRegistration
      _id: initialData._id,
      registrationStudent: selectedStudentIds.map((id) => ({
        studentId: id,
        score: [], // Initialize score as an empty array
        status: "registered",
      })),
    };
    onEdit(registrationData._id, registrationData); // Call the main onEdit to update this registration
    closeEnrollModal();
  };

  const handleViewClick = (registrationData) => {
    // ... (view click logic remains the same)
    setViewingRegistration(registrationData);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    // ... (close view logic remains the same)
    setIsViewing(false);
    setViewingRegistration(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={finalData}
        initialSortField="courseName"
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onEdit={handleEditClick}
        onDelete={onDelete} // onDelete is from props
        onAdd={handleEnrollStudentsClick} // DataTable's row "Add" button now triggers enroll students
        onView={handleViewClick}
      />

      {/* Edit Registration Modal */}
      {isEditing && editedRegistration && (
        <div className="modal-overlay"> {/* Standard overlay */}
          <div ref={editModalRef} className="modal-content"> {/* Standard content for smaller forms */}
             {/* EntityEdit likely has its own close button through its props/structure */}
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
              onClose={closeEditModal} // Use the dedicated close handler
            />
          </div>
        </div>
      )}

      {/* Enroll Students Modal (StudentRegistrationForm) */}
      {isEnrolling && enrollingRegistration && (
        <div className="student-registration-form-modal-overlay"> {/* Specific overlay class */}
          <div ref={enrollModalRef} className="student-registration-form-modal-content"> {/* Specific content class */}
            {/*
              StudentRegistrationForm is expected to render its own title ("Course Information"),
              details, student list, and footer buttons ("Confirm Registration", "Close")
              as per your screenshot.
            */}
            <StudentRegistrationForm
              initialData={enrollingRegistration}
              course={courses.find(c => c._id === (enrollingRegistration.courseId?._id || enrollingRegistration.courseId))}
              teacher={teachers.find(t => t._id === (enrollingRegistration.teacherId?._id || enrollingRegistration.teacherId))}
              students={students} // Full list of students to select from
              onClose={closeEnrollModal} // StudentRegistrationForm's "Close" button will trigger this
              onConfirm={handleConfirmEnrollment} // StudentRegistrationForm's "Confirm" button
            />
          </div>
        </div>
      )}

      {/* View RegistrationInfoTable Modal */}
      {isViewing && viewingRegistration && (
        // ... (View modal remains the same with registration-info-table-modal-overlay/content)
        <div className="registration-info-table-modal-overlay">
          <div ref={viewModalRef} className="registration-info-table-modal-content">
            <RegistrationInfoTable
              registrationDetails={viewingRegistration}
              allStudents={students}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationTable;