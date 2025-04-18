import React from "react";

const StudentRegistrationForm = ({ students, onSelect, onClose, onConfirm }) => {
  return (
    <div className="student-registration-form">
      <h2>Chọn Sinh Viên Để Đăng Ký</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => onSelect(student.id, e.target.checked)}
              />
              {student.name} ({student.email})
            </label>
          </li>
        ))}
      </ul>
      <button onClick={onConfirm}>Xác nhận Đăng ký</button>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

export default StudentRegistrationForm;