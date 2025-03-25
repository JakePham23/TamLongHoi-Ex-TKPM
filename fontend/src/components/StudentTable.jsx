import React, { useState, useRef, useCallback } from "react";
import Button from "./Button";
import { FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "../styles/StudentTable.scss";

const StudentTable = ({ students, onView, onDelete }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  // Hàm hỗ trợ sắp xếp nested field
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((value, key) => value?.[key] || "", obj);
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = getNestedValue(a, sortField);
    const valueB = getNestedValue(b, sortField);
  
    if (sortField === "schoolYear") {
      return sortOrder === "asc" ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
    }
  
    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
  

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Cuộn vô hạn
  const [visibleCount, setVisibleCount] = useState(10);
  const observer = useRef(null);

  const loadMoreStudents = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const lastStudentRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreStudents();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMoreStudents]
  );

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
        {sortedStudents.slice(0, visibleCount).map((student, index) => (
          <tr key={student.studentId} ref={index === visibleCount - 1 ? lastStudentRef : null}>
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
