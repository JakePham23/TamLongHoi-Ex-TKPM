import { API_URL } from "../utils/constants";
const API_BASE_URL = `${API_URL}/registrations`;

class RegistrationService {
    async getAllRegistrations() {
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách đăng ký');
            }
            const data = await response.json();
            return data.metadata;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async addRegistration(registrationData) {
        try {
            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });
            if (!response.ok) {
                throw new Error('Lỗi khi thêm đăng ký');
            }
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async updateRegistration(registrationId, registrationData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${registrationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            // Kiểm tra xem phản hồi có hợp lệ không
            if (!response.ok) {
                const errorMessage = await response.text(); // Lấy thông điệp lỗi từ phản hồi
                throw new Error(`Lỗi khi cập nhật đăng ký: ${errorMessage}`);
            }

            // Kiểm tra nếu phản hồi không rỗng trước khi gọi .json()
            const text = await response.text();
            return text ? JSON.parse(text) : {}; // Phân tích dữ liệu JSON nếu có
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async deleteRegistration(registrationId) {
        try {
            console.log("🗑️ Deleting registration with ID:", registrationId); // 👈 HIỂN THỊ RA CONSOLE
            const response = await fetch(`${API_BASE_URL}/${registrationId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Lỗi khi xóa đăng ký');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new RegistrationService();