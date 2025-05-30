'use strict';
import teacherModel from '../models/teacher.model.js';
import { logger } from '../utils/winston.js';
import ResponseFactory from '../responses/responseFactory.js';
import {ResponseTypes} from '../responses/response.types.js';

class TeacherController {
  async getAllTeachers(req, res, next) {
    try {
      const teachers = await teacherModel
        .find()
        .populate('department', 'departmentName');

      logger.info(`Lấy danh sách giáo viên thành công (${teachers.length} giáo viên)`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Lấy danh sách giáo viên thành công',
        metadata: teachers
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong getAllTeachers', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi lấy danh sách giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async createTeacher(req, res, next) {
    try {
      const { teacherId, name, department } = req.body;

      const exists = await teacherModel.findOne({ teacherId });
      if (exists) {
        logger.warn(`Tạo thất bại: Giáo viên với mã ${teacherId} đã tồn tại`);
        return ResponseFactory.create(ResponseTypes.CONFLICT, {
          message: 'Giáo viên đã tồn tại'
        }).send(res);
      }

      const teacher = await teacherModel.create({ teacherId, name, department });

      logger.info(`Tạo giáo viên thành công: ${teacherId}`);
      return ResponseFactory.create(ResponseTypes.CREATED, {
        message: 'Tạo giáo viên thành công',
        metadata: teacher
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong createTeacher', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi tạo giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async updateTeacher(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const teacher = await teacherModel.findByIdAndUpdate(id, updates, {
        new: true
      });

      if (!teacher) {
        logger.warn(`Cập nhật thất bại: Không tìm thấy giáo viên với id ${id}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy giáo viên'
        }).send(res);
      }

      logger.info(`Cập nhật giáo viên thành công: ${id}`);
      return ResponseFactory.create(ResponseTypes.UPDATED, {
        message: 'Cập nhật giáo viên thành công',
        metadata: teacher
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong updateTeacher', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi cập nhật giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async deleteTeacher(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await teacherModel.findByIdAndDelete(id);

      if (!deleted) {
        logger.warn(`Xóa thất bại: Không tìm thấy giáo viên với id ${id}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy giáo viên'
        }).send(res);
      }

      logger.info(`Xóa giáo viên thành công: ${id}`);
      return ResponseFactory.create(ResponseTypes.DELETED, {
        message: 'Xóa giáo viên thành công',
        metadata: deleted
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong deleteTeacher', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi xóa giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }
}

export default new TeacherController();
