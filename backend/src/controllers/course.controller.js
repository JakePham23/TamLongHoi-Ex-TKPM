import { logger } from "../utils/winston.js";
import courseModel from "../models/course.model.js";
import TranslationService from "../services/translation.service.js";
import ResponseFactory from "../responses/responseFactory.js";
import {ResponseTypes} from '../responses/response.types.js';

class CourseController {
    async addCourse(req, res, next) {
        try {
            const {
                courseId,
                courseName,
                credit,
                practicalSession,
                theoreticalSession,
                department,
                description,
                prerequisite
            } = req.body;

            if (!courseId || !courseName || !credit || !department || !practicalSession || !theoreticalSession) {
                logger.warn("Add course failed: Missing required fields");
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, {
                        message: "Course ID, name, credit and department are required"
                    })
                    .send(res);
            }

            const existingCourse = await courseModel.findOne({ courseId });
            if (existingCourse) {
                logger.warn(`Add course failed: Course ID ${courseId} already exists`);
                return ResponseFactory
                    .create(ResponseTypes.BAD_REQUEST, {
                        message: "Course ID already exists"
                    })
                    .send(res);
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

            await TranslationService.addTranslation({
                key: `course_list.${newCourse.courseId}.name`,
                text: newCourse.courseName,
                namespace: 'course'
            });

            await TranslationService.addTranslation({
                key: `course_list.${newCourse.courseId}.description`,
                text: newCourse.description || '',
                namespace: 'course'
            });

            logger.info(`New course added: ${courseName} (${courseId})`);
            return ResponseFactory
                .create(ResponseTypes.CREATED, {
                    message: "Course added successfully",
                    metadata: newCourse
                })
                .send(res);

        } catch (error) {
            logger.error("Error in addCourse", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const { courseId } = req.params;

            if (!courseId || courseId.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(courseId)) {
                logger.warn(`Delete course failed: Invalid Course ID ${courseId}`);
                return ResponseFactory
                    .create(ResponseTypes.NOT_FOUND, {
                        message: "Course not found"
                    })
                    .send(res);
            }

            const deletedCourse = await courseModel.findByIdAndDelete(courseId);

            if (!deletedCourse) {
                logger.warn(`Delete course failed: Course ID ${courseId} not found`);
                return ResponseFactory
                    .create(ResponseTypes.NOT_FOUND, {
                        message: "Course not found"
                    })
                    .send(res);
            }

            logger.info(`Course deleted: ${courseId}`);
            return ResponseFactory
                .create(ResponseTypes.DELETED, {
                    message: "Course deleted successfully"
                })
                .send(res);

        } catch (error) {
            logger.error("Error in deleteCourse", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async updateCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const updateData = req.body;
            updateData.department = updateData.departmentId;

            const currentCourse = await courseModel.findOne({ courseId: courseId });
            if (!currentCourse) {
                logger.warn(`Update course failed: Course ID ${courseId} not found`);
                return ResponseFactory
                    .create(ResponseTypes.NOT_FOUND, {
                        message: "Course not found"
                    })
                    .send(res);
            }

            const isChanged = Object.keys(updateData).some(key => {
                return updateData[key] != currentCourse[key];
            });

            if (!isChanged) {
                logger.info(`Course update skipped: No changes for course ${courseId}`);
                return ResponseFactory
                    .create(ResponseTypes.SUCCESS, {
                        message: "Không có thay đổi"
                    })
                    .send(res);
            }

            const updatedCourse = await courseModel.findOneAndUpdate(
                { courseId: courseId },
                updateData,
                { new: true, runValidators: true }
            );

            if (updateData.courseName && updateData.courseName !== currentCourse.courseName) {
                await TranslationService.addTranslation({
                    key: `course_list.${courseId}.name`,
                    text: updateData.courseName,
                    namespace: 'course'
                });
            }

            if (updateData.description && updateData.description !== currentCourse.description) {
                await TranslationService.addTranslation({
                    key: `course_list.${courseId}.description`,
                    text: updateData.description,
                    namespace: 'course'
                });
            }

            logger.info(`Course updated: ${courseId}`);
            return ResponseFactory
                .create(ResponseTypes.UPDATED, {
                    message: "Course updated successfully",
                    metadata: updatedCourse
                })
                .send(res);

        } catch (error) {
            logger.error("Error in updateCourse", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }

    async getAllCourses(req, res, next) {
        try {
            const courses = await courseModel.find().populate('department', 'departmentName');
            if (!courses || courses.length === 0) {
                logger.warn("No courses found");
                return ResponseFactory
                    .create(ResponseTypes.NOT_FOUND, {
                        message: "No courses found"
                    })
                    .send(res);
            }

            logger.info(`Retrieved ${courses.length} courses successfully`);
            return ResponseFactory
                .create(ResponseTypes.SUCCESS, {
                    message: "Courses retrieved successfully",
                    metadata: courses
                })
                .send(res);

        } catch (error) {
            logger.error("Error in getAllCourses", { error: error.message });
            return ResponseFactory
                .create(ResponseTypes.INTERNAL_ERROR, error.message)
                .send(res);
        }
    }
}

export default new CourseController();
