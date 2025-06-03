import React from "react";
import "../../styles/EnityViewModal.scss";
import { useTranslation } from 'react-i18next'

const EntityView = ({ title, entityData, fields, onClose, onEdit, exportType, setExportType, onExport, onViewDetail }) => {
  const { t } = useTranslation('component');

  if (!entityData) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal-container">
        <h2>{title}</h2>
        <div className="info-container">
          {fields.map(({ label, key }) => (
            <p key={key}>
              <strong>{label}:</strong> {entityData[key] ?? "N/A"}
            </p>
          ))}
        </div>

        {/* Button group */}
        <div className="button-group">
          <button className="edit-button" onClick={onEdit}>{t('edit')}</button>
          <button className="viewDetail-button" onClick={onViewDetail}>{t('viewDetail')}</button>

          <div className="exportBox">
            <select className="export-select" value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button className="export-button" onClick={onExport}>{t('export')}</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EntityView;
