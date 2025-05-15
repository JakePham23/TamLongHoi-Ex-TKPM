import request from 'supertest';
import app from '../app.js';
import departmentModel from '../models/department.model.js';

describe('Department API', () => {
    // Test thêm Khoa
    it('POST /departments/add should add a department', async () => {
        const newDepartment = {
            departmentName: 'Testing Unit Department'
        };  
        const response = await request(app)
            .post('/api/v1/departments/add')
            .send(newDepartment)
            .expect(201);

        expect(response.body.message).toBe('Department added successfully');
    });

    // Test lấy danh sách Khoa
    it('GET /departments should retrieve all departments', async () => {
        const response = await request(app)
            .get('/api/v1/departments')
            .expect(200);

        expect(response.body.message).toBe('Departments retrieved successfully');
    });

    // Test update Khoa
    it('PUT /departments/update/:id should update department', async () => {
        const departmentName = 'Testing Unit Department';
        const newDepartment = 'Testing Unit Department - updated';
        const findRes = await request(app)
            .get('/api/v1/departments')
            .expect(200);

        // Tìm id theo tên
        const department = findRes.body.metadata.find(dep => dep.departmentName === departmentName);
        const response = await request(app)
            .put(`/api/v1/departments/update/${department._id}`)
            .send({ departmentName: newDepartment })
            .expect(204);
    });

    // Test xoá khoa
    it('DELETE /departments/delete/:id should delete department', async () => {
        const departmentName = 'Testing Unit Department';
        const findRes = await request(app)
            .get('/api/v1/departments')
            .expect(200);

        // Tìm id theo tên
        const department = findRes.body.metadata.find(dep => dep.departmentName === departmentName);

        const response = await request(app)
            .delete(`/api/v1/departments/delete/${department._id}`)
            .expect(202);

        expect(response.body.message).toBe('Department deleted successfully');
    });

    // Test xóa khoa nếu không tồn tại
    it('DELETE /departments/delete/:id should return 404 if it doesnt exist', async () => {
        const departmentId = '67e2b06bddf1ba5cc99942ab' // ID không tồn tại
        const response = await request(app)
            .delete(`/api/v1/departments/delete/${departmentId}`)
            .expect(404);
    });

});