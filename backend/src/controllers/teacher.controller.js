'use strict';
import teacherModel from '../models/teacher.model.js'; // Ensure the path is correct
import { logger } from '../utils/winston.js'; // Import logger
import { BadRequest, ConflictRequest } from '../responses/error.response.js';
import { CreatedResponse, OkResponse, DeleteResponse, UpdateResponse } from '../responses/success.response.js';

class TeacherController {
    async getAllTeachers(req, res, next) {
        try {
            const teachers = await teacherModel.find().populate('department', 'departmentName'); // Populate department if needed
            logger.info(`Lấy danh sách giáo viên thành công (${teachers.length} giáo viên)`);
            return (new OkResponse({
                message: 'Teachers retrieved successfully',
                metadata: teachers
            })).send(res);
        } catch (error) {
            logger.error("Lỗi trong getAllTeachers", { error: error.message });
            next(error);
        }
    }
}

export default new TeacherController();