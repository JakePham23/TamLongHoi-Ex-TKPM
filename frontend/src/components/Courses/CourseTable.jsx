import React, { useState } from "react";
import DataTable from "../DataTable";
import EnityEdit from "../EnityEdit";
import "../../styles/Modal.scss";

const CourseTable = ({ courses = [],departments=[], searchTerm = "", onDelete, onEdit }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [errors, setErrors] = useState({});

  const columns = [
    { label: "STT", field: "stt", sortable: false },
    { label: "Mã môn học", field: "courseId", sortable: true },
    { label: "Tên môn học", field: "courseName", sortable: true },
    { label: "Số tín chỉ", field: "credit", sortable: true },
    { label: "Số tiết lý thuyết", field: "theoreticalSession", sortable: true },
    { label: "Số tiết thực hành", field: "practicalSession", sortable: true },
    { label: "Khoa", field: "departmentName", sortable: true },
    { label: "Môn học tiên quyết", field: "prerequisite", sortable: true },
    // { label: "Mô tả", field: "description", sortable: true }
  ];

  const filteredCourses = courses.filter((c) =>
    c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department?.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const valA = a.courseName?.toLowerCase() || "";
    const valB = b.courseName?.toLowerCase() || "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const finalData = sortedCourses.map((course, index) => {
    const dept = departments.find(d => d._id === (course.department?._id || course.department));
    return {
      ...course,
      stt: index + 1,
      departmentName: dept?.departmentName || "Chưa xác định",
      prerequisite: course.prerequisite || "Không có",
      // description: course.description || "Chưa có mô tả"
    };
  });
  

  const handleEditClick = (course) => {
    setEditedCourse({
      ...course,
      departmentId: course.department?._id || course.departmentId
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const newErrors = {};
    if (!editedCourse.courseName?.trim()) newErrors.courseName = "Tên môn học không được để trống!";
    if (!editedCourse.credit || editedCourse.credit < 2) newErrors.credit = "Số tín chỉ phải lớn hơn 1!";
    if (!editedCourse.departmentId) newErrors.departmentId = "Vui lòng chọn khoa!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onEdit(editedCourse.courseId, {
      courseName: editedCourse.courseName,
      credit: editedCourse.credit,
      theoreticalSession: editedCourse.theoreticalSession,
      practicalSession: editedCourse.practicalSession,
      departmentId: editedCourse.departmentId,
      prerequisite: editedCourse.prerequisite,
      description: editedCourse.description
    });

    setIsEditing(false);
    setEditedCourse(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({
      ...prev,
      [name]: name === "credit" ? parseInt(value) || 0 : value
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
        <EnityEdit
          title="Chỉnh sửa Môn học"
          fields={[
            { name: "courseId", label: "Mã môn học", type: "text", disabled: true },
            { name: "courseName", label: "Tên môn học", type: "text" },
            { name: "credit", label: "Số tín chỉ", type: "number" },
            { name: "theoreticalSession", label: "Số tiết lý thuyết", type: "number" },
            { name: "practicalSession", label: "Số tiết thực hành", type: "number" },
            {
              name: "departmentId",
              label: "Khoa",
              type: "select",
              options: departments.map((d) => ({
                value: d._id,
                label: d.departmentName
              }))
            },
            {
              name: "prerequisite",
              label: "Môn học tiên quyết",
              type: "select",
              options: [
                { value: "", label: "Không có" },
                ...courses.map((c) => ({
                  value: c.courseId,
                  label: c.courseName
                }))
              ]
            },
            // { name: "description", label: "Mô tả", type: "text" }
          ]}
          data={editedCourse}
          errors={errors}
          onChange={handleChange}
          onSave={handleSaveEdit}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default CourseTable;
