'use strict';
import teacherModel from '../models/teacher.model.js';
import { logger } from '../utils/winston.js';
import ResponseFactory from '../responses/responseFactory.js';
import {ResponseTypes} from '../responses/response.types.js';

class TeacherController {
  async getAllTeachers(req, res, next) {
    try {
      const teachers = await teacherModel
        .find();

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

  async getTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const teacher = await teacherModel.findById(teacherId);
      if (!teacher) {
        logger.warn(`Không tìm thấy giáo viên với id ${teacherId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy giáo viên',
          metadata: { id: teacherId }
        }).send(res);
      }
      logger.info(`Lấy thông tin giáo viên thành công: ${teacherId}`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Lấy thông tin giáo viên thành công',
        metadata: teacher
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong getTeacher', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi lấy thông tin giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async addTeacher(req, res, next) {
    try {
      let teachers = req.body;

      // Nếu chỉ gửi 1 object giáo viên thì tự chuyển thành mảng
      if (!Array.isArray(teachers)) {
        teachers = [teachers];
      }

      const addedTeachers = [];

      for (const teacher of teachers) {
        const newTeacher = new teacherModel(teacher);
        const savedTeacher = await newTeacher.save();
        addedTeachers.push(savedTeacher);
      }

      logger.info(`Thêm ${addedTeachers.length} giáo viên thành công!`);
      return ResponseFactory
        .create(ResponseTypes.CREATED, {
          message: `${addedTeachers.length} teacher(s) added successfully`,
          metadata: addedTeachers
        })
        .send(res);

    } catch (error) {
      logger.error("Lỗi trong addTeacher", { error });
      next(error); // để middleware lỗi xử lý
    }
  }

  async updateTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const updates = req.body;

      const teacher = await teacherModel.findByIdAndUpdate(
        teacherId,
        updates,
        { new: true }
      );

      if (!teacher) {
        logger.warn(`Cập nhật thất bại: Không tìm thấy giáo viên với _id ${teacherId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy giáo viên'
        }).send(res);
      }

      logger.info(`Cập nhật giáo viên thành công: ${teacherId}`);
      return ResponseFactory.create(ResponseTypes.UPDATED, {
        message: 'Cập nhật giáo viên thành công',
        metadata: teacher
      }).send(res);

    } catch (error) {
      logger.error('Lỗi trong updateTeacher', { error });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: error.message || 'Đã xảy ra lỗi khi cập nhật giáo viên',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async deleteTeacher(req, res, next) {
    try {
      const { teacherId } = req.params;
      const deleted = await teacherModel.findByIdAndDelete(teacherId);

      if (!deleted) {
        logger.warn(`Xóa thất bại: Không tìm thấy giáo viên với id ${teacherId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy giáo viên'
        }).send(res);
      }

      logger.info(`Xóa giáo viên thành công: ${teacherId}`);
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
