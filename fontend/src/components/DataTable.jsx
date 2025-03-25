import React, { useState, useRef, useCallback } from "react";
import Button from "./Button";
import { FaEye, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "../styles/Table.scss";

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onView, 
  onDelete, 
  initialSortField 
}) => {
  const [sortField, setSortField] = useState(initialSortField || null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(10);
  const observer = useRef(null);

  const loadMore = () => setVisibleCount((prev) => prev + 10);

  const lastRowRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const getNestedValue = (obj, path) => path.split(".").reduce((value, key) => value?.[key] || "", obj);

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
  
    const valueA = getNestedValue(a, sortField);
    const valueB = getNestedValue(b, sortField);
  
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA; // Sắp xếp số
    }
  
    const strA = String(valueA);
    const strB = String(valueB);
    
    return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA); // Sắp xếp chuỗi
  });
  

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(({ label, field, sortable }) => (
            <th key={field} onClick={() => sortable && handleSort(field)} style={{ cursor: sortable ? "pointer" : "default" }}>
              {label} {sortable && getSortIcon(field)}
            </th>
          ))}
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>Không có dữ liệu</td>
          </tr>
        ) : (
          sortedData.slice(0, visibleCount).map((row, index) => (
            <tr key={row._id || row.studentId} ref={index === visibleCount - 1 ? lastRowRef : null}>
              {columns.map(({ field }) => (
                <td key={field}>{getNestedValue(row, field)}</td>
              ))}
              <td className="buttonBox">
                {onView && <Button icon={<FaEye />} label="Xem" variant="gray" onClick={() => onView(row)} />}
                {onEdit && <Button icon={<FaEdit />} label="Sửa" variant="gray" onClick={() => onEdit(row)} />}
                {onDelete && <Button icon={<FaTrash />} label="Xoá" variant="danger" onClick={() => onDelete(row._id || row.studentId)} />}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default DataTable;
