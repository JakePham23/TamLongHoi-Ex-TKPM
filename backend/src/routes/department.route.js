import express from 'express';
import departmentController from '../controllers/department.controller.js';
const router = express.Router()

router.post('/addDepartment', departmentController.addDepartment);
router.get('/departments', departmentController.getAllDepartments);
router.delete('/departments/:departmentId', departmentController.deleteDepartment);
router.put('/departments/:departmentId', departmentController.updateDepartment);

export default router;