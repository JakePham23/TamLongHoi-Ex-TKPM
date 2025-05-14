import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import "../../styles/pages/RegistrationScreen.scss";

const RegistrationForm = ({ onSave, registration, courses, teachers, onClose }) => {
  const { t } = useTranslation('registration');

  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    courseId: "",
    teacherId: "",
    maxStudent: "",
    description: "",
    schedule: { dayOfWeek: "", time: "" }
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        year: registration.year || "",
        semester: registration.semester || "",
        courseId: registration.courseId || "",
        teacherId: registration.teacherId || "",
        maxStudent: registration.maxStudent || "",
        description: registration.description || "",
        schedule: registration.schedule || { dayOfWeek: "", time: "" }
      });
    }
  }, [registration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudent" ? parseInt(value) || "" : value
    }));
  };

  const handleScheduleChange = (dayOrTime, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayOrTime]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.year.trim()) {
      alert(t('year') + " " + "cannot be empty!");
      return;
    }
    if (!formData.semester.trim()) {
      alert(t('semester') + " " + "cannot be empty!");
      return;
    }
    if (!formData.courseId) {
      alert("Please select a " + t('course') + "!");
      return;
    }
    if (!formData.teacherId) {
      alert("Please select a " + t('teacher') + "!");
      return;
    }
    if (!formData.maxStudent || formData.maxStudent < 1) {
      alert(t('maxStudent') + " must be greater than 0!");
      return;
    }

    onSave({
      ...registration,
      year: formData.year,
      semester: formData.semester,
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      maxStudent: formData.maxStudent,
      description: formData.description,
      schedule: formData.schedule
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{registration ? t('editRegistration') : t('addRegistration')}</h2>

        <div className="form-group">
          <label>{t('year')}</label>
          <input
            type="number"
            name="year"
            placeholder={t('year') + " (e.g. 2023)"}
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('semester')}</label>
          <input
            type="number"
            name="semester"
            placeholder={t('semester') + " (e.g. 1 or 2)"}
            value={formData.semester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('course')}</label>
          <select
            name="courseId"
            value={formData.courseId}
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
        </div>

        <div className="form-group">
          <label>{t('teacher')}</label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectTeacher')}</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('maxStudent')}</label>
          <input
            type="number"
            name="maxStudent"
            placeholder={t('maxStudent') + " (greater than 0)"}
            value={formData.maxStudent}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>{t('description')}</label>
          <input
            type="text"
            name="description"
            placeholder={t('description') + " (optional)"}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{t('schedule')}</label>
          <input
            type="text"
            placeholder={t('dayOfWeek')}
            value={formData.schedule.dayOfWeek}
            onChange={(e) => handleScheduleChange('dayOfWeek', e.target.value)}
          />
          <input
            style={{ marginTop: "10px" }}
            type="text"
            placeholder={t('time')}
            value={formData.schedule.time}
            onChange={(e) => handleScheduleChange('time', e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          <Button label={t('cancel')} variant="gray" onClick={onClose} />
          <Button label={t('save')} variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;