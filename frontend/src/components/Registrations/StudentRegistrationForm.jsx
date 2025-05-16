import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/pages/RegistrationScreen.scss";

const StudentRegistrationForm = ({ initialData, course, teacher, students, onClose, onConfirm }) => {
  const { t } = useTranslation('registration');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleSelect = (studentId, isChecked) => {
    setSelectedStudents((prevSelected) =>
      isChecked
        ? [...prevSelected, studentId]
        : prevSelected.filter((id) => id !== studentId)
    );
  };

  useEffect(() => {
    setSelectedStudents([]); // reset khi đổi môn học
  }, [course]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="student-registration-form" onClick={(e) => e.stopPropagation()}>
        {course && (
          <div className="course-info">
            <h2>{t('courseInfo')}</h2>
            <p><strong>{t('courseName')}:</strong> {course.courseName}</p>
            <p><strong>{t('teacher')}:</strong> {teacher.fullname}</p>
          </div>
        )}

        <h2>{t('selectStudents')}</h2>

        <ul>
          {students.map((student) => {
            // Tìm xem sinh viên có trong danh sách đã đăng ký không
            const registeredInfo = initialData?.registrationStudent?.find(
              (rs) =>
                rs.studentId === student._id || rs.studentId?._id === student._id
            );
            const isRegistered = !!registeredInfo;
            const status = registeredInfo?.status;

            return (
              <li key={student._id} style={{ listStyleType: "none" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={(e) => handleSelect(student._id, e.target.checked)}
                    disabled={isRegistered} // nếu đã đăng ký thì disable checkbox
                  />
                  {student.name} ({student.email})
                  {status && (
                    <span style={{ marginLeft: 8, color: "green" }}>
                      — {t('registered')} ({status})
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>

        <div className="buttons">
          <button onClick={() => onConfirm(initialData, selectedStudents)}>{t('confirmRegistration')}</button>
          <button onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;