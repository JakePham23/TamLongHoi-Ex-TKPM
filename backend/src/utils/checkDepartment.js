import departmentModel from '../models/department.model.js';
import { BadRequest } from '../responses/error.response.js';

const checkExistedDepartment = async (department) => {
    const errorMessages = [];
    const existingDepartment = await departmentModel.findOne({_id: department._id})

    if(!existingDepartment) {
        errorMessages.push("Department ID is not valid");
    }

    // Nếu có lỗi, ném ra BadRequest với danh sách lỗi
    if (errorMessages.length > 0) {
        throw new BadRequest(errorMessages.join(" "));
    }
};

export { checkExistedDepartment };
