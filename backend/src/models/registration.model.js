import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true,
    },
    maxStudent: {
        type: Number,
        required: true,
    },
    registrationStudent: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Students',
        },
        score: [{
            processPoint: {
                type: Number
            },
            midterm:{
                type:Number
            },
            finalTerm:{
                type:Number
            },
            finalScore:{
                type:Number
            }
        }],
        status: {
            type: String,
            enum: ['registered', 'completed', 'dropped'],
        }
    }],
    schedule: {
        dayOfWeek: {
            type: String,
        },
        lessonBegin: {
            type: Number,
        },
        lessonEnd: {
            type: Number,
        }
    },
    roomId: {
        type: Number,
    },
    registrationDate: {
        type: Date,
        default: Date.now, // Automatically set to the current date
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
    },
},
    {
        collection: "Registrations",
        timestamps: true,
    });

const Registrations = mongoose.model("Registrations", registrationSchema);
export default Registrations;