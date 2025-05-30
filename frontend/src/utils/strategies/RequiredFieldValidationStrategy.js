// strategies/RequiredFieldValidationStrategy.js
import {ValidationStrategy} from "./ValidationStrategy.js";

export class RequiredFieldValidationStrategy extends ValidationStrategy {
    validate(value, options = {}) {
        const {fieldName = "Trường"} = options;

        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return `${fieldName} không được để trống`;
        }

        return null;
    }
}