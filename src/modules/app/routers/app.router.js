import { Router } from "express"
import { authenticate, authorize } from "../../auth/middelwares/auth.middelware.js"
import {  getAllAppsOfSpecificCompany, getAllAppsOfSpecificJop, getAllJopsOfSpecificCompany, makeCompanyDailyReport } from "../controllers/app.controller.js"
import { ROLES } from "../../../utilies/enums.js"
import { allowedToCompanyHrOnly } from "../middelwares/app.middelware.js"








const applictiantRouter = Router()


applictiantRouter.post('/generate-report',
    authenticate, authorize(ROLES.Company_HR, ROLES.MANGER),allowedToCompanyHrOnly , makeCompanyDailyReport)

applictiantRouter.get('/specific-company-applications',
    authenticate, authorize(ROLES.Company_HR, ROLES.MANGER ), allowedToCompanyHrOnly,getAllAppsOfSpecificCompany)
applictiantRouter.get('/specific-jop-applications',
    authenticate, authorize(ROLES.Company_HR, ROLES.MANGER ), allowedToCompanyHrOnly,getAllAppsOfSpecificJop)
applictiantRouter.get('/specific-company-jobs',
    authenticate, authorize(ROLES.Company_HR, ROLES.MANGER ), allowedToCompanyHrOnly,getAllJopsOfSpecificCompany)


export default applictiantRouter