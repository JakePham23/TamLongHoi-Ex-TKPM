import React, { useState } from "react";
import DataTable from "../DataTable";
import EntityEdit from "../EnityEdit"; // Fixed typo from EnityEdit
import EntityAdd from "../EntityAdd";
import "../../styles/Modal.scss";
import StudentRegistrationForm from "./StudentRegistrationForm"; // Đường dẫn tới component mới

const RegistrationTable = ({ students = [], registrations = [], courses = [], searchTerm, teachers = [], onDelete, onEdit }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState(null);
  const [errors, setErrors] = useState({});


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
    if (!editedRegistration.year) newErrors.year = "Năm không được để trống!";
    if (!editedRegistration.semester) newErrors.semester = "Học kỳ không được để trống!";
    if (!editedRegistration.courseId) newErrors.courseId = "Vui lòng chọn môn học!";
    if (!editedRegistration.teacherId) newErrors.teacherId = "Vui lòng chọn giáo viên!";
    if (!editedRegistration.maxStudent || editedRegistration.maxStudent < 1) newErrors.maxStudent = "Số sinh viên tối đa phải lớn hơn 0!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onEdit(editedRegistration._id, {
      year: editedRegistration.year,
      semester: editedRegistration.semester,
      courseId: editedRegistration.courseId,
      teacherId: editedRegistration.teacherId,
      maxStudent: editedRegistration.maxStudent,
      description: editedRegistration.description
    });

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
    </>
  );
};

export default RegistrationTable;