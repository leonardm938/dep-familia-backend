import express from "express";
import {
    createReport,
    getReport,
    getReportById
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/create", createReport);
router.get("/get", getReport);
router.get("/single-report/:id", getReportById);

export { router as reportRoutes };