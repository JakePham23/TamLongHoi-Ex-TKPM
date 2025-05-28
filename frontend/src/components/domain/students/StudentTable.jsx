import React from "react";
import DataTable from "../../common/DataTable.jsx";
import { useTranslation } from "react-i18next";

const StudentTable = ({ students = [], onView, onDelete }) => {
  const { t } = useTranslation(['student', 'department']);

  const columns = [
    { label: t('id'), field: "studentId", sortable: true },
    { label: t('full name'), field: "fullname", sortable: true },
    { label: t('department', { ns: 'department' }), field: "departmentName", sortable: true },
    { label: t('school year'), field: "schoolYear", sortable: true }
  ];

  const dataWithDepartmentName = students.map(student => ({
    ...student,
    departmentName: student.department?._id
      ? t(`department_list.${student.department._id}.name`, { ns: 'department' })
      : t('error.not determined', { ns: 'department' })
  }));

  return (
    <DataTable
      columns={columns}
      data={dataWithDepartmentName}
      initialSortField="fullname"
      onView={onView}
      onDelete={onDelete}
    />
  );
};

export default StudentTable;
