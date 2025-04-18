const API_BASE_URL ='http://localhost:3000/api/v1'

class CourseService {
    async getAllCourses() {
        try {
            const response = await fetch(`${API_BASE_URL}/courses`);
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách courses');
            }
            const data = await response.json();
            return data.metadata;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addCourse(courseData) {
        try {
            console.log("📥 Adding course:", courseData); // 👈 HIỂN THỊ RA CONSOLE
            const response = await fetch(`${API_BASE_URL}/courses/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) {
                throw new Error('Lỗi khi thêm course');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateCourse(courseId, courseData) {
        try {
            console.log("✏️ Updating course with ID:", courseId, "Data:", courseData); // 👈 HIỂN THỊ RA CONSOLE
            const response = await fetch(`${API_BASE_URL}/courses/update/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật course');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteCourse(courseId) {
        try {
            console.log("🗑️ Deleting course with ID:", courseId); // 👈 HIỂN THỊ RA CONSOLE
            const response = await fetch(`${API_BASE_URL}/courses/delete/${courseId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Lỗi khi xóa course');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new CourseService(); 