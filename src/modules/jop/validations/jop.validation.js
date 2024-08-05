import Joi from "joi";

export const addJopSchema = Joi.object({
    body: {
        jobTitle: Joi.string().required(),

        jobLocation: Joi.string().required(),
        workingTime: Joi.string().required(),
        seniorityLevel: Joi.string().required(),
        jobDescription: Joi.string().required(),
        technicalSkills: Joi.array().items(Joi.string().required()),
        softSkills: Joi.array().items(Joi.string().required()),

    },
    params: {
        company: Joi.string().hex().length(24),
    },
    query: {
        addedBy: Joi.string().hex().length(24)
    }
})
export const updateJobSchema = Joi.object({
    body: {
        jobTitle: Joi.string(),
        jobLocation: Joi.string(),
        workingTime: Joi.string(),
        seniorityLevel: Joi.string(),
        jobDescription: Joi.string(),
        technicalSkills: Joi.array().items(Joi.string()),
        softSkills: Joi.array().items(Joi.string()),
    }
    ,
    params: { id: Joi.string().hex().length(24) },
    query: {}
})
export const deleteJobInfoSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex().length(24) },
    query: {}
})
export const getJobInfoSchema = Joi.object({
    body: {},
    params: { id: Joi.string().hex().length(24) },
    query: {}
})
export const getAllJopsOFSpecificCompanySchema = Joi.object({
    body: {},
    params: {},
    query: { company_name: Joi.string() }
})
export const jobFiltersSchema = Joi.object({
    body: {},
    params: {},
    query: {
        workingTime: Joi.string(),
        jobLocation: Joi.string(),
        seniorityLevel: Joi.string(),
        technicalSkills: Joi.string(),
        jobTitle: Joi.string(),
    }
})


