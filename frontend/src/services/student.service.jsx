const API_BASE_URL = "http://localhost:4000/api/v1";

class StudentService {
    async getStudents() {
        try {
            const response = await fetch(`${API_BASE_URL}/students`);
            const data = await response.json();
            if (!response.status) throw new Error(data.message || "Lỗi khi lấy danh sách sinh viên");
            return data.metadata; 
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để frontend có thể hiển thị
        }
    }

    async updateStudent(studentId, updatedData) {
        try {
            const response = await fetch(`${API_BASE_URL}/updateStudent/${studentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (response.status === 204) {
                console.log("Cập nhật thành công, không có nội dung trả về.");
                return; // Không cần parse JSON vì response không có nội dung
              }
              
              const data = await response.json(); // Chỉ gọi khi có dữ liệu
              console.log(data);
              
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteStudent(studentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteStudent/${studentId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi khi xoá sinh viên");
            return data.metadata;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addStudent(studentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/addStudent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentData),
            });
    
            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Lỗi khi thêm sinh viên")          
            }
    
            return data.metadata;
        } catch (error) {
            console.log(`❌ Lỗi khi gửi yêu cầu thêm sinh viên ${studentData.fullname}:`, error);
            throw error
        }
    }
    
    
    
}

export default new StudentService();
