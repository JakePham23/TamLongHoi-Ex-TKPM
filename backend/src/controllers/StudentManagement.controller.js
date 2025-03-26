'use strict';
import studentModel from '../models/student.model.js';

import { logger } from '../utils/winston.js'; // Import logger
import { BadRequest, ConflictRequest } from '../responses/error.response.js';
import { CreatedResponse, OkResponse, DeleteResponse, UpdateResponse } from '../responses/success.response.js';
import studentManagementService from '../services/StudentManagement.service.js'
class StudentManagementController {
    async addStudent(req, res, next) {
        try {
            let students = req.body;
    
            // Nếu chỉ là một sinh viên, biến thành mảng để xử lý chung
            if (!Array.isArray(students)) {
                students = [students];
            }
    
            const addedStudents = [];
            for (const student of students) {
                const newStudent = await studentManagementService.addStudent(student);
                addedStudents.push(newStudent);
            }
    
            logger.info(`Thêm ${addedStudents.length} sinh viên thành công!`);
    
            return res.send(new CreatedResponse({
                message: `${addedStudents.length} students added successfully`,
            }));
        } catch (error) {
            logger.error("Lỗi trong addStudent", { error: error.message });

            next(error);
        }
    }
    
    async updateStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const updateData = req.body;

            const updatedData = await studentManagementService.updateStudent(studentId, updateData)
            
            console.log("updated data: " + updatedData)
            logger.info(`Cập nhật thành công: Student ID ${studentId}`);
            return new UpdateResponse({message: "Cập nhật thành công!"}).send(res);
        } catch (error) {
            logger.error("Lỗi trong updateStudent", { error: error.message });
            next(error);
        }
    }
    async deleteStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const deletedStudent = await studentModel.findOneAndDelete({ studentId });

            if (!deletedStudent) {
                logger.warn(`Xóa sinh viên thất bại: Student ID ${studentId} không tồn tại`);
                return new BadRequest({message: 'Student ID không tồn tại'}).send(res);
            }

            logger.info(`Xóa sinh viên thành công: Student ID ${studentId}`);
            return new DeleteResponse({message: 'Student deleted successfully'}).send(res);
        } catch (error) {
            logger.error("Lỗi trong deleteStudent", { error: error.message });
            next(error);
        }
    }



    async getStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const student = await studentModel.findOne({ studentId }).populate('department', "departmentName");

            if (!student) {
                logger.warn(`Lấy thông tin thất bại: Student ID ${studentId} không tồn tại`);
                return new BadRequest('Student ID không tồn tại').send(res);
            }

            logger.info(`Lấy thông tin thành công: Student ID ${studentId}`);
            return res.send(new OkResponse({message: 'Student retrieved successfully', metadata: student}))
        } catch (error) {
            logger.error("Lỗi trong getStudent", { error: error.message });
            next(error);
        }
    }

    async getAllStudent(req, res, next) {
        try {
            const students = await studentModel.find().populate('department', 'departmentName');
            logger.info(`Lấy danh sách sinh viên thành công (${students.length} sinh viên)`);
            return (new OkResponse({
                message:'Students retrieved successfully',
                metadata: students})).send(res)

        } catch (error) {
            logger.error("Lỗi trong getAllStudent", { error: error.message });
            next(error);
        }
    }
}

export default new StudentManagementController();
