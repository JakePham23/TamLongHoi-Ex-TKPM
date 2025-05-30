export class ValidatorComposite {
    constructor() {
        this.validators = new Map();
    }

    addValidator(field, strategy, options = {}) {
        if (!this.validators.has(field)) {
            this.validators.set(field, []);
        }

        this.validators.get(field).push({ strategy, options });
        return this; // For method chaining
    }

    validate(data) {
        const errors = {};

        for (const [field, validatorConfigs] of this.validators) {
            const fieldValue = this.getNestedValue(data, field);

            for (const {strategy, options} of validatorConfigs) {
                const error = strategy.validate(fieldValue, options);
                if (error) {
                    errors[field] = error;
                    break; // Stop at first error for this field
                }
            }
        }

        return errors;
    }
    // Helper method to get nested object values (e.g., "address.street")
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    // Remove all validators for a field
    removeValidators(field) {
        this.validators.delete(field);
        return this;
    }

    // Clear all validators
    clear() {
        this.validators.clear();
        return this;
    }
}
