import express from 'express'
import StudentManagementRoutes from './StudentManagement.route.js'
import departmentRoutes from './department.route.js'
const router = express.Router()
import { requestLogger } from "../utils/winston.js"; // Import middleware logger

router.use(requestLogger);
router.use(StudentManagementRoutes)
router.use(departmentRoutes)

export default router