import Joi from "joi";



export const addAppSchema = Joi.object({
    body: {
        userTechSkills: Joi.array().items(Joi.string().required()),
        userSoftSkills: Joi.array().items(Joi.string().required())
    },
    params: {
        id: Joi.string().hex().length(24)
    },
    query: {},
    file: Joi.object({
        fieldname: Joi.string().optional(),
        originalname: Joi.string().required().messages({
            'any.required': 'File is required',
            'string.empty': 'File cannot be empty',
        }),
        encoding: Joi.string().optional(),
        mimetype: Joi.string().valid('application/pdf').required().messages({
            'any.required': 'File type is required',
            'any.only': 'File must be a PDF document'
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