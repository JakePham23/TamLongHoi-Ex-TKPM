import registrationModel from "../models/registration.model.js";
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
        if (!deletedRegistration) throw new Error("Registration not found");
        logger.info(`Registration deleted: ${id}`);
        return deletedRegistration;
    }

    async updateRegistration(id, updateData) {
        console.log(updateData);
        const updatedRegistration = await registrationModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedRegistration) throw new Error("Registration not found");
        logger.info(`Registration updated: ${id}`);
        return updatedRegistration;
    }

    async getAllRegistrations() {
        return await registrationModel.find().populate('courseId teacherId', 'courseName teacherName');
    }
    async getRegistrations(year, semester) {
    try {
        const registrations = await registrationModel.find({ year: year, semester: semester });
        return registrations;
    } catch (error) {
        console.error('find registration error:', error);
        throw error;
    }
    }


    
}

export default new RegistrationService();