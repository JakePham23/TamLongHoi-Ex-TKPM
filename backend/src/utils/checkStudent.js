import studentModel from '../models/student.model.js';
import { BadRequest } from '../responses/error.response.js';

const checkExistedStudent = async (student, currentStudentId = null) => {
    const { studentId, email, phone, identityDocument } = student;
    const errorMessages = [];

    // Truy vấn nhưng bỏ qua chính sinh viên đang được cập nhật
    const existingStudents = await studentModel.findOne({
        $or: [
            { studentId },
            { email },
            { phone },
            { "identityDocument.idNumber": identityDocument?.idNumber }
        ],
        studentId: { $ne: currentStudentId } // Loại trừ sinh viên hiện tại
    });

    if (existingStudents) {
        if (existingStudents.studentId === studentId) {
            errorMessages.push(`Student ID "${studentId}" đã tồn tại.`);
        }
        if (existingStudents.email == email) {
            errorMessages.push(`Email "${email}" đã tồn tại.`);
        }
        if (existingStudents.phone == phone) {
            errorMessages.push(`Số điện thoại "${phone}" đã tồn tại.`);
        }
        if (existingStudents.identityDocument?.idNumber == identityDocument?.idNumber) {
            errorMessages.push(`Số giấy tờ "${identityDocument.idNumber}" đã tồn tại.`);
        }
    }

    if (errorMessages.length > 0) {
        throw new BadRequest(errorMessages.join(" "));
    }
};


export { checkExistedStudent };
