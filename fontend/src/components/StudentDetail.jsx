import "../styles/StudentDetail.scss"
import React, { useState } from "react";

const StudentDetail = ({ departments, student, isEditing, editedStudent, setEditedStudent, onSave, onEdit, onClose}) => {
  if (!student) return null;
  const [exportType, setExportType] = useState("csv"); // Trạng thái chọn kiểu xuất file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
    });
  };
  
  const handleEdit = () => {
    setEditedStudent({
      ...student,
      identityDocument: { ...student.identityDocument },
      department: student.department ? { ...student.department } : null,
    }); 
    onEdit();
  };
    // 📌 Hàm xuất file CSV
    const exportCSV = () => {
      const csvData = [
        ["MSSV", "Họ và tên", "CCCD", "Ngày sinh", "Khóa", "Khoa", "Giới tính", "Email", "SĐT", "Chương trình", "Tình trạng", "Địa chỉ thường trú", "Địa chỉ tạm trú"],
        [
          student.studentId,
          student.fullname,
          student.identityDocument?.idNumber || "",
          new Date(student.dob).toLocaleDateString("vi-VN"),
          student.schoolYear,
          student.department?.departmentName || "",
          student.gender ? "Nam" : "Nữ",
          student.email,
          student.phone,
          student.program,
          student.studentStatus,
          student.permanentAddress,
          student.temporaryAddress
        ],
      ];
  
      const csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `student_${student.studentId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    // 📌 Hàm xuất file JSON
    const exportJSON = () => {
      const jsonData = JSON.stringify(student, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `student_${student.studentId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    // 📌 Xử lý xuất file dựa trên lựa chọn
    const handleExport = () => {
      if (exportType === "csv") {
        exportCSV();
      } else {
        exportJSON();
      }
    };
  return (
    <div className="student-detail-overlay" onClick={(e) => e.target.classList.contains("student-detail-overlay") && onClose()}>
      <div className="student-detail">
      <div className="top-container">
              <div className="avatar-container">
                <div className="avatar"> {student.fullname?.charAt(0) || "?"}</div>
                <div className="student-name">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullname"
                      value={editedStudent.fullname}
                      onChange={handleChange}
                    />
                  ) : (
                    student.fullname
                  )}
                </div>
              </div>
              <div className="info">
                <p><strong>MSSV:</strong> {student.studentId}</p>
                <p><strong>CCCD:</strong> {isEditing ? (
                  <input type="text" name="identityDocument.idNumber" value={editedStudent.identityDocument.idNumber} onChange={handleChange} />
                ) : student.identityDocument.idNumber}</p>
                <p><strong>Sinh ngày:</strong> {isEditing ? (
                  <input type="date" name="dob" value={editedStudent.dob} onChange={handleChange} />
                ) : new Date(student.dob).toLocaleDateString("vi-VN")}</p>
                <p><strong>Khóa:</strong> {student.schoolYear}</p>
                <p><strong>Khoa:</strong> 
                {isEditing ? (
                  <select
                  name="department"
                  value={editedStudent.department._id || ""}
                  onChange={(e) => {
                    const selectedDept = departments.find(dept => dept._id === e.target.value);
                    setEditedStudent((prev) => ({
                      ...prev,
                      department: selectedDept ? { _id: selectedDept._id, departmentName: selectedDept.departmentName } : null
                    }));
                  }}
                >
                  <option value="">Chọn khoa</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
                ) : student.department?.departmentName}
              </p>
                <p><strong>Giới tính:</strong> {isEditing ? (
                <select name="gender" value={editedStudent.gender} onChange={(e) => 
                  setEditedStudent((prev) => ({
                    ...prev,
                    gender: e.target.value === "true" // Chuyển đổi từ chuỗi -> boolean
                  }))
                }>
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              ) : student.gender ? "Nam" : "Nữ"}</p>

                <p><strong>Email:</strong> {isEditing ? (
                  <input type="email" name="email" value={editedStudent.email} onChange={handleChange} />
                ) : student.email}</p>
                <p><strong>SĐT:</strong> {isEditing ? (
                  <input type="text" name="phone" value={editedStudent.phone} onChange={handleChange} />
                ) : student.phone}</p>
                <p><strong>Chương trình:</strong> {student.program}</p>
                <p><strong>Tình trạng:</strong> {student.studentStatus }</p>
              </div>
            </div>

            {/* CONTAINER DƯỚI */}
            <div className="bottom-container">
              <p><strong>Địa chỉ thường trú:</strong> {isEditing ? (
                <input type="text" name="permanentAddress" value={editedStudent.permanentAddress} onChange={handleChange} />
              ) : student.permanentAddress}</p>
              <p><strong>Địa chỉ tạm trú:</strong> {isEditing ? (
                <input type="text" name="temporaryAddress" value={editedStudent.temporaryAddress} onChange={handleChange} />
              ) : student.temporaryAddress}</p>
            </div>

            {/* BUTTON */}
            <div className="button-group">
              {isEditing ? (
                  <button className="save-button" onClick={onSave}>Lưu</button>
              ) : (
                <>
                <button className="edit-button" onClick={handleEdit}>Sửa</button>
                  {/* Dropdown chọn kiểu file */}
                  <div className="exportBox">
                      <select className="export-select" value={exportType} onChange={(e) => setExportType(e.target.value)}>
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                      </select>
                    {/* Nút xuất file */}
                    <button className="export-button" onClick={handleExport}>Xuất</button>
                  </div>
                </>
                
              )}
            </div>

      </div>
    </div>
  );
};

export default StudentDetail;
