import mongoose from'mongoose'

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    required: true,
    min: [2, 'Credit must be at least 2']
  },
  practicalSession:{
    type: Number,
    required: true,
    min: [0, 'Practical session must be at least 0']
  },
  theoreticalSession:{
    type: Number,
    required: true,
    min: [0, 'Theoretical session must be at least 0']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required: true,
  },
  description: {
    type: String
  },
  prerequisite: {
    type: String, // courseId of the prerequisite
    validate: {
      validator: async function (value) {
        if (!value) return true; // Allow empty prerequisite
        const Course = mongoose.model('Course');
        const exists = await Course.exists({ courseId: value });
        return !!exists;
      },
      message: props => `Prerequisite course with ID "${props.value}" does not exist.`
    }
  }
},
{
    collection: 'Courses',
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
