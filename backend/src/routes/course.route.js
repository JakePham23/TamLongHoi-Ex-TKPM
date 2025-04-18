import express from 'express';
import CourseController from '../controllers/course.controller.js';

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management API
 */
const router = express.Router();
/**
 * @swagger
 * /api/v1/courses/add:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - courseName
 *               - credit
 *               - department
 *             properties:
 *               courseId:
 *                 type: string
 *               courseName:
 *                 type: string
 *               credit:
 *                 type: number
 *               department:
 *                 type: string
 *               description:
 *                 type: string
 *               prerequisite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course added successfully
 *       400:
 *         description: Missing required fields or course already exists
 *       500:
 *         description: Internal server error
 */
router.post('/add', CourseController.addCourse);

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:courseId', CourseController.deleteCourse);

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               courseName:
 *                 type: string
 *               credit:
 *                 type: number
 *               department:
 *                 type: string
 *               description:
 *                 type: string
 *               prerequisite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: New Course ID already exists
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:courseId', CourseController.updateCourse);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get('/', CourseController.getAllCourses);

export default router; 