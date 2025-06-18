// controllers/registration.controller.js
import { logger } from "../utils/winston.js";
import ResponseFactory from "../responses/responseFactory.js";
import {ResponseTypes} from '../responses/response.types.js';
import RegistrationService from '../services/registration.service.js';

class RegistrationController {
    async addRegistration(req, res, next) {
        try {
            const { year, semester, courseId, teacherId, maxStudent, schedule, roomId } = req.body;

            // --- VALIDATION ĐƯỢC CẢI TIẾN ---
            if (!year || !semester || !courseId || !teacherId || !maxStudent) {
                logger.warn("Add registration failed: Missing required fields");
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, {
                        message: "Year, semester, course ID, teacher ID, and max student are required."
                    })
                    .send(res);
            }

            // Kiểm tra các trường con trong schedule nếu schedule tồn tại
            if (schedule && (!schedule.dayOfWeek || !schedule.lessonBegin || !schedule.lessonEnd)) {
                logger.warn("Add registration failed: Missing schedule fields");
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, {
                        message: "Schedule must include dayOfWeek, lessonBegin, and lessonEnd."
                    })
                    .send(res);
            }
            // --- KẾT THÚC VALIDATION ---

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

    async updateRegistration(req, res, next) {
        try {
            const { registrationId } = req.params;
            const updateData = req.body;

            // Service layer sẽ chịu trách nhiệm validate dữ liệu update
            const updatedRegistration = await RegistrationService.updateRegistration(registrationId, updateData);

            if (!updatedRegistration) {
                return ResponseFactory
                    .create(ResponseTypes.NOT_FOUND, {
                        message: "Registration not found or could not be updated."
                    })
                    .send(res);
            }

            return ResponseFactory
                .create(ResponseTypes.SUCCESS, { // Dùng SUCCESS hoặc UPDATED đều được
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
