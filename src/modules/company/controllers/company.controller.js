import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { removeFile } from "../../../utilies/removeFile.js";
import { appModel } from "../../app/models/app.model.js";
import { jopModel } from "../../jop/models/jop.model.js";
import { userModel } from "../../user/models/user.model.js";
import { companyModel } from "../models/company.model.js";
import { v2 as cloudinary } from 'cloudinary';

// Add company 

export const addCompany = catchAsyncError(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    let logo = null;
    req.file ? { filename: logo } = req.file : ''
    const { _id: companyHR } = req.user;

    const isCompanyExist = await companyModel.findOne({ companyEmail, companyName });
    if (isCompanyExist) {
        await removeFile(req.file.path)
        throw new AppError('try another name or email', 409);
    }

    let cloud = await cloudinary.uploader.upload(req.file.path)
    await removeFile(req.file.path)
    const company = await companyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR,
        logo: cloud.secure_url
    });


    res.status(201).json({
        status: 'success',
        message: 'Company added successfully',
        data: {
            company
        }
    });
});
// Update company data

export const updateCompanyInfo = catchAsyncError(async (req, res, next) => {
    const { id: companyId } = req.params;
    const { _id: userId } = req.user;
    const user = await userModel.findById(userId)
    const isCompanyExist = await companyModel.findById(companyId)
    if (!user || !isCompanyExist) return next(new AppError('Company not found', 404));
    const owner = await companyModel.findOne({ _id: companyId, companyHR: userId });
    if (!owner) {
        return next(new AppError('Owner only can control company', 403));
    }
    
    const updateData = req.body;
    if (req.file) {
        const profilePictureUrl = isCompanyExist.logo;
        if (profilePictureUrl) {
            const publicIdMatch = profilePictureUrl.match(/\/upload\/(?:v[0-9]+\/)?([^/.]+)(?=\.[^.]+$)/);
            const publicId = publicIdMatch ? publicIdMatch[1] : null;
            if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        let cloud = await cloudinary.uploader.upload(req.file.path)
        await removeFile(req.file.path)
        updateData.logo = cloud.secure_url
    }
    const isCompanyRepeated = await companyModel.findOne({ companyEmail: updateData.companyEmail, companyName: updateData.companyName });
    if (isCompanyRepeated) {
        return new AppError('try another name or email', 409);
    }

    // Update the company information

    const company = await companyModel.findByIdAndUpdate(companyId, updateData, { new: true, runValidators: true });

    // Handle case where company does not exist
    if (!company) {
        return next(new AppError('Company not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Company updated successfully',
        data: {
            company
        }
    });
});


// Delete company data

export const deleteCompanyInfo = catchAsyncError(async (req, res, next) => {
    const { id: companyId } = req.params;

    // Check if the company exists before deleting
    const company = await companyModel.findById(id);
    if (!company) {
        return next(new AppError('Company not found', 404));
    }
    const logoURL = company.logo;
    if (logoURL) {
        const publicIdMatch = logoURL.match(/\/upload\/(?:v[0-9]+\/)?([^/.]+)(?=\.[^.]+$)/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;


        // Remove the old profile picture from Cloudinary if public ID exists
        if (publicId) {
            try {
                const destroyResponse = await cloudinary.uploader.destroy(publicId);

                //    await cloudinary.uploader.destroy(destroyResponse.UploadResponse)
            } catch (error) {
                console.error('Error removing image from Cloudinary:', error);
            }
        }
    }
    await companyModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Company deleted successfully" });
});
// Get company data 

export const getCompanyInfo = catchAsyncError(async (req, res, next) => {
    const { id: companyId } = req.params;

    // Find the company by ID
    const company = await companyModel.findById(companyId, { _id: 0 });

    // Handle case where company does not exist
    if (!company) {
        return next(new AppError('Company not found', 404));
    }

    // Find jobs associated with the company
    const jobs = await jopModel.find({ company: companyId });

    // Send the response
    res.status(200).json({
        status: 'success',
        data: {
            company,
            jobs
        }
    });
});

// Search for a company with a name. 
export const searchCompanyWithName = catchAsyncError(async (req, res, next) => {
    const { company_name } = req.query;

    const companies = await companyModel.find({ companyName: { $regex: new RegExp(company_name, 'i') } })
    res.status(201).json({ companies })
    res.status(200).json({
        status: 'success',
        data: {
            companies,
        }
    });
})

// Get all applications for specific Jobs

export const getAllApplications = catchAsyncError(async (req, res) => {
    const { id: jobID } = req.params

    const job = await jopModel.findById(jobID, { _id: 0 })

    if (!job) {
        return next(new AppError('Job not found', 404));
    }
    const applications = await appModel.find({ jobId: jobID })

    res.status(200).json({
        status: 'success',
        data: {
            applications
        }
    });

})

