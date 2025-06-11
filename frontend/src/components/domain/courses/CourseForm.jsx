import React, { useEffect, useState } from "react";
import Button from "../../common/Button.jsx";
import "../../../styles/pages/CourseScreen.scss";
import { useTranslation } from "react-i18next";
import { validateCourseForm } from "./courseFormValidator.js" ;

const CourseForm = ({ onSave, course, departments, onClose }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    credit: "",
    practicalSession: "",
    theoreticalSession: "",
    departmentId: "",
    description: "",
    prerequisite: ""
  });

  const [errors, setErrors] = useState({});

  const { t } = useTranslation(['course', 'department', 'component']);

  useEffect(() => {
    if (course) {
      setFormData({
        courseId: course.courseId || "",
        courseName: course.courseName || "",
        credit: course.credit || "",
        practicalSession: course.practicalSession || "",
        theoreticalSession: course.theoreticalSession || "",
        departmentId: course.department?._id || "",
        description: course.description || "",
        prerequisite: course.prerequisite || ""
      });
    } else {
      setFormData({
        courseId: "",
        courseName: "",
        credit: "",
        practicalSession: "",
        theoreticalSession: "",
        departmentId: "",
        description: "",
        prerequisite: ""
      });
    }
  }, [course]);

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
      [name]: name === "credit" || name === "practicalSession" || name === "theoreticalSession" 
        ? (value === "" ? "" : parseInt(value) || "") 
        : value
    }));
  };

  const validateForm = () => {
    const newErrors = validateCourseForm(formData, t);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      ...course,
      courseId: formData.courseId,
      courseName: formData.courseName,
      credit: formData.credit,
      practicalSession: formData.practicalSession,
      theoreticalSession: formData.theoreticalSession,
      department: {
        _id: formData.departmentId
      },
      description: formData.description,
      prerequisite: formData.prerequisite
    });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{course ? t('edit course') : t('add course')}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('course id')} *</label>
            <input
              type="text"
              name="courseId"
              placeholder="VD: CSC0005"
              value={formData.courseId}
              onChange={handleChange}
              className={errors.courseId ? 'error' : ''}
            />
            {errors.courseId && <div className="error-message">{errors.courseId}</div>}
          </div>

          <div className="form-group">
            <label>{t('course name')} *</label>
            <input
              type="text"
              name="courseName"
              placeholder={t('enter course name')}
              value={formData.courseName}
              onChange={handleChange}
              className={errors.courseName ? 'error' : ''}
            />
            {errors.courseName && <div className="error-message">{errors.courseName}</div>}
          </div>

          <div className="form-group">
            <label>{t('number of credits')} *</label>
            <input
              type="number"
              name="credit"
              placeholder={t('enter number of credits')}
              value={formData.credit}
              onChange={handleChange}
              min="2"
              className={errors.credit ? 'error' : ''}
            />
            {errors.credit && <div className="error-message">{errors.credit}</div>}
          </div>

          <div className="form-group">
            <label>{t('theoretical session')} *</label>
            <input
              type="number"
              name="theoreticalSession"
              placeholder={t('enter theoretical session')}
              value={formData.theoreticalSession}
              onChange={handleChange}
              min="0"
              className={errors.theoreticalSession ? 'error' : ''}
            />
            {errors.theoreticalSession && <div className="error-message">{errors.theoreticalSession}</div>}
          </div>

          <div className="form-group">
            <label>{t('practical session')} *</label>
            <input
              type="number"
              name="practicalSession"
              placeholder={t('enter practical session')}
              value={formData.practicalSession}
              onChange={handleChange}
              min="0"
              className={errors.practicalSession ? 'error' : ''}
            />
            {errors.practicalSession && <div className="error-message">{errors.practicalSession}</div>}
          </div>

          <div className="form-group">
            <label>{t('department', { ns: 'department' })} *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className={errors.departmentId ? 'error' : ''}
            >
              <option value="">{t('choose department', { ns: 'department' })}</option>
              {departments.map(department => (
                <option key={department._id} value={department._id}>
                  {department.departmentName}
                </option>
              ))}
            </select>
            {errors.departmentId && <div className="error-message">{errors.departmentId}</div>}
          </div>

          <div className="form-group">
            <label>{t('prerequisuite')}</label>
            <input
              type="text"
              name="prerequisite"
              placeholder={`${t('prerequisuite id')} ${t('if have')}`}
              value={formData.prerequisite}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('description')}</label>
            <textarea
              name="description"
              placeholder={t('course description')}
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-buttons">
            <Button label={t('cancel', { ns: 'component' })} variant="gray" onClick={onClose} type="button" />
            <Button label={t('save', { ns: 'component' })} variant="primary" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;