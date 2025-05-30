

import { ValidatorComposite } from '../strategies/ValidatorComposite';
import { EmailValidationStrategy } from '../strategies/EmailValidationStrategy';
import { PhoneValidationStrategy } from '../strategies/PhoneRegexValidationStrategy';
import { StatusChangeValidationStrategy } from '../strategies/StatusChangeValidationStrategy';
import { RequiredFieldValidationStrategy } from '../strategies/RequiredFieldValidationStrategy';
import { IdentityDocumentValidationStrategy } from '../strategies/IdentityDocumentValidationStrategy';
import { DateValidationStrategy } from '../strategies/DateValidationStrategy';

export class ValidationFactory {
    static createEmailValidator(allowedDomain) {
        return new EmailValidationStrategy().validate.bind(
            new EmailValidationStrategy(),
            undefined,
            { allowedDomain }
        );
    }

    static createPhoneValidator(phoneRegex) {
        return new PhoneValidationStrategy().validate.bind(
            new PhoneValidationStrategy(),
            undefined,
            { phoneRegex }
        );
    }

    static createStatusValidator(currentStatus, statusRules) {
        return new StatusChangeValidationStrategy().validate.bind(
            new StatusChangeValidationStrategy(),
            undefined,
            { currentStatus, statusRules }
        );
    }

    static createStudentValidator(currentStatus, statusRules, allowedEmailDomain, phoneRegex) {
        const validator = new ValidatorComposite();

        return validator
            .addValidator('studentId', new RequiredFieldValidationStrategy(), { fieldName: 'Mã sinh viên' })
            .addValidator('fullname', new RequiredFieldValidationStrategy(), { fieldName: 'Họ tên' })
            .addValidator('email', new EmailValidationStrategy(), { allowedDomain: allowedEmailDomain })
            .addValidator('phone', new PhoneValidationStrategy(), { phoneRegex })
            .addValidator('studentStatus', new StatusChangeValidationStrategy(), { currentStatus, statusRules })
            .addValidator('identityDocument.idNumber', new IdentityDocumentValidationStrategy())
            .addValidator('dob', new DateValidationStrategy(), {
                maxDate: new Date().toISOString().split('T')[0],
                fieldName: 'Ngày sinh'
            });
    }

    static createClassValidator() {
        const validator = new ValidatorComposite();

        return validator
            .addValidator('classCode', new RequiredFieldValidationStrategy(), { fieldName: 'Mã lớp' })
            .addValidator('courseId', new RequiredFieldValidationStrategy(), { fieldName: 'Môn học' })
            .addValidator('teacherId', new RequiredFieldValidationStrategy(), { fieldName: 'Giảng viên' })
            .addValidator('semester', new RequiredFieldValidationStrategy(), { fieldName: 'Học kỳ' })
            .addValidator('academicYear', new RequiredFieldValidationStrategy(), { fieldName: 'Năm học' });
    }
}
