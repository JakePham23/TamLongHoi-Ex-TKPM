import express from 'express';
import teacherController from '../controllers/teacher.controller.js';

const router = express.Router();

router.get('/', teacherController.getAllTeachers);

export default router;
