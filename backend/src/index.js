import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config(); // Allows us to read the .env file

const app = express(); // create an express app

app.use(express.json()); // Allows us to extract the fields from JSON request body

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port: "+PORT);
    connectDB();
})