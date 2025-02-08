import axios from "axios";

export const axiosGemini = axios.create({
    baseURL: process.env.GEMINI_API_URI,
    headers: {  
        "Content-Type": "application/json"
    }
});