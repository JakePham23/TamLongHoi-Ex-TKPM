import departmentModel from "../models/department.model.js";

class DepartmentController {
  async addDepartment(req, res, next) {
    try {
      const { departmentName } = req.body;
      if (!departmentName) {
        return res.status(400).json({ message: "Departments name is required" });
      }

      const newDepartment = new departmentModel({ departmentName });
      await newDepartment.save();

      res.status(201).json({
        message: "Departments added successfully",
        data: newDepartment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllDepartments(req, res, next) {
    try {
      const departments = await departmentModel.find();
      res.status(200).json({
        message: "Departments retrieved successfully",
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const { departmentId } = req.params;
      const department = await departmentModel.findByIdAndDelete(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Departments not found" });
      }
      res.status(200).json({ message: "Departments deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateDepartment(req, res, next) {
    try {
        const { departmentId } = req.params;
        const { departmentName } = req.body;

        if (!departmentName || typeof departmentName !== "string") {
            return res.status(400).json({ message: "Invalid department name" });
        }

        const updatedDepartment = await departmentModel.findByIdAndUpdate(
            departmentId,
            { departmentName },
            { new: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({ message: "Departments not found" });
        }

        res.status(200).json({ 
            message: "Departments updated successfully",
            data: updatedDepartment 
        });
    } catch (error) {
        next(error);
    }
}

}

export default new DepartmentController();
