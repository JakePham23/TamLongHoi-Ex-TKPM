// controllers/registration.controller.js
import { logger } from "../utils/winston.js";
import {
    BadRequest,
    InternalServerError,
    NotFoundRequest
} from "../responses/error.response.js";
import {
    CreatedResponse,
    DeleteResponse,
    UpdateResponse,
    OkResponse
} from "../responses/success.response.js";
import RegistrationService from '../services/registration.service.js'; // Import service

class RegistrationController {
    async addRegistration(req, res, next) {
        try {
            const { year, semester, courseId, teacherId, maxStudent, schedule, roomId } = req.body;
            console.log(year, semester, courseId, teacherId, maxStudent, schedule, roomId);
            if (!year || !semester || !courseId || !teacherId || !maxStudent) {
                logger.warn("Add registration failed: Missing required fields");
                return new BadRequest({ message: "Year, semester, course ID, teacher ID, and max student are required" }).send(res);
            }

            const newRegistration = await RegistrationService.addRegistration({
                year,
                semester,
                courseId,
                teacherId,
                maxStudent,
                schedule,
                roomId
            });

            return new CreatedResponse({
                message: "Registration added successfully",
                metadata: newRegistration
            }).send(res);
        } catch (error) {
            logger.error("Error in addRegistration", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async deleteRegistration(req, res, next) {
        try {
            const { registrationId } = req.params;
            await RegistrationService.deleteRegistration(registrationId);
            return new DeleteResponse({
                message: "Registration deleted successfully"
            }).send(res);
        } catch (error) {
            logger.error("Error in deleteRegistration", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async updateRegistration(req, res, next) {
        try {
            const { registrationId } = req.params;
            const updateData = req.body;

            const updatedRegistration = await RegistrationService.updateRegistration(registrationId, updateData);
            return new UpdateResponse({
                message: "Registration updated successfully",
                metadata: updatedRegistration
            }).send(res);
        } catch (error) {
            logger.error("Error in updateRegistration", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async getAllRegistrations(req, res, next) {
        try {
            const registrations = await RegistrationService.getAllRegistrations();
            return new OkResponse({
                message: "Registrations retrieved successfully",
                metadata: registrations
            }).send(res);
        } catch (error) {
            logger.error("Error in getAllRegistrations", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    
}

export default new RegistrationController();