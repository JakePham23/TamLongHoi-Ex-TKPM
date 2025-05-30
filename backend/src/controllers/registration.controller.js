// controllers/registration.controller.js
import { logger } from "../utils/winston.js";
import ResponseFactory from "../responses/responseFactory.js";
import {ResponseTypes} from '../responses/response.types.js';
import RegistrationService from '../services/registration.service.js';

class RegistrationController {
    async addRegistration(req, res, next) {
        try {
            const { year, semester, courseId, teacherId, maxStudent, schedule, roomId } = req.body;
            if (!year || !semester || !courseId || !teacherId || !maxStudent) {
                logger.warn("Add registration failed: Missing required fields");
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, {
                        message: "Year, semester, course ID, teacher ID, and max student are required"
                    })
                    .send(res);
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

            return ResponseFactory
                .create(ResponseTypes.CREATED, {
                    message: "Registration added successfully",
                    metadata: newRegistration
                })
                .send(res);

        } catch (error) {
            logger.error("Error in addRegistration", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async deleteRegistration(req, res, next) {
        try {
            const { registrationId } = req.params;
            await RegistrationService.deleteRegistration(registrationId);
            return ResponseFactory
                .create(ResponseTypes.DELETED, {
                    message: "Registration deleted successfully"
                })
                .send(res);

        } catch (error) {
            logger.error("Error in deleteRegistration", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async updateRegistration(req, res, next) {
        try {
            const { registrationId } = req.params;
            const updateData = req.body;

            const updatedRegistration = await RegistrationService.updateRegistration(registrationId, updateData);

            return ResponseFactory
                .create(ResponseTypes.UPDATED, {
                    message: "Registration updated successfully",
                    metadata: updatedRegistration
                })
                .send(res);

        } catch (error) {
            logger.error("Error in updateRegistration", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async getAllRegistrations(req, res, next) {
        try {
            const registrations = await RegistrationService.getAllRegistrations();

            return ResponseFactory
                .create(ResponseTypes.SUCCESS, {
                    message: "Registrations retrieved successfully",
                    metadata: registrations
                })
                .send(res);

        } catch (error) {
            logger.error("Error in getAllRegistrations", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }
    async getRegistrations(req, res, next){
        try{
            const {year, semester} = req.body;
            const registrations = await RegistrationService.getRegistrations(year, semester);
            return ResponseFactory
                .create(ResponseTypes.SUCCESS, {
                    message: "Get registrations successfully",
                    metadata: registrations
                })
                .send(res);

        }catch(err){
            logger.error("Error in getRegistrations", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

}

export default new RegistrationController();
