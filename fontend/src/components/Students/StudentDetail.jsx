import "../../styles/StudentDetail.scss";
import React, { useState } from "react";
import { exportCSV, exportJSON } from "../../utils/export.util"; // Ensure correct import
import { validateEmail, validatePhone, validateStatusChange } from "../../utils/businessRule.util"; // Import validation utils
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../../utils/constants"; // Ensure constants are correct

const StudentDetail = ({ departments, student, isEditing, editedStudent, setEditedStudent, onSave, onEdit, onClose }) => {
  const [exportType, setExportType] = useState("csv"); // Trạng thái chọn kiểu xuất file
  const [errors, setErrors] = useState({}); // State để lưu lỗi

  if (!student) return null;
  // Hàm kiểm tra các lỗi
  const validate = () => {
    let newErrors = {};

    // Kiểm tra email
    const emailError = validateEmail(editedStudent.email, ALLOWED_EMAIL_DOMAIN);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Kiểm tra số điện thoại
    const phoneError = validatePhone(editedStudent.phone, PHONE_REGEX);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // Kiểm tra tình trạng
    const statusError = validateStatusChange(editedStudent.studentStatus, editedStudent.studentStatus, STATUS_RULES);
    if (statusError) {
      newErrors.studentStatus = statusError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setEditedStudent((prev) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        // Đảm bảo cập nhật đúng trường ở cấp cao
        return { ...prev, [name]: value };
      } else {
        // Cập nhật trường con trong nested object
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

  // 📌 Handle export
  const handleExport = () => {
    if (exportType === "csv") {
      exportCSV(student, `student_${student.studentId}`);
    } else {
      exportJSON(student, `student_${student.studentId}`);
    }
  };

  // Hàm lưu dữ liệu khi người dùng nhấn lưu
  const handleSave = () => {
    if (validate()) {
      onSave();
    }
  };
// Reset the editedStudent when closing the modal
const handleClose = () => {
  setEditedStudent({
    ...student,
    identityDocument: { ...student.identityDocument },
    department: student.department ? { ...student.department } : null,
  });
  onClose();
};

  return (
    <div className="student-detail-overlay" onClick={(e) => e.target.classList.contains("student-detail-overlay") && onClose()&& handleClose()}>
      <div className="student-detail">
        <div className="top-container">
          <div className="avatar-container">
            <div className="avatar">{student.fullname?.charAt(0) || "?"}</div>
            <div className="student-name">
              {isEditing ? (
                <input type="text" name="fullname" value={editedStudent.fullname} onChange={handleChange} />
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
              <>
                <input type="email" name="email" value={editedStudent.email} onChange={handleChange} />
                <p>                {errors.email && <span className="error">{errors.email}</span>}      </p>
              </>
            ) : student.email}</p>
            <p><strong>SĐT:</strong> {isEditing ? (
              <>
                <input type="text" name="phone" value={editedStudent.phone} onChange={handleChange} />
                <p>                {errors.phone && <span className="error">{errors.phone}</span>}                </p>
              </>
            ) : student.phone}</p>
            <p><strong>Chương trình:</strong> {student.program}</p>
            <p><strong>Tình trạng:</strong> {isEditing ? (
              <>
                <select
                  name="studentStatus"
                  value={editedStudent.studentStatus}
                  onChange={handleChange}
                  disabled={editedStudent.studentStatus === "graduated"} // Disable if "graduated"
                >
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="dropout">Dropout</option>
                  <option value="suspended">Suspended</option>
                </select>
                {errors.studentStatus && <span className="error">{errors.studentStatus}</span>}
              </>
            ) : student.studentStatus}</p>
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
            <button className="save-button" onClick={handleSave}>Lưu</button>
          ) : (
            <>
              <button className="edit-button" onClick={handleEdit} >Sửa</button>
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
