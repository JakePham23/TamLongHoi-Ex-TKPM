import express from 'express'
import StudentManagementRoutes from './StudentManagement.route.js'
import departmentRoutes from './department.route.js'
const router = express.Router()


router.use(StudentManagementRoutes)
router.use(departmentRoutes)

export default router