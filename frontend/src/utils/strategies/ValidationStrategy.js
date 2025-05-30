/* eslint-disable no-unused-vars */

export class ValidationStrategy {
    validate(value, options = {}) {
        throw new Error("Must implement validate method");
    }
}