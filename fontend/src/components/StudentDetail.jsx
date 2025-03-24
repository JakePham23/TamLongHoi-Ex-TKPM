import React from "react";
import "../styles/StudentDetail.scss"
const StudentDetail = ({ student, isEditing, editedStudent, setEditedStudent, onSave, onEdit, onClose}) => {
  if (!student) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
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
                <p><strong>Khoa:</strong> {student.department?.departmentName}</p>
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
             {isEditing ? (
              <button className="save-button" onClick={onSave}>Lưu</button>
            ) : (
              <button className="edit-button" onClick={onEdit}>Sửa</button>
            )}
      </div>
    </div>
  );
};

export default StudentDetail;
