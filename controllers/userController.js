import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const validateEmail = (email) => {
    // Regular expression pattern to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
};


const register = asyncHandler(async(req, res) => {
    try {
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();
        const { username, email, password } = req.body;

        if (!username && !email && !password) {
            return res.status(400).json({ message: 'Please Fill All Fields!' });
        }


        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            role: user.role

        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const login = asyncHandler(async(req, res) => {
    try {
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT
        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        return res.status(200).json({
            message: 'User loggin successfully',
            token,
            role: user.role
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


const getMe = asyncHandler(async(req, res) => {
    try {
        await mongoose.createConnection(process.env.MONGO_URI).asPromise();
        const bearerHeader = req.headers.authorization;
        const tok = bearerHeader.split(' ')[1];

        // Verify the access token
        JWT.verify(tok, process.env.JWT_SECRET, async(err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid access token' });
            }

            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                return res.status(200).send({
                    message: "User Doesn't Exists!",
                    success: false,
                });
            }
            return res.status(200).send({
                success: true,
                message: "Get User Data Successfull",
                user,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Get User Data callback",
            error: error,
            success: false,
        });
    }
});



export { register, login, getMe };