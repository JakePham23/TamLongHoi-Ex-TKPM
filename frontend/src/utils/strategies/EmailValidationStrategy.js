import {ValidationStrategy} from "./ValidationStrategy.js";

export class EmailValidationStrategy extends ValidationStrategy {
    validate(email, options = {}) {
        const {allowedDomain} = options;

        if (!email) {
            return "Email không được để trống";
        }

        if (!allowedDomain) {
            return "Cần cung cấp domain được phép";
        }

        if (!email.endsWith(allowedDomain)) {
            return `Email phải có đuôi ${allowedDomain}`;
        }

        return null;
    }
}