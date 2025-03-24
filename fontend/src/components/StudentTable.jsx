import React, { useState } from "react";
import Button from "./Button";
import { FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "../styles/StudentTable.scss";

const StudentTable = ({ students, onView, onDelete }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  // Sắp xếp danh sách sinh viên theo trường được chọn
  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField] || "";
    const valueB = b[sortField] || "";
    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  // Chọn icon sắp xếp phù hợp
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("studentId")}>MSSV {getSortIcon("studentId")}</th>
          <th onClick={() => handleSort("fullname")}>Họ và tên {getSortIcon("fullname")}</th>
          <th onClick={() => handleSort("department.departmentName")}>Khoa {getSortIcon("department.departmentName")}</th>
          <th onClick={() => handleSort("schoolYear")}>Khóa {getSortIcon("schoolYear")}</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {sortedStudents.map((student) => (
          <tr key={student.studentId}>
            <td>{student.studentId}</td>
            <td>{student.fullname}</td>
            <td>{student.department?.departmentName}</td>
            <td>{student.schoolYear}</td>
            <td className="buttonBox">
              <Button icon={<FaEye />} label="Xem" variant="gray" onClick={() => onView(student)} />
              <Button icon={<FaTrash />} label="Xoá" variant="gray" onClick={() => onDelete(student.studentId)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
