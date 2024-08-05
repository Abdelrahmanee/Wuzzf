import { Router } from "express";
import { authenticate, authorize } from "../../auth/middelwares/auth.middelware.js";
import { addJop, applyJop, deleteJopInfo, getAllJops, getAllJopsOFSpecificCompany, getSpecificJop, jobFilters, updateJopInfo } from "../controllers/jop.controller.js";
import getUploadMiddelware, { uploadSingle } from "../../../middelwares/upload.middelware.js";
import { validate } from "../../../middelwares/validation.middelware.js";
import { addAppSchema } from "../../app/validations/app.validation.js";
import { addJopSchema, deleteJobInfoSchema, getAllJopsOFSpecificCompanySchema, getJobInfoSchema, jobFiltersSchema, updateJobSchema } from "../validations/jop.validation.js";
import { ROLES } from "../../../utilies/enums.js";



const router = Router()


router.post('/add-jop/:company',
    validate(addJopSchema), authenticate, authorize(ROLES.Company_HR, ROLES.MANGER), addJop)

router.get('/all-jops', authenticate, getAllJops)
router.get('/search/', validate(getAllJopsOFSpecificCompanySchema), authenticate, getAllJopsOFSpecificCompany)
router.get('/jobFilters/', validate(jobFiltersSchema), authenticate, jobFilters)
router.route('/apply-jop/:id')
    .post(uploadSingle('cv', 'CVs'), validate(addAppSchema), authenticate, authorize(ROLES.USER), applyJop)

router.route('/:id')
    .put(validate(updateJobSchema), authenticate, authorize(ROLES.Company_HR, ROLES.MANGER), updateJopInfo)
    .delete(validate(deleteJobInfoSchema), authenticate, authorize(ROLES.Company_HR, ROLES.MANGER), deleteJopInfo)
    .get(validate(getJobInfoSchema), authenticate, getSpecificJop)



export default router;