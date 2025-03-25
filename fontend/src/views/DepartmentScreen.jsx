import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSort, FaSortUp, FaSortDown, FaEdit, FaSave } from "react-icons/fa";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import departmentService from "../services/department.service.jsx";
import "../styles/DepartmentScreen.scss";

const removeVietnameseTones = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const DepartmentScreen = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const filteredDepartments = departments
    .filter((d) => removeVietnameseTones(d.departmentName).includes(removeVietnameseTones(searchTerm)))
    .sort((a, b) => {
      if (!sortField) return 0;
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSaveEdit = async (departmentId) => {
    if (!editedName.trim()) return;
  
    try {
      const updatedDepartment = await departmentService.updateDepartment(departmentId, { departmentName: editedName });
  
      if (updatedDepartment && updatedDepartment.data) {  // Kiểm tra response có dữ liệu không
        setDepartments((prev) =>
          prev.map((d) => (d._id === departmentId ? { ...d, departmentName: updatedDepartment.data.departmentName } : d))
        );
      }
  
      setEditingId(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
    }
  };
  

  const handleDelete = async (departmentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    await departmentService.deleteDepartment(departmentId);
    setDepartments(departments.filter((s) => s._id !== departmentId));
  };

  const handleEditClick = (department) => {
    setEditingId(department._id);
    setEditedName(department.departmentName);
  };

  return (
    <div className="DepartmentScreen">
      <h1>Danh sách các khoa</h1>
      <div className="top-bar">
        <SearchInput placeholder="Tìm kiếm khoa" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button icon={<FaPlus />} label="Thêm khoa" variant="gray" onClick={() => setIsAdding(true)} />
      </div>

      <table className="department-table">
        <thead>
          <tr>
            <th>STT</th>
            <th onClick={() => handleSort("departmentName")} className="sortable">
              Khoa {getSortIcon("departmentName")}
            </th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((department, index) => (
            <tr key={department._id}>
              <td>{index + 1}</td>
              <td>
                {editingId === department._id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  department.departmentName
                )}
              </td>
              <td className="buttonBox">
                {editingId === department._id ? (
                  <Button icon={<FaSave />} label="Lưu" variant="primary" onClick={() => handleSaveEdit(department._id)} />
                ) : (
                  <Button icon={<FaEdit />} label="Sửa" variant="gray" onClick={() => handleEditClick(department)} />
                )}
                <Button icon={<FaTrash />} label="Xoá" variant="gray" onClick={() => handleDelete(department._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Thêm Khoa</h2>
            <input type="text" placeholder="Nhập tên khoa" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
            <div className="modal-buttons">
              <Button label="Hủy" variant="gray" onClick={() => setIsAdding(false)} />
              <Button label="Lưu" variant="primary" onClick={handleSaveEdit(newDepartment._id)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentScreen;
