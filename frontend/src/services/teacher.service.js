// src/services/TeacherService.js
import BaseService from "./BaseEnityService.js";

class TeacherService extends BaseService {
    constructor() {
        super('teachers');
    }

    async getTeachers() {
        const response = await this.getAll();
        return response?.metadata || [];
    }
}

export default new TeacherService();