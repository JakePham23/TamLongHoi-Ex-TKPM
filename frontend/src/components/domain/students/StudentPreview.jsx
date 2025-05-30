// components/domain/students/StudentPreview.jsx
import React from "react";

const StudentPreview = ({ students, errors }) => (
  <ul className="student-preview-list">
    {students.map((student, index) => (
      <li key={index} className="student-preview-item">
        <div className="student-info">
          <span className="student-name">{student.fullname}</span>
          <span className="student-id"> - {student.studentId}</span>
        </div>
        {errors[student.studentId] && (
          <div className="error-message">
            <span className="error">({errors[student.studentId]})</span>
          </div>
        )}
      </li>
    ))}
  </ul>
);

export default StudentPreview;