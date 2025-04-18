const API_BASE_URL = 'http://localhost:3000/api/v1';

class TeacherService {
    async getTeachers() {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers`);
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