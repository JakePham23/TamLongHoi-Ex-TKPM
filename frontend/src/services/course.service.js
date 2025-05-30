// src/services/CourseService.js
import BaseService from "./BaseEnityService.js";

class CourseService extends BaseService {
    constructor() {
        super('courses');
    }

    async getAllCourses() {
        const response = await this.getAll();
        return response.metadata; // Assuming your API wraps data in metadata
    }

    async addCourse(courseData) {
        return this.create(courseData);
    }

    async updateCourse(courseId, courseData) {
        return this.update(courseId, courseData);
    }

    async deleteCourse(courseId) {
        return this.delete(courseId);
    }
}

export default new CourseService();