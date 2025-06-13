import express from 'express';
import teacherController from '../controllers/teacher.controller.js';

/**
 * @swagger
 * tags:
 *   name: teachers
 *   description: API quản lý giảng viên
 */

const router = express.Router();

/**
 * @swagger
 * /api/v1/teachers/add:
 *   post:
 *     summary: Thêm giảng viên mới
 *     tags: [teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - fullname
 *               - dob
 *               - gender
 *               - department
 *               - email
 *               - phone
 *               - role
 *               - academicDegree
 *               - address
 *               - identityDocument
 *               - nationality
 *             properties:
 *               teacherId:
 *                 type: integer
 *               fullname:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: boolean
 *               department:
 *                 type: string
 *                 description: ID của khoa (ObjectId dạng string)
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *               academicDegree:
 *                 type: string
 *               nationality:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   houseNumber:
 *                     type: string
 *                   street:
 *                     type: string
 *                   ward:
 *                     type: string
 *                   district:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               identityDocument:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   idNumber:
 *                     type: string
 *                   issuedDate:
 *                     type: string
 *                     format: date
 *                   issuedPlace:
 *                     type: string
 *                   expirationDate:
 *                     type: string
 *                     format: date
 *                   hasChip:
 *                     type: boolean
 *                   countryIssued:
 *                     type: string
 *     responses:
 *       201:
 *         description: Giảng viên đã được thêm thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.post('/add', teacherController.addTeacher);

/**
 * @swagger
 * /api/v1/teachers/{teacherId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của giảng viên theo ID
 *     tags: [teachers]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giảng viên cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của giảng viên
 *       404:
 *         description: Không tìm thấy giảng viên
 */
router.get('/:teacherId', teacherController.getTeacher);

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     summary: Lấy danh sách tất cả giảng viên
 *     tags: [teachers]
 *     responses:
 *       200:
 *         description: Trả về danh sách giảng viên
 */
router.get('/', teacherController.getAllTeachers);

/**
 * @swagger
 * /api/v1/teachers/update/{teacherId}:
 *   put:
 *     summary: Cập nhật thông tin sinh viên
 *     tags: [teachers]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giảng viên cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               
 *     responses:
 *       200:
 *         description: Cập nhật thông tin giảng viên thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.put('/update/:teacherId', teacherController.updateTeacher);

/**
 * @swagger
 * /api/v1/teachers//delete/{teacherId}:
 *   delete:
 *     summary: Xóa giảng viên theo ID
 *     tags: [teachers]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giảng viên cần xóa
 *     responses:
 *       200:
 *         description: Xóa thông tin giảng viên thành công
 *       400:
 *         description: Teacher ID không tồn tại
 */
router.delete('/delete/:teacherId', teacherController.deleteTeacher);

export default router;
