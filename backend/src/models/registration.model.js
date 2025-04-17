import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    teachers: {
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
            required: true,
        },
        scoure: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['registered', 'completed', 'dropped'],
        }
    }],
    schedule: {
        dayOfWeek: {
            type: Number,
        },
        time: {
            type: String,
        },
    },
    roomId: {
        type: Number,
    },
},
    {
        collection: "Registrations",
        timestamps: true,
    });

const Registrations = mongoose.model("Registrations", registrationSchema);
export default Registrations