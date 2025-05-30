// src/services/DepartmentService.js
import BaseService from "./BaseEnityService.js";

class DepartmentService extends BaseService {
    constructor() {
        super('departments');
    }

    async getDepartments() {
        const response = await this.getAll();
        return response?.metadata || [];
    }

    async addDepartment(departmentData) {
        return this.create(departmentData);
    }

    async updateDepartment(departmentId, updatedData) {
        return this.update(departmentId, updatedData);
    }

    async deleteDepartment(departmentId) {
        return this.delete(departmentId);
    }
}

export default new DepartmentService();