import Message from "../models/message.model.js";
import { config } from "dotenv";
config();

export const sendMessageJob = async (receiverId, messageData) => {
    for (let i=0; i<messageData.length; i++){
        console.log("Sending message: ", messageData[i])
        const newMessage = Message({
            senderId: process.env.WELCOME_USER,
            receiverId,
            text: messageData[i],
        });
        try {
            await newMessage.save();  
        } catch (error) {
            console.error("Error saving message:", error);
        }
    }
};