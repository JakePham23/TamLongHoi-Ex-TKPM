import {Schema, model} from 'mongoose'

const COLLECTION_NAME = 'Departments'

const departmentSchema = new Schema({
    departmentName: {
        type: String,
        unique: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const departmentModel =new model(COLLECTION_NAME, departmentSchema)

export default departmentModel