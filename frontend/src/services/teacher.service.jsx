import { API_URL } from "../utils/constants";

const API_BASE_URL = `${API_URL}/teachers`;

class TeacherService {
    async getTeachers() {
        try {
            const response = await fetch(`${API_BASE_URL}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi khi lấy danh sách giáo viên");
            return data.metadata;
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để frontend có thể hiển thị
        }
    }
};

export default new TeacherService();