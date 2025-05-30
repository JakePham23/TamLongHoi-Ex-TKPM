import React, { useState } from "react";
import "../../../styles/ClassForm.scss";
import { useTranslation } from "react-i18next";

const ClassForm = ({ courses, teachers, onSubmit, onClose, existingClass = null, academicYear, semester }) => {
  const { t } = useTranslation(['class', 'course', 'teacher', 'component']);
  
  const [formData, setFormData] = useState({
    classCode: existingClass?.classCode || "",
    courseId: existingClass?.course?._id || "",
    teacherId: existingClass?.teacher?._id || "",
    semester: semester || "1",
    academicYear: academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    schedule: {
      dayOfWeek: existingClass?.schedule?.dayOfWeek || "Monday",
      time: existingClass?.schedule?.time || "08:00-10:00"
    },
    room: existingClass?.room || "A101",
    maxStudents: existingClass?.maxStudents || 120
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "07:00-09:00", "08:00-10:00", "09:00-11:00", "10:00-12:00",
    "13:00-15:00", "14:00-16:00", "15:00-17:00", "16:00-18:00",
    "18:00-20:00", "19:00-21:00"
  ];

  const roomOptions = [
    "A101", "A102", "A103", "A201", "A202", "A203",
    "B101", "B102", "B103", "B201", "B202", "B203",
    "C101", "C102", "C103", "LAB1", "LAB2", "LAB3"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudents" ? (value === "" ? "" : parseInt(value) || "") : value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear schedule errors
    if (errors.schedule) {
      setErrors(prev => ({
        ...prev,
        schedule: null
      }));
    }

    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [name]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.classCode.trim()) {
      newErrors.classCode = t('error.classCodeRequired');
    }

    if (!formData.courseId) {
      newErrors.courseId = t('error.selectCourse');
    }

    if (!formData.teacherId) {
      newErrors.teacherId = t('error.selectTeacher');
    }

    if (!formData.academicYear.trim()) {
      newErrors.academicYear = t('error.academicYearRequired');
    } else if (!/^\d{4}-\d{4}$/.test(formData.academicYear)) {
      newErrors.academicYear = t('error.invalidAcademicYearFormat');
    }

    if (!formData.schedule.time.trim()) {
      newErrors.schedule = t('error.timeRequired');
    } else if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(formData.schedule.time)) {
      newErrors.schedule = t('error.invalidTimeFormat');
    }

    if (!formData.room.trim()) {
      newErrors.room = t('error.roomRequired');
    }

    if (!formData.maxStudents || formData.maxStudents < 1 || formData.maxStudents > 120) {
      newErrors.maxStudents = t('error.invalidMaxStudents');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        ...existingClass,
        ...formData,
        course: { _id: formData.courseId },
        teacher: { teacherId: formData.teacherId }
      });
      onClose();
    } catch (error) {
      setErrors({ general: error.message || t('error.saveFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      const year = currentYear + i;
      years.push(`${year}-${year + 1}`);
    }
    return years;
  };

  return (
    <div className="class-form-overlay" onClick={handleOverlayClick}>
      <div className="class-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{existingClass ? t('editClass') : t('addNewClass')}</h2>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="class-form">
          <div className="form-section">
            <h3>{t('basicInformation')}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('classCode')} *</label>
                {/* <input
                  type="text"
                  name="classCode"
                  value={formData.classCode}
                  onChange={handleChange}
                  placeholder={t('enterClassCode')}
                  className={errors.classCode ? 'error' : ''}
                  disabled={isSubmitting}
                /> */}
              </div>

              <div className="form-group">
                <label>{t('maxStudents')} *</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className={errors.maxStudents ? 'error' : ''}
                />
                {errors.maxStudents && <div className="error-message">{errors.maxStudents}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('course', { ns: 'course' })} *</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={errors.courseId ? 'error' : ''}
                >
                  <option value="">{t('selectCourse')}</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseId} - {course.courseName}
                    </option>
                  ))}
                </select>
                {errors.courseId && <div className="error-message">{errors.courseId}</div>}
              </div>

              <div className="form-group">
                <label>{t('teacher', { ns: 'teacher' })} *</label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className={errors.teacherId ? 'error' : ''}
                >
                  <option value="">{t('selectTeacher')}</option>
                  {teachers.map(teacher => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.fullname}
                    </option>
                  ))}
                </select>
                {errors.teacherId && <div className="error-message">{errors.teacherId}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>{t('academicInformation')}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('semester')} *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="1">{t('semester1')}</option>
                  <option value="2">{t('semester2')}</option>
                  <option value="3">{t('summerSemester')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('academicYear')} *</label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className={errors.academicYear ? 'error' : ''}
                >
                  {generateAcademicYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.academicYear && <div className="error-message">{errors.academicYear}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>{t('scheduleInformation')}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('dayOfWeek')} *</label>
                <select
                  name="dayOfWeek"
                  value={formData.schedule.dayOfWeek}
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
                <label>{t('time')} *</label>
                <select
                  name="time"
                  value={formData.schedule.time}
                  onChange={handleScheduleChange}
                  className={errors.schedule ? 'error' : ''}
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.schedule && <div className="error-message">{errors.schedule}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('room')} *</label>
                <select
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className={errors.room ? 'error' : ''}
                >
                  {roomOptions.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                {errors.room && <div className="error-message">{errors.room}</div>}
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="general-error">{errors.general}</div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              {t('cancel', { ns: 'component' })}
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('saving', { ns: 'component' }) : t('save', { ns: 'component' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;