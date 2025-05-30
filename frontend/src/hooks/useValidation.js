/* eslint-disable no-unused-vars */

import { useState, useMemo } from 'react';

export const useValidation = (validatorComposite) => {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const validationErrors = validatorComposite.validate(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validate,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};