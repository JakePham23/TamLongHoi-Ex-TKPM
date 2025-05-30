import express from 'express';
import RegistrationController from '../controllers/registration.controller.js';

/**
 * @swagger
 * tags:
 *   name: registrations
 *   description: API quản lý đăng ký khóa học
 */

const router = express.Router();

/**
 * @swagger
 * /api/v1/registrations/add:
 *   post:
 *     summary: Thêm một đăng ký khóa học mới
 *     tags: [registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - studentId
 *               - semester
 *               - year
 *             properties:
 *               courseId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               semester:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo đăng ký thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/add', RegistrationController.addRegistration);

/**
 * @swagger
 * /api/v1/registrations/delete/{registrationId}:
 *   delete:
 *     summary: Xóa một đăng ký khóa học
 *     tags: [registrations]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đăng ký cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy đăng ký
 *       500:
 *         description: Lỗi server
 */
router.delete('/delete/:registrationId', RegistrationController.deleteRegistration);

/**
 * @swagger
 * /api/v1/registrations/update/{registrationId}:
 *   put:
 *     summary: Cập nhật thông tin đăng ký khóa học
 *     tags: [registrations]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đăng ký cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               semester:
 *                 type: integer
 *               year:
 *                 type: integer
 *               courseId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy đăng ký
 *       500:
 *         description: Lỗi server
 */
router.put('/update/:registrationId', RegistrationController.updateRegistration);

/**
 * @swagger
 * /api/v1/registrations:
 *   get:
 *     summary: Lấy danh sách tất cả các đăng ký khóa học
 *     tags: [registrations]
 *     responses:
 *       200:
 *         description: Danh sách đăng ký
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       500:
 *         description: Lỗi server
 */
router.get('/', RegistrationController.getAllRegistrations);
router.get('/getData', RegistrationController.getRegistrations);

export default router;
