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
            throw error;
        }
    }

    async addCourse(courseData) {
        try {
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
            throw error;
        }
    }

    async updateCourse(courseId, courseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
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
            throw error;
        }
    }

    async deleteCourse(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
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