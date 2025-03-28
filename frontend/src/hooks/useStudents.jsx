import { useEffect, useState, useCallback } from "react";
import studentService from "../services/student.service";

const useStudents = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
    }
  }, []);


  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, setStudents, fetchStudents };
};

export default useStudents;
