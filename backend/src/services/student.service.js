import studentModel from '../models/student.model.js';
import { checkExistedDepartment } from '../utils/checkDepartment.js';
import { checkExistedStudent } from '../utils/checkStudent.js';
import { BadRequest } from '../responses/error.response.js';

class StudentService {

    async addStudent(student) {
        await this.validateStudent(student);

        const newStudent = new studentModel(student);
        await newStudent.save();

        return newStudent;
    }

    async updateStudent(studentId, updateData) {
        await this.validateStudent(updateData, studentId);

        const updatedStudent = await studentModel.findOneAndUpdate(
            { studentId },
            updateData,
            { new: true }
        );

        if (!updatedStudent) {
            throw new BadRequest(`Student ID ${studentId} không tồn tại`);
        }

        return updatedStudent;
    }

    // Helper function để tái sử dụng kiểm tra
    async validateStudent(student, studentId = null) {
        await checkExistedStudent(student, studentId);
        await checkExistedDepartment(student.department);
    }
}

export default new StudentService();
