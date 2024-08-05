


import ExcelJS from 'exceljs'
import { AppError, catchAsyncError } from "../../../utilies/error.handel.js";
import { appModel } from "../models/app.model.js";
import fs from 'fs'
import { companyModel } from '../../company/models/company.model.js';
import { jopModel } from '../../jop/models/jop.model.js';





// Endpoint to collect applications and generate an Excel sheet
export const makeCompanyDailyReport = catchAsyncError(async (req, res) => {
    const { company, date } = req.body;

    // Convert date string to Date object
    const queryDate = new Date(date);

    // Find applications for the specified company on the specified date
    const applications = await appModel.find({
        company: company,
        createdAt: {
            $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
            $lt: new Date(queryDate.setHours(23, 59, 59, 999))
        }
    });
    console.log(applications);

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Applicant Name', key: 'applicantName', width: 30 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Age', key: 'age', width: 30 },
        { header: 'MobileNumber', key: 'mobileNumber', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'CV', key: 'cv', width: 60 },
    ];

    // Add rows to the worksheet
    applications.forEach(application => {
        worksheet.addRow({
            applicantName: application.userId.userName,
            email: application.userId.email,
            age: application.userId?.age,
            mobileNumber: application.userId.mobileNumber,
            status: application.status,
            date: application.createdAt,
            cv: application.userResume.pdfURL,
        });
    });

    // Write the workbook to a file
    const filePath = './applications-report.xlsx';
    await workbook.xlsx.writeFile(filePath);

    // Send the Excel file to the client
    res.download(filePath, 'applications-report.xlsx', (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error generating report');
        }

        // Delete the file after sending
        // fs.unlinkSync(filePath);
    });
})


export const getAllAppsOfSpecificCompany = catchAsyncError(async (req, res, next) => {

    const { _id: company } = req.company

    const apps = await appModel.find({ company })
    res.status(200).json({
        status: "success",
        data: apps
    })
})
export const getAllAppsOfSpecificJop = catchAsyncError(async (req, res, next) => {

    const { companyHR } = req.company
    const Hr = await jopModel.findOne({ addedBy: companyHR })

    const apps = await appModel.find({ jopId: Hr._id })
    res.status(200).json({
        status: "success",
        data: apps
    })
})
export const getAllJopsOfSpecificCompany = catchAsyncError(async (req, res, next) => {

    console.log(req.company);
    const { _id : company } = req.company
    const jobs = await jopModel.find({ company })

    res.status(200).json({
        status: "success",
        data: jobs
    })
})