import React from "react";
import DataTable from "../DataTable";

const StudentTable = ({ students, onView, onDelete }) => {
  const columns = [
    { label: "MSSV", field: "studentId", sortable: true },
    { label: "Họ và tên", field: "fullname", sortable: true },
    { label: "Khoa", field: "department.departmentName", sortable: true },
    { label: "Khóa", field: "schoolYear", sortable: true }
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
