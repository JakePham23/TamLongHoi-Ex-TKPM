import { logger } from "../utils/winston.js";
import departmentModel from "../models/department.model.js";
import {
    NotFoundRequest,
    BadRequest,
    InternalServerError
} from "../responses/error.response.js";
import {
    OkResponse,
    CreatedResponse,
    DeleteResponse,
    UpdateResponse
} from "../responses/success.response.js";

import TranslationService from "../services/translation.service.js";

class DepartmentController {
    async addDepartment(req, res, next) {
        try {
            const { departmentName, dateOfEstablishment, headOfDepartment } = req.body;

            if (!departmentName?.trim()) {
                logger.warn("Add department failed: Missing departmentName");
                return new BadRequest({ message: "Department name is required" }).send(res);
            }

            const newDepartment = new departmentModel({
                departmentName,
                dateOfEstablishment,
                headOfDepartment
            });
            await newDepartment.save();

            await TranslationService.addTranslation({
                key: `department_list.${newDepartment._id}.name`,
                text: departmentName,
                namespace: 'department'
            });

            logger.info(`New department added: ${departmentName}`);
            return new CreatedResponse({
                message: "Department added successfully",
                metadata: newDepartment
            }).send(res);
        } catch (error) {
            logger.error("Error in addDepartment", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async getAllDepartments(req, res, next) {
        try {
            const departments = await departmentModel.find().populate('headOfDepartment');
            logger.info("Fetched all departments");
            return new OkResponse({
                message: "Departments retrieved successfully",
                metadata: departments
            }).send(res);
        } catch (error) {
            logger.error("Error in getAllDepartments", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async deleteDepartment(req, res, next) {
        try {
            const { departmentId } = req.params;
            const department = await departmentModel.findByIdAndDelete(departmentId);

            if (!department) {
                logger.warn(`Delete department failed: ID ${departmentId} not found`);
                return new NotFoundRequest({ message: "Department not found" }).send(res);
            }

            logger.info(`Department deleted: ID ${departmentId}`);
            return new DeleteResponse({ message: "Department deleted successfully" }).send(res);
        } catch (error) {
            logger.error("Error in deleteDepartment", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async updateDepartment(req, res, next) {
        try {
            const { departmentId } = req.params;
            const { departmentName, dateOfEstablishment, headOfDepartment } = req.body;
            console.log(departmentName);
            console.log(dateOfEstablishment);
            console.log(headOfDepartment);

            if (departmentName && (typeof departmentName !== "string" || !departmentName.trim())) {
                logger.warn("Update department failed: Invalid department name");
                return new BadRequest({ message: "Invalid department name" }).send(res);
            }

            const updateFields = {};
            if (departmentName) updateFields.departmentName = departmentName;
            if (dateOfEstablishment) updateFields.dateOfEstablishment = dateOfEstablishment;
            if (headOfDepartment) updateFields.headOfDepartment = headOfDepartment;

            const updatedDepartment = await departmentModel.findByIdAndUpdate(
                departmentId,
                updateFields,
                { new: true }
            );

            if (!updatedDepartment) {
                logger.warn(`Update department failed: ID ${departmentId} not found`);
                return new NotFoundRequest({ message: "Department not found" }).send(res);
            }

            if (departmentName) {
                await TranslationService.addTranslation({
                    key: `department_list.${departmentId}.name`,
                    text: departmentName,
                    namespace: 'department'
                });
            }

            logger.info(`Department updated: ID ${departmentId}`);
            return new UpdateResponse({
                message: "Department updated successfully",
                metadata: updatedDepartment
            }).send(res);
        } catch (error) {
            logger.error("Error in updateDepartment", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }
}

export default new DepartmentController();
