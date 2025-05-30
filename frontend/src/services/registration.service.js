// src/services/RegistrationService.js
import BaseService from "./BaseEnityService.js";

class RegistrationService extends BaseService {
    constructor() {
        super('registrations');
    }

    async getAllRegistrations() {
        const response = await this.getAll();
        return response?.metadata || [];
    }

    async addRegistration(registrationData) {
        return this.create(registrationData);
    }

    async updateRegistration(registrationId, registrationData) {
        return this.update(registrationId, registrationData);
    }

    async deleteRegistration(registrationId) {
        return this.delete(registrationId);
    }
}

export default new RegistrationService();