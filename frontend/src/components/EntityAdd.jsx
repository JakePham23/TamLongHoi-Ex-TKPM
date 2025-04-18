import React from "react";
import "../styles/EnityEditModal.scss";

const EntityAdd = ({ title, fields, data, errors, onChange, onSave, onClose }) => {
  return (
    <div className="entity-edit-overlay" onClick={(e) => e.target.classList.contains("entity-edit-overlay") && onClose()}>
      <div className="entity-edit-modal">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select name={field.name} value={String(data[field.name] || "")} onChange={onChange}>
                  <option value="">-- Chọn --</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={String(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={field.name.split(".").reduce((obj, key) => obj?.[key], data) || ""}
                  onChange={onChange}
                  disabled={field.disabled}
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}
          {errors.general && <div className="error-message general-error">{errors.general}</div>}
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={onSave}>Thêm</button>
          <button className="cancel-button" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default EntityAdd;
