import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {

    try{
        // to grab token from cookies we will cookie-parser in index.js
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({message:"Unauthorized - No Token provied"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if (!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");
        // console.log(`User trying to auth ${user}`)

        if (!user){
            return res.status(404).json({message:"User Not Found"});
        }

        req.user = user;

        
        next()
    } catch(error){
        console.log("Error in protectRoute middleware", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
    
}