import React, { useState } from "react";
import DataTable from "../../common/DataTable.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx"; // Fixed typo from EnityEdit
import "../../../styles/Modal.scss";
import StudentRegistrationForm from "./StudentRegistrationForm.jsx";
import { useTranslation } from "react-i18next";

const RegistrationTable = ({ students = [], registrations = [], courses = [], searchTerm, teachers = [], onDelete, onEdit, onAdd }) => {
  const { t } = useTranslation(['registration', 'course']);

  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [addedRegistration, setAddedRegistration] = useState(null);

  const columns = [
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('year'), field: "year", sortable: true },
    { label: t('semester'), field: "semester", sortable: true },
    { label: t('course'), field: "courseName", sortable: true },
    { label: t('teacher'), field: "teachers", sortable: true },
    { label: t('maxStudent'), field: "maxStudent", sortable: true },
    { label: t('description'), field: "description", sortable: true }
  ];

  const filteredRegistrations = registrations.filter((r) =>
    r.courseId.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    const valA = a.courseName?.toLowerCase() || "";
    const valB = b.courseName?.toLowerCase() || "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const finalData = sortedRegistrations.map((registration, index) => {
    const course = courses.find(c => c._id === registration.courseId?._id || c.courseId === registration.courseId?.courseId);
    const teacher = teachers.find(t => t._id === registration.teacherId?._id);

    const courseKey = course?.courseId;

    return {
      ...registration,
      stt: index + 1,
      courseName: courseKey
        ? t(`course_list.${courseKey}.name`, { ns: 'course' })
        : t('error.not determined', { ns: 'course' }),
      teachers: teacher?.fullname || t('error.not determined', { ns: 'course' }),
      description: courseKey
        ? t(`course_list.${courseKey}.description`, { ns: 'course' })
        : t('error.no description', { ns: 'course' }),
    };
  });


  const handleEditClick = (registration) => {
    setEditedRegistration({
      ...registration,
      courseId: registration.courseId,
      teacherId: registration.teacherId
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const newErrors = {};
    const {
      _id,
      year,
      semester,
      courseId,
      teacherId,
      maxStudent,
      description,
      students
    } = editedRegistration;

    if (!editedRegistration.year) newErrors.year = t('year') + " cannot be empty!";
    if (!editedRegistration.semester) newErrors.semester = t('semester') + " cannot be empty!";
    if (!editedRegistration.courseId) newErrors.courseId = t('course') + " is required!";
    if (!editedRegistration.teacherId) newErrors.teacherId = t('teacher') + " is required!";
    if (!editedRegistration.maxStudent || editedRegistration.maxStudent < 1) newErrors.maxStudent = t('maxStudent') + " must be greater than 0!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      year: year || '',
      semester: semester || '',
      courseId: courseId || '',
      teacherId: teacherId || '',
      maxStudent: maxStudent || 0,
      description: description || '',
      registrationStudent: students || [] // nếu có danh sách sinh viên được chỉnh sửa
    };

    onEdit(_id, updatedData);

    setIsEditing(false);
    setEditedRegistration(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRegistration((prev) => ({
      ...prev,
      [name]: name === "maxStudent" ? parseInt(value) || 0 : value
    }));
  };

  const handleAddClick = (registration) => {
    setAddedRegistration({
      _id: registration._id,
      year: registration.year,
      semester: registration.semester,
      courseId: registration.courseId?._id || registration.courseId,
      teacherId: registration.teacherId?._id || registration.teacherId,
      registrationStudent: registration.registrationStudent,
      maxStudent: registration.maxStudent,
      description: registration.description
    });
    setIsAdding(true);
  };

  const handleConfirmRegistration = (initialData, selectedStudentIds) => {
    const registrationData = {
      ...initialData,
      Id: initialData._id,
      registrationStudent: selectedStudentIds.map(id => ({
        studentId: id,
        score: null,
        status: "registered",
      })),
    };

    onEdit(registrationData.Id, registrationData);

    // Reset trạng thái
    setIsAdding(false);
    setAddedRegistration(null);
    setErrors({});
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
        onDelete={onDelete}
        onAdd={handleAddClick}
      />

      {isEditing && (
        <EntityEdit
          title={t('editRegistration')}
          fields={[
            { name: "year", label: t('year'), type: "number" },
            { name: "semester", label: t('semester'), type: "number" },
            {
              name: "courseId",
              label: t('course'),
              type: "select",
              options: courses.map((c) => ({
                value: c._id,
                label: c.courseName
              }))
            },
            {
              name: "teacherId",
              label: t('teacher'),
              type: "select",
              options: teachers.map((t) => ({
                value: t._id,
                label: t.fullname
              }))
            },
            { name: "maxStudent", label: t('maxStudent'), type: "number" },
            { name: "description", label: t('description'), type: "text" }
          ]}
          data={editedRegistration}
          errors={errors}
          onChange={handleChange}
          onSave={handleSaveEdit}
          onClose={() => setIsEditing(false)}
        />
      )}
      {isAdding && (
        <StudentRegistrationForm
          initialData={addedRegistration}
          course={courses.find(c => c._id === addedRegistration?.courseId)}
          teacher={teachers.find(c => c._id === addedRegistration?.teacherId)}
          students={students}
          onSubmit={(data) => {
            onAdd(data);
            setIsAdding(false);
            setAddedRegistration(null);
            setErrors({});
          }}
          onClose={() => {
            setIsAdding(false);
            setAddedRegistration(null);
            setErrors({});
          }}
          onConfirm={handleConfirmRegistration}
        />
      )}
    </>
  );
};

export default RegistrationTable;