import axios from "axios";
import { config } from "dotenv";
config();

export const axiosGemini = axios.create({
    baseURL: process.env.GEMINI_API_URI,
    headers: {  
        "Content-Type": "application/json"
    }
});

export const axiosRedisHelper = axios.create({
    baseURL: process.env.REDIS_BACKEND_URL
})