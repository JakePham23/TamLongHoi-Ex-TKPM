import React, { useState } from "react";
import DataTable from "../DataTable";
import EntityEdit from "../EnityEdit"; // Fixed typo from EnityEdit
import "../../styles/Modal.scss";
import StudentRegistrationForm from "./StudentRegistrationForm";


const RegistrationTable = ({ students = [], registrations = [], courses = [], searchTerm, teachers = [], onDelete, onEdit, onAdd }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [addedRegistration, setAddedRegistration] = useState(null);

  const columns = [
    { label: "STT", field: "stt", sortable: false },
    { label: "Năm", field: "year", sortable: true },
    { label: "Học kỳ", field: "semester", sortable: true },
    { label: "Môn học", field: "courseName", sortable: true },
    { label: "Giáo viên", field: "teachers", sortable: true },
    { label: "Số sinh viên tối đa", field: "maxStudent", sortable: true },
    { label: "Mô tả", field: "description", sortable: true }
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
    const course = courses.find(c => c._id === registration.courseId._id);
    const teacher = teachers.find(t => t._id === registration.teacherId._id);
    return {
      ...registration,
      stt: index + 1,
      courseName: course?.courseName || "Chưa xác định",
      teachers: teacher?.fullname || "Không xác định",
      description: registration.description || "Chưa có mô tả"
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

    if (!editedRegistration.year) newErrors.year = "Năm không được để trống!";
    if (!editedRegistration.semester) newErrors.semester = "Học kỳ không được để trống!";
    if (!editedRegistration.courseId) newErrors.courseId = "Vui lòng chọn môn học!";
    if (!editedRegistration.teacherId) newErrors.teacherId = "Vui lòng chọn giáo viên!";
    if (!editedRegistration.maxStudent || editedRegistration.maxStudent < 1) newErrors.maxStudent = "Số sinh viên tối đa phải lớn hơn 0!";

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
        score: null, // hoặc 0, hoặc undefined nếu bạn chưa có điểm
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
          title="Chỉnh sửa Đăng ký"
          fields={[
            { name: "year", label: "Năm", type: "number" },
            { name: "semester", label: "Học kỳ", type: "number" },
            {
              name: "courseId",
              label: "Môn học",
              type: "select",
              options: courses.map((c) => ({
                value: c._id,
                label: c.courseName
              }))
            },
            {
              name: "teacherId", // Updated field name
              label: "Giáo viên",
              type: "select", // Change to select for teacher
              options: teachers.map((t) => ({
                value: t._id,
                label: t.fullname // Ensure this matches the teacher name field
              }))
            },
            { name: "maxStudent", label: "Số sinh viên tối đa", type: "number" },
            { name: "description", label: "Mô tả", type: "text" }
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