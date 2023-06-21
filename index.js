import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
// Routes
import { userRoutes } from "./routes/userRoutes.js";
import { reportRoutes } from "./routes/reportRoutes.js";
// Error Handler Middleware

const port = process.env.PORT || 8080;
dotenv.config();




const app = express();
app.use(express.json());


const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectToMongoDB();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    limit: "10mb",
};


app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/users", userRoutes);
app.use("/api/report", reportRoutes);

app.listen(port, () => console.log("Running on port " + port));