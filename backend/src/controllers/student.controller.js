'use strict';
import studentModel from '../models/student.model.js';
import { logger } from '../utils/winston.js';

import StudentService from '../services/student.service.js';
import ResponseFactory from "../responses/responseFactory.js";
import {ResponseTypes} from '../responses/response.types.js';

class StudentController {
    async addStudent(req, res, next) {
        try {
            let students = req.body;

            if (!Array.isArray(students)) {
                students = [students];
            }

            const addedStudents = [];
            for (const student of students) {
                const newStudent = await StudentService.addStudent(student);
                addedStudents.push(newStudent);
            }

            logger.info(`Thêm ${addedStudents.length} sinh viên thành công!`);
            return ResponseFactory
                .create(ResponseTypes.CREATED, {
                    message: `${addedStudents.length} students added successfully`
                })
                .send(res);

        } catch (error) {
            logger.error("Lỗi trong addStudent", { error: error.message });
            next(error);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const updateData = req.body;

            const updatedData = await StudentService.updateStudent(studentId, updateData);

            logger.info(`Cập nhật thành công: Student ID ${studentId}`);
            return ResponseFactory
                .create(ResponseTypes.UPDATED, { message: "Cập nhật thành công!" })
                .send(res);

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
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, { message: 'Student ID không tồn tại' })
                    .send(res);
            }

            logger.info(`Xóa sinh viên thành công: Student ID ${studentId}`);
            return ResponseFactory
                .create(ResponseTypes.DELETED, { message: 'Student deleted successfully' })
                .send(res);

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
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, { message: 'Student ID không tồn tại' })
                    .send(res);
            }

            logger.info(`Lấy thông tin thành công: Student ID ${studentId}`);
            return ResponseFactory
                .create(ResponseTypes.SUCCESS, {
                    message: 'Student retrieved successfully',
                    metadata: student
                })
                .send(res);

        } catch (error) {
            logger.error("Lỗi trong getStudent", { error: error.message });
            next(error);
        }
    }

    async getAllStudent(req, res, next) {
        try {
            const students = await studentModel.find().populate('department', 'departmentName');

            logger.info(`Lấy danh sách sinh viên thành công (${students.length} sinh viên)`);

            return ResponseFactory
                .create(ResponseTypes.SUCCESS, {
                    message: 'Students retrieved successfully',
                    metadata: students
                })
                .send(res);

        } catch (error) {
            logger.error("Lỗi trong getAllStudent", { error: error.message });
            next(error);
        }
    }
}

export default new StudentController();
