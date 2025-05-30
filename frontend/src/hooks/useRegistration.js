import { useEffect, useState, useCallback } from "react";
import registrationService from "../services/registration.service.js"; // Dịch vụ đăng ký

const useRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await registrationService.getAllRegistrations();
      setRegistrations(data || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đăng ký:", err);
      setError(err.message || "Đã có lỗi xảy ra khi tải đăng ký.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    registrations,
    setRegistrations,
    fetchRegistrations,
    loading,
    error
  };
};

export default useRegistration;