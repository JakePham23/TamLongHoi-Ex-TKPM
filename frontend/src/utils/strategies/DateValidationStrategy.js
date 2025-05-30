// strategies/DateValidationStrategy.js
import {ValidationStrategy} from "./ValidationStrategy.js";

export class DateValidationStrategy extends ValidationStrategy {
    validate(date, options = {}) {
        const {minDate, maxDate, fieldName = "Ngày"} = options;

        if (!date) {
            return `${fieldName} không được để trống`;
        }

        const dateValue = new Date(date);

        if (isNaN(dateValue.getTime())) {
            return `${fieldName} không hợp lệ`;
        }

        if (minDate && dateValue < new Date(minDate)) {
            return `${fieldName} không được nhỏ hơn ${minDate}`;
        }

        if (maxDate && dateValue > new Date(maxDate)) {
            return `${fieldName} không được lớn hơn ${maxDate}`;
        }

        return null;
    }
}