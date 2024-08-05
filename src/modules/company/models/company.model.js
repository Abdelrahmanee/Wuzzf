import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 10000,
    },
    industry: {
        type: String,
        trim  :true,
        required :true
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    numberOfEmployees: {
        type: String,
        enum : ['1-10', '11-20', '21-50', '51-100', '101-500', '500+'],
        required: true,
        trim: true,
    },
    companyEmail :{
        type: String,
        required: true,
        trim: true,
        unique :true,
    },
    companyHR :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required :true,
    },
    logo:{
        type:String
    }


},
    { timestamps: true }
)


export const companyModel = mongoose.model('company', companySchema)