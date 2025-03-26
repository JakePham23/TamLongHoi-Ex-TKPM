    import studentModel from '../models/student.model.js';
    import { checkExistedDepartment } from '../utils/checkDepartment.js';
    import { checkExistedStudent } from '../utils/checkStudent.js';
    import { BadRequest } from '../responses/error.response.js';

    class StudentManagementService {
        async addStudent(student) {
            try {
                await checkExistedStudent(student);
                await checkExistedDepartment(student.department);

                const newStudent = new studentModel(student);
                await newStudent.save();

                return newStudent;
            } catch (error) {
                throw error; 
            }
        }

        async updateStudent(studentId, updateData) {
            try {
                await checkExistedStudent(updateData, studentId); 
                await checkExistedDepartment(updateData.department);
        
                const updatedStudent = await studentModel.findOneAndUpdate(
                    { studentId }, 
                    updateData,
                    { new: true }
                );
        
                return JSON.stringify(updatedStudent);
            } catch (error) {
                throw error;
            }
        }
    }



    export default new StudentManagementService();
