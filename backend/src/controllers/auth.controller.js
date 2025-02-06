import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body;
    try{
        if (!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        if (password.length < 8){
            return res.status(400).json({message:"Password should be more than 8 characters"});
        }
        const user = await User.findOne({email});

        if (user) {
            return res.status(400).json({message:"User already exists with that email address"});
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = User({
            fullName,
            email,
            password:hashedPassword
        })

        if (newUser) {
            // generate JWT
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.fullName,
                profilePic:newUser.profilePic,
                language: newUser.language
            })
        } else {
            return res.status(400).json({message:"Invalid User Data"});
        }
    } catch(error){
        console.log("Error in singup controller", error);
        return res.status(500).json({message:"Internal Server Error"})
    }

};

export const login = async (req,res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        } 
        // generate a JWT token
        generateToken(user._id, res)
        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            language: user.language
        })
        
    } catch(error){
        console.log("User login failed", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
};

export const logout = (req,res) => {
    try{
        res.cookie("jwt", "", {
            maxAge:0
        });
        return res.status(200).json({message:"User Logged Out"})
    } catch(error){
        console.log("User login failed", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
};

export const updateProfilePic = async (req,res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if (!profilePic){
            return res.status(400).json({message:"Profile Pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.url}, {new:true});
        return res.status(200).json(updatedUser);

    } catch(error){
        console.log("Error uploading profile pic", error)
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export const checkAuth = (req, res) => {
    try{
        return res.status(200).json(req.user);
    } catch(error){
        console.log("Error in checkAuth controller", error);
        return res.json(500).json({message:"Internal Server Error"});
    }

};

export const updateLanguage = async (req, res) => {
    try {
        const {language} = req.body;
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, {language: language}, {new:true});
        return res.status(200).json(updatedUser);

    } catch(error){
        console.log("Error updating the language", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}