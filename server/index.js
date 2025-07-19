import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";
import {authenticateToken} from "./utilities.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "Hello" });
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName: name,
            email,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).json({
            message: "User successfully registered!",
            user: { id: user._id, name: user.fullName, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userInfo = await User.findOne({ email });

        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = { id: userInfo._id, email: userInfo.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { id: userInfo._id, email: userInfo.email, name: userInfo.fullName },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.get("/notes", authenticateToken, async (req, res) => {

    const { user } = req.user;
    const id = req.user.id;

    try {
        
        const notes = await Note.find({ userId : id }).sort({ isPinned : -1 });

        return res.json({
            error : false,
            notes,
            message : "All notes retrieved successfully"
        });
        
    } catch (error) {
        return res
            .status(500)
            .json({
                error : true,
                message : "Internal Server Error"
            });
    }
});

app.post("/add-note", authenticateToken, async (req, res) => {
    
    const { title, desc } = req.body;
    const { user } = req.user;

    console.log(req.user);
    const id = req.user.id;

    console.log(title);
    console.log(desc);


    if (!title) {
        return res 
            .status(400)
            .json({
                error : true,
                message : "Title is required"
            });
    }

    if (!desc) {
        return res
            .status(400)
            .json({
                error : true,
                message : "Content is required"
            })
    }

    try {
        const note = new Note({
            title,
            desc,
            userId : id,
        });

        await note.save();
        console.log('Note saved:', note);

        return res.json({
            error : false,
            note,
            message : "Note added successfully"
        });

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                error : true,
                message : "Internal Server Error",
            });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




