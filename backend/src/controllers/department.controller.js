import departmentModel from "../models/department.model.js";

class DepartmentController{
    async addDepartment(req, res, next){
        try{
            const { departmentName } = req.body;
            const newDepartment = new departmentModel({ departmentName });
            await newDepartment.save();
            res.status(201).json({ message: "Department added successfully", options: { location: `/departments/${newDepartment._id}` } });
        }catch(error){
            next(error);
        }
    }

    async getAllDepartments(req, res, next){
        try{
            const departments = await departmentModel.find();
            res.status(200).json({ message: "Departments retrieved successfully", data: departments });
        }catch(error){
            next(error);
        }
    }

    async deleteDepartment(req, res, next){
        try{
            const { departmentId } = req.params;
            await departmentModel.findByIdAndDelete(departmentId);
            res.status(200).json({ message: "Department deleted successfully" });
        }catch(error){
            next(error);
        }
    }

    async updateDepartment(req, res, next){
        try{
            const { departmentId } = req.params;
            const updatedDepartment = await departmentModel.findByIdAndUpdate(departmentId, req.body, { new: true });
            if(!updatedDepartment){
                throw new Error("Department not found");
            }
            res.status(200).json({ message: "Department updated successfully", data: updatedDepartment });
        }catch(error){
            next(error);
        }
    }
    
}

export default new DepartmentController();