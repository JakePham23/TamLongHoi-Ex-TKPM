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
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Departments',
    required: true,
  },
  description: {
    type: String
  },
  prerequisite: {
    type: String, // courseCode of the prerequisite
    validate: {
      validator: async function (value) {
        if (!value) return true; // Allow empty prerequisite
        const Course = mongoose.model('Course');
        const exists = await Course.exists({ courseCode: value });
        return !!exists;
      },
      message: props => `Prerequisite course "${props.value}" does not exist.`
    }
  }
},
{
    collection: 'Courses',
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
