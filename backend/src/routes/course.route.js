import express from 'express';
import CourseController from '../controllers/course.controller.js';

const router = express.Router();

router.post('/add', CourseController.addCourse);
router.delete('/:courseId', CourseController.deleteCourse);
router.put('/:courseId', CourseController.updateCourse);
router.get('/', CourseController.getAllCourses);

export default router; 