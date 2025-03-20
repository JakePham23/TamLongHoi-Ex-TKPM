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

    
}

export default new DepartmentController();