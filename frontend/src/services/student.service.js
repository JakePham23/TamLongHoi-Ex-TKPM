// src/services/StudentService.js
import BaseService from "./BaseEnityService.js";

class StudentService extends BaseService {
    constructor() {
        super('students');
    }

    async getStudents() {
        const response = await this.getAll();
        return response?.metadata || [];
    }

    async updateStudent(studentId, updatedData) {
        console.log("Updating student with ID:", studentId, "Data:", updatedData);
        return this.update(studentId, updatedData);
    }

    async deleteStudent(studentId) {
        return this.delete(studentId);
    }

    async addStudent(studentData) {
        console.log(`Adding student ${studentData.fullname}`);
        return this.create(studentData);
    }
}

export default new StudentService();