import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Report from "../models/reportModel.js";


const createReport = asyncHandler(async(req, res) => {
    try {
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();
        const {
            region,
            municipality,
            month,
            year,
            data,
            creator,
        } = req.body;
        console.log(req.body)
        const newData = new Report({
            region,
            municipality,
            month,
            year,
            data,
            creator,
        });
        await newData.save();

        return res.status(201).json({
            message: `Created successfully`,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});



const getReport = asyncHandler(async(req, res) => {
    try {
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();

        const data = await Report.find({}).populate({
            path: "creator",
            select: "username",
        });;
        return res.status(200).json({
            message: `Get successfully`,
            data: data
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const getReportById = asyncHandler(async(req, res) => {
    try {
        const reportId = req.params.id;
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();

        const report = await Report.findById(reportId).populate({
            path: "creator",
            select: "username",
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        return res.status(200).json({
            message: "Get successfully",
            data: report,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export { createReport, getReport, getReportById };