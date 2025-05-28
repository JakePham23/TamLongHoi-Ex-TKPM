import axios from "axios";
import { API_URL } from "../utils/constants";

const API_BASE_URL = `${API_URL}/classRegistration`;

class ClassService {
  /**
   * Đăng ký khóa học cho sinh viên
   */
  registerStudent = async (registrationId, studentId) => {
    const res = await axios.post(`${API_BASE_URL}/register`, {
      registrationId,
      studentId,
    });
    return res.data;
  };

  /**
   * Hủy đăng ký khóa học của sinh viên
   */
  unRegisterStudent = async (registrationId, studentId) => {
    const res = await axios.post(`${API_BASE_URL}/unregister`, {
      registrationId,
      studentId,
    });
    return res.data;
  };

  /**
   * Lấy danh sách lớp học với điểm số
   */
  getClassRoster = async (registrationId) => {
    const res = await axios.get(`${API_BASE_URL}/class/${registrationId}`);
    return res.data;
  };

  /**
   * Tạo bảng điểm chính thức cho sinh viên
   */
  generateTranscript = async (studentId) => {
    const res = await axios.get(`${API_BASE_URL}/transcript/${studentId}`);
    return res.data;
  };
}

export default new ClassService();
