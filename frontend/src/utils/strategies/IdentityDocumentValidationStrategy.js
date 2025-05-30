import {ValidationStrategy} from "./ValidationStrategy.js";

export class IdentityDocumentValidationStrategy extends ValidationStrategy {
    validate(idNumber) {
        if (!idNumber) {
            return "Số giấy tờ không được để trống.";
        }

        if (!/^\d{9,12}$/.test(idNumber)) {
            return "Số giấy tờ phải có 9-12 chữ số.";
        }

        return null;
    }
}