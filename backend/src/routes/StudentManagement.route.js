import express from 'express'
import studentManagementController from '../controllers/StudentManagement.controller.js'

const router = express.Router()

router.post('/addStudent', studentManagementController.addStudent)

router.get('/students/:studentId', studentManagementController.getStudent)

router.get('/students', studentManagementController.getAllStudent)

router.post('/updateStudent/:studentId', studentManagementController.updateStudent)

router.delete('/deleteStudent/:studentId', studentManagementController.deleteStudent)

export default router