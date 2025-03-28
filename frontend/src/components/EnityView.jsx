import React from "react";
import "../styles/EnityViewModal.scss";

const EntityView = ({ title, entityData, fields, onClose, onEdit, exportType, setExportType, onExport }) => {
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
            <button className="edit-button" onClick={onEdit}>Sửa</button>
          <div className="exportBox">
            <select className="export-select" value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button className="export-button" onClick={onExport}>Xuất</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EntityView;
