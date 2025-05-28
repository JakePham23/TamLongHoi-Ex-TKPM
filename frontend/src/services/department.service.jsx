import { API_URL } from "../utils/constants";
const API_BASE_URL = `${API_URL}/departments`;

class Department{
    async getDepartments(){
        try {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) throw new Error("Lỗi khi lấy danh sách department");
            const data = await response.json();
            return data.metadata;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async addDepartment(departmentData){
        try {
            const response = await fetch(`${API_BASE_URL}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(departmentData),
            });

            if (!response.ok) throw new Error("Lỗi khi thêm khoa");

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDepartment(departmentId, updatedData) {
        try {
            const response = await fetch(`${API_BASE_URL}/update/${departmentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error("Lỗi khi cập nhật khoa");

            return
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async deleteDepartment(departmentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${departmentId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Lỗi khi xoá khoa");
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new Department();