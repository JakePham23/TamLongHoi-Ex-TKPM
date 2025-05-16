import React, { useEffect, useState } from "react";
import Button from "../Button";
import "../../styles/pages/CourseScreen.scss";
import { useTranslation } from "react-i18next";

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
    setFormData(prev => ({
      ...prev,
      [name]: name === "credit" ? parseInt(value) || "" : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.courseId.trim()) {
      alert(t('course id blank'));
      return;
    }
    if (!formData.courseName.trim()) {
      alert(t('course name blank'));
      return;
    }
    if (!formData.credit || formData.credit < 2) {
      alert(t('credits greater than 1'));
      return;
    }
    if (!formData.practicalSession || formData.practicalSession < 0) {
      alert(t('number of theoretical sessions must be greater than or equal to 0'));
      return;
    }
    if (!formData.theoreticalSession || formData.theoreticalSession < 0) {
      alert(t('number of practical sessions must be greater than or equal to 0'));
      return;
    }
    if (!formData.departmentId) {
      alert(t('please select department'));
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

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{course ? t('edit course') : t('add course')}</h2>

        <div className="form-group">
          <label>{t('course id')}</label>
          <input
            type="text"
            name="courseId"
            placeholder="VD: CSC0005"
            value={formData.courseId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{t('course name')}</label>
          <input
            type="text"
            name="courseName"
            placeholder={t('enter course name')}
            value={formData.courseName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{t('number of credits')}</label>
          <input
            type="number"
            name="credit"
            placeholder={t('enter number of credits')}
            value={formData.credit}
            onChange={handleChange}
            min="2"
          />
        </div>


        <div className="form-group">
          <label>{t('theoretical session')}</label>
          <input
            type="number"
            name="theoreticalSession"
            placeholder={t('enter theoretical session')}
            value={formData.theoreticalSession}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>{t('practical session')}</label>
          <input
            type="number"
            name="practicalSession"
            placeholder={t('enter practical session')}
            value={formData.practicalSession}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>{t('department', { ns: 'department' })}</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
          >
            <option value="">{t('choose department', { ns: 'department' })}</option>
            {departments.map(department => (
              <option key={department._id} value={department._id}>
                {department.departmentName}
              </option>
            ))}
          </select>
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
          <input
            type="text"
            name="description"
            placeholder={t('course description')}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="modal-buttons">
          <Button label={t('cancel', { ns: 'component' })} variant="gray" onClick={onClose} />
          <Button label={t('save', { ns: 'component' })} variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default CourseForm;