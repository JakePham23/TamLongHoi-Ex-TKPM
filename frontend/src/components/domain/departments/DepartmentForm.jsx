import React, { useEffect, useState } from "react";
import Button from "../../common/Button.jsx";
import "../../../styles/pages/DepartmentScreen.scss";
import { useTranslation } from 'react-i18next';
import TeacherService from "../../../services/teacher.service.js"

const DepartmentForm = ({ onSave, onClose, department }) => {
  const [name, setName] = useState("");
  const [establishedDate, setEstablishedDate] = useState("");
  const [head, setHead] = useState("");
  const [teachers, setTeachers] = useState([]); // THAY THẾ props

  const { t } = useTranslation('department');

  useEffect(() => {
    // Gọi API lấy danh sách giảng viên
    const fetchTeachers = async () => {
      const data = await TeacherService.getTeachers();
      setTeachers(data || []);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    setName(department?.departmentName || "");
    setEstablishedDate(department?.dateOfEstablishment?.slice(0, 10) || "");
    setHead(department?.headOfDepartment || "");
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(t('error.blank department name'));
      return;
    }

    onSave({
      departmentName: name.trim(),
      dateOfEstablishment: establishedDate || null,
      headOfDepartment: head || null, // LƯU _id của giảng viên
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('add department')}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>{t('form.enter department name')} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('form.established date')}</label>
            <input
              type="date"
              value={establishedDate}
              onChange={(e) => setEstablishedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t('select head')}</label>
          <select value={head} onChange={(e) => setHead(e.target.value)}>
            <option value="">{t('select head')}</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <Button label={t('button.cancel')} variant="gray" onClick={onClose} />
          <Button label={t('button.save')} variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;
