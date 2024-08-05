import mongoose from "mongoose";


const jopSchema = new mongoose.Schema({

    jobTitle: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: true,
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
        maxlength: 10000,
    },
    technicalSkills: [{
        type: String,
        required: true
    }],
    softSkills: [{
        type: String,
        required: true
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    company : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    }

},
    { timestamps: true }

)


export const jopModel = mongoose.model('jop', jopSchema)