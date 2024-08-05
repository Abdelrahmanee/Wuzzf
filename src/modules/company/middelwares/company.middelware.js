import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { userModel } from "../../user/models/user.model.js";
import { companyModel } from "../models/company.model.js";
import { addCompanySchema } from "../validations/company.validation.js";






export const checkCompanyExist = catchAsyncError(async (req, res, next) => {
    const { companyName, companyEmail } = await req.body;
    console.log(req.body);
    const company = await companyModel.findOne({ companyEmail, companyName });
    if (company) {
        return new AppError('try another name or email', 409);
    }
    
    next();
});

export const checkCompanyOwner = catchAsyncError(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { id: companyId } = req.params
    const user = await userModel.findById(userId)
    const company = await companyModel.findById(companyId)
    if (!user || !company) return next(new AppError('Company not found', 404));
    const owner = await companyModel.findOne({ _id: company, companyHR: userId });
    if (!owner) {
        return next(new AppError('Owner only can control company', 403));
    }
    next();
});

