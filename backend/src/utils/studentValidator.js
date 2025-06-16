import studentModel from '../models/student.model.js';
import { BadRequest } from '../responses/error.response.js';

class StudentValidator {
    // Static inner classes
    static DuplicateStudentIdValidator = class extends StudentValidator {
        async validate(student, currentStudentId) {
            const existing = await studentModel.findOne({
                studentId: student.studentId,
                studentId: { $ne: currentStudentId }
            });
            if (existing) {
                throw new BadRequest(`Student ID "${student.studentId}" đã tồn tại.`);
            }
        }
    };

    static DuplicateEmailValidator = class extends StudentValidator {
        async validate(student, currentStudentId) {
            const existing = await studentModel.findOne({
                email: student.email,
                studentId: { $ne: currentStudentId }
            });
            if (existing) {
                throw new BadRequest(`Email "${student.email}" đã tồn tại.`);
            }
        }
    };

    static DuplicatePhoneValidator = class extends StudentValidator {
        async validate(student, currentStudentId) {
            const existing = await studentModel.findOne({
                phone: student.phone,
                studentId: { $ne: currentStudentId }
            });
            if (existing) {
                throw new BadRequest(`Số điện thoại "${student.phone}" đã tồn tại.`);
            }
        }
    };

    static DuplicateIdentityValidator = class extends StudentValidator {
        async validate(student, currentStudentId) {
            const idNumber = student.identityDocument?.idNumber;
            if (!idNumber) return;

            const existing = await studentModel.findOne({
                "identityDocument.idNumber": idNumber,
                studentId: { $ne: currentStudentId }
            });
            if (existing) {
                throw new BadRequest(`Số giấy tờ "${idNumber}" đã tồn tại.`);
            }
        }
    };
}

// Strategy Context
class StudentValidatorContext {
    constructor() {
        this.validators = [
            new StudentValidator.DuplicateStudentIdValidator(),
            new StudentValidator.DuplicateEmailValidator(),
            new StudentValidator.DuplicatePhoneValidator(),
            new StudentValidator.DuplicateIdentityValidator(),
        ];
    }

    async validateAll(student, currentStudentId = null) {
        for (const validator of this.validators) {
            await validator.validate(student, currentStudentId);
        }
    }
}

export { StudentValidator, StudentValidatorContext };
