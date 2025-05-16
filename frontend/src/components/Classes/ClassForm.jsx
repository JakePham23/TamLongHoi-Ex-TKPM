import React, { useState } from "react";
import "../../styles/ClassForm.scss";
import { useTranslation } from "react-i18next";

const ClassForm = ({ courses, teachers, onSubmit, onClose }) => {
  const { t } = useTranslation(['class', 'course', 'teacher']);
  const [newClass, setNewClass] = useState({
    classCode: "",
    courseId: "",
    teacherId: "",
    semester: "1",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    schedule: {
      dayOfWeek: "Monday",
      time: "08:00-10:00"
    },
    room: "A101",
    maxStudents: 30
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newClass.courseId || !newClass.teacherId) {
      setErrors({
        courseId: !newClass.courseId ? t('error.selectCourse') : null,
        teacherId: !newClass.teacherId ? t('error.selectTeacher') : null
      });
      return;
    }

    try {
      await onSubmit(newClass);
      onClose();
    } catch (error) {
      setErrors({ general: error.message || t('error.saveFailed') });
    }
  };

  return (
    <div className="class-form-overlay" onClick={onClose}>
      <div className="class-form" onClick={(e) => e.stopPropagation()}>
        <h2>{t('addNewClass')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('classCode')}:</label>
            <input
              type="text"
              name="classCode"
              value={newClass.classCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('course', { ns: 'course' })}:</label>
            <select
              name="courseId"
              value={newClass.courseId}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectCourse')}</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
            {errors.courseId && <span className="error">{errors.courseId}</span>}
          </div>

          <div className="form-group">
            <label>{t('teacher', { ns: 'teacher' })}:</label>
            <select
              name="teacherId"
              value={newClass.teacherId}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectTeacher')}</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacherId && <span className="error">{errors.teacherId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('semester')}:</label>
              <select
                name="semester"
                value={newClass.semester}
                onChange={handleChange}
              >
                <option value="1">{t('semester1')}</option>
                <option value="2">{t('semester2')}</option>
                <option value="3">{t('summerSemester')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('academicYear')}:</label>
              <input
                type="text"
                name="academicYear"
                value={newClass.academicYear}
                onChange={handleChange}
                required
                placeholder="YYYY-YYYY"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('dayOfWeek')}:</label>
              <select
                name="dayOfWeek"
                value={newClass.schedule.dayOfWeek}
                onChange={handleScheduleChange}
              >
                <option value="Monday">{t('monday')}</option>
                <option value="Tuesday">{t('tuesday')}</option>
                <option value="Wednesday">{t('wednesday')}</option>
                <option value="Thursday">{t('thursday')}</option>
                <option value="Friday">{t('friday')}</option>
                <option value="Saturday">{t('saturday')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('time')}:</label>
              <input
                type="text"
                name="time"
                value={newClass.schedule.time}
                onChange={handleScheduleChange}
                placeholder="08:00-10:00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('room')}:</label>
              <input
                type="text"
                name="room"
                value={newClass.room}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>{t('maxStudents')}:</label>
              <input
                type="number"
                name="maxStudents"
                value={newClass.maxStudents}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;