import React, { useEffect, useState } from "react";
import Button from "../../common/Button.jsx";
import "../../../styles/pages/DepartmentScreen.scss";
import { useTranslation } from 'react-i18next';

const DepartmentForm = ({ onSave, onClose, department, teachers = [] }) => {
  const [name, setName] = useState("");
  const [establishedDate, setEstablishedDate] = useState("");
  const [head, setHead] = useState("");

  const { t } = useTranslation('department');

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
      headOfDepartment: head || null,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('add department')}</h2>

        <input
          type="text"
          placeholder={t('form.enter department name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="date"
          value={establishedDate}
          onChange={(e) => setEstablishedDate(e.target.value)}
        />

        <select value={head} onChange={(e) => setHead(e.target.value)}>
          <option value="">{t('form.select head')}</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.fullName}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <Button label={t('button.cancel')} variant="gray" onClick={onClose} />
          <Button label={t('button.save')} variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;
