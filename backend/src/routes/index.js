import express from 'express'
import StudentManagementRoutes from './student.route.js'
import departmentRoutes from './department.route.js'
import courseRoutes from './course.route.js'
const router = express.Router()
import { requestLogger } from "../utils/winston.js"; // Import middleware logger

router.use(requestLogger);
router.use('/students', StudentManagementRoutes)
router.use('/departments',departmentRoutes)
router.use('/courses', courseRoutes)

export default router