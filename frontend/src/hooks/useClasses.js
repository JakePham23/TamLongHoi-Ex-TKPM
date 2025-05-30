import { useState, useEffect } from 'react';
import classService from '../services/class.service.js';

const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAllClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    setClasses,
    fetchClasses,
    loading,
    error
  };
};

export default useClasses;