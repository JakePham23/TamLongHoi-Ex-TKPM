import { useEffect, useState, useCallback } from "react";
import teacherService from "../services/teacher.service.js"; // Đảm bảo rằng đường dẫn đúng

const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = useCallback(async () => {
    try {
      const data = await teacherService.getTeachers(); // Gọi hàm lấy danh sách giáo viên
      setTeachers(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giáo viên:", error);
    }
  }, []);

  useEffect(() => {
    fetchTeachers(); // Gọi hàm fetch khi hook được sử dụng
  }, [fetchTeachers]);

  return { teachers, setTeachers, fetchTeachers }; // Trả về danh sách giáo viên và các hàm liên quan
};

export default useTeachers;