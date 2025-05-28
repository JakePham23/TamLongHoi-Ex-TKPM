import React, { useState } from "react";
import DataTable from "../../common/DataTable.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx";
import "../../../styles/Modal.scss";
import removeVietnameseTones from "../../../utils/string.util.jsx";
import { useTranslation } from "react-i18next";

const CourseTable = ({ courses = [], departments = [], searchTerm = "", onDelete, onEdit }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [errors, setErrors] = useState({});

  const { t } = useTranslation(['course', 'department']);

  const columns = [
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('course id'), field: "courseId", sortable: true },
    { label: t('course name'), field: "courseName", sortable: true },
    { label: t('number of credits'), field: "credit", sortable: true },
    { label: t('theoretical session'), field: "theoreticalSession", sortable: true },
    { label: t('practical session'), field: "practicalSession", sortable: true },
    { label: t('department', { ns: 'department' }), field: "departmentName", sortable: true },
    { label: t('prerequisuite'), field: "prerequisite", sortable: true },
    // { label: "Mô tả", field: "description", sortable: true }
  ];

  const cleanSearch = removeVietnameseTones(searchTerm.toLowerCase());

  const filteredCourses = courses.filter((c) =>
    removeVietnameseTones(c.courseId)?.toLowerCase().includes(cleanSearch) ||
    removeVietnameseTones(c.courseName)?.toLowerCase().includes(cleanSearch) ||
    removeVietnameseTones(c.department?.departmentName)?.toLowerCase().includes(cleanSearch)
  );


  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const valA = a.courseName?.toLowerCase() || "";
    const valB = b.courseName?.toLowerCase() || "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const finalData = sortedCourses.map((course, index) => {
    const deptId = course.department?._id || course.department;
    const dept = departments.find(d => d._id === deptId);

    return {
      ...course,
      stt: index + 1,
      courseName: t(`course_list.${course.courseId}.name`),
      departmentName: dept
        ? t(`department_list.${dept._id}.name`, { ns: 'department' })
        : t('error.not determined'),
      prerequisite: course.prerequisite || t('error.not available'),
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
    if (!editedCourse.courseName?.trim()) newErrors.courseName = t('error.course name blank');
    if (!editedCourse.credit || editedCourse.credit < 2) newErrors.credit = t('error.credits greater than 1');
    if (!editedCourse.departmentId) newErrors.departmentId = t('error.please select department');

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
          title={t('edit course')}
          fields={[
            { name: "courseId", label: t('course id'), type: "text", disabled: true },
            { name: "courseName", label: t('course name'), type: "text" },
            { name: "credit", label: t('number of credits'), type: "number" },
            { name: "theoreticalSession", label: t('theoretical session'), type: "number" },
            { name: "practicalSession", label: t('practical session'), type: "number" },
            {
              name: "departmentId",
              label: t('department', { ns: 'department' }),
              type: "select",
              options: departments.map((d) => ({
                value: d._id,
                label: d.departmentName
              }))
            },
            {
              name: "prerequisite",
              label: t('prerequisuite'),
              type: "select",
              options: [
                { value: "", label: t('error.not available') },
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
