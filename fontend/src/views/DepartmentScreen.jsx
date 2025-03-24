import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import departmentService from "../services/department.service.jsx";
import "../styles/DepartmentScreen.scss";

const DepartmentScreen = () => {
  const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return; // Không cho nhập rỗng
  
    try {
      const addedDepartment = await departmentService.addDepartment({
        departmentName: newDepartment,
      });
  
      // Nếu API trả về object có _id, ta thêm nó vào danh sách
      if (addedDepartment && addedDepartment._id) {
        setDepartments((prev) => [...prev, addedDepartment]);
      }
  
      setIsAdding(false);
      setNewDepartment(""); // Reset input
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
    }
  };
    const handleDelete = async (departmentId) => {
      if (!window.confirm("Bạn có chắc muốn xoá?")) return;
      await departmentService.deleteDepartment(departmentId);
      setDepartments(departments.filter((s) => s._id !== departmentId));
    };

  return (
    <div className="DepartmentScreen">
      <h1>Danh sách các khoa</h1>
      <div className="top-bar">
        <SearchInput placeholder="Tìm kiếm khoa" />
        <Button icon={<FaPlus />} label="Thêm khoa" variant="gray" onClick={() => setIsAdding(true)} />
      </div>

      <table className="department-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Khoa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department, index) => (
            <tr key={department._id}>
              <td>{index + 1}</td>
              <td>{department.departmentName}</td>
              <td className="buttonBox">
                {/* <Button icon={<FaEye />} label="Xem" variant="gray" /> */}
                <Button icon={<FaTrash />} label="Xoá" variant="gray"  onClick={()=>handleDelete(department._id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hộp thoại thêm khoa */}
      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Thêm Khoa</h2>
            <input
              type="text"
              placeholder="Nhập tên khoa"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
            <div className="modal-buttons">
              <Button label="Hủy" variant="gray" onClick={() => setIsAdding(false)} />
              <Button label="Lưu" variant="primary" onClick={handleAddDepartment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentScreen;
