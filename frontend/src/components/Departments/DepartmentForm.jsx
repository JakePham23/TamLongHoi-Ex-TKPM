import React, { useEffect, useState } from "react";
import Button from "../Button";
import "../../styles/pages/DepartmentScreen.scss";
import { useTranslation } from 'react-i18next'

const DepartmentForm = ({ onSave, department, onClose }) => {
    const [name, setName] = useState("");

    const { t } = useTranslation('department');

    useEffect(() => {
        setName(department ? department.departmentName : "");
    }, [department]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert(t('error.blank department name'));

        onSave({ ...department, departmentName: name });
        setName("");
        onClose(); // Đóng form sau khi lưu
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
                <div className="modal-buttons">
                    <Button label={t('button.cancel')} variant="gray" onClick={onClose} />
                    <Button label={t('button.save')} variant="primary" type="submit" />
                </div>
            </div>
        </form>
    );
};

export default DepartmentForm;
