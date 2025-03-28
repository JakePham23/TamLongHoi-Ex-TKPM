import departmentService from "../services/department.service";
import { useEffect, useState, useCallback } from "react";

const useDepartments = () => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);  // Chỉ gọi lại khi fetchDepartments thay đổi

  return { departments, setDepartments, fetchDepartments };
};

export default useDepartments;
