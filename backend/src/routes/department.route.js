import express from "express";
import departmentController from "../controllers/department.controller.js";

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management API
 */
const router = express.Router();

/**
 * @swagger
 *  /api/v1/departments:
 *   get:
 *     summary: Lấy danh sách các khoa
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Trả về danh sách khoa
 */
router.get("/", departmentController.getAllDepartments);

/**
 * @swagger
 *  /api/v1/departments/add:
 *   post:
 *     summary: Thêm khoa mới
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm khoa thành công
 */
router.post("/add", departmentController.addDepartment);

/**
 * @swagger
 *  /api/v1/departments/update/{departmentId}:
 *   put:
 *     summary: Cập nhật thông tin khoa
 *     tags: [Departments]
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         description: ID của khoa cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Khoa không tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/update/:departmentId", departmentController.updateDepartment);

/**
 * @swagger
 *  /api/v1/departments/{departmentId}:
 *   delete:
 *     summary: Xóa khoa
 *     tags: [Departments]
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         description: ID của khoa cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Khoa không tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/delete/:departmentId", departmentController.deleteDepartment);

export default router;
