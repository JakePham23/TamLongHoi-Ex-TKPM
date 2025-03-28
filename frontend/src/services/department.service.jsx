const API_BASE_URL = "http://localhost:4000/api/v1";

class Department{
    async getDepartments(){
        try {
            const response = await fetch(`${API_BASE_URL}/departments`);
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
            const response = await fetch(`${API_BASE_URL}/addDepartment`, {
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
            const response = await fetch(`${API_BASE_URL}/updateDepartment/${departmentId}`, {
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
            const response = await fetch(`${API_BASE_URL}/deleteDepartment/${departmentId}`, {
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