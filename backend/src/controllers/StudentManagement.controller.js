'use strict';
import studentModel from '../models/student.model.js';
import departmentModel from '../models/department.model.js';

import { BadRequest } from '../responses/error.response.js';
import { CreatedResponse } from '../responses/success.response.js';

class StudentManagementController {
    async addStudent(req, res, next) {
        try {
            let students = req.body; // Dữ liệu có thể là một hoặc nhiều sinh viên
    
            // Nếu chỉ có 1 sinh viên, chuyển thành mảng để xử lý chung
            if (!Array.isArray(students)) {
                students = [students];
            }
    
            // Kiểm tra trùng lặp Student ID, Email, Phone
            const existingStudents = await studentModel.find({
                $or: students.flatMap(({ studentId, email, phone }) => [
                    { studentId }, { email }, { phone }
                ])
            });
    
            if (existingStudents.length > 0) {
                throw new BadRequest("Một số Student ID, Email hoặc Phone đã tồn tại");
            }
    
            // Kiểm tra khoa có hợp lệ không
            const departmentIds = [...new Set(students.map(s => s.department))];
            const foundDepartments = await departmentModel.find({ _id: { $in: departmentIds } });
    
            if (foundDepartments.length !== departmentIds.length) {
                throw new BadRequest("Một số khoa không hợp lệ");
            }
    
            // Lưu danh sách sinh viên
            const newStudents = await studentModel.insertMany(students);
    
            return res.status(201).json(new CreatedResponse({
                message: 'Students added successfully',
                options: { count: newStudents.length }
            }));
    
        } catch (error) {
            next(error);
        }
    }
    

    async deleteStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const deletedStudent = await studentModel.findOneAndDelete({ studentId });

            if (!deletedStudent) {
                throw new BadRequest('Student ID không tồn tại');
            }

            return res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const updateData = req.body;
    
            // Tìm sinh viên có email hoặc phone trùng, nhưng KHÔNG phải sinh viên đang cập nhật
            const existingStudent = await studentModel.findOne({ 
                $or: [
                    { email: updateData.email },
                    { phone: updateData.phone }
                ],
                studentId: { $ne: studentId } // Tránh trùng với chính nó
            });
    
            if (existingStudent) {
                throw new BadRequest("Email hoặc Phone đã tồn tại.");
            }
    
            // Cập nhật sinh viên
            const updatedStudent = await studentModel.findOneAndUpdate(
                { studentId },
                updateData,
                { new: true }
            );
    
            if (!updatedStudent) {
                throw new BadRequest("Student ID không tồn tại.");
            }
    
            return res.status(200).json({ message: "Cập nhật thành công!", data: updatedStudent });
        } catch (error) {
            next(error);
        }
    }
    
    async getStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const student = await studentModel.findOne({ studentId }).populate('department', "departmentName");

            if (!student) {
                throw new BadRequest('Student ID không tồn tại');
            }

            return res.status(200).json({ message: 'Student retrieved successfully', data: student });
        } catch (error) {
            next(error);
        }
    }

    async getAllStudent(req, res, next) {
        try {
            const students = await studentModel.find().populate('department', 'departmentName');
            return res.status(200).json({ message: 'Students retrieved successfully', data: students });
        } catch (error) {
            next(error);
        }
    }
    
}

export default new StudentManagementController();
