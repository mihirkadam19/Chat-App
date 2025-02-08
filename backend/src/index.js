import express from "express";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import {app, server} from "./lib/socket.js";

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Allows us to read the .env file


app.use(express.json()); // Allows us to extract the fields from JSON request body
app.use(cookieParser()); //Allows us to get the JWT from the cookies

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))



const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist");
    console.log("Serving frontend from:", frontendPath); // Debugging

    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        const indexPath = path.resolve(__dirname, "../frontend/dist", "index.html");
        console.log("Index.html path:", indexPath); // Debugging
        res.sendFile(indexPath);
    });
}


server.listen(PORT, () => {
    console.log("Server is running on port: "+PORT);
    connectDB();
})