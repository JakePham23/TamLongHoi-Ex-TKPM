import React from "react";
import DataTable from "../DataTable";
import { useTranslation } from "react-i18next"

const StudentTable = ({ students, onView, onDelete }) => {
  const { t } = useTranslation(['student', 'department']);

  const columns = [
    { label: t('id'), field: "studentId", sortable: true },
    { label: t('full name'), field: "fullname", sortable: true },
    { label: t('department', { ns: 'department' }), field: "department.departmentName", sortable: true },
    { label: t('school year'), field: "schoolYear", sortable: true }
  ];

  return (
    <DataTable
      columns={columns}
      data={students}
      initialSortField="fullname"
      onView={onView}
      onDelete={onDelete}
    />
  );
};

export default StudentTable;
