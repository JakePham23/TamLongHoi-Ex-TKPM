import Registrations from '../models/registration.model.js';
import Students from '../models/student.model.js';
import Courses from '../models/course.model.js';
import { logger } from '../utils/winston.js';
import ResponseFactory from '../responses/responseFactory.js';
import {ResponseTypes} from '../responses/response.types.js';

class ClassRegistrationController {
  async registerStudent(req, res, next) {
    try {
      const { registrationId, studentId } = req.body;

      const registration = await Registrations.findById(registrationId);
      if (!registration) {
        logger.warn(`Đăng ký thất bại: Không tìm thấy lớp ${registrationId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy lớp đăng ký'
        }).send(res);
      }

      if (registration.registrationStudent.length >= registration.maxStudent) {
        logger.warn(`Đăng ký thất bại: Lớp ${registrationId} đã đầy`);
        return ResponseFactory.create(ResponseTypes.BAD_REQUEST, {
          message: 'Lớp học đã đủ số lượng sinh viên'
        }).send(res);
      }

      const alreadyRegistered = registration.registrationStudent.some(
        reg => reg.studentId.toString() === studentId
      );
      if (alreadyRegistered) {
        logger.warn(`Đăng ký thất bại: Sinh viên ${studentId} đã đăng ký lớp ${registrationId}`);
        return ResponseFactory.create(ResponseTypes.BAD_REQUEST, {
          message: 'Sinh viên đã đăng ký lớp học này'
        }).send(res);
      }

      const student = await Students.findById(studentId);
      const course = await Courses.findById(registration.courseId);

      if (!student || !course) {
        logger.warn(`Đăng ký thất bại: Không tìm thấy sinh viên hoặc học phần`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy sinh viên hoặc học phần'
        }).send(res);
      }

      // Kiểm tra học phần tiên quyết
      if (course.prerequisites && course.prerequisites.length > 0) {
        const completedCourses = await Registrations.find({
          'registrationStudent.studentId': studentId,
          'registrationStudent.status': 'completed'
        });

        const completedCourseIds = completedCourses.map(reg => reg.courseId.toString());

        const missingPrerequisites = course.prerequisites.filter(
          prereq => !completedCourseIds.includes(prereq.toString())
        );

        if (missingPrerequisites.length > 0) {
          logger.warn(`Đăng ký thất bại: Thiếu học phần tiên quyết`);
          return ResponseFactory.create(ResponseTypes.BAD_REQUEST, {
            message: 'Sinh viên chưa hoàn thành học phần tiên quyết',
            metadata: { missingPrerequisites }
          }).send(res);
        }
      }

      registration.registrationStudent.push({
        studentId,
        status: 'registered'
      });

      await registration.save();

      logger.info(`Sinh viên ${studentId} đăng ký thành công lớp ${registrationId}`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Đăng ký lớp học thành công',
        metadata: registration
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong registerStudent', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi trong quá trình đăng ký',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async unregisterStudent(req, res, next) {
    try {
      const { registrationId, studentId } = req.body;

      const registration = await Registrations.findById(registrationId);
      if (!registration) {
        logger.warn(`Hủy đăng ký thất bại: Không tìm thấy lớp ${registrationId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy lớp đăng ký'
        }).send(res);
      }

      if (registration.status === 'closed') {
        logger.warn(`Hủy đăng ký thất bại: Lớp ${registrationId} đã kết thúc`);
        return ResponseFactory.create(ResponseTypes.BAD_REQUEST, {
          message: 'Không thể hủy đăng ký vì lớp đã kết thúc'
        }).send(res);
      }

      const studentIndex = registration.registrationStudent.findIndex(
        reg => reg.studentId.toString() === studentId
      );

      if (studentIndex === -1) {
        logger.warn(`Hủy đăng ký thất bại: Sinh viên ${studentId} không có trong lớp ${registrationId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy sinh viên trong lớp đăng ký'
        }).send(res);
      }

      const unregisteredStudent = registration.registrationStudent[studentIndex];
      unregisteredStudent.status = 'dropped';
      unregisteredStudent.unregisteredAt = new Date();

      await registration.save();

      logger.info(`Sinh viên ${studentId} đã hủy đăng ký thành công khỏi lớp ${registrationId}`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Hủy đăng ký thành công',
        metadata: registration
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong unregisterStudent', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi trong quá trình hủy đăng ký',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async getClassRoster(req, res, next) {
    try {
      const { registrationId } = req.params;

      const registration = await Registrations.findById(registrationId)
        .populate('courseId')
        .populate('teacherId')
        .populate('registrationStudent.studentId');

      if (!registration) {
        logger.warn(`Lấy danh sách lớp thất bại: Không tìm thấy lớp ${registrationId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy lớp đăng ký'
        }).send(res);
      }

      logger.info(`Lấy danh sách lớp thành công: ${registrationId}`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Lấy danh sách lớp thành công',
        metadata: registration
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong getClassRoster', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi lấy danh sách lớp',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  async generateTranscript(req, res, next) {
    try {
      const { studentId } = req.params;

      const registrations = await Registrations.find({
        'registrationStudent.studentId': studentId,
        'registrationStudent.status': 'completed'
      })
        .populate('courseId')
        .populate('registrationStudent.studentId');

      if (!registrations || registrations.length === 0) {
        logger.warn(`Không có học phần hoàn thành cho sinh viên ${studentId}`);
        return ResponseFactory.create(ResponseTypes.NOT_FOUND, {
          message: 'Không tìm thấy học phần đã hoàn thành cho sinh viên này'
        }).send(res);
      }

      let totalCredits = 0;
      let totalGradePoints = 0;

      const transcript = registrations.map(reg => {
        const studentData = reg.registrationStudent.find(
          s => s.studentId._id.toString() === studentId
        );

        const course = reg.courseId;
        const gradePoint = this.calculateGradePoint(studentData.score);
        const credits = course.credits || 3;

        totalGradePoints += gradePoint * credits;
        totalCredits += credits;

        return {
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits,
          year: reg.year,
          semester: reg.semester,
          score: studentData.score,
          grade: this.calculateGrade(studentData.score),
          gradePoint,
        };
      });

      const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

      const student = await Students.findById(studentId);

      const transcriptData = {
        student: {
          id: student.studentId,
          name: student.name,
          program: student.program,
        },
        courses: transcript,
        gpa,
        generatedAt: new Date(),
      };

      logger.info(`Bảng điểm được tạo cho sinh viên ${studentId}`);
      return ResponseFactory.create(ResponseTypes.SUCCESS, {
        message: 'Tạo bảng điểm thành công',
        metadata: transcriptData
      }).send(res);
    } catch (error) {
      logger.error('Lỗi trong generateTranscript', { error: error.message });
      return ResponseFactory.create(ResponseTypes.INTERNAL_ERROR, {
        message: 'Đã xảy ra lỗi khi tạo bảng điểm',
        metadata: { error: error.message }
      }).send(res);
    }
  }

  calculateGrade(score) {
    if (score >= 9) return 'A';
    if (score >= 8) return 'B';
    if (score >= 7) return 'C';
    if (score >= 6) return 'D';
    return 'F';
  }

  calculateGradePoint(score) {
    if (score >= 9) return 4.0;
    if (score >= 8) return 3.0;
    if (score >= 7) return 2.0;
    if (score >= 6) return 1.0;
    return 0.0;
  }
}

export default new ClassRegistrationController();
