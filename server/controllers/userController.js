import { z } from 'zod';
import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import googleUser from '../models/googleUser.js';

export const userRegister = async (req, res) => {
    try {
        const requiredBody = z.object({
            email: z.string().min(3).max(40).email(),
            username: z.string().min(3).max(15),
            password: z.string().min(6).max(30),
        });

        const parsedData = requiredBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Incorrect format",
                error: parsedData.error.errors,
            });
        }

        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT Secret is missing in environment variables" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            sameSite: "lax",
           httpOnly: true,
    secure: true,
        });

        return res.status(201).json({
            message: "User successfully registered",
            user: { username, email },
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email }).select("username email password");


        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);


        res.cookie("token", token, {
            sameSite: "lax", 
          httpOnly: true,
    secure: true,
        });

        return res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email },
            token,
        });

    } catch (error) {
        console.error("Error in login process:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            sameSite: "lax",
            secure:false,
            httpOnly : true
        })

        return res.status(200).json({
            message: "logout sucessfully"
        })
    } catch (error) {
        console.error("Error in logout process", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const userUpdate = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }


        const updatedFields = {}
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.password = hashedPassword;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true, runValidators: true }

        );
        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error("Error updating user", error);
        return res.status(500).json({
            message: "interval server error"
        })
    }
}
export const googleUserInfo = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        console.log("Received Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const user = await googleUser.findById(decoded.id).select("-__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
export const getUserToken = (req, res) => {
    console.log(req.cookies);
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }
    res.json({ token });
};
