import {ValidationStrategy} from "./ValidationStrategy.js";

export class StatusChangeValidationStrategy extends ValidationStrategy {
    validate(newStatus, options = {}) {
        const {currentStatus, statusRules} = options;

        if (!currentStatus || !newStatus) {
            return "Trạng thái hiện tại và trạng thái mới không được để trống";
        }

        if (currentStatus === newStatus) {
            return null;
        }

        if (!statusRules || !statusRules[currentStatus]) {
            return "Quy tắc trạng thái không hợp lệ";
        }

        if (!statusRules[currentStatus].includes(newStatus)) {
            return `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}"`;
        }

        return null;
    }
}