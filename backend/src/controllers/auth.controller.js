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
                profilePic:newUser.profilePic
            })
        } else {
            return res.status(400).json({message:"Invalid User Data"});
        }
    } catch(error){
        console.log("Error in singup controller", error);
        return res.status(500).json({message:"Internal Server Error"})
    }

};

export const login =  (req,res) => {
    res.send("login route");
};

export const logout = (req,res) => {
    res.send("logout route");
};