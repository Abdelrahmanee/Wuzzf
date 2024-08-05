import { Router } from "express";
import { authenticate, authorize } from "../../auth/middelwares/auth.middelware.js";
import { addCompany, deleteCompanyInfo, getAllApplications, getCompanyInfo, searchCompanyWithName, updateCompanyInfo } from "../controllers/company.controller.js";
import { validate } from "../../../middelwares/validation.middelware.js";
import { addCompanySchema, deleteCompanyInfoSchema, getAllApplicationsSchema, getCompanyInfoSchema, searchCompanyWithNameSchema, updateCompanyInfoSchema } from "../validations/company.validation.js";
import { checkCompanyOwner } from "../middelwares/company.middelware.js";
import { checkJopOwner } from "../../app/middelwares/app.middelware.js";
import { ROLES } from "../../../utilies/enums.js";
import { uploadSingle } from "../../../middelwares/upload.middelware.js";
import { validateFields } from "../../../middelwares/validateFields.js";


const router = Router()


router.post(
    '/add-company',
    uploadSingle('logo', 'companyLogo'),          // 5. Handle file upload
    validate(addCompanySchema),               // 1. Validate non-file fields
    authenticate,                                  // 2. Authenticate the user
    authorize(ROLES.MANGER, ROLES.Company_HR),    // 3. Authorize the user
    addCompany                                     // 6. Controller to handle business logic
);

router.get('/search/', validate(searchCompanyWithNameSchema), authenticate, searchCompanyWithName);
router.get('/getAllApplications/:id',
    validate(getAllApplicationsSchema), authenticate, authorize(ROLES.MANGER, ROLES.Company_HR),
    checkJopOwner, getAllApplications);

router.route('/:id')
    .put(
        uploadSingle('logo', 'companyLogo'),
        validate(updateCompanyInfoSchema),
        authenticate, authorize(ROLES.MANGER, ROLES.Company_HR),
        // checkCompanyOwner,
        updateCompanyInfo
    )
    .delete(validate(deleteCompanyInfoSchema), authenticate, authorize(ROLES.MANGER, ROLES.Company_HR), checkCompanyOwner, deleteCompanyInfo)
    .get(validate(getCompanyInfoSchema), authenticate, getCompanyInfo);




export default router;
