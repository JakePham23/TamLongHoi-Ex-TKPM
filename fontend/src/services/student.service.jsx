const API_BASE_URL = "http://localhost:4000/api/v1";

class StudentService {
    async getStudents() {
        try {
            const response = await fetch(`${API_BASE_URL}/students`);
            if (!response.ok) throw new Error("Lỗi khi lấy danh sách sinh viên");
            const data = await response.json();
            return data.data; // Đúng với API của bạn
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async updateStudent(studentId, updatedData) {
        try {
            const response = await fetch(`${API_BASE_URL}/updateStudent/${studentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error("Lỗi khi cập nhật sinh viên");
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async deleteStudent(studentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteStudent/${studentId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Lỗi khi xoá sinh viên");
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async addStudent(studentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/addStudent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(studentData),
            });
    
            if (!response.ok) throw new Error("Lỗi khi thêm sinh viên");
    
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    
}

export default new StudentService();