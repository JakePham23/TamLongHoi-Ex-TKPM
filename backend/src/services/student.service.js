import studentModel from '../models/student.model.js';
import { checkExistedDepartment } from '../utils/checkDepartment.js';
import { StudentValidatorContext } from '../utils/studentValidator.js';
import { BadRequest } from '../responses/error.response.js';

class StudentService {

    async addStudent(student) {
        const validator = new StudentValidatorContext();
        await validator.validateAll(student)

        const newStudent = new studentModel(student);
        await newStudent.save();

        return newStudent;
    }

    async updateStudent(studentId, updateData) {
        const validator = new StudentValidatorContext();
        await validator.validateAll(student)

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
}

export default new StudentService();
