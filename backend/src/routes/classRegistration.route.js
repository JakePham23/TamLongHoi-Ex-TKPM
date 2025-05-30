import express from 'express';
import ClassRegistrationController from '../controllers/classRegistration.controller.js';


/**
 * @swagger
 * tags:
 *   name: Class Registration
 *   description: Course management API
 */
const router = express.Router();

/**
 * @swagger
 * /api/v1/classRegistration/register:
 *   post:
 *     summary: Đăng ký khóa học cho sinh viên
 *     tags: [Class Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationId
 *               - studentId
 *             properties:
 *               registrationId:
 *                 type: string
 *                 description: ID đăng ký khóa học
 *               studentId:
 *                 type: string
 *                 description: ID sinh viên
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Lớp đã đầy hoặc sinh viên chưa hoàn thành môn tiên quyết
 *       404:
 *         description: Không tìm thấy đăng ký hoặc sinh viên
 *       500:
 *         description: Lỗi server
 */
router.post('/register', ClassRegistrationController.registerStudent);

/**
 * @swagger
 * /api/v1/classRegistration/unregister:
 *   post:
 *     summary: Hủy đăng ký khóa học của sinh viên
 *     tags: [Class Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationId
 *               - studentId
 *             properties:
 *               registrationId:
 *                 type: string
 *                 description: ID đăng ký khóa học
 *               studentId:
 *                 type: string
 *                 description: ID sinh viên
 *     responses:
 *       200:
 *         description: Hủy đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Đã quá hạn hủy đăng ký
 *       404:
 *         description: Không tìm thấy đăng ký hoặc sinh viên
 *       500:
 *         description: Lỗi server
 */
router.post('/unregister', ClassRegistrationController.unregisterStudent);

/**
 * @swagger
 * /api/v1/classRegistration/class/{registrationId}:
 *   get:
 *     summary: Lấy danh sách lớp học với điểm số
 *     tags: [Class Registration]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đăng ký khóa học
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Không tìm thấy đăng ký
 *       500:
 *         description: Lỗi server
 */
router.get('/class/:registrationId', ClassRegistrationController.getClassRoster);

/**
 * @swagger
 * /api/v1/classRegistration/transcript/{studentId}:
 *   get:
 *     summary: Tạo bảng điểm chính thức
 *     tags: [Class Registration]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sinh viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transcript'
 *       404:
 *         description: Không tìm thấy sinh viên hoặc không có môn học đã hoàn thành
 *       500:
 *         description: Lỗi server
 */
router.get('/transcript/:studentId', ClassRegistrationController.generateTranscript);

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         year:
 *           type: number
 *           description: Năm học
 *         semester:
 *           type: number
 *           description: Học kỳ
 *         courseId:
 *           type: string
 *           description: ID khóa học
 *         teacherId:
 *           type: string
 *           description: ID giảng viên
 *         maxStudent:
 *           type: number
 *           description: Số lượng sinh viên tối đa
 *         registrationStudent:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               score:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [registered, completed, dropped]
 *         schedule:
 *           type: object
 *           properties:
 *             dayOfWeek:
 *               type: string
 *             time:
 *               type: string
 *         roomId:
 *           type: number
 *         registrationDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [open, closed]
 * 
 *     Transcript:
 *       type: object
 *       properties:
 *         student:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             program:
 *               type: string
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               courseCode:
 *                 type: string
 *               courseName:
 *                 type: string
 *               credits:
 *                 type: number
 *               year:
 *                 type: number
 *               semester:
 *                 type: number
 *               score:
 *                 type: number
 *               grade:
 *                 type: string
 *               gradePoint:
 *                 type: number
 *         gpa:
 *           type: number
 *         generatedAt:
 *           type: string
 *           format: date-time
 */

export default router;