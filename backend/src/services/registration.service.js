import registrationModel from "../models/registration.model.js";
import { NotFoundRequest } from "../responses/error.response.js";
import { logger } from "../utils/winston.js";

class RegistrationService {
    async addRegistration(data) {
        // const existingRegistration = await registrationModel.findOne({
        //     courseId: data.courseId,
        // });
        // if (existingRegistration) throw new Error("Registration already exists");

        const newRegistration = new registrationModel(data);
        await newRegistration.save();
        logger.info(`New registration added: ${data.courseId}`);
        return newRegistration;
    }

    async deleteRegistration(id) {
        const deletedRegistration = await registrationModel.findByIdAndDelete(id);
        if (!deletedRegistration) throw new NotFoundRequest("Registration not found");
        logger.info(`Registration deleted: ${id}`);
        return deletedRegistration;
    }

    async updateRegistration(id, updateData) {
        const updated = await registrationModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updated) throw new NotFoundRequest("Registration not found");
        logger.info(`Registration updated: ${id}`);
        return updated;
    }

    async getAllRegistrations() {
        return await registrationModel.find().populate('courseId teacherId', 'courseName teacherName');
    }
    async getRegistrations(year, semester) {
        try {
            const registrations = await registrationModel.find({ year: year, semester: semester });
            return registrations;
        } catch (error) {
            logger.error('find registration error:', error);
            throw new BadRequest("Invalid parameters or DB error");
        }
    }
}

export default new RegistrationService();