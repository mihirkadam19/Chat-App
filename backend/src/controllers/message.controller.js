import { axiosGemini } from "../lib/axios.js";
import cloudinary from "../lib/cloudinary.js";
import { geminiHelper } from "../lib/gemini.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import {config} from "dotenv";

config();

export const getUsersForSidebar = async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId }}).select("-password"); //$ne not equal to

        return res.status(200).json(filteredUsers);
    } catch(error){
        console.log("Error in getUsersForSidebar controller", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export const getMessages = async(req,res) => {
    try{
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });

        return res.status(200).json(messages)
    } catch(error){
        console.log("Error in getMessages controller", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
    
};

export const sendMessages = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        const {text, image} = req.body;

        if (!text){
            return res.status(400).json({message:"Text cannot be empty"});
        }

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }        

        return res.status(200).json(newMessage);

    } catch(error){
        console.log("Error in sendMessages controller", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
    
};

export const translateMessage = async(req, res) => {
    try {
        const {text} = req.body;
        const language = req.user.language;
        const translatedText = await geminiHelper(language, text);
        return res.status(200).json(translatedText);    
    } catch(error){
        console.log("Error in Translation controller", error.message);
        return res.status(500).json({message:"Gemini failure"})
    }
};

export const getWelcomeUser = async(req, res) => {
    try {
        const welcomeUser = await User.find({_id: process.env.WELCOME_USER}).select("-password");
        return res.status(200).json(welcomeUser);
    } catch(error){
        console.log("Error finding the welcome user:", error.message)
        return res.status(500).json({message:"Interal Server Error"})
    }
}