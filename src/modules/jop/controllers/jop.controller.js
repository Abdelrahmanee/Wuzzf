

import cloudinary from 'cloudinary'
import { AppError, catchAsyncError } from "../../../utilies/error.handel.js"
import { appModel } from "../../app/models/app.model.js"
import { companyModel } from "../../company/models/company.model.js"
import { jopModel } from "../models/jop.model.js"
import { pdfModel } from '../../app/models/pdf.model.js'
import { userModel } from '../../user/models/user.model.js'
import { removeFile } from '../../../utilies/removeFile.js'




//addJob

export const addJop = catchAsyncError(async (req, res, next) => {

    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body

    const { _id: user } = req.user
    const { company } = req.params
    const companyExist = await companyModel.findById(company);
    const userExist = await userModel.findById(user);
    console.log(companyExist);
    console.log(userExist);
    if (!companyExist || !userExist) return next(new AppError('Company not found', 404));

    const owner = await companyModel.findOne({ _id: company, companyHR: user })
    if (!owner) return next(new AppError('owner only can add jop', 409));

    const jop = await jopModel.create({ jobTitle, company, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy: user })
    res.status(201).json({
        status: 'success',
        message: "Jop added successfully",
        data: {
            jop
        }
    });
})

// Update Jop data

export const updateJopInfo = catchAsyncError(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body
    const { id: jopID } = req.params
    const jop = await jopModel.findByIdAndUpdate({ _id: jopID }, { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills }, { new: true })
    res.status(200).json({
        status: 'success',
        message: "Jop Updated successfully ",
        data: {
            jop
        }
    });

})

// Delete Jop data
export const deleteJopInfo = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const jop = await jopModel.findByIdAndDelete(id)
    if (!jop) throw new AppError('jop is not found', 404)
    res.status(200).json()
    res.status(201).json({
        status: 'success',
        message: "Jop deleted successfully",
    });
})

// Get all Jobs with their company’s  information
export const getAllJops = catchAsyncError(async (req, res, next) => {
    const jops = await jopModel.find().populate('company')
    res.status(200).json({
        status: 'success',
        data: {
            jops
        }
    });
})
export const getSpecificJop = catchAsyncError(async (req, res, next) => {
    const { id } = req.params

    const jop = await jopModel.findById(id).populate('company')
    if (!jop) throw new AppError('jop is not found', 404)
    res.status(200).json({
        status: 'success',
        data: {
            jop
        }
    });
})
// Get all Jobs for a specific company.
export const getAllJopsOFSpecificCompany = catchAsyncError(async (req, res, next) => {
    try {
        const { company_name } = req.query
        const comapny = await companyModel.find({ companyName: company_name })
        const comapnyInfo = comapny[0]
        const { _id } = comapnyInfo
        const jops = await jopModel.findOne({ company: _id })
        res.status(200).json({
            status: 'success',
            data: {
                jops
            }
        });

    } catch (error) {
        throw new AppError('Company Not found', 404)
    }
})


// 6. Get all Jobs that match the following filters 
//     - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
//     - one or more of them should applied
//     **Exmaple** : if the user selects the   
//     **workingTime** is **part-time** and the **jobLocation** is **onsite** 
//     , we need to return all jobs that match these conditions
//     - apply authorization with the role ( User , Company_HR )


export const jobFilters = catchAsyncError(async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    // Construct query object based on provided filters
    const query = {};
    if (workingTime) query.workingTime = workingTime;
    if (jobLocation) query.jobLocation = jobLocation;
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;
    if (jobTitle) query.jobTitle = jobTitle;
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(',') };

    const jops = await jopModel.find(query);

    res.status(200).json({
        status: 'success',
        data: {
            jops
        }
    });
})



// Apply to Job



export const applyJop = catchAsyncError(async (req, res, next) => {

    const { id: jopId } = req.params
    const { id: userId } = req.user

    const job = await jopModel.findById(jopId)
    const user = await userModel.findById(userId)
    if (!user) throw new AppError("user is not exist", 404)
    if (!job) throw new AppError("Job no longer exist", 400)

    const company = job.company
    
    const userAppliedToJop = await appModel.findOne({ jopId, userId })
    if (userAppliedToJop) throw new AppError("you already applied to this jop", 409)

    let cloud = await cloudinary.uploader.upload(req.file.path)

    let pdf = await pdfModel.create({ name: cloud.public_id, pdfURL: cloud.secure_url })

    

    const { userTechSkills, userSoftSkills } = req.body

    const app = await appModel.create({ userTechSkills, userSoftSkills, userId, jopId , company, userResume: pdf._id })

    await removeFile(req.file.path)
    console.log(req.file);

    res.status(201).json({
        status: 'success',
        message: "Added successfully",
        data: {
            app,
            pdf
        }
    });

})



