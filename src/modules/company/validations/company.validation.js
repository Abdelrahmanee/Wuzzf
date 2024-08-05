import Joi from "joi";


// email: Joi.string().email(),
// recoveryEmail: Joi.string().email(),
// password: Joi.string().pattern(new RegExp('^[1-9]')),
// firstName: Joi.string().min(2).max(100),
// lastName: Joi.string().min(2).max(100),
// DOB: Joi.date(),
// mobileNumber: Joi.string(),



export const addCompanySchema = Joi.object({
    body: {
        companyName: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required(),
        industry: Joi.string().required(),
        address: Joi.string().required(),
        numberOfEmployees: Joi.string().required(),
        companyEmail: Joi.string().email().required(),
    },
    params: {},
    query: {},
    file: Joi.object({
        fieldname: Joi.string().optional(),
        originalname: Joi.string().required().messages({
            'any.required': 'File is required',
            'string.empty': 'File cannot be empty',
        }),
        encoding: Joi.string().optional(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png').required().messages({
            'any.required': 'File type is required',
            'any.only': 'File must be a jpeg or png image'
        }),
        destination: Joi.string().optional(),
        filename: Joi.string().required().messages({
            'any.required': 'File name is required'
        }),
        path: Joi.string().optional(),
        size: Joi.number().max(5 * 1024 * 1024).messages({
            'number.max': 'File size must be less than 5MB'
        })
    }).required()
})
export const updateCompanyInfoSchema = Joi.object({
    body: {
        companyName: Joi.string().min(2).max(200),
        description: Joi.string().min(2).max(500),
        industry: Joi.string(),
        address: Joi.string(),
        numberOfEmployees: Joi.string(),
        companyEmail: Joi.string().email(),
    },
    params: {id: Joi.string().hex()},
    query: {},
    file: Joi.object({
        fieldname: Joi.string().optional(),
        originalname: Joi.string().required().messages({
            'any.required': 'File is required',
            'string.empty': 'File cannot be empty',
        }),
        encoding: Joi.string().optional(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png').required().messages({
            'any.required': 'File type is required',
            'any.only': 'File must be a jpeg or png image'
        }),
        destination: Joi.string().optional(),
        filename: Joi.string().required().messages({
            'any.required': 'File name is required'
        }),
        path: Joi.string().optional(),
        size: Joi.number().max(5 * 1024 * 1024).messages({
            'number.max': 'File size must be less than 5MB'
        })
    }).optional()
})

export const deleteCompanyInfoSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex() },
    query: {}
})
export const getAllApplicationsSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex() },
    query: {}
})

export const getCompanyInfoSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex() },
    query: {}
})
export const searchCompanyWithNameSchema = Joi.object({
    body: {},
    params: { },
    query: { company_name : Joi.string().min(1).required()}
})

