import { Schema, model } from 'mongoose';

const COLLECTION_NAME = 'Students';

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: Boolean, // true: male, false: female
      required: true,
    },
    schoolYear: {
      type: Number,
      required: true,
    },
    program: {
      type: String,
      enum: ['CQ', 'CLC', 'DTTX', 'APCS'],
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Departments',
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    studentStatus: {
      type: String,
      enum: ['active', 'graduated', 'dropout', 'suspended'],
      default: 'active',
    },
    address: {
      houseNumber: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    addressTemp: {
      houseNumber: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    addressMail: {
      houseNumber: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    // Thông tin giấy tờ tùy thân
    identityDocument: {
      type: {
        type: String,
        enum: ['CMND', 'CCCD', 'Passport'],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      issuedDate: {
        type: Date,
        required: true,
      },
      issuedPlace: {
        type: String,
        required: true,
      },
      expirationDate: {
        type: Date,
      },
      hasChip: {
        type: Boolean, // Chỉ áp dụng cho CCCD
      },
      countryIssued: {
        type: String, // Chỉ áp dụng cho Passport
      },
      notes: {
        type: String, // Ghi chú thêm nếu có
      },
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const studentModel = new model(COLLECTION_NAME, studentSchema);
export default studentModel;
