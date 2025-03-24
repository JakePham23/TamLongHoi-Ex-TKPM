'use strict';
import studentModel from '../models/student.model.js';
import departmentModel from '../models/department.model.js';

import { BadRequest } from '../responses/error.response.js';
import { CreatedResponse } from '../responses/success.response.js';

class StudentManagementController {
    async addStudent(req, res, next) {
        try {
            const { 
                studentId, fullname, dob, gender, schoolYear, program
                , email, phone, studentStatus, address, 
                addressTemp, addressMail, identityDocument, nationality 
            } = req.body;
            const department = "67d8eaa77e02c451d88fa5e0"
            // Kiểm tra Student ID, Email, Phone có trùng không
            const existingStudent = await studentModel.findOne({ 
                $or: [{ studentId }, { email }, { phone }] 
            });

            if (existingStudent) {
                throw new BadRequest('Student ID, Email hoặc Phone đã tồn tại');
            }

            // Kiểm tra xem department có tồn tại không
            const foundDepartment = await departmentModel.findById(department);
            if (!foundDepartment) {
                throw new BadRequest('Department không hợp lệ');
            }

            // Tạo student mới
            const newStudent = new studentModel({
                studentId, fullname, dob, gender, schoolYear, 
                program, department, email, phone, studentStatus, 
                address, addressTemp, addressMail, identityDocument, nationality
            });

            await newStudent.save();

            return res.status(201).json(new CreatedResponse({
                message: 'Student added successfully',
                options: { location: `/students/${newStudent._id}` }
            }));

        } catch (error) {
            next(error); // Chuyển lỗi đến middleware xử lý lỗi
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
            const existingStudent = await updateData.findOne({ 
                $or: [{ studentId }, { email }, { phone }] 
            });
            if (existingStudent && existingStudent.studentId!== studentId) {
                throw new BadRequest('Student ID, Email hoặc Phone đã tồn tại');
            }
            const updatedStudent = await studentModel.findOneAndUpdate(
                { studentId },
                updateData,
                { new: true }
            );

            if (!updatedStudent) {
                throw new BadRequest('Student ID không tồn tại');
            }

            return res.status(200).json({ message: 'Student updated successfully', data: updatedStudent });
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
