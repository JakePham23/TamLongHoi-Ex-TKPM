const request = require('supertest');
import app from '../app.js';
import courseModel from '../models/course.model.js'; 
import departmentModel from '../models/department.model.js'; 

describe('Course API', () => {
  // Test thêm môn học
  it('POST /courses should add a course', async () => {
    const newCourse = {
      courseId: 'CSC0005',
      courseName: 'Test Course',
      credit: 3,
      department: '67e0e2e95966e68b4e9a4b2c',
      description: 'Test description',
      prerequisite: 'Không có',
      practicalSession: 30,
      theoreticalSession: 45,
    };
    

    const response = await request(app)
      .post('/api/v1/courses/add')
      .send(newCourse)
      .expect(201);

    expect(response.body.message).toBe('Course added successfully');
    expect(response.body.status).toBe('OK');
  });

  // Test lấy tất cả môn học
  it('GET /courses should retrieve all courses', async () => {
    const response = await request(app)
      .get('/api/v1/courses')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('courses retrieved successfully');
  });

  // Test cập nhật môn học
  it('PUT /courses/:id should update course', async () => {
    const updateData = {
      courseName: 'Updated Course',
      credit: 4,
      description: 'Updated description',
    };

    const courseId = 'CSC0005';

    const response = await request(app)
      .put(`/api/v1/courses/update/${courseId}`)
      .send(updateData)
      .expect(200);

    expect(response.body.message).toBe('Course updated successfully');
  });

  // Test xóa môn học
  it('DELETE /courses/:id should delete course', async () => {
    const courseId = '681f8d804e0b31a5466cf7c4'; // ID của môn học cần xóa

    const response = await request(app)
      .delete(`/api/v1/courses/delete/${courseId}`)
      .expect(202);

    expect(response.body.message).toBe('Course deleted successfully');
  });

  // Test xóa môn học không tồn tại
  it('DELETE /courses/:id should return 404 if course not found', async () => {
    const courseId = 'nonexistent_id'; // Môn học không tồn tại

    const response = await request(app)
      .delete(`/api/v1/courses/delete/${courseId}`)
      .expect(404);
      console.log(response.body);
    expect(response.body.message).toBe('Course not found');
  });
});