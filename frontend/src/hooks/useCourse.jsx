import { useEffect, useState, useCallback } from "react";
import courseService from "../services/course.service";

const useCourse = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách môn học:", err);
      setError(err.message || "Đã có lỗi xảy ra khi tải môn học.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    setCourses,
    fetchCourses,
    loading,
    error
  };
};

export default useCourse;
