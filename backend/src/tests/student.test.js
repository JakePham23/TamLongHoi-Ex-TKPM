const request = require('supertest');
import app from '../app.js';

describe('Student API', () => {
  // Test thêm sinh viên
  it('POST /students should add a student', async () => {
    const newStudent = {
      studentId: 22129999,
      fullname: 'Testing Unit Student',
      dob: new Date('2000-01-01'),
      gender: true,
      schoolYear: 2021,
      program: 'CQ',
      department: null,
      email: 'johndoe@example.com',
      phone: '0987321234',
      studentStatus: 'active',
      address: {
        houseNumber: '36B',
        street: 'Đường 3 Tháng 2',
        ward: 'Phường 14',
        district: 'Quận 10',
        city: 'TP Hồ Chí Minh',
        country: 'Việt Nam'
      },
      addressTemp: {
        houseNumber: '36B',
        street: 'Đường 3 Tháng 2',
        ward: 'Phường 14',
        district: 'Quận 10',
        city: 'TP Hồ Chí Minh',
        country: 'Việt Nam'
      },
      identityDocument: {
        type: 'CMND',
        idNumber: '0123456788',
        issuedDate: new Date('2021-03-10'),
        issuedPlace: 'Công an TP Hồ Chí Minh'
      },
      nationality: 'Việt Nam'
    };

    const response = await request(app)
      .post('/api/v1/students/add')
      .send(newStudent)
      .expect(200);

    console.log(response.body);

    expect(response.body.message).toBe('1 students added successfully');
  });


  // Test lấy danh sách sinh viên
  it('GET /students should retrieve all students', async () => {
    const response = await request(app)
      .get('/api/v1/students')
      .expect(200);

    console.log(response.body);

    expect(response.body.status).toBe('OK');
  });

  // Test cập nhật sinh viên
  it('PUT /students/:id should update a student', async () => {
    const updateData = {
      studentId: 22129999,
      fullname: 'Unit Test Student 12345',
      dob: new Date('2000-01-01'),
      gender: true,
      schoolYear: 2021,
      program: 'CQ',
      department: null,
      email: 'johndoe@example.com',
      phone: '0987321234',
      studentStatus: 'active',
      address: {
        houseNumber: '36B',
        street: 'Đường 3 Tháng 2',
        ward: 'Phường 14',
        district: 'Quận 10',
        city: 'TP Hồ Chí Minh',
        country: 'Việt Nam'
      },
      addressTemp: {
        houseNumber: '36B',
        street: 'Đường 3 Tháng 2',
        ward: 'Phường 14',
        district: 'Quận 10',
        city: 'TP Hồ Chí Minh',
        country: 'Việt Nam'
      },
      identityDocument: {
        type: 'CMND',
        idNumber: '0123456788',
        issuedDate: new Date('2021-03-10'),
        issuedPlace: 'Công an TP Hồ Chí Minh'
      },
      nationality: 'Việt Nam'
    };

    const studentId = '22129999';

    const response = await request(app)
      .put(`/api/v1/students/update/${studentId}`)
      .send(updateData)
      .expect(204);
  });

  // Test xóa sinh viên
  it('DELETE /students/:id should delete a student', async () => {
    const studentId = '22129999';

    const response = await request(app)
      .delete(`/api/v1/students/delete/${studentId}`)
      .expect(202);

    console.log(response.body);

    expect(response.body.message).toBe('Student deleted successfully');
  });

  // Test xóa sinh viên không tồn tại
  it('DELETE /students/:id should return 400 if student doesnt exist', async () => {
    const studentId = '221299991';

    const response = await request(app)
      .delete(`/api/v1/students/delete/${studentId}`)
      .expect(400);

    console.log(response.body);
  });
});