import express from "express";
import departmentController from "../controllers/department.controller.js";

const router = express.Router();

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Lấy danh sách các khoa
 *     responses:
 *       200:
 *         description: Trả về danh sách khoa
 */
router.get("/departments", departmentController.getAllDepartments);

/**
 * @swagger
 * /addDepartment:
 *   post:
 *     summary: Thêm khoa mới
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
router.post("/addDepartment", departmentController.addDepartment);

/**
 * @swagger
 * /departments/{departmentId}:
 *   put:
 *     summary: Cập nhật thông tin khoa
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
 *   delete:
 *     summary: Xóa khoa
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         description: ID của khoa cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa khoa thành công
 */
router.put("/updateDepartment/:departmentId", departmentController.updateDepartment);
router.delete("/deleteDepartment/:departmentId", departmentController.deleteDepartment);

export default router;
