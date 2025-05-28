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

import TranslationService from "../services/translation.service.js"

class DepartmentController {
    async addDepartment(req, res, next) {
        try {
            const { departmentName } = req.body;
            if (!departmentName) {
                logger.warn("Add department failed: Missing departmentName");
                return new BadRequest({ message: "Department name is required" }).send(res);
            }

            const newDepartment = new departmentModel({ departmentName });
            await newDepartment.save();

            await TranslationService.addTranslation({
                key: `department_list.${newDepartment._id}.name`,
                text: departmentName,
                namespace: 'department'
            });

            logger.info(`New department added: ${departmentName}`);
            return new CreatedResponse({ message: "Department added successfully", metadata: newDepartment }).send(res);
        } catch (error) {
            logger.error("Error in addDepartment", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async getAllDepartments(req, res, next) {
        try {
            const departments = await departmentModel.find();
            logger.info("Fetched all departments");
            return new OkResponse({ message: "departments retrieved successfully", metadata: departments }).send(res);
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
            const { departmentName } = req.body;

            if (!departmentName.trim() || typeof departmentName !== "string") {
                logger.warn("Update department failed: Invalid department name");
                return new BadRequest("Invalid department name").send(res);
                return new BadRequest({ message: "Invalid department name" }).send(res);
            }

            const updatedDepartment = await departmentModel.findByIdAndUpdate(
                departmentId,
                { departmentName },
                { new: true }
            );

            if (updatedDepartment.departmentName !== departmentName) {
                await TranslationService.addTranslation({
                    key: `department_list.${newDepartment._id}.name`,
                    text: departmentName,
                    namespace: 'department'
                });
            }

            if (!updatedDepartment) {
                logger.warn(`Update department failed: ID ${departmentId} not found`);
                return new NotFoundRequest({ message: "Department not found" }).send(res);
            }

            logger.info(`Department updated: ID ${departmentId}, New Name: ${departmentName}`);
            return new UpdateResponse({ message: "Department updated successfully", metadat: updatedDepartment }).send(res);
        } catch (error) {
            logger.error("Error in updateDepartment", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }
}

export default new DepartmentController();
