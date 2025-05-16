import Registrations from '../models/registration.model.js';
import Students from '../models/student.model.js';
import Courses from '../models/course.model.js';


class classRegistration  {
    // Register a student for a course
    registerStudent = async (req, res) => {
        try {
            const { registrationId, studentId } = req.body;
            
            // Find the registration
            const registration = await Registrations.findById(registrationId);
            if (!registration) {
                return res.status(404).json({ message: 'Registration not found' });
            }
            
            // Check if class is full
            if (registration.registrationStudent.length >= registration.maxStudent) {
                return res.status(400).json({ message: 'Class is full' });
            }
            
            // Check if student is already registered
            const alreadyRegistered = registration.registrationStudent.some(
                reg => reg.studentId.toString() === studentId
            );
            if (alreadyRegistered) {
                return res.status(400).json({ message: 'Student already registered for this course' });
            }
            
            // Find student and course for prerequisite check
            const student = await Students.findById(studentId);
            const course = await Courses.findById(registration.courseId);
            
            if (!student || !course) {
                return res.status(404).json({ message: 'Student or course not found' });
            }
            
            // Check prerequisites
            if (course.prerequisites && course.prerequisites.length > 0) {
                const completedCourses = await Registrations.find({
                    'registrationStudent.studentId': studentId,
                    'registrationStudent.status': 'completed'
                });
                
                const completedCourseIds = completedCourses.map(reg => reg.courseId.toString());
                
                const missingPrerequisites = course.prerequisites.filter(
                    prereq => !completedCourseIds.includes(prereq.toString())
                );
                
                if (missingPrerequisites.length > 0) {
                    return res.status(400).json({ 
                        message: 'Prerequisite requirements not met',
                        missingPrerequisites
                    });
                }
            }
            
            // Add student to registration
            registration.registrationStudent.push({
                studentId,
                status: 'registered'
            });
            
            await registration.save();
            
            res.status(200).json(registration);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Unregister a student from a course
    unregisterStudent = async (req, res) => {
        try {
            const { registrationId, studentId } = req.body;
            
            // Find the registration
            const registration = await Registrations.findById(registrationId);
            if (!registration) {
                return res.status(404).json({ message: 'Registration not found' });
            }
            
            // Check if registration is closed
            if (registration.status === 'closed') {
                return res.status(400).json({ message: 'Registration is closed, cannot unregister' });
            }
            
            // Find and remove student from registration
            const studentIndex = registration.registrationStudent.findIndex(
                reg => reg.studentId.toString() === studentId
            );
            
            if (studentIndex === -1) {
                return res.status(404).json({ message: 'Student not found in this registration' });
            }
            
            // Record unregistration history (you might want to save this to a separate collection)
            const unregisteredStudent = registration.registrationStudent[studentIndex];
            unregisteredStudent.status = 'dropped';
            unregisteredStudent.unregisteredAt = new Date();
            
            // Or to completely remove:
            // registration.registrationStudent.splice(studentIndex, 1);
            
            await registration.save();
            
            res.status(200).json({ 
                message: 'Student unregistered successfully',
                registration
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get class roster with grades
    getClassRoster = async (req, res) => {
        try {
            const { registrationId } = req.params;
            
            const registration = await Registrations.findById(registrationId)
                .populate('courseId')
                .populate('teacherId')
                .populate('registrationStudent.studentId');
            
            if (!registration) {
                return res.status(404).json({ message: 'Registration not found' });
            }
            
            res.status(200).json(registration);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Generate official transcript
    generateTranscript = async (req, res) => {
        try {
            const { studentId } = req.params;
            
            // Find all completed registrations for the student
            const registrations = await Registrations.find({
                'registrationStudent.studentId': studentId,
                'registrationStudent.status': 'completed'
            })
            .populate('courseId')
            .populate('registrationStudent.studentId');
            
            if (!registrations || registrations.length === 0) {
                return res.status(404).json({ message: 'No completed courses found for this student' });
            }
            
            // Calculate GPA
            let totalCredits = 0;
            let totalGradePoints = 0;
            
            const transcript = registrations.map(reg => {
                const studentData = reg.registrationStudent.find(
                    s => s.studentId._id.toString() === studentId
                );
                
                const course = reg.courseId;
                const gradePoint = calculateGradePoint(studentData.score);
                const credits = course.credits || 3; // Default to 3 if credits not set
                
                totalGradePoints += gradePoint * credits;
                totalCredits += credits;
                
                return {
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    credits: credits,
                    year: reg.year,
                    semester: reg.semester,
                    score: studentData.score,
                    grade: calculateGrade(studentData.score),
                    gradePoint: gradePoint
                };
            });
        
            const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
            
            // Get student info
            const student = await Students.findById(studentId);
            
            // Format transcript data (in a real app, you might use a PDF generator)
            const transcriptData = {
                student: {
                    id: student.studentId,
                    name: student.name,
                    program: student.program
                },
                courses: transcript,
                gpa: gpa,
                generatedAt: new Date()
            };
            
            // In a real implementation, you would generate a PDF here
            // For now, we'll return JSON
            res.status(200).json(transcriptData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    async calculateGrade(score) {
        if (score >= 9) return 'A';
        if (score >= 8) return 'B';
        if (score >= 7) return 'C';
        if (score >= 6) return 'D';
        return 'F';
    }

    async calculateGradePoint(score) {
        if (score >= 9) return 4.0;
        if (score >= 8) return 3.0;
        if (score >= 7) return 2.0;
        if (score >= 6) return 1.0;
        return 0.0;
    }
}

export default new classRegistration();
