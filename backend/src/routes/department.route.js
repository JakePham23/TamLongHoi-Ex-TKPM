import express from 'express';
import departmentController from '../controllers/department.controller.js';
const router = express.Router()

router.post('/addDepartment', departmentController.addDepartment);

export default router;