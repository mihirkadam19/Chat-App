import express from "express";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";


dotenv.config(); // Allows us to read the .env file

const app = express(); // create an express app

app.use(express.json()); // Allows us to extract the fields from JSON request body
app.use(cookieParser()); //Allows us to get the JWT from the cookies

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))



const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port: "+PORT);
    connectDB();
})