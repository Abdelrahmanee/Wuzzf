



import mongoose from "mongoose";


const pdfSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    pdfURL: {
        type: String
    }

},
    { timestamps: true }
)


export const pdfModel = mongoose.model('pdf', pdfSchema)