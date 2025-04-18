import express from 'express';
import teacherController from '../controllers/teacher.controller.js';

const router = express.Router();

router.get('/teachers', teacherController.getAllTeachers);

export default router;
