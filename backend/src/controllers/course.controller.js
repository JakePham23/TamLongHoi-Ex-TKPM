import { logger } from "../utils/winston.js";
import courseModel from "../models/course.model.js";
import { 
    BadRequest,
    InternalServerError,
    NotFoundRequest
} from "../responses/error.response.js";
import {
    CreatedResponse,
    DeleteResponse,
    UpdateResponse,
    OkResponse
} from "../responses/success.response.js";

class CourseController {
    async addCourse(req, res, next) {
        try {
            const { courseId, courseName, credit, practicalSession, theoreticalSession, department, description, prerequisite } = req.body;

            // Validate required fields
            if (!courseId || !courseName || !credit || !department || !practicalSession || !theoreticalSession) {
                logger.warn("Add course failed: Missing required fields");
                return new BadRequest({message: "Course ID, name, credit and department are required"}).send(res);
            }

            // Check if course already exists
            const existingCourse = await courseModel.findOne({ courseId });
            if (existingCourse) {
                logger.warn(`Add course failed: Course ID ${courseId} already exists`);
                return new BadRequest({message: "Course ID already exists"}).send(res);
            }

            const newCourse = new courseModel({
                courseId,
                courseName,
                credit,
                practicalSession,
                theoreticalSession,
                department,
                description,
                prerequisite
            });

            await newCourse.save();

            logger.info(`New course added: ${courseName} (${courseId})`);
            return new CreatedResponse({
                message: "Course added successfully",
                metadata: newCourse
            }).send(res);
        } catch (error) {
            logger.error("Error in addCourse", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            
            const deletedCourse = await courseModel.findByIdAndDelete( courseId );
            
            if (!deletedCourse) {
                logger.warn(`Delete course failed: Course ID ${courseId} not found`);
                return new NotFoundRequest({message: "Course not found"}).send(res);
            }

            logger.info(`Course deleted: ${courseId}`);
            return new DeleteResponse({
                message: "Course deleted successfully"
            }).send(res);
        } catch (error) {
            logger.error("Error in deleteCourse", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }

    async updateCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const updateData = req.body;
            updateData.department = updateData.departmentId;
            console.log(courseId, "Update course data:", updateData);
    
            // Lấy thông tin khóa học hiện tại
            const currentCourse = await courseModel.findOne({ courseId: courseId });
            if (!currentCourse) {
                logger.warn(`Update course failed: Course ID ${courseId} not found`);
                return new NotFoundRequest({ message: "Course not found" }).send(res);
            }
    
            // Kiểm tra xem dữ liệu có thực sự thay đổi không
            const isChanged = Object.keys(updateData).some(key => {
                // Nếu là object (như nested), cần custom xử lý sâu hơn
                return updateData[key] != currentCourse[key];
            });
    
            if (!isChanged) {
                logger.info(`Course update skipped: No changes for course ${courseId}`);
                return res.status(200).json({
                    status: "success",
                    message: "Không có thay đổi"
                });
            }
    
            // Tiến hành update nếu có thay đổi
            const updatedCourse = await courseModel.findOneAndUpdate(
                { courseId: courseId },
                updateData,
                { new: true, runValidators: true }
            );
            
    
            logger.info(`Course updated: ${courseId}`);
            return res.status(200).json({
                status: "success",
                message: "Course updated successfully"
            });
    
        } catch (error) {
            logger.error("Error in updateCourse", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }
    

    async getAllCourses(req, res, next) {
        try {
            const courses = await courseModel.find().populate('department', 'departmentName');
            logger.info(`Retrieved ${courses.length} courses successfully`);
            return new OkResponse({
                message: "Courses retrieved successfully",
                metadata: courses
            }).send(res);
        } catch (error) {
            logger.error("Error in getAllCourses", { error: error.message });
            return new InternalServerError(error.message).send(res);
        }
    }
}

export default new CourseController(); 