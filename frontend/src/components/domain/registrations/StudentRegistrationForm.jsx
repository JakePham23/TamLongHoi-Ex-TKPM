import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import "../../../styles/StudentRegistrationForm.scss";
import removeVietnameseTones from "../../../utils/string.util.js";

const StudentRegistrationForm = ({ initialData, course, teacher, students, onClose, onConfirm }) => {
  const { t } = useTranslation(['registration', 'common', 'course']);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (studentId, isChecked) => {
    setSelectedStudents((prevSelected) =>
      isChecked
        ? [...prevSelected, studentId]
        : prevSelected.filter((id) => id !== studentId)
    );
  };

  useEffect(() => {
    setSelectedStudents([]);
    setSearchTerm("");
  }, [initialData]);

const filteredStudents = useMemo(() => {
    // Chuẩn hóa từ khóa tìm kiếm: bỏ dấu, chuyển sang chữ thường, cắt khoảng trắng
    const normalizedFilter = removeVietnameseTones(searchTerm.toLowerCase().trim());

    if (!normalizedFilter) {
      return students;
    }
    return students.filter(student => {
      // Chuẩn hóa tên sinh viên
      const studentName = removeVietnameseTones(String(student.fullname || '').toLowerCase());
      // Chuẩn hóa mã số sinh viên
      const studentId = removeVietnameseTones(String(student.studentId || '').toLowerCase());
      
      return studentName.includes(normalizedFilter) || studentId.includes(normalizedFilter);
    });
}, [students, searchTerm]);

  return (
    <div className="student-registration-form-modal-overlay" onClick={onClose}>
      <div className="student-registration-form-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h1>{t('enrollStudent')}</h1>
          <button className="close-icon" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {course && (
            <div className="course-info">
              <p><strong>{t('course', { ns: 'course' })}:</strong> {course.courseName}</p>
              <p><strong>{t('teacher', { ns: 'course' })}:</strong> {teacher.fullname}</p>
            </div>
          )}

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('common:searchByNameOrId')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ul>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const registeredInfo = initialData?.registrationStudent?.find(
                  (rs) => rs.studentId === student._id || rs.studentId?._id === student._id
                );
                const isRegistered = !!registeredInfo;

                return (
                  <li key={student._id}>
                    <label data-disabled={isRegistered}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={(e) => handleSelect(student._id, e.target.checked)}
                        disabled={isRegistered}
                      />
                      <div className="student-info">
                        <span className="student-fullname">{student.fullname}</span>
                        <span className="student-id">({student.studentId})</span>
                      </div>
                      {isRegistered && (
                        <span className="student-status">
                          {t('registered')}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })
            ) : (
              <div className="no-results-message">
                {t('common:noResultsFound')}
              </div>
            )}
          </ul>
        </div>
        
        <div className="modal-footer">
            <button className="confirm-button" onClick={() => onConfirm(initialData, selectedStudents)}>{t('confirmRegistration')}</button>
        </div>

      </div>
    </div>
  );
};

export default StudentRegistrationForm;