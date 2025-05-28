import express from 'express';
import studentController from '../controllers/student.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: students
 *   description: Sinh viên management API
 */

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Lấy danh sách tất cả sinh viên
 *     tags: [students]
 *     responses:
 *       200:
 *         description: Trả về danh sách sinh viên
 */
router.get('', studentController.getAllStudent);

/**
 * @swagger
 * /api/v1/students/{studentId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của sinh viên theo ID
 *     tags: [students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của sinh viên
 *       404:
 *         description: Không tìm thấy sinh viên
 */
router.get('/:studentId', studentController.getStudent);

/**
 * @swagger
 * /api/v1/students/add:
 *   post:
 *     summary: Thêm sinh viên mới
 *     tags: [students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "SV001"
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "email@example.com"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               department:
 *                 type: string
 *                 example: "660d6f6f2a3e5b001b1b70f1"
 *     responses:
 *       201:
 *         description: Sinh viên đã được thêm thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.post('/add', studentController.addStudent);

/**
 * @swagger
 * /api/v1/students/update/{studentId}:
 *   put:
 *     summary: Cập nhật thông tin sinh viên
 *     tags: [students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin sinh viên thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.put('/update/:studentId', studentController.updateStudent);

/**
 * @swagger
 * /api/v1/students//delete/{studentId}:
 *   delete:
 *     summary: Xóa sinh viên theo ID
 *     tags: [students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sinh viên cần xóa
 *     responses:
 *       200:
 *         description: Xóa sinh viên thành công
 *       400:
 *         description: Student ID không tồn tại
 */
router.delete('/delete/:studentId', studentController.deleteStudent);

export default router;
