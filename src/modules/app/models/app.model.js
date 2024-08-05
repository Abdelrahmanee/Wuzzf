import mongoose from "mongoose";


const appSchema = new mongoose.Schema({
    jopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jop'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    userTechSkills: [{
        type: String,
        required: true
    }],
    userSoftSkills: [{
        type: String,
        required: true
    }],
    userResume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pdf'
    },
    status :{
        type : String,
        enum :['Rejected' , 'Accepted' , 'Applied' , 'OnHold'],
        default:'Applied'
    }
},
    { timestamps: true }
)


appSchema.pre(/^find/ , function(){
    this.populate('jopId').populate('userId').populate('userResume')
})

export const appModel = mongoose.model('app', appSchema)