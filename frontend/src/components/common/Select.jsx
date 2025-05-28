import React from "react";
import PropTypes from "prop-types";
import "../../styles/components/Select.scss";

const Select = ({ options, value, onChange, placeholder, disabled }) => {
  return (
    <select
      className="custom-select"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

Select.defaultProps = {
  placeholder: "Select...",
  disabled: false,
};

export default Select;