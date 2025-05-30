import {ValidationStrategy} from "./ValidationStrategy.js";

export class PhoneValidationStrategy extends ValidationStrategy {
    validate(phone, options = {}) {
        const {phoneRegex} = options;

        if (!phone) {
            return "Số điện thoại không được để trống";
        }

        if (!phoneRegex) {
            return "Cần cung cấp regex cho số điện thoại";
        }

        if (!phoneRegex.test(phone)) {
            return "Số điện thoại không hợp lệ!";
        }

        return null;
    }
}